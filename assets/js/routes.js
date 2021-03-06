(function() {
  'use strict';
  angular.module('hansei.routes')
    .constant('routes', {
      signin: {
        url:         '/signin',
        templateUrl: '/templates/signin.html',
        controller:  'SigninCtrl'
      },
      boards: {
        url:         '/boards',
        templateUrl: '/templates/boards.html',
        controller:  'BoardsCtrl',
        resolve: {
          hideHeader: ['$rootScope', function($rootScope) {
            $rootScope.showHeader = false;
          }],
          loadColsets: ['colsets', function(colsets) {
            colsets.load();
            return colsets.promise;
          }],
          boards: ['$q', 'api', 'user', function($q, api, user) {
            var defer = $q.defer();
            if (user.token()) {
              api.boardsGetList(function(boards) {
                defer.resolve(boards);
              });
            } else {
              defer.reject('not_logged_in');
            }
            return defer.promise;
          }]
        }
      },
      board: {
        url:         '/boards/:boardId',
        templateUrl: '/templates/board.html',
        controller:  'BoardCtrl',
        resolve: {
          boardData: ['board', 'user', '$stateParams', function(board, user, $stateParams) {
            if (!user.token()) {
              var defer = $q.defer();
              defer.reject('not_logged_in');
              return defer.promise;
            }
            return board.load($stateParams.boardId);
          }]
        }
      }
    });
})();
