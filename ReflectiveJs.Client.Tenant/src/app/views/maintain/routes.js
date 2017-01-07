/// <reference path="../Panels/panel_service.js" />
var pageSize = 25;

/* jshint ignore:end */

angular.module('routeControl', ['ng', 'camporderexport', 'actiondetails', 'listdetails'])
    .controller('routeControl', function($rootScope, $scope, entityManagerFactory, objectService, $http, apiUrl, flyoutService, viewService, panelService) {

        $scope.errors = [];

        $scope.getEnumValue = function(field) {
            if (!$scope.master[field.Name] && field.DefaultValue) {
                $scope.master[field.Name] = field.DefaultValue;
            }
            return $scope.master[field.Name];
        }
        
        $scope.shownIf = function (field) {
            var isNullOrEmptyString = function (str) {
                return (!str || 0 === str.length);
            };
           
            var operationFx = {
                '==': function (x, y) { return x == y },
                '===': function (x, y) { return x === y },
                '!=': function (x, y) { return x != y },
                '!==': function (x, y) { return x != y },
                '<=': function (x, y) { return x <= y },
                '=>': function (x, y) { return x >= y },
                '>=': function (x, y) { return x >= y },
                '<': function (x, y) { return x < y },
                '>': function (x, y) { return x > y },
                '&&': function (x, y) { return x && y },
                '||': function (x, y) { return x || y }
            };

            var conditionValue = function (c) {
                switch (true) {
                    case /^(true|false)/.test(c):
                        return Boolean(c);
                    case /null/.test(c):
                        return null;
                    default:
                        return c;
                }
            };

            var contains = function (x, i) {
                if (x.indexOf(i) !== -1) { return true } else { return false };
            };
            function isEmpty(obj) {
                return Object.keys(obj).length === 0;
            }

            var getOperatorOperands = function (exp) {
                var operators = ['==', '===', '!=', '!==', '<=', '=>', '>=', '<', '>'];
                var hash = {};
                

                if (typeof exp === 'object') {
                    operators.forEach(function (op) {
                        if (contains(exp, op)) {
                            var operatorIndex = exp.indexOf(op);
                            hash.entityProp = exp[(operatorIndex - 1)];
                            hash.condition = conditionValue(exp[(operatorIndex + 1)]);
                            hash.operator = exp[operatorIndex];
                        }
                    });
                } else if (typeof exp === 'string') {
                    if (contains(exp, ' ')) {
                        var x = exp.split(' ');
                        operators.forEach(function (op) {
                            if (contains(x, op)) {
                                var operatorIndex = x.indexOf(op);
                                hash.entityProp = x[(operatorIndex - 1)];
                                hash.condition = conditionValue(x[(operatorIndex + 1)]);
                                hash.operator = x[operatorIndex];
                            }
                        });
                    }
                }
                return hash;
            };
            var hideOnFieldValueNull = (function (field, panelMode, master) {
                if (panelMode === 'view' && field.InputType === 'select' && isNullOrEmptyString(master[field.Name])) {
                    return false;
                }
                else {
                    return true;
                }
            })(field, $scope.panelMode, $scope.master);

            var shownIf = (function(field, getOperatorOperands,isEmpty, operationFx, master) {
                if (field.ShownIf) {
                    var expression = getOperatorOperands(field.ShownIf);
                    if (isEmpty(expression)) {
                        return true;
                    } else {
                        var etPropValue = master[expression.entityProp];
                        return operationFx[expression.operator](etPropValue, expression.condition);;
                    };
                } else {
                    return true;
                }
            })(field,getOperatorOperands,isEmpty,operationFx,$scope.master);

            var result = (shownIf && hideOnFieldValueNull);

            return result;

            //if (field.ShownIf) {

            //    var exp = getOperatorOperands(field.ShownIf);
            //    if (isEmpty(exp)) {
            //        return true;
            //    } else {
            //        //find breeze entity and current value/setting.
            //        var etPropValue = $scope.master[exp.entityProp];
            //        var result = operationFx[exp.operator](etPropValue, exp.condition);
            //        return result;
            //    }
            //} else {
            //    return true;
            //}

        };

        $scope.getInputFieldType = function(field) {
            if ((field.InputType === 'text' || field.InputType === 'textarea') && field.ShowAsTextEditor === true) {
                return 'texteditor';
            } else {
                return field.InputType;
            }
        };

        $scope.loadDetailsForFkey = function (item, key) {

            var navProp = item.entityType.navigationProperties.filter(function (a) { return a.foreignKeyNames[0] === key });

            var entityType = navProp[0].entityType;
            var entityTypeName = entityType.defaultResourceName || entityType.shortName;

            var query = breeze.EntityQuery.from(entityTypeName).where('Id', '==', parseInt(item[key]));

            entityManagerFactory
                .executeQuery(query)
                .then(function (data) {
                    if (data.results.length === 0) {
                        alert('Sorry, we could not find that ' + entityTypeName + ' record.');
                    } else {
                        var item = data.results[0];
                        viewService.viewDetails(item, 0);
                    }
                })
                .catch(function (error) {
                    alert('No route exists to download ' + error.query.resourceName + ' data from the server. Please add a Controller, Route, and DBSet for ' + error.query.resourceName);
                });
        };

        $scope.closePanel = function() {

            if ($scope.panelMode == "edit" || $scope.panelMode == "new") {
                viewService.cancelChanges($scope, $scope.panelNumber);
            } else {
                panelService.closeRightPanel($scope.panelNumber);
            }
        }

        $scope.zoomPanel = function () {

            panelService.zoomRightPanel($scope.panelNumber);
        }

        if (!$scope.routes) {
            $scope.routes = $rootScope.routes;
        }

        $scope.editDetails = function () {
            viewService.editDetails($scope);
        };

        $scope.saveChanges = function (panelNumber, closeOnSave) {
            viewService.saveChanges($scope, panelNumber, closeOnSave);
        };

        $scope.cancelChanges = function (panelNumber) {
            viewService.cancelChanges($scope, panelNumber);
        };

        $scope.cancelActionChanges = function (panelNumber) {
            viewService.cancelActionChanges($scope, panelNumber);
        };

        $scope.saveActionChanges = function (panelNumber) {
            viewService.saveActionChanges($scope, panelNumber);
        };

        $scope.getTable = function (item, property) {

            var prop = entityManagerFactory.metadataStore.getEntityType(item.entityType.shortName).getDataProperty(property);
            if (prop.relatedNavigationProperty) {
                if (prop.relatedNavigationProperty.entityType.baseTypeName === 'EnumType:#Corvus.Magpie.Server.Model.Domain') {
                    var tbl = prop.relatedNavigationProperty.entityType.shortName;
                    return tbl;

                } else {
                    var tbl = prop.relatedNavigationProperty.entityType.defaultResourceName || prop.relatedNavigationProperty.entityType.shortName;


                    if (tbl.indexOf("paymentmethod") > -1)
                        console.log("payment method!");

                    if (tbl && tbl !== 'Users'){
                        return tbl;
                    }
                    else {
                        return '';
                    }
                }
            } else
                return '';
        };

        $scope.deactivateItem = function (item) {
            viewService.deactivateItem(item, $scope);
        }

        $scope.deleteItem = function (item) {
            viewService.deleteItem(item, $scope);
        }

        $scope.delete = function (item, index) {
            viewService.delete(item, index, $scope);
        };

        $scope.enableDataLoad = function() {
            $scope.gettingData = false;
        };

        $scope.canHasMoreRecords = function() {
            if (! ($scope.query && $rootScope.counts && $scope.pageSize && !$scope.currentPage))
                return false;
            else
                return $rootScope.counts[$scope.query.resourceName] > $scope.pageSize * $scope.currentPage;
        }

        $scope.getField = objectService.getFieldType;
        $scope.getDisplayValue = objectService.getDisplayValue;
        $scope.getDisplayName = objectService.getDisplayName;

        $scope.getFieldType = objectService.getFieldType;
        $scope.getHelpText = objectService.getHelpText;
        $scope.getField = objectService.getFieldType;
        $scope.getKeyValue = objectService.getKeyValue;

        $scope.getLoadingMessage = $rootScope.getLoadingMessage;

        $scope.isLoading = function (key) {
            if ($scope.ajaxLoading)
                if ($scope.ajaxLoading[key])
                    return $scope.ajaxLoading[key];

            return false;
        }

        $scope.validate = function (evt) {
            if (!$scope.errors) {
                $scope.errors = {};
            }

            //console.log('validating ' + evt.target.name);
            var entityType = evt.target.name.split('.')[0];
            var key = evt.target.name.split('.')[1];
            var value = evt.target.value;
            //var f = objectService.getField(entityType , key);
            var validators = null;
            var type = null;
            try {
                type = entityManagerFactory.metadataStore.getEntityType(entityType);
            } catch (ex) {
            }
            if (type) {
                validators = type.getProperty(key).validators;
            }

            if (!validators) {
                return;
            }

            if ($scope.errors[evt.target.name]) {
                $scope.errors[evt.target.name] = '';
            }

            for (var i = 0; i < validators.length; i++) {
                //validate it!
                var v = validators[i];
                var vname = v.name;
                console.log('routes.js - $scope.validate(' + entityType + ',' + key + ') - ' + v);
                if (vname === 'maxLength') {
                    var ml = v.context.maxLength;

                    if (value.length > 50) {
                        $(evt.target).removeClass('ng-valid').addClass('ng-invalid');

                        var msg = v.context.messageTemplate;
                        msg = msg.replace('%displayName%', key).replace('%maxLength%', v.context.maxLength);
                        $scope.errors[evt.target.name] += msg;
                    }
                } else if (vname === 'required') {
                    if (!value) {
                        $(evt.target).removeClass('ng-valid').addClass('ng-invalid');

                        var msg = v.context.messageTemplate;
                        msg = msg.replace('%displayName%', key);
                        if ($scope.errors[evt.target.name]) {
                            $scope.errors[evt.target.name] += msg;
                        } else {
                            $scope.errors[evt.target.name] = msg;
                        }

                    } else {
                        $(evt.target).removeClass('ng-invalid').addClass('ng-valid');
                    }

                }
            }
            //$scope.myForm.$setValidity(evt.target, false);
            if ($scope.errors[evt.target.name]) {
                return false;
            }
        };
    });