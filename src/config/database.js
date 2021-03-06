// Cria uma conexão com o banco de dados e exporta.
require('dotenv').config() //Obtem as variáveis de ambiente do arquivo '.env'
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const uri = process.env.MONGODB_URI || 'mongodb://localhost/guia_if'

module.exports = mongoose.connect(uri, {useMongoClient: true})