angular
    .module(
        'masterIndex',
        ['flyoutService', '720kb.datepicker', 'ngAnimate'])
    .controller(
        'MasterIndexController',
        ['$scope', '$rootScope', 'flyoutService', '$http', 'apiUrl', '$timeout', masterIndexController])
    .filter('nospace', [nospaceFilter])
    .filter('searchFor', [searchForFilter])
    .directive("loadMenu", [loadMenuDirective])
    .directive("dropdown", [dropdownDirective])
    .directive('dropdownOptions', [dropdownOptionsDirective])
    .directive('ngSlideDown', ['$timeout', ngSlideDownDirective])
    .directive('toggle', [toggleDirective])
    .directive('scroller', [scrollerDirective])
    .directive('equalizeHeight', ['$timeout', equalizeHeightDirective])
    .directive('equalizeHeightAdd', [equalizeHeightAddDirective])
    .directive('resize', ['$window', resizeDirective]);

function masterIndexController($scope, $rootScope, flyoutService, $http, apiUrl, $timeout) {

    $scope.date = new Date();

    $scope.loadMenu = function () {
        var myEl = angular.element(document.querySelector('#wrapper'));
        setTimeout(function () {
            myEl.toggleClass('toggled');

        }, 300);

    };

    $scope.layout = 'list';

    $scope.setLayout = function (layout) {
        $scope.layout = layout;

    };

    $scope.isLayout = function (layout) {
        return $scope.layout === layout;
    };

    $scope.sort = "Type";
    $scope.reverse = false;
    $scope.changeSort = function (value) {
        if ($scope.sort === value) {
            $scope.reverse = !$scope.reverse;
            return;
        }

        $scope.sort = value;
        $scope.reverse = false;
    }

    $scope.loadOoids = function () {
        $rootScope.$emit('loadingData', 'Loading ToolKit...');
        $http.get(apiUrl() + "/dash/simple", {
            params: {
                from: $scope.from,
                to: $scope.to
            }
        })
          .success(function (data, status, headers, config) {
          //Set defaults
              $scope.setSelectedListItemToDefaultValues = function() {
                  $scope.selectedListItem = {};
                  $scope.selectedListItem['label'] = 'All';
                  $scope.selectedListItem['type'] = 'All';
              };
              $scope.setSelectedListItemToDefaultValues();
              $scope.filters = {};
              $scope.clearFilter = function () {
                  $scope.filters = {};
              };
             
              $scope.ooids = data;
              if (data) {
                  $scope.vmToolkitList = createToolkitForDropdown(data);
              }
             
              $rootScope.$emit('loadedData', 'Loading ToolKit...');
          }).error(function (data, status, headers, config) {
              $rootScope.$emit('loadedData', 'Loading ToolKit...');
          });
    }

    $scope.clickOoid = function (ooid) {
        var obj = {
            Id: ooid.Id,
            entityType: ooid.Type
        };
        flyoutService.exploreEntity(obj, $scope);
    };

    $scope.clickNewid = function (selectedListItem) {
        if ('type' in selectedListItem && 'label' in selectedListItem) {
            flyoutService.createEntity(selectedListItem.type, selectedListItem.label, $scope);
        }
        
    };

    var init = function () {
        $scope.loadOoids();
    };
    // and fire it after definition
    init();



    $scope.reloadOoids = function () {
        $rootScope.$emit('loadingData', 'Refreshing ToolKit...');
        $http.get(apiUrl() + "/dash/simple", {
            params: {
                from: $scope.from,
                to: $scope.to
            }
        })
          .success(function (data, status, headers, config) {
              $scope.ooids = data;
              if (data) {
                  $scope.vmToolkitList = createToolkitForDropdown(data);
              }

              $rootScope.$emit('loadedData', 'Refreshing ToolKit...');
          });
    }

    $scope.$on('changes-saved', function (event, data) {
        $scope.reloadOoids();
    });
};


function nospaceFilter() {

    return function (string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/[\s]/g, '');
    };
}

function searchForFilter() {

    return function (arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];
        searchString = searchString.toLowerCase();

        angular.forEach(arr, function (item) {

            if (item.Name.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
                this.item = '';
            } else if (item.Type.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
                this.item = '';
            } else if (item.TypeLabel.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
                this.item = '';
            }
        });
        return result;
    };
}

function loadMenuDirective() {

    return {
        restrict: "A",
        scope: {
            myid: '@'
        },
        link: function (scope, element, attr) {

            var el = $(element);
            isClosed = false;

            el.on('click', function () {
                hamburger_cross();
            });

            function hamburger_cross() {
                if (isClosed == true) {
                    el.removeClass('is-open');
                    el.addClass('slideInLeft')
                    el.addClass('is-closed');
                    el.addClass('slideOutLeft')
                    isClosed = false;
                } else {
                    el.removeClass('is-closed');
                    el.removeClass('slideOutLeft')
                    el.addClass('is-open');
                    el.addClass('slideInLeft')
                    isClosed = true;
                }
            }
        }
    };
}

function dropdownDirective() {

    return {
        restrict: 'A',
        link: function (scope) {
            scope.showDropdown = function () {
                if (scope.showList) {
                    scope.showList = false;
                } else {
                    scope.showList = true;
                }
            }
        }
    }
}

function dropdownOptionsDirective() {

    return {
        restrict: 'A',
        transclude: true,
        link: function (scope, element, attrs) {
            scope.selectDropdownItem = function (item) {
                scope.selectedListItem = item;
                //scope.selectedEntityType;
                scope.showList = false;

                if (scope.selectedListItem === undefined) {
                    scope.setSelectedListItemToDefaultValues();
                    scope.clearFilter();
                }

            }
        }
    }
}

function ngSlideDownDirective($timeout) {

    var getTemplate, link;
    getTemplate = function (tElement, tAttrs) {
        if (tAttrs.lazyRender !== void 0) {
            return '<div ng-if=\'lazyRender\' ng-transclude></div>';
        } else {
            return '<div ng-transclude></div>';
        }
    };
    link = function (scope, element, attrs, ctrl, transclude) {
        var closePromise, duration, elementScope, emitOnClose, getHeight, hide, lazyRender, onClose, show;
        duration = attrs.duration || 1;
        elementScope = element.scope();
        emitOnClose = attrs.emitOnClose;
        onClose = attrs.onClose;
        lazyRender = attrs.lazyRender !== void 0;
        if (lazyRender) {
            scope.lazyRender = scope.expanded;
        }
        closePromise = null;
        element.css({
            overflow: 'hidden',
            transitionProperty: 'height',
            transitionDuration: '' + duration + 's',
            transitionTimingFunction: 'ease-in-out'
        });
        getHeight = function (passedScope) {
            var c, children, height, _i, _len;
            height = 0;
            children = element.children();
            for (_i = 0, _len = children.length; _i < _len; _i++) {
                c = children[_i];
                height += c.clientHeight;
            }
            return '' + height + 'px';
        };
        show = function () {
            if (closePromise) {
                $timeout.cancel(closePromise);
            }
            if (lazyRender) {
                scope.lazyRender = true;
            }
            return element.css('height', getHeight());
        };
        hide = function () {
            element.css('height', '0px');
            if (emitOnClose || onClose || lazyRender) {
                return closePromise = $timeout(function () {
                    if (emitOnClose) {
                        scope.$emit(emitOnClose, {});
                    }
                    if (onClose) {
                        elementScope.$eval(onClose);
                    }
                    if (lazyRender) {
                        return scope.lazyRender = false;
                    }
                }, duration * 1000);
            }
        };
        scope.$watch('expanded', function (value, oldValue) {
            if (value) {
                return $timeout(show);
            } else {
                return $timeout(hide);
            }
        });
        return scope.$watch(getHeight, function (value, oldValue) {
            if (scope.expanded && value !== oldValue) {
                return $timeout(show);
            }
        });
    };
    return {
        restrict: 'A',
        scope: {
            expanded: '=ngSlideDown'
        },
        transclude: true,
        link: link,
        template: function (tElement, tAttrs) {
            return getTemplate(tElement, tAttrs);
        }
    };
}

function d3DonutDirective() {

    return {
        restrict: 'E',
        scope: {
            radius: '=',
            percent: '=',
            display: '=',
            text: '=',
        },
        link: function (scope, element, attrs) {
            var radius = scope.radius,
              percent = scope.percent,
              display = scope.display,
              progress = 0;

            var svg = d3.select(element[0])
              .append('svg')
              .style('width', radius / 2 + 'px')
              .style('height', radius / 2 + 'px')

            svg.append("circle")
              .attr("cx", 112.5)
              .attr("cy", 112.5)
              .attr("r", 100)
              .attr("fill", "#53565a");

            var donutScale = d3.scale.linear()
              .domain([0, 100])
              .range([0, 2 * Math.PI]);

            var color = "#3cabea";

            var data = [
              [0, 100, "#e2e2e2"],
              [0, 0, color]
            ];

            var arc = d3.svg.arc()
              .innerRadius(radius / 6)
              .outerRadius(radius / 4)
              .startAngle(function (d) {
                  return donutScale(d[0]);
              })
              .endAngle(function (d) {
                  return donutScale(d[1]);
              });

            var caret = svg.append("text")
              .attr("x", radius / 4)
              .attr("y", radius / 4)
              .attr("dy", "-2.5em")
              .attr("text-anchor", "middle")
              .attr("font-family", "FontAwesome")
              .attr('font-size', function (d) {
                  return '16px';
              })
              .style("fill", function (d) {
                  if (percent <= 1) {
                      return "#EF6C44"
                  } else {
                      return "#A9CD86"
                  };
              })
              .text(function (d) {
                  if (percent <= 1) {
                      return '\uf0d7'
                  } else {
                      return '\uf0d8'
                  }
              });


            var text = svg.append("text")
                .attr("x", radius / 4)
                .attr("y", radius / 4)
                .attr("dy", ".15em")
                .attr("text-anchor", "middle")
                .attr("font-size", "40px")
                .style("fill", "#fff")
                .attr("class", "inside")
                .attr("text-anchor", "middle")
                .text(display);

            var text = svg.append("text")
                .attr("x", radius / 4)
                .attr("y", radius / 4)
                .attr("dy", "1.35em")
                .attr("text-anchor", "middle")
                .attr("font-size", "48px")
                .style("fill", "#F9F2E7")
                .attr("class", "hidden")
                .attr("text-anchor", "middle")
                .text(percent);

            var result = svg.append("text")
                .attr("x", radius / 4)
                .attr("y", radius / 4)
                .attr("dy", "2.15em")
                .attr("text-anchor", "middle")
                .style("fill", "#F9F2E7")
                .attr("class", "data")
                .attr("font-size", "14px")
                .text(function (d) {
                    return 'Achieved';
                });

            var icon = svg.append("text")
                .attr("x", radius / 4)
                .attr("y", radius / 4)
                .attr("dy", "4em")
                .attr("text-anchor", "middle")
                .style("fill", "#fff")
                .attr("font-family", "FontAwesome")
                .attr('font-size', function (d) {
                    return '14px';
                })
                .text(function (d) {
                    return '\uf05a';
                });


            var path = svg.selectAll("path")
                .data(data)
                .enter()
                .append("path")
                .style("fill", function (d) {
                    return d[2];
                })
                .attr("d", arc)
                .each(function (d) {
                    this._current = d;
                    console.log(this._current);
                });

            // update the data!
            data = [
              [0, 100, "#e2e2e2"],
              [0, percent, color]
            ];

            path
              .data(data)
              .attr("transform", "translate(" + radius / 4 + "," + radius / 4 + ")")
              .transition(200).duration(500).ease('linear')
              .attrTween("d", function (a) {
                  // Store the displayed angles in _current.
                  // Then, interpolate from _current to the new angles.
                  // During the transition, _current is updated in-place by d3.interpolate.
                  var i = d3.interpolate(this._current, a);
                  var i2 = d3.interpolate(progress, percent)
                  this._current = i(0);
                  //console.log(this._current);
                  console.log(display, percent);
                  return function (t) {
                      text.text(i2(t));
                      return arc(i(t));
                  };
              });
        }
    };
}

function toggleDirective() {

    var TOGGLE_CLASS = 'selected';
    var DEF_GROUPNAME = 'default';

    var groups = {};

    return {
        restrict: 'A',
        link: togglePostLink
    };

    function addElement(groupName, elem) {
        var list = groups[groupName] || (groups[groupName] = []);
        if (list.indexOf(elem) === -1) list.push(elem);
    }

    function removeElement(groupName, elem) {
        var list = groups[groupName] || [];
        var idx = list.indexOf(elem);
        if (idx !== -1) list.splice(idx, 1);
    }

    function setActive(groupName, elem) {
        angular.forEach(groups[groupName], function (el) {
            el.removeClass(TOGGLE_CLASS);
        });
        elem.addClass(TOGGLE_CLASS);
    }

    function togglePostLink(scope, elem, attrs) {
        var groupName = attrs.toggle || DEF_GROUPNAME;
        addElement(groupName, elem);

        elem.on('click', onClick);
        scope.$on('$destroy', onDestroy);

        function onClick() {
            setActive(groupName, elem);
        }

        function onDestroy() {
            removeElement(groupName, elem);
        }
    }
}

function scrollerDirective() {

    return {
        link: function (scope, element, attrs) {

            $('.ooid-content').scroll(function () {
                if ($(this).scrollTop() > 600) {
                    $('.go-top').fadeIn(200);
                } else {
                    $('.go-top').fadeOut(200);
                }
            });


            element.click(function () {
                $('.ooid-content').animate({ scrollTop: 0 }, 800);
                return false;
            });
        }
    }
}

function equalizeHeightDirective($timeout) {

    return {
        restrict: 'A',
        controller: function ($scope) {
            var elements = [];
            this.addElement = function (element) {
                elements.push(element);
            }

            this.resize = function () {
                $timeout(function () {
                    // find the tallest
                    var tallest = 0, height;
                    angular.forEach(elements, function (el) {
                        height = el[0].offsetHeight;
                        if (height > tallest)
                            tallest = height;
                    });
                    // resize
                    angular.forEach(elements, function (el) {
                        el[0].style.height = tallest + 'px';
                    });
                }, 0);
            };
        }
    };
}

function equalizeHeightAddDirective() {

    return {
        restrict: 'A',
        require: '^^equalizeHeight',
        link: function (scope, element, attrs, ctrl_for) {
            ctrl_for.addElement(element);
            if (scope.$last)
                ctrl_for.resize();
        }
    };
}

function resizeDirective($window) {

    return function (scope, element, attr) {

        var w = angular.element($window);
        scope.$watch(function () {
            return {
                'h': window.innerHeight,
                'w': window.innerWidth
            };
        }, function (newValue, oldValue) {
            console.log(newValue, oldValue);
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.resizeWithOffset = function (offsetH) {
                scope.$eval(attr.notifier);
                return {
                    'height': (newValue.h - offsetH) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
}

var createToolkitForDropdown = function(data) {
    var tmpToolKitObject = {}
    //create list for toolkit dropdown names and type
    var toolkitList = data.map(function(obj) {
        return { type: obj.Type, label: obj.TypeLabel };
    });
    var sortedToolkitListByLabel = toolkitList.sort(function(a, b) {
        return a.label.toLowerCase() < b.label.toLowerCase() ? -1 : a.label.toLowerCase() > b.label.toLowerCase() ? 1 : 0;
    });
    return removeDuplicatesFromObjByProp(sortedToolkitListByLabel, 'type');
};
var removeDuplicatesFromObjByProp = function (arr, prop) {
    var newArr = [];
    var lookup = {};
    for (var i in arr) {
        lookup[arr[i][prop]] = arr[i];
    }
    for (i in lookup) {
        newArr.push(lookup[i]);
    }
    return newArr;
};
