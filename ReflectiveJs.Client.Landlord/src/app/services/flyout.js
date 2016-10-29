
angular

    .module('flyoutService', ['ng', 'view'])

    .provider('flyoutService', {

        $get: function ($rootScope, entityManagerFactory, viewService, $http, apiUrl) {

            var flyoutService = {}; //new Object();

            flyoutService.exploreEntity = function (item, $scope) {

                var entityType = entityManagerFactory.metadataStore.getEntityType(item.entityType);
                var entityTypeName = entityType.defaultResourceName || entityType.shortName;

                if (item.Id === -1) {

                    viewService.addNewItem($scope, entityTypeName);

                } else {

                    var entityQuery =
                        breeze.EntityQuery.from(entityTypeName).where('Id', '==', parseInt(item.Id));

                    entityManagerFactory
                        .executeQuery(entityQuery)
                        .then(function (data) {
                            if (data.results.length === 0) {
                                alert('Sorry, we could not find that ' + entityTypeName + ' record.');
                            } else {
                                viewService.viewDetails(data.results[0], 0);
                            }
                        })
                        .catch(function (error) {
                            alert('No route exists to download ' + error.entityQuery.resourceName + ' data from the server. Please add a Controller, Route, and DBSet for ' + error.entityQuery.resourceName);
                        });
                }
            };

            flyoutService.createEntity = function (entityTypeName, entityTypeLabel, $scope) {

                var entityType = entityManagerFactory.metadataStore.getEntityType(entityTypeName);
                viewService.addNewItem($scope, entityTypeName, null, entityTypeLabel);
            };

            flyoutService.exploreMetric = function (item) {

                $http.get(apiUrl() + "/api/mashboard/" + item.entityType)
                    .success(function (data, status, headers, config) {

                        viewService.viewListDetails(item.entityType, item.entityLabel, data);

                    }).error(function (data, status, headers, config) {
                    });
            };

            return flyoutService;
        }
    }
);
