angular
    .module('datacaching', ['ng', 'persistence'])

    .factory('enumLookupService', function () { return {}; })

    .provider('enumLookupService', {

        $get: function ($rootScope, entityManagerFactory) {

            var enumsByType = {};
            var enumLookupService = {}

            enumLookupService.loadEnum = function (enumTypeName, $scope) {

                if (enumsByType[enumTypeName]) {
                    $scope.options[enumTypeName] = enumsByType[enumTypeName];
                    return;
                }
            }

            enumLookupService.getEnum = function (enumTypeName, enumTypeId) {

                for (var i=0; i< enumsByType[enumTypeName].length; i++) {
                    if (enumsByType[enumTypeName][i] === enumTypeId) {
                        return enumsByType[enumTypeName][i]
                    }
                }
                return null;
            }

            enumLookupService.setEnums = function (data) {

                enumsByType = {};

                for (var i = 0; i < data.results.length; i++) {
                    var nextEnum = data.results[i];
                    var enumsForType = enumsByType[nextEnum.EnumTypeName];
                    if (!enumsForType) {
                        enumsForType = [];
                        //enumsForType.push({ Name: '', Description: '' });
                        enumsByType[nextEnum.EnumTypeName] = enumsForType;
                    }
                    enumsForType.push({ Name: nextEnum.Name, Description: nextEnum.Description });
                }
            }

            return enumLookupService;
        }
    });



