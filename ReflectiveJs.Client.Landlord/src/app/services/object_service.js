
angular
    .module('persistence')

    .factory('objectService', function () {
        return {
        };
    })
    .provider('objectService', {
        $get: function (entityManagerFactory, $rootScope, enumLookupService) {

            var objectService = {}; //new Object();
            
            objectService.getDisplayName = function (item) {

                if (!item) { return ''; }

                if (item.entityType) {
                    if (item.Description) {
                        return item.Description;
                    } else if (item.Name) {
                        return item.Name;
                    } else {
                        return '';
                    }
                }

                if (item.hasOwnProperty('Description')) {
                    return item.Description;
                }
                return item;
            };

            objectService.getFieldType = function (item, property) {

                var type = 'readonly';

                if (item && item.entityType) {

                    var className = item.entityType.shortName;
                    var prop = entityManagerFactory.metadataStore.getEntityType(className).getDataProperty(property);
                    if (!prop) {
                        type = '';
                        //this will catch all the foreign keys, including enumTypes.
                    } else if (type === 'unknown' && prop.relatedNavigationProperty) {
                        type = 'select';
                    } else {
                        var propName = prop.name;
                        var field = objectService.getField(className, propName);
                        if (field){
                            type = field.InputType;
                        }
                    }
                }

                return type;
            };

            objectService.getHelpText = function (item, key) {
                var f = objectService.getField(item.entityType.shortName, key);
                if (f && f.HelpText) {
                    return f.HelpText;
                } else {
                    return '';
                }
            };

            objectService.getField = function (className, propName) {
                for (var i = 0; i < _fields.length; i++) {
                    if (_fields[i].ModelName === className && _fields[i].Name === propName) {
                        return _fields[i];
                    }
                }
                return null;
            };

            objectService.getDisplayValue = function (item, key) {

                if (key.substring(key.length - 2, key.length) === 'Id') {

                    var fkey = key.substring(0, key.length - 2);

                    if (item._backingStore.hasOwnProperty(fkey)) {
                        //if (item[key] != null  && item[fkey] === null) {
                        //    try {
                        //        var entityType = item._backingStore[fkey].entityType.shortName;
                        //        var query = breeze.EntityQuery.from(entityType).where('Id', 'equals', item[key]);
                        //        entityManagerFactory.execute(query).then(function(data) {
                        //            console.log('routes.js => $scope.getDisplayValue: ' + data)
                        //        });

                        //    } catch (ex) {
                        //    }

                        //}
                        if (item[fkey]) {
                            var x = item[fkey];
                            return objectService.getDisplayName(x);
                        } else if (item[key]) {
                            //return $scope.getDisplayName(item[key]);
                            if (item[key].toString().indexOf('-') > 0) {
                                //for enumtypes....
                                return item[key].split('-')[1];
                            }
                            else {
                                return item[key];
                            }
                        } else {
                            return '';
                        }
                    }
                }

                return item[key];

            };

            objectService.getKeyValue = function (item) {
                if (item.hasOwnProperty('_backingStore')) {
                    item = item._backingStore;
                }
                if (item.hasOwnProperty('Id')) {
                    return item.Id;
                } else if (item.hasOwnProperty('ID')) {
                    return item.ID;
                } else if (item.hasOwnProperty('Name')) {
                    return item.Name;
                } else {
                    return item;
                }
            };

            objectService.getForeignKeyObjectFromIdField = function (item, field, $scope, dataCacheKey) {

                var key = field.Name;
                var retValue = item[key];
                var entityType = item.entityType;

                var fkeys = entityType.foreignKeyProperties;
                for (var i = 0; i < fkeys.length; i++) {
                    if (fkeys[i].name === key) {

                        if (field.IsEnum) {
                            return enumLookupService.getEnum(field.EnumType, retValue);
                        }

                        retValue = item[fkeys[i].relatedNavigationProperty.name];
                        var updateDataCache = function (data) {
                            console.log('getForeignKeyObjectFromIdField(): ' + data);
                            var values = data.results[0]._backingStore;
                            var theKey = key;
                            if ($scope.dataCache[dataCacheKey]) {
                                var dc = $scope.dataCache[dataCacheKey];
                                for (var ii = 0; ii < dc.length; ii++) {
                                    if (dc[ii][theKey] === values['Id']) {
                                        dc[ii][theKey] = objectService.getDisplayName(data.results[0]);
                                    }
                                }
                            }
                            //loop through the scope and update the datacache with the value.
                        };
                        if (!retValue){
                            item.entityAspect.loadNavigationProperty(fkeys[i].relatedNavigationProperty.name).then(updateDataCache);
                        }
                    }
                }

                return retValue;
            };

            objectService.getNonCollectionFieldList = function (item, view, includeRels, includeEnumRels) {

                var sortedFields = view.Fields
                    .filter(function (f) { return !f.IsCollection})
                    .sort(function (a, b) { return a.DisplayOrder > b.DisplayOrder; });

                var keyList = [];

                for (var i = 0; i < sortedFields.length; i++) {

                    var field = sortedFields[i];

                    if (field.IsRelationship)
                    {
                        if (field.IsEnum) 
                        {
                            if (!includeEnumRels) {continue;}
                        } 
                        else if (!includeRels) { continue; }
                    }
                 
                    keyList.push(field);
                }

                return keyList;
            };

            objectService.getCollectionFieldList = function (item, view) {

                var sortedFields = view.Fields
                    .filter(function (f) { return f.IsCollection })
                    .sort(function (a, b) { return a.DisplayOrder > b.DisplayOrder; });

                var keyList = [];

                for (var i = 0; i < sortedFields.length; i++) {
                    keyList.push(sortedFields[i]);
                }

                return keyList;
            };

            return objectService;
        }
    });