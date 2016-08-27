'[use strict]';
/**
 * Created by Osvaldo on 05/10/15.
 */

// Var sjcl = require('sjcl');

app.controller('loginController', [
  '$scope',
  '$location',
  'setUserLogado',
  '$route',
  'seguranca',
  function ($scope, $location, setUserLogado, $route, seguranca) {

    var me = this;
    me.nonce = null;
    me.listeners = {};
    me.senhaHash = null;

    $scope.modalTitulo = '';
    $scope.modalTexto = '';


    // ----------------USADO APENAS PARA AGILIZAR LOGIN
    $scope.usuario = {
      email: 'root',
      senha: 'root',
    };
    // ------------------------------------------------

    // -------VARIAVEIS DE VALIDACAO
    $scope.validoSenha = true;
    $scope.validoEmailCadastrado = true;
    $scope.validoServer = true;
    // -----------------------------

    me.wind = '/home';

    /**
     * Criado por: Gustavo
     *
     * Transforma senha em hash
     */
    $scope.criaHash = function () {
      me.senhaHash = seguranca.hash(angular.copy($scope.usuario.senha));
    };

    /**
     * Criado por: Osvaldo;
     *
     * Tenta logar usuario;
     */
    $scope.logar = function () {

      me.senhaHash = seguranca.hash(angular.copy($scope.usuario.senha));

      me.nonce = Math.floor((Math.random() * 1000000000) + 1);

      var user = angular.copy($scope.usuario);
      user.senha = {
        senha: me.senhaHash,
        nonce: me.nonce
      };

      user.senha = seguranca.cifra(user.senha);

      var msg = new Mensagem(me, 'logar', user, 'usuario');
      SIOM.logar(msg);

    };

    /**
     * Criado por: Osvaldo;
     *
     * quando o usuario entra, joga o usuario logado globalmente.
     *
     * @param msg
     */
    me.logou = function (msg) {
      var dado = msg.getDado();
      var log = seguranca.verificaAutenticacao(dado, me.nonce, me.senhaHash);
      if(log.err){
        console.log('erro', log.err);
      } else {
        setUserLogado.setLogado(log.res);
        SIOM.emit('setarota', log.res.tipo);
      }

    };

    /**
     * Criado por: Osvaldo;
     *
     * destroy a interface.
     */
    me.destroy = function () {
      for (var name in me.listeners) {
        if (me.listeners.hasOwnProperty(name)) {

          SIOM.removeListener(name, me.listeners[name]);

        }
      }
    };

    /**
     * Criado por: Osvaldo;
     *
     * Troca rota;
     */
    me.nextView = function () {
      $location.path(me.wind);
      $route.reload();
    };

    /**
     * Criado/modificado por: Osvaldo e Gustavo;
     *
     * Retorno do server de erro do server;
     *
     * @param msg
     */
    me.serverError = function (msg) {
      $scope.validoServer = false;
      $scope.$apply();
    };

    /**
     * Criado/modificado por: Osvaldo e Gustavo;
     *
     * Retorno do server de email nao cadastrado;
     *
     * @param msg
     */
    me.invalidUser = function (msg) {
      $scope.validoEmailCadastrado = false;
      $scope.$apply();
    };

    /**
     * Criado/modificado por: Osvaldo e Gustavo;
     *
     * Retorno do server de senha incorreta;
     *
     * @param msg
     */
    me.senhaincorreta = function (msg) {
      $scope.validoSenha = false;
      $scope.$apply();
    };

    /**
     * Criado por: Gustavo;
     *
     * Alterna entre mostra formulario de cadastro e formulario de login;
     *
     * @param alterna
     * @param esconde
     * @param mostra
     */
    $scope.trocaLoginCadastro = function (alterna, esconde, mostra) {

      $('.' + esconde).animate({width: 'toggle'}, 350, function () {
        $('.' + mostra).animate({width: 'toggle'}, 350);
      });

    };

    me.retCadastrado = function(msg) {
      $scope.modalTitulo = 'Cadastro sucesso';
      $scope.modalTexto = 'Seu usuario foi cadastrado com sucesso';
      $scope.trocaLoginCadastro(0, 'span-cadastrausuario', 'span-loginusuario');
      $('#modalRetorno').modal();
      $scope.$apply();
    };

    me.wiring = function() {
      me.listeners['usuario.login'] = me.logou.bind(me);
      me.listeners['usuario.error.logar'] = me.serverError.bind(me);
      me.listeners['usuario.emailnaocadastrado'] = me.invalidUser.bind(me);
      me.listeners['usuario.senhaincorreta'] = me.senhaincorreta.bind(me);
      me.listeners['rotasetada'] = me.nextView.bind(me);
      me.listeners['usuario.created'] = me.retCadastrado.bind(me);

      for (var name in me.listeners) {
        if (me.listeners.hasOwnProperty(name)) {

          SIOM.on(name, me.listeners[name]);

        }
      }

    };

    me.wiring();

  }]);