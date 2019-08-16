require('dotenv').config() //Obtem as variáveis de ambiente do arquivo '.env'
const AssistantV1 = require('ibm-watson/assistant/v1');
const chatService = require('../chat/chatService')


// Configuração do asistente do IBM Watson (Chaves)
// todo process.env.<VALOR> é uma variável de ambiente
const assistant = new AssistantV1({
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    version: process.env.WATSON_VERSION
});

/* Função que retorna um objeto que representa a conversa do usuário no banco.
    Caso não exista uma conversa, esta função a cria.
    Ela é uma promise, então ela roda em segundo plano para ser resolvida.
*/
iniciarOuContinuarConversa = (input) => new Promise((resolve, reject) => {
    // Pesquisa o contextID informado, se não existir, cria uma nova conversa e a retorna usando o resolve
    chatService.find({ session_id: input.session_id }, (err, data) => {
        if (err || data.length == 0 || data == undefined) {

            let chat = new chatService({
                input: input.message || undefined,
                session_id: undefined,
            });
            chat.session_id = chat._id; //define a sessão como o ID do objeto (tem que ser único, o _id é unico pelo mongoDB)

            resolve(chat);
        }
        else { // Se existir, retorna a conversa encontrada usando o resolve
            chat = data[0];
            chat.input = input.message || undefined,
                resolve(chat);
        }
    })
});


module.exports.analisarConstruirMensagem = (input) => new Promise((resolve, reject) => {
    // Primeiro, checo na entrada do usuário, se ele me passou um contextId, e retorno o novo ou antigo usuário dele (user)
    iniciarOuContinuarConversa(input).then((user) => {
        // envio ao watson a sessão do usuário e a mensagem que ele informou para análise.
        assistant.message({
            workspace_id: process.env.WATSON_WORKSPACE_ID,
            session_id: user.session_id,
            context: user.context,
            input: user.input
        })
            .then((resp) => { // checo os erros e resposta do watson
                    // se tiver ok passo para o reconstruirIntencoesEntidadesContexto fazer as devidas alterações e retornar uma nova resposta (resp)

                    //Adiciono a nova mensagem do usuário no objeto do banco user
                    user.messages.push({
                        message: input.message.text
                    });

                    resp.output.generic.forEach(object => {
                        switch (object.response_type) {
                            //adiciona no modo opção
                            case 'option':
                                user.messages.push({
                                    message: object.title,
                                    description: object.description,
                                    options: object.options,
                                    type: object.response_type,
                                    base: 'received'
                                });
                                break;

                            default:
                                //adicionando uma mensagem na lista se for comum.
                                resp.output.text.forEach(message =>{
                                    user.messages.push({
                                        message: message,
                                        base: 'received'
                                    })
                                })
                                break;
                        }
                    });

                    // Armazeno o fluxo de contexto da conversação que foi obtida como respota do watson na sessão do usuário.
                    user.context = resp.context;

                    resolve(user); // retorno o objeto usuário e o objeto de resposta do watson.
                });

            }).catch((err) => {
                console.log(err);
                reject(err);
            });
});