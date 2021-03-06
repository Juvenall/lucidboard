(function() {
  'use strict';

  // ROUTING
  angular.module('hansei.routes', [
      'ui.router',
      'LocalStorageModule'
    ])
    .config([
      '$stateProvider',
      'routeDefaults',
      '$urlRouterProvider',
      'routes',
      'localStorageServiceProvider',
      function($stateProvider,
               routeDefaults,
               $urlRouterProvider,
               routes,
               localStorageServiceProvider) {

        localStorageServiceProvider.setPrefix('niftyboard');

        angular.forEach(routes, function(stateConfig, key) {
          $stateProvider
            .state(key, angular.extend(angular.copy(routeDefaults), stateConfig));
        });

        $urlRouterProvider.otherwise('/signin');
      }
    ])
    .run(['$rootScope', '$state', function($rootScope, $state) {
      // Monitor state change errors and route accordingly
      $rootScope.$on('$stateChangeError', function(a, b, c, d, e, rejection) {
        switch(rejection) {
          case 'not_logged_in':
            $state.go('signin');
            break;
        }
      });

      // Useful variables can be set in each route. Put them on $rootScope
      // so they can be accessed in templates.
      $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        $rootScope.headerUrl = toState.headerUrl;
        $rootScope.footerUrl = toState.footerUrl;
      });
    }]);


  // SERVICES
  angular.module('hansei.services', [
      'hansei.routes',
      'ngSails',
      'angular-lodash/utils/pluck',
      'angular-lodash/utils/flatten',
      'angular-lodash/utils/sortBy',
    ])

    .run(['$rootScope', '$sails', '$state', 'user', 'api',
      function($rootScope, $sails, $state, user, api) {

        function initialSetup() {
          // This clues the api library into the status of the initial token setup
          // so that it can defer any calls until after the websocket session is
          // authenticated.
          user.resetInitialTokenPromise();

          if (!user.token()) {
            return;
          }

          // We have a token in local storage, so let's reauthenticate with it for
          // this fresh websocket connection.
          user.initialRefreshToken();
        }

        $sails.on('reconnect', function() {
          initialSetup();
          api.resubscribe();
        });

        initialSetup();
      }
    ]);


  // USER INTERFACE
  angular.module('hansei.ui', [
      'hansei.services',
      'xeditable',
      'ang-drag-drop',
      'ng-context-menu',
      'monospaced.elastic'
    ])

    .run(['editableOptions', 'editableThemes', function(editableOptions, editableThemes) {
      editableThemes['bs3'].inputClass = 'msd-elastic';
      editableOptions.theme = 'bs3';
    }])

    .run(['$rootScope', '$state', 'user', function($rootScope, $state, user) {
      $rootScope.signout = function($event) {
        $event.preventDefault();
        user.signout();
        $state.go('signin');
      };
    }]);


  // APP
  angular.module('hansei', ['hansei.ui'])
    .config(['$locationProvider', function($locationProvider) {
      $locationProvider
        .html5Mode({enabled: true, requireBase: false})
        .hashPrefix('!');
    }]);
})();
