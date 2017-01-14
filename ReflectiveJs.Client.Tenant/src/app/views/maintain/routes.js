/// <reference path="../Panels/panel_service.js" />
var pageSize = 25;

/* jshint ignore:end */

angular
    .module('routeControl', ['ng', 'actiondetails', 'listdetails'])

    .controller('routeControl', function($rootScope, $scope, entityManagerFactory, objectService, $http, apiUrl, flyoutService, viewService, panelService) {

        $scope.errors = [];

        $scope.getEnumValue = function(field) {
            if (!$scope.master[field.Name] && field.DefaultValue) {
                $scope.master[field.Name] = field.DefaultValue;
            }
            return $scope.master[field.Name];
        }
        
        $scope.shownIf = function (field) {
            return true;
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

        $scope.enableDataLoad = function () {
            $scope.gettingData = false;
        };

        $scope.canHasMoreRecords = function () {
            if (!($scope.query && $rootScope.counts && $scope.pageSize && !$scope.currentPage))
                return false;
            else
                return $rootScope.counts[$scope.query.resourceName] > $scope.pageSize * $scope.currentPage;
        }

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

        // Redirects to View Service

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

        $scope.deactivateItem = function (item) {
            viewService.deactivateItem(item, $scope);
        }

        $scope.deleteItem = function (item) {
            viewService.deleteItem(item, $scope);
        }

        $scope.delete = function (item, index) {
            viewService.delete(item, index, $scope);
        };


        // Redirects to Object Service 

        $scope.getField = objectService.getFieldType;
        $scope.getDisplayValue = objectService.getDisplayValue;
        $scope.getDisplayName = objectService.getDisplayName;

        $scope.getFieldType = objectService.getFieldType;
        $scope.getHelpText = objectService.getHelpText;
        $scope.getField = objectService.getFieldType;
        $scope.getKeyValue = objectService.getKeyValue;

    });