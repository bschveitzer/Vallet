/**
 * Created by Bernardo on 27/01/2017.
 */
'use strict';

const Manager = require('./manager.js');
const utility = require('util');
const Model = require('../../model/equipamento.js');
const hub = require('../../../hub/hub.js');
const sjcl = require('sjcl');

class EquipamentoManager extends Manager {
    constructor() {
        super();

        this.sjcl = sjcl;

        this.model = Model;
        this.listeners = {};

        this.wiring();

    }


    cadastroEquipamento(msg) {
        let dado = msg.getRes().entidade;
        let senhadesempacotada = this.sjcl.codec.utf8String.fromBits(dado.senha);
        delete dado.confirmasenha;
        dado.senha = senhadesempacotada;
        msg.setRes(dado);
        this.executaCrud(msg);
    }

    /**
     * Busca um usuario peleo email, quando vem o retorno, verifica se a senha
     * está correta.
     * caso nao venha nenhum atravez da busca pelo email, informa que o email nao
     * esta cadastrado.
     * se a senha nao bater, informa que o email esta cadastrado mas a senha esta
     * incorreta.
     * se der um erro no banco, avisa que o banco esta inoperavel e pede para
     * aguardar ate que o sistema volte.
     *
     * @param msg
     */
    buscaEquipamento(msg) {
        var me = this;
        var dado = msg.getRes();
        let servernonce = Math.floor((Math.random() * 1000000000) + 1);

        this.model.findOne({'email': dado.email}, function(err, res) {
            if (res) {
                try {

                    var senha = JSON.parse(me.sjcl.decrypt(res.senha, dado.senha));

                    if (senha.senha === res.senha) {

                        senha.nonce = senha.nonce + servernonce;
                        res.senha = null;

                        let ret = {
                            user: res,
                            cifra: {
                                ret: me.sjcl.encrypt(senha.senha, JSON.stringify(senha),
                                    {mode: 'ocb2'}),
                                serverNonce: servernonce,
                            },
                        };

                        process.nextTick(function() {
                            me.emitManager(msg, '.login', {res: ret});
                        });
                    }
                } catch (e) {
                    console.log('erro', e);
                    me.emitManager(msg, '.senhaincorreta', {res: null});
                }
            } else if (err) {
                me.emitManager(msg, '.error.logar', {err: err});
            } else {
                me.emitManager(msg, '.emailnaocadastrado', {res: res});
            }
        });
    }

    /**
     * Funcao que pega todos os usuario, menos os que estao definidos como root
     *
     * @param msg
     */
    getAllRootLess(msg) {
        var me = this;

        this.model.find({'tipo': {$ne: 0}}, function(err, res) {
            if (res) {
                me.emitManager(msg, '.pegacadastrados', {res: res});
            } else {
                me.emitManager(msg, '.error.pegacadastrados', {err: err});
            }
        });
    }


    /**
     * Funcao responsavel por ligar os eventos escutados por esse documento.
     */
    wiring() {
        var me = this;

        for (var name in me.listeners) {
            if (me.listeners.hasOwnProperty(name)) {
                hub.on(name, me.listeners[name]);
            }
        }

    }

}

module.exports = new EquipamentoManager();