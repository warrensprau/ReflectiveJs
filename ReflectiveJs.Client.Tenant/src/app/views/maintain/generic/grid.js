
angular
    .module(
        'grid',
        ['ng', 'ngAnimate', 'vAccordion', 'kendo.directives'])
    .controller(
        'grid',
        ['$scope', '$rootScope', 'objectService', 'viewService', 'entityManagerFactory', '$http', 'apiUrl', Grid]);

function Grid($scope, $rootScope, objectService, viewService, entityManagerFactory, $http, apiUrl) {

    $scope.accordionExpandCallback = function (master, collectionFields, index, Name) {
        
        console.log('expand:', index, Name);
    
    };

    $scope.setAccodionId = function(cfield) {
        var name = cfield.Name;

        if (!name || /^\s*$/.test(name) || 0 === name.length) {
            return;
        }
        else {
            $scope.accordionIdName = name.replace(/\s/, '-')
            return $scope.accordionIdName;
        }
    }

    $scope.loaded = false;

    $scope.data = [];
    $scope.columns = [];

    $scope.dataCache = new kendo.data.ObservableArray($scope.data);

    $scope.gridOptions = {
        dataSource: new kendo.data.DataSource({
                batch: true,
                pageSize: 10,
                data: $scope.dataCache
            }),
        selectable: "row",
        pageable: true,
        navigatable: true,
        sortable: true,
        columns: $scope.columns
    }

    $scope.hasData = function () {
        return $scope.dataCache && $scope.dataCache.length > 0;
    }

    $scope.reloadList = function () {

        $scope.loaded = false;
        $scope.reloading = true;
        $scope.data = [];
        $scope.dataCache = new kendo.data.ObservableArray($scope.data);
        if ($scope.isCustomGrid) {
            $scope.loadCustomList($scope.master, $scope.field, $scope.field.CollectionDetailRoute);
        } else {
            $scope.loadList($scope.master, $scope.field);
        }
        $scope.reloading = false;
    }

    $scope.loadListFor = function (master, field) {

        $scope.master = master;
        $scope.field = field;
        $scope.isCustomGrid = field.CollectionDetailRoute;
        $scope.key = field.Name;
        $scope.label = field.Label;
        $scope.pageNumber = 1;
        $scope.pageSize = 25;
        $scope.currentPage = 1;

        if (!$scope.loaded) {
            if ($scope.isCustomGrid) {
                $scope.loadCustomList(master, field, field.CollectionDetailRoute);
            } else {
                $scope.loadList(master, field);
            }
        }
    }

    $scope.loadList = function (master, field) {

        var query;
        var key = field.Name;

        $scope.entityType = master[key].navigationProperty.entityType;
        $scope.entityTypeName = $scope.entityType.shortName;

        query = breeze.EntityQuery.from($scope.entityType.defaultResourceName);

        var fkeyNames = master._backingStore[key].navigationProperty.invForeignKeyNames;
        var keyName = null;
        if (fkeyNames.length > 0) {
            keyName = fkeyNames[0];
            var pred = new breeze.Predicate(keyName, '==', master.Id);
            query = query.where(pred);
        }

        entityManagerFactory.executeQuery(query)
            .then(function (data) {

                $scope.prepareListData(data.results, field);
                $scope.loaded = true;

            }).catch(function (error) {
                alert(error);
            });
    };

    $scope.loadCustomList = function (master, field, listRoute) {

        var key = field.Name;

        $scope.entityType = master[key].navigationProperty.entityType;
        $scope.entityTypeName = $scope.entityType.shortName;

        $rootScope.$emit('loadingData', 'Loading List...');

        $http.get(apiUrl() + "/api/" + listRoute, { params: { id: master.Id } })
            .success(function (data, status, headers, config) {

                $scope.prepareCustomListData(data, field);
                $scope.loaded = true;
                $rootScope.$emit('loadedData', 'Loading List...');

            }).error(function (data, status, headers, config) {
                $scope.loaded = true;
                $rootScope.$emit('loadedData', 'Loading List...');
            });

    };

    $scope.prepareListData = function (data, field) {

        var fields = objectService.getNonCollectionFieldList(data[0], $scope.view, false, true);;

        var columns = [];

        for (var i = 0; i < fields.length; i++) {
            if (!fields[i].IsHidden) {
                columns.push(
                {
                    field: fields[i].Name,
                    title: fields[i].Label,
                    attributes: { "class": fields[i].Name, "style": "" }
                });
            }
        }

        $scope.columns = columns;

        for (var i = 0; i < data.length; i++) {

            var obj = {};
            for (var k = 0; k < fields.length; k++) {

                var displayItem = null;

                if (fields[k].Name.length > 2) {
                    var fkeyItem = data[i][fields[k].Name.substring(0, fields[k].Name.length - 2)];
                    if (fkeyItem) {
                        displayItem = fkeyItem;
                    } else {
                        displayItem = objectService.getForeignKeyObjectFromIdField(data[i], fields[k], $scope, field.Name) || data[i][fields[k].Name];
                    }
                }

                obj[fields[k].Name] = objectService.getDisplayName(displayItem);
            }
            obj['entityType'] = $scope.entityTypeName;
            obj['id'] = data[i]['Id'];
            $scope.dataCache.push(obj);
        }

        $scope.gridOptions = {
            dataSource: new kendo.data.DataSource(
                {
                    batch: true,
                    pageSize: 10,
                    data: $scope.dataCache
                }),
            selectable: "row",
            pageable: true,
            navigatable: true,
            sortable: true,
            columns: $scope.columns
        }
    }

    $scope.prepareCustomListData = function(data, field) {
            
        var rowData = data.RowData;

        var columns = [];

        for (var i = 0; i < data.Columns.length; i++) {
            columns.push(
                {
                    field: data.Columns[i].field,
                    title: data.Columns[i].title,
                    attributes: { "class": data.Columns[i].field, "style": "" }
                });
        }

        $scope.columns = columns;

        for (var i = 0; i < rowData.length; i++) {

            var obj = {};

            obj['id'] = rowData[i]['Id'];
            obj['entityType'] = $scope.entityTypeName;

            for (var j = 0; j < data.Columns.length; j++) {
                var property = data.Columns[j].field;
                obj[property] = rowData[i][property];
            }

            $scope.dataCache.push(obj);
        }

        $scope.gridOptions = {
            dataSource: new kendo.data.DataSource(
                {
                    batch: true,
                    pageSize: 10,
                    data: $scope.dataCache
                }),
            selectable: "row",
            pageable: true,
            navigatable: true,
            sortable: true,
            columns: $scope.columns
        }
    }

    $scope.handleChange = function (data, dataItem, columns, master, key) {

        var query = breeze.EntityQuery.from($scope.entityType.defaultResourceName).where('Id', '==', parseInt(dataItem.id));

        entityManagerFactory
            .executeQuery(query)
            .then(function (data) {
                if (data.results.length === 0) {
                    alert('Sorry, we could not find that ' + $scope.entityTypeName + ' record.');
                } else {
                    var item = data.results[0];
                    viewService.viewDetails(item, 0);
                }
            })
            .catch(function (error) {
                alert('No route exists to download ' + error.query.resourceName + ' data from the server. Please add a Controller, Route, and DBSet for ' + error.query.resourceName);
            });
    };

    $scope.addNewItem = function (field) {

        if (field.ModelAddAction) {

            var action = $rootScope.actions.filter(function (a) { return (a.Name === field.ModelAddAction); })[0];
            $scope.action = action;
            viewService.addNewActionItem(action, $scope.master, $scope.panelNumber);

        } else {
            viewService.addNewItem($scope, $scope.entityTypeName, $scope.master);
        }
    };

    $scope.$on('changes-saved', function (event, data) {

        if (data === $scope.entityTypeName) {
            if (!$scope.reloading) {
                $scope.reloadList();
            }
        }
    });
};