/**
 * Created by Osvaldo on 06/10/15.
 */
var ctrbd = require('../../util/ctrbd.js');
var Mongoose = require('../Banco.js').mongoose;

var types = Mongoose.Schema.Types;

var obj = Mongoose.Schema({
    nome: {type: types.String, required: true},
    sobrenome: {type: types.String, required: true},
    email: {type: types.String, required: true},
    senha: {type: types.String, required: true},
    datanascimento: {type: types.Date, required: true},
    sexo: {type: types.String, required: true},
    numerocelular: {type: types.String},
    foto: {type: types.String},
    tipo: {type: types.Number}
});

new ctrbd('usuario', obj);

module.exports = Mongoose.model('usuario', obj);