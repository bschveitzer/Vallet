/**
 * Created by Osvaldo on 06/10/15.
 */
var ctrbd = require('../../util/ctrbd.js');
var Mongoose = require('../Banco.js').mongoose;

var types = Mongoose.Schema.Types;

var obj = Mongoose.Schema({
    nome: {type: types.String},
    sobrenome: {type: types.String},
    email: {type: types.String, required: true, index: { unique: true }},
    senha: {type: types.String, required: true},
    datanascimento: {type: types.Date},
    sexo: {type: types.String},
    numerocelular: {type: types.String},
    foto: {type: types.String},
    tipo: {type: types.Number, required: true},
    idioma: {type: types.ObjectId, ref: 'idioma'}
});

new ctrbd('usuario', obj, 'nome');

module.exports = Mongoose.model('usuario', obj);