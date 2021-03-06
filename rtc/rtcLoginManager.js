'use strict';


const Basico = require('./basicRtc.js');
const rtcRoot = require('./rtcRoot.js');
const rtcAdmin = require('./rtcAdmin');
const rtcComum = require('./rtcComum');
const Mensagem = require('../util/mensagem.js');

/**
 * @author Osvaldo <juniorsin2012@gmail.com>
 *
 */
class RtcLoginManager extends Basico {
  /**
   * Recebe o socketId passado pelo cliente.
   *
   * @param conf
   */
  constructor(conf) {
    super('login');
    this.config = conf;
    this.Root = rtcRoot;
    this.Admin = rtcAdmin;
    this.Comum = rtcComum;
    this.mensagem = Mensagem;

    this.wiring();
    this.interfaceWiring();
  }

  /**
   * Funcao que recebe o retorno do banco, se vier um usuario ele verifica
   * o tipo para iniciar o rtc que representa este user no server e informa a
   * interface, se nao veio usuario ele informa a interface.
   *
   * @param msg
   */
  trataLogin(msg) {

    let rtc = null;

    if (msg.getRtc() === this) {
      let dado = msg.getRes().user;
      if (dado.tipo === 0) {
        rtc = new this.Root(this.config, this);
      } else if (dado.tipo === 1) {
        rtc = new this.Admin(this.config, this);
      } else if (dado.tipo === 2) {
        rtc = new this.Comum(this.config, this);
      }

      this.emitePraInterface(msg);
    }
  }

  /**
   * Destroi o rtc login quando outro rtc assume o controle.
   *
   * @param login
   */
  destroylogin(login) {
    if (login === this) {
      this.destroy();
    }
  }

  /**
   * @author Gustavo <gurbrillinger@gmail.com>
   *
   * @param msg
   */
  trataCadUpUsuario(msg) {
    msg.dados.entidade.tipo = 2;
    this.daInterface(msg);
  }

  /**
   * Liga os eventos do cliente.
   */
  interfaceWiring() {

    this.interfaceListeners['logar'] = this.daInterface.bind(this);
    this.interfaceListeners['idioma.read'] = this.daInterface.bind(this);
    this.interfaceListeners['usuario.create'] = this.trataCadUpUsuario
      .bind(this);
    this.interfaceListeners['usuariomodel'] = this.daInterface.bind(this);

    this.ligaEventCli();
  }

  /**
   * Liga os eventos do servidor.
   */
  wiring() {

    this.listeners['idioma.readed'] = this.emitePraInterface.bind(this);
    this.listeners['usuario.error.logar'] = this.emitePraInterface.bind(this);
    this.listeners['usuario.senhaincorreta'] = this.emitePraInterface
      .bind(this);
    this.listeners['usuario.emailnaocadastrado'] = this.emitePraInterface
      .bind(this);
    this.listeners['usuario.login'] = this.trataLogin.bind(this);
    this.listeners['rtcLogin.destroy'] = this.destroylogin.bind(this);
    this.listeners['usuario.created'] = this.emitePraInterface.bind(this);
    this.listeners['usuariomodelread'] = this.emitePraInterface.bind(this);

    this.ligaEventServer();

  }

}

module.exports = RtcLoginManager;