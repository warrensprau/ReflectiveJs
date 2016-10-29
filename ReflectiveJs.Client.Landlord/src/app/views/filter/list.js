
angular
    .module(
        'list',
        ['ng', 'ngAnimate', 'kendo.directives'])
    .controller(
        'list',
        ['$scope', '$rootScope', 'entityManagerFactory', 'viewService', List]);

function List($scope, $rootScope, entityManagerFactory, viewService) {

    $scope.checkedIds = [];

    var data = $scope.data;

    var columns = [];

    columns.push({template: "<input type='checkbox' class='checkbox' />" });
    for (var i = 0; i < data.Columns.length; i++) {
        columns.push(
            {
                field: data.Columns[i].field,
                title: data.Columns[i].title,
                attributes: { "class": data.Columns[i].field, "style": "" }
            });
    }

    var rowData = data.RowData;
    var dataCache = new kendo.data.ObservableArray($scope.data);

    for (var i = 0; i < rowData.length; i++) {

        var obj = {};

        obj['id'] = rowData[i]['Id'];
        obj['entityType'] = $scope.entityTypeName;

        for (var j = 0; j < data.Columns.length; j++) {
            var property = data.Columns[j].field;
            obj[property] = rowData[i][property];
        }

        dataCache.push(obj);
        $scope.checkedIds.push(obj['id']);
    }

    $scope.gridOptions = {
        dataSource: new kendo.data.DataSource(
            {
                batch: true,
                pageSize: 5,
                data: dataCache
            }),
        selectable: "row",
        pageable: true,
        navigatable: true,
        sortable: true,
        columns: columns
    }

    $scope.handleChange = function (data, dataItem) {

        var et = entityManagerFactory.metadataStore.getEntityType(dataItem.entityType);
        var entityType = et.defaultResourceName || et.shortName;

        var query = breeze.EntityQuery.from(entityType).where('Id', '==', parseInt(dataItem.id));

        entityManagerFactory
            .executeQuery(query)
            .then(function (data) {
                if (data.results.length === 0) {
                    alert('Sorry, we could not find that ' + entityType + ' record.');
                } else {
                    var item = data.results[0];
                    viewService.viewDetails(item, 0);
                }
            })
            .catch(function (error) {
                alert('No route exists to download ' + error.query.resourceName + ' data from the server. Please add a Controller, Route, and DBSet for ' + error.query.resourceName);
            });
    };

    $scope.performAction = function (action) {
        $scope.action = action;
        viewService.addNewActionItem(action, $scope.master, $scope.panelNumber, null, $scope.data);
    }
}

 