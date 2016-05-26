/**
 * Created by Osvaldo on 05/10/15.
 */

app.controller("loginController",['$scope', '$location', 'setUserLogado', '$route',function ($scope, $location, setUserLogado, $route) {
    var me = this;
    me.listeners = {};

    //----------------USADO APENAS PARA AGILIZAR LOGIN
    $scope.usuario = {
        email: "admin",
        senha: "admin"
    };
    //-----------------------------

    me.wind = "/home";

    $scope.logar = function(){
        var msg = new Mensagem(me, 'logar', $scope.usuario, 'usuario');
        SIOM.logar(msg);

    };

    me.logou = function(msg){
        setUserLogado.setLogado(msg.getDado());
        SIOM.emit('setarota', msg.getDado().tipo);
    };

    me.nextView = function(){
        $location.path(me.wind);
        $route.reload();
    };

    me.serverError = function(msg){
        //todo criar um box de aviso que informa erros e sucessos
        console.log('error', msg);
    };

    me.invalidUser = function(msg){
        //todo criar um box de aviso que informa erros e sucessos
        console.log('email não cadastrado', msg);
    };

    me.senhaincorreta = function (msg) {
        //todo criar um mensagem pra avisar que a senha está incorreta
        console.log('senha incorreta', msg)
    };

    me.wiring = function(){
        me.listeners['usuario.login'] = me.logou.bind(me);
        me.listeners['usuario.error.logar'] = me.serverError.bind(me);
        me.listeners['usuario.emailnaocadastrado'] = me.invalidUser.bind(me);
        me.listeners['usuario.senhaincorreta'] = me.senhaincorreta.bind(me);
        me.listeners['rotasetada'] = me.nextView.bind(me);

        for(var name in me.listeners){

            SIOM.on(name, me.listeners[name]);

        }

    };

    me.wiring();

}]);