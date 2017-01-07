
angular
    .module('camporderexport', ['ng', 'routeControl', '720kb.datepicker'])
    .controller(
        'camporderexportController',
        ['$scope', '$rootScope', 'viewService', 'entityManagerFactory', 'panelService', '$http', 'apiUrl',
            function ($scope, $rootScope, viewService, entityManagerFactory, panelService, $http, apiUrl) {
        
                var campaignId;

                if ($scope.master) {
                    campaignId = $scope.master.Id;
                }

                $scope.loaded = false;

                $scope.gridData = [];
                $scope.columns = [];

                $scope.pageNumber = 1;
                $scope.pageSize = 25;
                $scope.currentPage = 1;

                $scope.dataCache = new kendo.data.ObservableArray($scope.gridData);

                $scope.gridOptions = {
                    dataSource: new kendo.data.DataSource(
                        {
                            batch: true,
                            pageSize: 5,
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

                $scope.load = function () {

                    if ($scope.loaded) {
                        $scope.loaded = false;
                        $scope.dataCache = new kendo.data.ObservableArray($scope.data);
                    }
                    $scope.loadList();
                }

                $scope.loadList = function () {

                    $scope.$on('changes-saved', function (event, data) {
                        if (data === 'Order') {
                            $scope.reloadList();
                        }
                    });

                    $rootScope.$emit('loadingData', 'Loading List...');

                    $http.get(apiUrl() + "/api/ordersforexport", { params: { campaignId: $scope.master.CampaignId, from: $scope.master.From, to: $scope.master.To, filterOrderStatusId: $scope.master.FilterOrderStatusId } })
                        .success(function (data, status, headers, config) {
                            $scope.prepareCustomListData(data);
                            $scope.loaded = true;
                            $rootScope.$emit('loadedData', 'Loading List...');
                        }).error(function (data, status, headers, config) {
                            $rootScope.$emit('loadedData', 'Loading List...');
                        });

                };

                $scope.prepareCustomListData = function (data) {

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
                        obj['entityType'] = 'Order';

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
                                pageSize: 5,
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
                                viewService.viewDetails(item, $rootScope, $rootScope, 0, master);
                            }
                        })
                        .catch(function (error) {
                            alert('No route exists to download ' + error.query.resourceName + ' data from the server. Please add a Controller, Route, and DBSet for ' + error.query.resourceName);
                        });
                };

                $scope.preview = function () {

                    $rootScope.$emit('loadingData', 'Generating export...');

                    $http.get(apiUrl() + "/api/exportcampaignorders", { params: { campaignId: campaignId, from: $scope.from, to: $scope.to } })
                        .success(function (data, status, headers, config) {
                            $scope.preview = data;
                            $rootScope.$emit('loadedData', 'Generating export...');
                        }).error(function (data, status, headers, config) {
                            $rootScope.$emit('loadedData', 'Generating export...');
                        });
                };

                $scope.clear = function() {
                    $scope.preview = '';
                }

                $scope.cancel = function (panelNumber) {

                    $rootScope.$emit('changes-cancelled', panelNumber);
                };

                $scope.available = [
                    { "name": "Reference", "id": "Reference" },
                    { "name": "Amount", "id": "Amount" },
                    { "name": "OrderStatus", "id": "OrderStatus" }
                ];

                $scope.assigned = [];

                $scope.move = function (n, fm, to) {

                    var idx = -1;

                    for (var i=0; i<fm.length; i++) {
                        if (fm[i].id == n.id) {
                            idx = i;
                            break;
                        }
                    }

                    if (idx != -1) {
                        to.push(n);
                        fm.splice(idx, 1);

                        if ($scope.master.FormatColumnIds) {
                            $scope.master.FormatColumnIds += ',' + n.id;
                        } else {
                            $scope.master.FormatColumnIds = n.id;
                        }
                    }
                }

                $scope.prepareCustomListData($scope.data);
                $scope.loaded = true;

            }]
    )
    .directive('camporderexport', function ($rootScope) {
        return {
            restrict: 'E',
            controller: 'routeControl',
            //        require: '^poll',
            //        transclude: true,
            scope: false,
            //        template: '<button class="btn btn-block btn-default"><span ng-transclude></span></button>',
            templateUrl: 'app/views/maintain/custom/camporderexport.html',
            replace: true,
            link: function ($scope, $element, $attrs, $event) {
                //alert('hello product');
                $element.on('click', function (evt) {
                    //this is fired if someone clicks the product panel.

                });
            }
        };
    });
