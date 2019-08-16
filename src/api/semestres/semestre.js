const restful = require('node-restful')
const mongoose = restful.mongoose

const provaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    link: { type: String, required: true },
})

const semestreSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    provas: [provaSchema], 
})

/* Estrutura que terá.
    Exemplo:
    {
       
    }
*/

module.exports = restful.model('Semestre', semestreSchema)