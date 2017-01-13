angular
    .module(
        'mashboard',
        ['flyoutService', '720kb.datepicker', 'ngAnimate'])
    .controller(
        'MashboardController',
        ['$scope', '$rootScope', 'flyoutService', '$http', 'apiUrl', '$timeout', 'entityManagerFactory', mashboardController])
    .directive('d3Donut', [d3DonutDirective]);

function mashboardController($scope, $rootScope, flyoutService, $http, apiUrl, $timeout, entityManagerFactory) {

      $scope.radius = 450;

      $scope.from = new Date();
      $scope.to = new Date();

      $scope.delay = 1;

      $scope.refreshPoids = function () {

          $rootScope.$emit('loadingData', 'Loading Poids...');
          $http.get(apiUrl() + "/performancesummary?tenantId=1", {
              params: {
                  metricFilter: '',
                  breakdownFilter: '',
                  from: $scope.to,
                  to: $scope.from
              }
          })
          .success(function (data, status, headers, config) {
              $rootScope.poids = data;
              $rootScope.$emit('loadedData', 'Loading Poids...');
          }).error(function (data, status, headers, config) {
              $rootScope.$emit('loadedData', 'Loading Poids...');
          });
      }

      $scope.autoRefreshPoids = function () {

          $http.get(apiUrl() + "/performancesummary?tenantId=1", {
              params: {
                  metricFilter: '',
                  breakdownFilter: '',
                  from: $scope.to,
                  to: $scope.from
              }
          })
          .success(function (data, status, headers, config) {
              $rootScope.poids = data;
          }).error(function (data, status, headers, config) {
          });

          refreshTimeout = setTimeout(function () { $scope.autoRefreshPoids(); }, $scope.delay * 10000);
      }

      $scope.resetInterval = function () {

          clearTimeout(refreshTimeout);
          setTimeout(function () { $scope.autoRefreshPoids(); }, $scope.delay * 10000);
      }

      $scope.clickPoid = function (poid) {
          var obj = {
              entityType: poid.Type,
              entityLabel: poid.Label
          };
          flyoutService.exploreMetric(obj, $scope);
      };

      $scope.refreshPoids();

      var refreshTimeout = setTimeout(function () { $scope.autoRefreshPoids(); }, $scope.delay * 10000);

      $scope.active = 'Orders';

      $scope.setActive = function (type) {
          $scope.active = type;
      };

      $scope.isActive = function (type) {
          return type === $scope.active;
      };
  };


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
              .attr("fill", "#0D0D0D");

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



function togglerDirective() {

    var TOGGLE_CLASS = 'btnSelected';
    var DEF_GROUPNAME = 'default';

    var groups = {};

    return {
        restrict: 'A',
        link: togglerPostLink
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

    function togglerPostLink(scope, elem, attrs) {
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
