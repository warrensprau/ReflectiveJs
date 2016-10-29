
angular
    .module('masterdetails')
    .controller(
        'orderexportController',
        ['$scope', '$rootScope', 'viewService', 'entityManagerFactory', 'panelService', '$http', 'apiUrl',
            function ($scope, $rootScope, viewService, entityManagerFactory, panelService, $http, apiUrl) {
        
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
            }]
    )
    .directive('orderexport', function ($rootScope) {
        return {
            restrict: 'E',
            controller: 'routeControl',
            //        require: '^poll',
            //        transclude: true,
            scope: false,
            //        template: '<button class="btn btn-block btn-default"><span ng-transclude></span></button>',
            templateUrl: 'app/views/maintain/custom/orderexport.html',
            replace: true,
            link: function ($scope, $element, $attrs, $event) {
                //alert('hello product');
                $element.on('click', function (evt) {
                    //this is fired if someone clicks the product panel.

                });
            }
        };
    });
