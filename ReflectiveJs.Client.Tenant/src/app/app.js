'use strict';

//var authorizationToken = 'RQsfUP3Y7TBpA8I54358iIJmcWTQTO3npUEVejbm6UE8xe66lUAGOTzW6LSjkK3wZ9P0DJJRKaJql348sJWTn1LQI3dZG3MXu5wu6JOFPmiCAXQoU03XVsTRjbiuAJC8bVepNOdzh9_coi4HkW0_03t3VEIReIIeTQ2dmoKqO4DpDm5opGxxYn_HdNHEBETQMSN8xKW-tCLZRHdSjITwfKCsKFyc9dVOklltwC20M-VRIyxDc-Obs4z7DreDFZP27opn--sOq_rOSfbweItRM_qof9XThKvVwsQkKSwvih30tTLHzlux5o-20dU6NJkXgwUZOmRV0ySWWz-UmTZPMJ79KjbqQ7V9t1QAz2K_uwKWaI-A8KMxR_cXsmRDRQD1FEpi5f7ieQjraY1WqLnpU5lTTMrfJsUR5QT6vwDQ6ZPnVMsUUUu1N-DCRmftBo1qW9J7KjehB-3-a7lYGlhdryfUdZDxKgPrOVpvfbtglOTM2q994Hc-M-_KWogkujM_F1DdQJnCEjKKJTvb6FzbhA';
var authorizationToken = '';
var _views = null;

var magpieUrl = "";

var globalPanelService = null;

var cvApp = angular.module('cvApp', ['config', 'ui.router', 'ngCookies', 'breeze.angular', 'breeze.directives', 'masterIndex', 'mashboard', 'security', 'main', 'actionHandling', 'grid', 'list', 'initialDataLoaderService', 'persistence', 'datacaching', 'viewUtil'])

    .service('apiUrl', function (magpieUrl) {
        //alert(myconst);
        return function () {
            return magpieUrl;
        };
    })

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider.state('site', {
          'abstract': true,
          resolve: {
              authorize: ['authorization',
                function (authorization) {
                    return authorization.authorize();
                }
              ]
          }
      }).state('home', {
          parent: 'site',
          url: '/',
          data: {
              roles: ['User']
          },
          views: {
              'content@': {
                  templateUrl: 'app/views/home.html',
                  controller: 'HomeController'
              }
          }
      }).state('signin', {
          parent: 'site',
          url: '/signin',
          data: {
              roles: []
          },
          views: {
              'content@': {
                  templateUrl: 'app/views/security/signin.html',
                  controller: 'securityController'
              }
          }
      }).state('restricted', {
          parent: 'site',
          url: '/restricted',
          data: {
              roles: ['Admin']
          },
          views: {
              'content@': {
                  templateUrl: 'app/views/security/restricted.html'
              }
          }
      }).state('accessdenied', {
          parent: 'site',
          url: '/denied',
          data: {
              roles: []
          },
          views: {
              'content@': {
                  templateUrl: 'app/views/security/denied.html'
              }
          }
      });
  }
  ])
  .run(['$rootScope', '$state', '$stateParams', 'authorization', 'principal', 'breeze', '$q',
    function ($rootScope, $state, $stateParams, authorization, principal, breeze, $q) {

        var ajaxAdapter = breeze.config.getAdapterInstance('ajax');

        ajaxAdapter.requestInterceptor = function (requestInfo) {

            var $body = angular.element(document.body);   // 1
            var $rootScope = $body.scope().$root;         // 2

            var canceller = $q.defer();
            if (!$rootScope.cancellers) {
                $rootScope.cancellers = [];
            }

            $rootScope.cancellers.push(canceller);

            requestInfo.config.timeout = canceller.promise;
        };

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if (principal.isIdentityResolved()) authorization.authorize();
        });
    }
  ]);

cvApp.directive('body', ['$window', 'panelService', 'principal', function ($window, panelService, principal) {

    return function (scope) {

        var w = angular.element($window);

        scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };

        scope.$watch(
            scope.getWindowDimensions,
            function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.style = function () {
                    return {
                        'height': (newValue.h - 100) + 'px',
                        'width': (newValue.w - 100) + 'px'
                    };
                };
            },
            true
        );

        w.bind('resize', function ($rootScope) {
            scope.$apply();
            panelService.setPositioning($rootScope);
        });

        $window.onbeforeunload = function () {
            principal.authenticate(null);
        }
    };
}]);






