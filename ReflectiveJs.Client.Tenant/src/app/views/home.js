angular
    .module(
        'main',
        ['ngCookies', 'config', 'breeze.angular', 'kendo.directives', 'listdetails', 'masterdetails'])
    .controller(
        'HomeController',
        ['$cookies', '$scope', '$rootScope', '$compile', 'panelService', 'objectService', 'entityManagerFactory', '$state', 'principal', 'initialDataLoaderService', homeController]);

function homeController($cookies, $scope, $rootScope, $compile, panelService, objectService, entityManagerFactory, $state, principal, initialDataLoaderService) {

    initialDataLoaderService.loadAll($rootScope);

    //var entityQuery =
    //    breeze.EntityQuery
    //        .from('associate')
    //        .where('LoginId', '==', $rootScope.loginId)
    //        .expand('AssociateProfile');

    //entityManagerFactory
    //    .executeQuery(entityQuery)
    //    .then(function (data) {
    //        var associate = data.results[0];
    //        $rootScope.userName = associate.FirstName;
    //        var ap = associate.AssociateProfile;
    //    })
    //    .catch(function (error) {
    //        alert('No route exists to download ' + error.entityQuery.resourceName + ' data from the server. Please add a Controller, Route, and DBSet for ' + error.entityQuery.resourceName);
    //    });

    $rootScope.userName = $rootScope.loginId;

    $scope.signout = function () {
        principal.authenticate(null);
        $state.go('signin');
    };

    $scope.loadMenu = function () {
        var myEl = angular.element(document.querySelector('#wrapper'));
        setTimeout(function () {
            myEl.toggleClass('toggled');

        }, 300);

    };

    $scope.layout = 'list';

    $scope.setLayout = function (layout) {
        $scope.layout = layout;
    };

    $rootScope.isLoggedIn = false;

    globalPanelService = panelService;

    $rootScope.attachmentsNeeded = [];

    if (!$rootScope.viewPanels) {
        $rootScope.viewPanels = 3;
    }

    if (!$rootScope.lastPanel) {
        $rootScope.lastPanel = {
            side: '',
            panelNumber: 0
        };
    }

    if (!$rootScope.currentRightPanel) {
        $rootScope.currentRightPanel = 0;
    }

    if (!$rootScope.currentLeftPanel) {
        $rootScope.currentLeftPanel = 0;
    }

    $rootScope.$on('panels-stable', function (event, data) {
        relayoutIsotope();
    });

    $rootScope.$on('close-panel', function (event, data) {
        if (data.side === 'left') {
            $rootScope.currentLeftPanel = data.panelNumber - 1;
        }
        else {
            $rootScope.currentRightPanel = data.panelNumber - 1;
        }
    });
};


