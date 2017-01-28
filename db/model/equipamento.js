/**
 * Created by Bernardo on 27/01/2017.
 */
'use strict';
/**
 * Created by Osvaldo on 06/10/15.
 */
const Ctrbd = require('../../util/ctrbd.js');
const Mongoose = require('../Banco.js').mongoose;

const types = Mongoose.Schema.Types;

var obj = Mongoose.Schema({
    codigo: {type: types.Number, required: true, index:{unique:true}},
    localizacao: {type: types.String, required: true, index:{unique: true}},
    nome: {type: types.String, required: true},
    tamanho: {type: types.Number, required: true},
    status: {type: types.String, required: true},
    datafinal: {type: types.Date},
    dataparcial: {type: types.Date},
    employeeuser: {type: types.ObjectId, ref: 'usuario'},
});

let ctrbd = new Ctrbd('equipamento', obj, 'codigo');

module.exports = Mongoose.model('equipamento', obj);