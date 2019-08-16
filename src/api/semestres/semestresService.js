const semestre = require('./semestre') // Obtém o esquema de produtos (modelo de dados)

semestre.methods(['get', 'post', 'put', 'delete']) //informa quais tipos de requisições serão permitidos 
semestre.updateOptions({new: true, runValidators: true}) //Somente retorne o objeto novo inserido e use as validações do esquema

module.exports = semestre //Exporta o serviço completo