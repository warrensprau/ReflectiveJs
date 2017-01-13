angular.module('security')
    .controller(
        'securityController',
        ['$rootScope', '$scope', '$state', 'principal', 'registrationService', 'transformRequestAsFormPost', 'panelService', SecurityController]);

function SecurityController($rootScope, $scope, $state, principal, registrationService, transformRequestAsFormPost, panelService) {



    $scope.animateToggle = false;
    $rootScope.isLoggedIn = false;
    $rootScope.loginBox = true;

    $scope.username = 'admin@client1.com';
    $scope.password = 'Admin123!';
    $scope.oldPassword ='';
    $scope.confirmPassword = '';

    $scope.login = function() {

        $rootScope.spinner = true;
        $rootScope.loginBox = false;
        $rootScope.loggingIn = false;

        var ajaxAdapter = breeze.config.getAdapterInstance('ajax');

        var rsl = registrationService.login($scope.username, $scope.password, transformRequestAsFormPost);

        rsl.success(function(result) {

            principal.authenticate({
                name: result.userName,
                roles: ['User']
            });

            localStorage.setItem("authorizationToken", result.access_token);
            $rootScope.loginId = result.userName;

            // set fixed headers
            ajaxAdapter.defaultSettings = {
                headers: {
                    "Authorization": 'bearer ' + result.access_token
                },
            };
            //        angular.element('#' + sideAbbr + 'flyout' + panelNumber).html($compile(directive)($scope)).addClass(side + '1').addClass(panelSize).append($compile(s)($scope));

            $rootScope.spinner = false;
            $rootScope.loginBox = true;
            $rootScope.loggingIn = true;

            panelService.setPositioning($rootScope);
            
            if ($scope.returnToState) {
                $state.go($scope.returnToState.name, $scope.returnToStateParams);
            } else {
                $state.go('home');
            }

        }).error(function(result) {

            if (result.toString().indexOf('Cannot drop database') > 0) {
                alert('rsl.error(): Database Connection in use. Try closing the connection and open table data panes in Server Explorer....');
            } else if (result.error_description) {
                alert('rsl.error(): ' + result.error_description);
            } else {
                alert(result.substring(result.indexOf('<i>') + 3, result.indexOf("</i>")));
            }
            $rootScope.spinner = false;
            $rootScope.loginBox = true;
        });
    };

    $scope.changePassword = function() {

        $rootScope.spinner = true;
        $rootScope.loginBox = false;
        $rootScope.loggingIn = false;

        var rsl = registrationService.login($scope.oldPassword, $scope.NewPassword, $scope.confirmPassword, transformRequestAsFormPost);

        rsl.success(function(result) {

            principal.authenticate(null);

            $rootScope.spinner = false;
            $rootScope.loginBox = true;
            $rootScope.loggingIn = true;

            //panelService.setPositioning($rootScope);

            if ($scope.returnToState) {
                $state.go($scope.returnToState.name, $scope.returnToStateParams);
            } else {
                $state.go('home');
            }

        }).error(function(result) {

            if (result.toString().indexOf('Cannot drop database') > 0) {
                alert('rsl.error(): Database Connection in use. Try closing the connection and open table data panes in Server Explorer....');
            } else if (result.error_description) {
                alert('rsl.error(): ' + result.error_description);
            } else {
                alert(result.substring(result.indexOf('<i>') + 3, result.indexOf("</i>")));
            }
            $rootScope.spinner = false;
            $rootScope.loginBox = true;

        });
    }
}
