'[use strict]';
/**
 * Created by Gustavo on 21/05/2016.
 */
app.directive('modalcrianovaentidade', ['referencia', function(referencia) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      entidades: '=',
    },
    templateUrl: '../../../views/entidades/modalCriaNovaEntidade/' +
    'modalCriaNovaEntidade.html',

    link: function(scope) {

      var me = this;
      var listeners = {};

      // Lista da referencia do atributo
      scope.listareferencia = [];
      // Referencia para o usuario
      scope.referencianome = {};

      /**
       * Criado por: Gustavo;
       *
       * Popula scope.referencianome;
       */
      scope.populareferencianome = function() {

        for (var dado in scope.entidadeselecionada.modelo) {
          if (scope.entidadeselecionada.modelo.hasOwnProperty(dado)) {

            var nomeref = scope.entidadeselecionada.modelo[dado].referencia;

            if (nomeref !== undefined) {
              scope.referencianome[nomeref] =
                scope.entidadeselecionada.dadoentidade[nomeref];
            }

          }
        }

        $('#modalCriaEntidade').modal();

      };

      /**
       * Criado por: Gustavo;
       *
       * Coloca o objeto desejado em dadoentidade;
       *
       * @param referencia
       * @param key
       */
      scope.setReferencia = function(referencia, key) {

        var referenciaindex = referencia.slice(-1);
        var dadoreferencia = scope.listareferencia[key][referenciaindex];

        scope.entidadeselecionada.dadoentidade[key] = dadoreferencia;

      };

      /**
       * Criado/modificado por: Gustavo e Bosvaldo;
       *
       * Salva a entidade criado no banco;
       *
       * @param nomedaentidade
       * @param dadodaentidade
       */
      scope.salvarEntidade = function(nomedaentidade, dadodaentidade) {

        var method = null;

        var dado = {
          nome: nomedaentidade,
          entidade: dadodaentidade,
        };

        if (dado.entidade._id) {
          method = 'update';
        } else {
          method = 'create';
        }

        var msg = new Mensagem(me, 'entidade.' + method, dado, 'entidade');
        SIOM.emitirServer(msg);

        scope.emailErro = false;
      };

      /**
       * TODO remover
       * Criado por: Gustavo e Osvaldo;
       *
       * Retorno do banco, erro ao criar/atualizar usuario;
       * Dado.code == 11000, email duplicado;
       *
       * @param msg
       */
      var createdError = function(msg) {

        var dado = msg.getErro();

        if (dado.code !== 11000) {
          console.log('erro desconhecido', dado);
        } else {
          scope.$apply(function() {
            scope.emailErro = true;
          });
        }

      };

      /**
       * Criado/modificado por: Gustavo e Osvaldo;
       *
       * Chega o retorno com todas as referencias;
       *
       * @param msg
       */
      var retornoreferencia = function(msg) {
        scope.$apply(function() {
          scope.listareferencia[msg.getFlag()] = msg.getDado();
        });
      };

      /**
       * Criado por: Osvaldo;
       *
       * Solicita as referencias da entidade passada.
       *
       * @param dado
       */
      var getReferencias = function(dado) {

        scope.listareferencia = {};
        scope.entidadeselecionada = dado;

        referencia.getReferencias(dado.modelo, me);
        scope.populareferencianome();

      };

      var wiring = function() {
        listeners['entidade.error.created'] = createdError.bind(me);
        listeners['referencia.readed'] = retornoreferencia.bind(me);
        listeners['pedereferencias'] = getReferencias.bind(me);

        for (var name in listeners) {

          if (listeners.hasOwnProperty(name)) {
            SIOM.on(name, listeners[name]);
          }

        }
      };

      wiring();
    },
  };
}]);
