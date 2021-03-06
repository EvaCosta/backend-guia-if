const options = {
    host: process.env.PORT ? "0.0.0.0" : "localhost",
    port: process.env.PORT || 3003
};

/* 
    Todas as bibliotecas que precisamos, serão importadas utilizando a função require('nome_do_import')
    Caso seja passado um caminho(./cors) o require busca nas pastas da regiao local deste arquivo.
    Caso seja passado somente o nome do modulo(express) essa busca será realizada dentro da pasta
    node_modules.  
*/
const bodyParser = require('body-parser')
const express = require('express')
const semestresMock = require('../api/semestres/semestresMock')
const allowCors = require('./cors')
const queryParser = require('express-query-int')

// Criamos a instancia inicial do nosso servidor
const server = express()

// Aplicamos middlewares ao nosso servidor
server.use(bodyParser.urlencoded({ extended: true })) //Esse midleware trata dados de application/x-www-form-urlencoded post data (formulários)
server.use(bodyParser.json()) //Esse midleware trata dados de application/json (JSON)
server.use(allowCors) // Esse midleware faz com que as requisições tenham o CORS em seu cabeçalho
server.use(queryParser()) //Converte valores passados string que seriam números para o seu tipo corretamente

// Rodamos o serviço após aplicar todos os midlewares
server.listen(options, function(){
    //Gera uma lista de produtos no banco caso ele esteja vazio.
    semestresMock.checkDataBase();
    console.log(`Backend está rodando em http://${options.host}:${options.port}/`);
})

// Após isso, o servidor vai estar rodando em http://localhost:3003/.
// Porém ainda não temos rotas. Elas serão criadas em src/routes.js

module.exports = server //Exporta o servidor para que ele possa ser usado em outros lugares. Como a criação de rotas.