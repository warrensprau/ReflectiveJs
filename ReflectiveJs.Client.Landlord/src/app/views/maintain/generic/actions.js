
angular
    .module('actionHandling', ['ng'])
    .controller(
        'actionController',
        ['$scope', '$rootScope', 'viewService', 'entityManagerFactory', 'apiUrl', ActionController]);

function ActionController ($scope, $rootScope, viewService, entityManagerFactory, apiUrl) {
        
    $scope.actions = $scope.view.Actions.filter(function (a) { return a.IsStandard; });
    $scope.customActions = $scope.view.Actions.filter(function (a) { return !a.IsStandard; });

    $scope.performAction = function (action) {
        $scope.action = action;
        if (action.Command) {
            if (action.Command === "SaveChanges") {
                $scope.saveChanges($scope.panelNumber, false);
            } else if (action.Command === "SaveChangesAndClose") {
                $scope.saveChanges($scope.panelNumber, true);
            } else if (action.Command === "CancelChanges") {
                $scope.cancelChanges($scope.panelNumber);
            } else if (action.Command === "Edit") {
                $scope.editDetails();
            } else if (action.Command === "Delete") {
                $scope.deleteItem($scope.master, $scope.panelNumber);
            } else if (action.Command === "Deactivate") {
                $scope.deactivateItem($scope.master);
            } else if (action.Command === "ExportAsCsv") {
                $scope.downloadOrdersExportCsv($scope.master);
            }
        } else {
            if (action.IsCustom) {
                viewService.customActionDetails(action, $scope, entityManagerFactory);
            } else {
                viewService.addNewActionItem(action, $scope.master, $scope.panelNumber);                
            }
        }
    }

    $scope.viewDetails = function (item, panelNumber) {

        if (!panelNumber) panelNumber = 0;
        viewService.viewDetails(item, $rootScope, $scope, panelNumber);
    };

    $scope.downloadOrdersExportCsv = function (ordersExport) {

        try {


            $scope.exception = null;
            $scope.errors = [];

            window.open(apiUrl() + "/api/downloadordersexportcsv?ordersExportId=" + ordersExport.Id, '_blank', '');

        } catch (ex) {
            $scope.exception = ex;

        }
    };

}
