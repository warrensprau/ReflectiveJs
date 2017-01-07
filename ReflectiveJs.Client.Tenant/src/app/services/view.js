
angular

    .module('view', ['ng', 'panelService'])

    .provider('viewService', {

        $get: function ($rootScope, entityManagerFactory, panelService, objectService, enumLookupService, $location, $q) {

            var viewService = {}; //new Object();

            var editing = false;

            this.location = $location;

            viewService.viewDetails = function (entity, panelNumber) {

                var $scope = $rootScope.$new(true, $rootScope);

                $scope.panelNumber = panelNumber || 0;

                $scope.entityType = entity.entityType.shortName;
                $scope.master = entity;

                $scope.view = _views.filter(function (v) { return v.ModelName === $scope.entityType && v.IsReadMode && v.IsDefault; })[0];
                configureView(entity, $scope, true);

                $rootScope.loadingMessage = null;

                if (entity.IsAction) {
                    panelService.openRightFlyout('actiondetails', 'Details', $scope.panelNumber, $scope);
                } else {
                    panelService.openRightFlyout($scope.view.Directive || "masterdetails", 'Details', $scope.panelNumber, $scope);
                }
            };

            viewService.editDetails = function ($scope) {

                if (!editing) {
                    editing = true;
                    $scope.view = _views.filter(function (v) { return v.ModelName === $scope.entityType && v.IsUpdateMode && v.IsDefault; })[0];
                    configureView($scope.master, $scope, true);

                    $rootScope.loadingMessage = null;

                    if ($scope.master.IsAction) {
                        panelService.openRightFlyout('actiondetails', 'Details', $scope.panelNumber, $scope);
                    } else {
                        panelService.openRightFlyout($scope.view.Directive || "masterdetailsedit", 'Details', $scope.panelNumber, $scope);
                    }
                } else {
                    var yes = alert('Edit already in progress...');
                }
            }

            var configureView = function (entity, $scope, includeCollections) {

                $scope.nonCollectionFields = objectService.getNonCollectionFieldList($scope.master, $scope.view, true, true);
                if (includeCollections) {
                    $scope.collectionFields = objectService.getCollectionFieldList($scope.master, $scope.view);
                }

                $scope.options = {};

                var foreignKeys = entityManagerFactory.metadataStore.getEntityType(entity.entityType.shortName).foreignKeyProperties;

                for (var i = 0; i < foreignKeys.length; i++) {

                    var prop = foreignKeys[i];

                    if (prop.relatedNavigationProperty.entityType.baseTypeName === 'EnumType:#Corvus.Magpie.Server.Model.Domain') {

                        enumLookupService.loadEnum(prop.relatedNavigationProperty.entityType.shortName, $scope);

                    } else {

                        var table = prop.relatedNavigationProperty.entityType.defaultResourceName || prop.relatedNavigationProperty.entityType.shortName;

                        $scope.options[table] = [];

                        if (table && table == 'Users') continue;

                        var field;

                        for (var k = 0; k < $scope.nonCollectionFields.length; k++) {
                            if ($scope.nonCollectionFields[k].Name == prop.name) {
                                field = $scope.nonCollectionFields[k];
                            }
                        }

                        var query;
                        var promise;

                        if (field.CollectionOptionConstraint) {
                            var whereClauseString = field.CollectionOptionConstraint;
                            var whereClause = eval("(" + whereClauseString + ")");
                            query = breeze.EntityQuery.from(table).where(whereClause);
                            promise = entityManagerFactory.executeQuery(query);
                        } else {
                            query = breeze.EntityQuery.from(table);
                            promise = entityManagerFactory.executeQuery(query);
                        }

                        promise.then(function (data) {

                            var table = data.query.resourceName;

                            for (var j = 0; j < data.results.length; j++) {
                                $scope.options[table].push(data.results[j]);
                            }

                        }).catch(function (error) {
                            console.log('routeControl.getFieldType() error loading ' + error.query.resourceName + ': ' + error);
                        });
                    }
                }
            };

            viewService.saveChanges = function ($scope, panelNumber, closeOnSave) {

                if ($scope.master) {
                    if ($scope.master.entityAspect.entityState.name === "Detached") {
                        entityManagerFactory.addEntity($scope.master);
                    }
                }

                try {
                    $rootScope.$emit('loadingData', 'Saving changes...');

                    $scope.exception = null;
                    $scope.errors = [];
                    var saveOptions = null;
                    if ($scope.action && $scope.action.Name != "Edit" && $scope.action.Name != "Save") {
                        saveOptions = new breeze.SaveOptions({ resourceName: $scope.action.Name });
                    }
                    entityManagerFactory.saveChanges(null, saveOptions)

                        .then(function (saveResult) {

                            $rootScope.$emit('loadedData', 'Saving changes...');
                            $rootScope.$emit('changes-saved', panelNumber);
                            $rootScope.$broadcast('changes-saved', $scope.master.entityType.shortName);

                            editing = false;

                            if (closeOnSave) {
                                panelService.closeRightPanel(panelNumber);
                                
                            } else {
                                $scope.view = _views.filter(function (v) { return v.ModelName === $scope.entityType && v.IsReadMode && v.IsDefault; })[0];
                                configureView($scope.master, $scope);

                                $rootScope.loadingMessage = null;
                                panelService.openRightFlyout($scope.view.Directive || "masterdetails", 'Details', $scope.panelNumber, $scope);
                            }
                        })

                        .catch(function (error) {

                            $rootScope.$emit('loadedData', 'Saving changes...');


                            if (error.entityErrors && error.entityErrors.length > 0) {
                                $scope.errors = error.entityErrors;
                            } else if (error.message) {
                                $scope.exception = error.message;
                                //for (var i = 0; i < .entityErrors.length; i++) {
                                //    var entityType = $scope.master.entityType.shortName;
                                //    $($('[name="' + entityType + '.' + msg.entityErrors[i].propertyName + '"')[0]).removeClass('ng-valid').addClass('ng-invalid');
                                //}
                            } else {
                                $scope.exception = "Save failed for unknown reason, please contact support.";
                            }
                        });

                } catch (ex) {
                    $scope.exception = ex;
                    $rootScope.$emit('loadedData', 'Saving changes...');
                }
            };

            viewService.cancelChanges = function ($scope, panelNumber) {

                $scope.master.entityAspect.rejectChanges();
                $scope.master.entityAspect.clearValidationErrors();
                $scope.errors = [];
                $rootScope.$emit('changes-cancelled', panelNumber);

                if ($scope.view.IsCreateMode) {
                    panelService.closeRightPanel(panelNumber);
                } else {
                    $scope.view = _views.filter(function (v) { return v.ModelName === $scope.entityType && v.IsReadMode && v.IsDefault; })[0];
                    configureView($scope.master, $scope, true);

                    $rootScope.loadingMessage = null;

                    if ($scope.master.IsAction) {
                        panelService.openRightFlyout('actiondetails', 'Details', $scope.panelNumber, $scope);
                    } else {
                        panelService.openRightFlyout($scope.view.Directive || "masterdetails", 'Details', $scope.panelNumber, $scope);
                    }
                }
                editing = false;
            };

            viewService.addNewItem = function ($scope, entityTypeName, master, entityTypeLabel) {

                if (editing) {
                    var yes = alert('Edit already in progress...');
                    return;
                }

                editing = true;

                var scope = $rootScope.$new(true, $rootScope);

                var entity = entityManagerFactory.createEntity(entityTypeName);

                scope.view = _views.filter(function (v) { return v.ModelName === entityTypeName && v.IsCreateMode && v.IsDefault; })[0];
                configureView(entity, scope, false);

                scope.entityTypeName = entityTypeName;
                scope.entityTypeLabel = entityTypeLabel;
                scope.master = entity;
                scope.panelNumber = $scope.panelNumber + 1;
                
                //Here we should set default values. The defaults could come from database constraints
                //passed through as part of the FIELDs
                if (entity._backingStore.hasOwnProperty('IsActive')) {
                    entity.IsActive = true;
                }
                //find foreign keys
                //if any are the same type as the current Master
                //set that value to the master's id
                if (master) {
                    var fkeys = entity.entityType.foreignKeyProperties;
                    for (var i = 0; i < fkeys.length; i++) {

                        if (fkeys[i].relatedNavigationProperty.entityType.shortName === master.entityType.shortName || master.entityType.baseEntityType && master.entityType.baseEntityType.shortName === fkeys[i].relatedNavigationProperty.entityType.shortName) {
                            entity[fkeys[i].name] = master.Id;
                        }
                    }
                }

                panelService.openRightFlyout('masterdetailscreate', 'Details', scope.panelNumber, scope);

                $rootScope.$emit('new-panel', '');
            };

            viewService.deactiveItem = function(entity, $scope) {

                $rootScope.$emit('loadingData', 'Making inactive...');

                entity.IsActive = false;

                entityManagerFactory.saveChanges()
                    .then(function (data) {
                        panelService.closeRightPanel($scope.panelNumber);
                        $rootScope.$emit('loadedData', 'Making inactive...');
                    })
                    .catch(function (error) {
                        entity.entityAspect.rejectChanges();
                        if (error.entityErrors.length > 0) {
                            $scope.errors = error.entityErrors;
                        } else {
                            $scope.errors.push({ errorMessage: error.message });
                        }

                        $rootScope.$emit('loadedData', 'Making inactive...');
                    });
            }

            viewService.deleteItem = function (item, $scope) {

                var yes = confirm('Remove?');

                if (yes) {

                    $rootScope.$emit('loadingData', 'Deleting item...');

                    item.entityAspect.setDeleted();

                    entityManagerFactory.saveChanges()
                        .then(function (data) {
                            panelService.closeRightPanel($scope.panelNumber);
                            $rootScope.$emit('loadedData', 'Deleting item...');
                            $rootScope.$broadcast('changes-saved', $scope.master.entityType.shortName);
                        })
                        .catch(function (error) {
                            entityManagerFactory.rejectChanges();
                            //item.entityAspect.rejectChanges();
                            if (error.entityErrors.length > 0) {
                                $scope.errors = error.entityErrors;
                            } else {
                                $scope.errors.push({ errorMessage: error.message });
                            }

                            $rootScope.$emit('loadedData', 'Deleting item...');
                        });
                }
            }

            viewService.delete = function (item, index, $scope) {

                item.IsActive = false;
                //item.entityAspect.setDeleted();
                $rootScope.$emit('loadingData', 'Deleting item...');
                entityManagerFactory.saveChanges()
                    .then(function (data) {
                        $scope.methoddata.splice(index, 1);
                        $rootScope.$emit('loadedData', 'Deleting item...');
                    })
                    .catch(function (error) {
                        alert(error.message);
                        $rootScope.$emit('loadedData', 'Deleting item...');
                    });
            };


            // Actions

            viewService.addNewActionItem = function (action, master, panelNumber, entityTypeLabel, data) {

                if (editing) {
                    var yes = alert('Edit already in progress...');
                    return;
                }

                editing = true;

                var scope = $rootScope.$new(true, $rootScope);

                scope.entityTypeName = action.ActionModel;

                var entity = entityManagerFactory.createEntity(scope.entityTypeName);

                scope.view = _views.filter(function (v) { return v.ModelName === scope.entityTypeName && v.IsCreateMode && v.IsDefault; })[0];
                configureView(entity, scope, false);

                scope.entityTypeLabel = entityTypeLabel;
                scope.master = entity;
                scope.data = data;
                scope.panelNumber = panelNumber + 1;
                scope.action = action;

                scope.okCancel = false;
                if (action.Route) {
                    scope.okCancel = true;
                }

                //Here we should set default values. The defaults could come from database constraints
                //passed through as part of the FIELDs
                if (entity._backingStore.hasOwnProperty('IsActive')) {
                    entity.IsActive = true;
                }
                //find foreign keys
                //if any are the same type as the current Master
                //set that value to the master's id
                if (master) {
                    var fkeys = entity.entityType.foreignKeyProperties;
                    for (var i = 0; i < fkeys.length; i++) {

                        if (fkeys[i].relatedNavigationProperty.entityType.shortName === master.entityType.shortName || master.entityType.baseEntityType && master.entityType.baseEntityType.shortName === fkeys[i].relatedNavigationProperty.entityType.shortName) {
                            entity[fkeys[i].name] = master.Id;
                        }
                    }
                }

                if (scope.data) {
                    var rowData = scope.data.RowData;
                    var selectedIds = '';
                    for (var i = 0; i < rowData.length; i++) {
                        if (selectedIds.length == 0) {
                            selectedIds += rowData[i]['Id'];
                        } else {
                            selectedIds += ',' + rowData[i]['Id'];
                        }
                    }
                    entity.SelectedIds = selectedIds;
                }

                if (action.Directive) {
                    panelService.openRightFlyout(action.Directive, 'Details', scope.panelNumber, scope);
                } else {
                    panelService.openRightFlyout('actiondetailscreate', 'Details', scope.panelNumber, scope);
                }

                $rootScope.$emit('new-panel', '');
            };

            viewService.customActionDetails = function (action, $scope, panelNumber) {

                var scope = $rootScope.$new();

                scope.panelType = "edit";
                scope.panelNumber = $scope.panelNumber + 1;
                scope.master = $scope.master;
                scope.action = $scope.action;

                scope.nonCollectionFields = objectService.getNonCollectionFieldList(scope.master, "details", true, true);

                panelService.openRightFlyout(action.Directive, 'Details', scope.panelNumber, scope);
                $rootScope.$emit('new-panel', '');
            };

            viewService.cancelActionChanges = function ($scope, panelNumber) {

                $scope.master.entityAspect.rejectChanges();
                $scope.master.entityAspect.clearValidationErrors();
                $scope.errors = [];
                $rootScope.$emit('changes-cancelled', panelNumber);

                panelService.closeRightPanel(panelNumber);
                editing = false;
            };

            viewService.saveActionChanges = function ($scope, panelNumber) {

                try {
                    $rootScope.$emit('loadingData', 'Saving changes...');

                    var refresh = function () {

                        $rootScope.$emit('changes-saved', panelNumber);
                        if ($scope.action.EntityType) {
                            $rootScope.$broadcast('changes-saved', $scope.action.EntityType);
                        }

                        if ($scope.action.StayOpenOnSuccess) {

                            $scope.panelMode = "view";
                            editing = false;

                        } else {
                            panelService.closeRightPanel(panelNumber);
                        }
                    };

                    var saveFailed = function (msg) {

                        if (msg.message && !msg.entityErrors) {
                            $scope.exception = msg;
                        } else {
                            $scope.errors = msg.entityErrors;
                            for (var i = 0; i < msg.entityErrors.length; i++) {
                                
                                $($('[name="' + $scope.action.EntityType + '.' + msg.entityErrors[i].propertyName + '"')[0]).removeClass('ng-valid').addClass('ng-invalid');
                            }
                        }
                    };

                    var saveOptions = null;

                    var resourceName = $scope.action.Route;

                    if (resourceName) {
                        saveOptions = new breeze.SaveOptions({ resourceName: resourceName });
                    }

                    entityManagerFactory.saveChanges(null, saveOptions, refresh, saveFailed);

                    $scope.results = 'Changes Saved!';
                    $scope.panelNumber = panelNumber;

                    $rootScope.$emit('loadedData', 'Saving changes...');
                    //set the scope.master's property value to this newly created item so the select box will auto change to the new item.

                } catch (ex) {
                    $scope.exception = ex;
                    $rootScope.$emit('loadedData', 'Saving changes...');
                    console.WriteLine('routeControl.saveChanges() Error: ' + ex.message);
                }
            };

            viewService.viewListDetails = function (entityTypeName, entityTypeLabel, data, panelNumber) {

                var scope = $rootScope.$new(true, $rootScope);

                scope.panelNumber = panelNumber || 0;

                scope.entityTypeName = entityTypeName;
                scope.entityTypeLabel = entityTypeLabel;
                scope.data = data;
                scope.panelFunction = viewService.viewDetails;
                scope.panelArguments = arguments;

                panelService.openRightFlyout('listdetails', 'Details', scope.panelNumber, scope);
            };

            return viewService;
        }
    }
);
