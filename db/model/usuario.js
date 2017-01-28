'use strict';
/**
 * Created by Osvaldo on 06/10/15.
 */
const Ctrbd = require('../../util/ctrbd.js');
const Mongoose = require('../Banco.js').mongoose;

const types = Mongoose.Schema.Types;

var obj = Mongoose.Schema({
  nome: {type: types.String},
  employeeid: {type: types.Number, required: true, index:{unique: true}},
});

let ctrbd = new Ctrbd('usuario', obj, 'nome');

module.exports = Mongoose.model('usuario', obj);