const path = require('path')

const fs = require('fs');
const semestresService = require('./semestresService'); //Obtém o modelo de produtosService

// Função exportada que, caso não exista produtos no banco, cria exemplos (MOCK)
module.exports.checkDataBase = () => {
    semestresService.find({}, (err, data) => {
        if (err || data.length <= 0 || data == undefined) {
            
            let contents = fs.readFileSync(path.join(__dirname, 'provas.json'));
            let dados = JSON.parse(contents);  
            console.log(dados);
            dados.forEach(semestre => {
                new semestresService(semestre).save()
            });

            console.log("Banco criado");
        }
    })
};