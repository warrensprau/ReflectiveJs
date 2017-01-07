
angular.module('security')

    .factory('principal', ['$rootScope', '$q', '$http', '$timeout', 'registrationService', 'transformRequestAsFormPost', 'initialDataLoaderService', function ($rootScope, $q, $http, $timeout, registrationService, transformRequestAsFormPost, initialDataLoaderService) {

      var _identity = undefined, _authenticated = false;

      return {

          isIdentityResolved: function () {
              return angular.isDefined(_identity);
          },
          isAuthenticated: function () {
              return _authenticated;
          },
          isInRole: function (role) {
              if (!_authenticated || !_identity.roles) return false;

              return _identity.roles.indexOf(role) != -1;
          },
          isInAnyRole: function (roles) {
              if (!_authenticated || !_identity.roles) return false;

              for (var i = 0; i < roles.length; i++) {
                  if (this.isInRole(roles[i])) return true;
              }

              return false;
          },
          authenticate: function (identity) {
              _identity = identity;
              _authenticated = identity != null;

              // for this cvApp, we'll store the identity in localStorage. For you, it could be a cookie, sessionStorage, whatever
              if (identity) localStorage.setItem("cvApp.identity", angular.toJson(identity));
              else localStorage.removeItem("cvApp.identity");
          },
          identity: function (force) {
              var deferred = $q.defer();

              if (force === true) _identity = undefined;

              // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
              if (angular.isDefined(_identity)) {
                  deferred.resolve(_identity);

                  return deferred.promise;
              }

              var self = this;
              $timeout(function () {
                  _identity = angular.fromJson(localStorage.getItem("cvApp.identity"));
                  self.authenticate(_identity);
                  deferred.resolve(_identity);
              }, 1000);

              //if (!$rootScope.username) {
              //    _identity = null;
              //    _authenticated = false;
              //    deferred.resolve(_identity);
              //}

              //registrationService.login($rootScope.username, $rootScope.password, transformRequestAsFormPost)

              //  .success(function(data) {

              //      _identity = data;
              //      _authenticated = true;

              //      $rootScope.authorizationToken = data.access_token;
              //      var ajaxAdapter = breeze.config.getAdapterInstance('ajax');

              //      ajaxAdapter.defaultSettings = {
              //          headers: {
              //              "Authorization": 'bearer ' + authorizationToken
              //          },
              //      };

              //      initialDataLoaderService.loadAll($scope);

              //      deferred.resolve(_identity);
              //  })
              //  .error(function () {
              //      _identity = null;
              //      _authenticated = false;
              //      deferred.resolve(_identity);
              //  });

              return deferred.promise;
          }
      };
  }
])

