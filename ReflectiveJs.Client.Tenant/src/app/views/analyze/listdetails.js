
angular
    .module('listdetails', ['ng', 'routeControl'])
    .directive('listdetails', function ($rootScope) {
        return {
            restrict: 'E',
            controller: 'routeControl',
            //        require: '^poll',
            //        transclude: true,
            scope: true,
            //        template: '<button class="btn btn-block btn-default"><span ng-transclude></span></button>',
            templateUrl: 'app/views/analyze/listdetails.html',
            replace: true,
            link: function ($scope, $element, $attrs, $event) {
                //alert('hello product');
                $element.on('click', function (evt) {
                    //this is fired if someone clicks the product panel.

                });
            }
        };
    });
