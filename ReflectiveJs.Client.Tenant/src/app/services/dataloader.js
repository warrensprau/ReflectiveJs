angular.
    module('initialDataLoaderService', ['ng', 'persistence'])
    .factory('initialDataLoaderService', function ($http, objectService) {
        return {};
    })
    .provider('initialDataLoaderService', {
        $get: function ($http, $rootScope, entityManagerFactory, $timeout, objectService, enumLookupService) {

            var cService = {};

            cService.loadAll = function ($scope) {

                $rootScope.$emit('loadingData', 'Loading Ooids...');
                entityManagerFactory.
                    executeQuery(breeze.EntityQuery.from("dash/simple")).
                    then(function (data) {
                        $rootScope.ooids = data.results;
                        $rootScope.$emit('loadedData', 'Loading Ooids...');
                    }).catch(function (error) {
                        console.log('Ooids: ' + error);
                    });

                $rootScope.$emit('loadingData', 'Loading Views...');
                entityManagerFactory.
                    executeQuery(breeze.EntityQuery.from('uiview')).
                    then(function (data) {
                        _views = data.results;
                        console.log('Fields: ' + data.results.length);
                        $rootScope.$emit('loadedData', 'Loading Views...');
                    }).catch(function (error) {
                        console.log('Views: ' + error);
                        $rootScope.$emit('loadedData', 'Loading Views...');
                    });

                $rootScope.$emit('loadingData', 'Loading Enums...');
                entityManagerFactory.
                    executeQuery(breeze.EntityQuery.from('EnumTypes')).
                    then(function (data) {
                        enumLookupService.setEnums(data);
                        $rootScope.$emit('loadedData', 'Loading Enums...');
                    }).catch(function (error) {
                        console.log('Enums: ' + error);
                    });

            };
            return cService;
        }
    });

