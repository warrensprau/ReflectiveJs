var _setControlPanelTimeout = null;

var MAX_OPEN_PANELS = 6;
var MAX_PANELS_PER_SIDE = 20;

angular
    .module('panelService', ['ng'])

    .factory('panelService', function ($http, $compile) {
        return {

        };
    })

    .provider('panelService', {

        $get: function ($rootScope, $compile, objectService, entityManagerFactory) {

            var panelService = {}; //new Object();

            panelService.panelIsOpen = function(el) {
                var open = false;
                for (var i = 1; i < MAX_PANELS_PER_SIDE; i++) {
                    if (el.hasClass('left' + i) || el.hasClass('right' + i)) {
                        return true;
                    }
                }
                return open;
            };

            panelService.openPanelCount = function() {
                var openPanels = 1;
                for (var i = MAX_PANELS_PER_SIDE; i > 0; i--) {
                    openPanels += this.panelIsOpen($('#lflyout' + i)) ? 1 : 0;
                    openPanels += this.panelIsOpen($('#rflyout' + i)) ? 1 : 0;
                }
                return openPanels;
            };

            panelService.openRight = function (panelSize) {
                if ($rootScope.currentRightPanel >= MAX_PANELS_PER_SIDE) {
                    return;
                }
                $rootScope.currentRightPanel++;
                $rootScope.lastPanel = { side: 'right', panelNumber: $rootScope.currentRightPanel };
                $rootScope.openRightFlyout('emptypanel', 'emptypanel', $rootScope.currentRightPanel, $scope, panelSize);
                //angular.element('#rflyout1').html($compile('<productdetails></productdetails>')($scope)).addClass('right1');
                $rootScope.$emit('new-panel', '');

            };

            panelService.openLeft = function (panelSize) {
                if ($rootScope.currentLeftPanel >= MAX_PANELS_PER_SIDE) {
                    return;
                }
                $rootScope.currentLeftPanel++;
                $rootScope.lastPanel = { side: 'left', panelNumber: $rootScope.currentLeftPanel };
                $rootScope.openLeftFlyout('emptypanel', 'emptypanel', $rootScope.currentLeftPanel, $scope, panelSize);
                //angular.element('#rflyout1').html($compile('<productdetails></productdetails>')($scope)).addClass('right1');
                $rootScope.$emit('new-panel', '');
            };

            panelService.openFlyout = function (side, directive, label, panelNumber, $scope, panelSize) {

                if (panelNumber === undefined)
                    panelNumber = 0;
                
                if (!$scope){
                    $scope = lastScope;
                }

                var capSide = side.capitalize();
                var sideAbbr = side.substr(0, 1);

                if (!panelSize) {
                    panelSize = 'single';
                }

                if (panelNumber > MAX_PANELS_PER_SIDE){
                    return;
                }


                //$('#container').width($('#container').width() + 500);
                if (!$rootScope.refreshing) {
                    //don't need to update current panel, etc when doing a refresh because the panel orders stay the same.
                    if (!panelNumber) {
                        if (side == 'right') {
                            if (!$rootScope.currentRightPanel) {
                                $rootScope.currentRightPanel = 1;
                                panelNumber = 1;
                            } else {
                                panelNumber = ++$rootScope.currentRightPanel;
                            }

                        } else {
                            if (!$rootScope.currentLeftPanel) {
                                $rootScope.currentLeftPanel = 1;
                                panelNumber = 1;
                            } else {
                                panelNumber = ++$rootScope.currentLeftPanel;
                            }
                        }
                    } else {
                        if (side == 'right') {
                            $rootScope.currentRightPanel = panelNumber;
                        } else {
                            $rootScope.currentLeftPanel = panelNumber;
                        }
                    }
                    if ($scope)
                        $scope.panelNumber = panelNumber;

                }
                if (directive) {
                    directive = '<' + directive + '></' + directive + '>';
                }
                if (!panelService.panelSettings)
                    panelService.panelSettings = {}

                panelService.panelSettings[side + panelNumber] = {
                    side: side,
                    directive: directive,
                    label: label,
                    panelNumber: panelNumber,
                    panelSize: panelSize,
                    scope: $scope
                }

                //bad autoreplacement of ' and "
                //var s = '<div class="' + side + 'Close" onclick="return globalPanelService.close' + capSide + 'Panel(' + panelNumber + ')">X</div><div class="' + side + 'Zoom" onclick="return globalPanelService.zoom' + capSide + 'Panel(' + panelNumber + ')">ZOOM</div>';
                 
                var s = "<div class='panelToolbar'><div class='" + side + "Close" + ' ' + "panel-icon' onclick='return globalPanelService.close" + capSide + "Panel(" + panelNumber + ")'><i class='pe-7s-close'></i></div><div class='" + side + "Refresh" + ' ' + "panel-icon' onclick='return globalPanelService.refresh" + capSide + "Panel(" + panelNumber + ")' ng-show='panelFunction'><i class='pe-7s-refresh-2'></i></div><div class='" + side + "Zoom" + ' ' + "panel-icon' onclick='return globalPanelService.zoom" + capSide + "Panel(" + panelNumber + ")'><i class='pe-7s-expand1'></i></div></div>";
               
                if (!$rootScope.refreshing) {
                    $('.' + sideAbbr + 'flyout').each(function (index) {
                        for (var i = 0; i < MAX_PANELS_PER_SIDE; i++) {
                            $(this).removeClass(side + i);
                        }
                    });

                    var panelPosition = panelNumber;
                    for (var i = 1; i < panelNumber; i++) {
                        angular.element('#' + sideAbbr + 'flyout' + i).addClass(side + panelPosition);
                        panelPosition--;
                    }
                }

                //        if (panelNumber === 3) {
                //            angular.element('#rflyout1').addClass('right3');
                //            angular.element('#rflyout2').addClass('right2');
                //       }
                //        if (panelNumber === 2) {
                //            angular.element('#rflyout1').addClass('right2');
                //        }
                $scope.panelNumber = panelNumber;
                angular.element('#' + sideAbbr + 'flyout' + panelNumber).html($compile(directive)($scope)).addClass(side + '1').addClass(panelSize);
                angular.element('#' + sideAbbr + 'flyout' + MAX_PANELS_PER_SIDE).html('');
                $rootScope.centerPanel = { Side: side, Number: panelNumber };
                this.setPositioning($rootScope);
                $rootScope.refreshing = false;
                //angular.element('#rflyout1').html($compile(directive)($scope)).addClass('right1');
            };

            panelService.openRightFlyout = function (directive, label, panelNumber, $scope, panelSize) {
                this.openFlyout('right', directive, label, panelNumber, $scope, panelSize);
            };

            panelService.openLeftFlyout = function (directive, label, panelNumber, $scope, panelSize) {
                this.openFlyout('left', directive, label, panelNumber, $scope, panelSize);
            };

            panelService.closePanel = function (side, panelNumber) {
                if (side == 'right') {
                    if (panelNumber <= 0){
                        panelNumber = $rootScope.currentRightPanel;
                    }

                    if (panelService.panelIsOpen(angular.element('#rflyout' + (panelNumber)))) {
                        $rootScope.currentRightPanel = (panelNumber - 1);

                        //this closes the left analysis panel if we just closed all the right hand panels.
                        if ($rootScope.currentRightPanel === 0 && $rootScope.currentLeftPanel === 1){
                            panelService.closeLeftPanel(1);
                        }

                    } else {
                        return;
                    }



                } else {
                    if (panelNumber <= 0){
                        panelNumber = $rootScope.currentLeftPanel;
                    }

                    if (panelService.panelIsOpen(angular.element('#lflyout' + panelNumber))) {
                        $rootScope.currentLeftPanel = (panelNumber - 1);

                        //this closes the right panel if we just closed all the left hand panels.
                        if ($rootScope.currentRightPanel === 1 && $rootScope.currentLeftPanel === 0){
                            panelService.closeRightPanel(1);
                        }

                    } else {
                        return;
                    }

                }

                $rootScope.$emit('close-panel', { side: side, panelNumber: panelNumber });

                var indicator = side.substr(0, 1);

                $('.' + indicator + 'flyout').each(function (index) {
                    for (var i = 0; i < MAX_PANELS_PER_SIDE; i++) {
                        $(this).removeClass(side + i).removeClass('double').removeClass('triple');
                    }
                });

                var panelPosition = panelNumber - 1;

                for (var i = 1; i < panelNumber; i++) {
                    angular.element('#' + indicator + 'flyout' + i).addClass(side + panelPosition);
                    panelPosition--;
                }

                this.setPositioning($rootScope);
            };

            panelService.closePanels = function (side) {
                for (var i = MAX_PANELS_PER_SIDE; i > 0; i--) {
                    if (!side) {
                        this.closePanel('right', i);
                        this.closePanel('left', i);
                    } else {
                        this.closePanel(side, i);
                    }
                }

            };

            panelService.zoomPanel = function(side, panelNumber) {
                var indicator = side.substr(0, 1);
                var el = $('#' + indicator + 'flyout' + panelNumber);
                if (el.hasClass('triple')) {
                    el.removeClass('triple');
                }else if (el.hasClass('double')) {
                    el.removeClass('double').addClass('triple');

                } else {
                    el.addClass('double');
                }
                this.setPositioning($rootScope);


            };

            panelService.closeRightPanel = function (panelNumber) {
                this.closePanel('right', panelNumber);
            };

            panelService.closeLeftPanel = function (panelNumber) {
                this.closePanel('left', panelNumber);
            };

            panelService.zoomRightPanel = function (panelNumber) {
                this.zoomPanel('right', panelNumber);
            };

            panelService.zoomLeftPanel = function (panelNumber) {
                this.zoomPanel('left', panelNumber);
            };

            panelService.closeRightPanels = function () {
                this.closePanels('right');
            };

            panelService.closeLeftPanels = function () {
                this.closePanels('left');
            };

            panelService.refreshLeftPanel = function (panelNumber, scope) {
                panelService.refreshPanel('left', panelNumber, scope);
            }
            panelService.refreshRightPanel = function (panelNumber, scope) {
                panelService.refreshPanel('right', panelNumber, scope);
            }
            panelService.refreshPanel = function (side,panelNumber, scope) {
                var ps = panelService.panelSettings[side + panelNumber];
                //alert('refreshing panel');
                //ps.scope.dataCache = {};

                //$scope.panelObject = "panelService";
                //$scope.panelFunction = "viewDetails";
                //$scope.panelArguments = arguments;

                ps.scope.$root.refreshing = true;
                ps.scope.panelFunction.apply(null, ps.scope.panelArguments);

                //panelService.openFlyout(ps.side, ps.directive, ps.label, ps.panelNumber, ps.scope, ps.panelSize);
            }


            panelService.increaseVisiblePanels = function () {
                $rootScope.$apply(function () {
                    $rootScope.viewPanels++;
                    if ($rootScope.viewPanels > MAX_OPEN_PANELS){
                        $rootScope.viewPanels = 1;
                    }

                    panelService.setPositioning($rootScope);

                });

            };

            panelService.getPanelWidth = function(panel, defaultWidth) {

                if (!defaultWidth) {
                    
                    var width = window.innerWidth;
                    var openedPanels = this.openPanelCount();
                    var openPanels = openedPanels;
                    if ($rootScope) {
                        if ($rootScope.viewPanels > 0){
                            openPanels = Math.min($rootScope.viewPanels, openPanels);
                        }
                    }
                    defaultWidth = width / openPanels - 0;
                }

                var scaleFactor = 1;
                if (panel.hasClass('double')) {
                    scaleFactor = 2;
                }
                if (panel.hasClass('triple')) {
                    scaleFactor = 3;
                }
                return defaultWidth * scaleFactor;
            };

            panelService.setPositioning = function($rootScope) {
                var offsetLeft = 0;
                var panelWidths = 0;
                var sides = ['r', 'l'];

                var height = window.innerHeight;
                var width = window.innerWidth;
                var currLeft = 0;
                var scaleFactor = 1;
                var openedPanels = this.openPanelCount();
                var openPanels = openedPanels;
                if ($rootScope) {
                    if ($rootScope.viewPanels > 0){
                        openPanels = Math.min($rootScope.viewPanels, openPanels);
                    }
                } else {
                    //openPanels = this.openPanelCount();
                }
                var panelWidth = width / openPanels - 0;



                //if ($rootScope.centerPanel) {
                //    console.log('panelService.setPositioning center panel: ' + $rootScope.centerPanel.Side + ' ' + $rootScope.centerPanel.Number);
                //    for (var i = 1; i <= MAX_PANELS_PER_SIDE; i++) {
                //        for (var j = 0; j < sides.length; j++) {
                //            var el = $('#' + sides[j] + 'flyout' + i);
                //            if (this.panelIsOpen(el)) {
                //                panelWidths += panelService.getPanelWidth(el, width / openedPanels);
                //            }
                //        }
                //    }
                //    //center panel
                //    if (panelWidths > 1200 && openedPanels > 3) {
                //        offsetLeft = panelWidth;  //here we need to get an offset that will make the center panel the middle one. 
                //        currLeft = -1 * offsetLeft;

                //    }

                //} 
                

               
                var el = null;
                var thisPanelWidth = 0;
                for (var i = 1; i <= MAX_PANELS_PER_SIDE; i++) {
                    scaleFactor = 1;
                    el = $('#lflyout' + i);
                    if (this.panelIsOpen(el)) {
                        el.css('left', currLeft);
                        thisPanelWidth = panelService.getPanelWidth(el, panelWidth);
                        el.css('width', thisPanelWidth);
                        currLeft += thisPanelWidth;
                    } else {
                        el.html('');
                        el.css('width', 0);
                    }
                }

                el = $('#centerPanel');
                el.css('left', currLeft);
                $('#centerPanel').css('width', panelWidth);
                currLeft += panelWidth;


                for (var i = MAX_PANELS_PER_SIDE; i > 0; i--) {
                    scaleFactor = 1;
                    el = $('#rflyout' + i);
                    if (this.panelIsOpen(el)) {
                        el.css('left', currLeft);
                        thisPanelWidth = panelService.getPanelWidth(el, panelWidth);
                        el.css('width', thisPanelWidth);
                        
                        currLeft += thisPanelWidth;
                    } else {
                        el.css('left', currLeft);
                        el.html('');
                        el.css('width', 0);
                    }
                }

                if ($rootScope) {
                    if ($rootScope.lastPanel) {
                        var div = '';
                        if ($rootScope.lastPanel.side === 'right') {
                            div = 'rflyout' + $rootScope.lastPanel.panelNumber;
                            this.scrollIntoView(div);
                        } else {
                            div = 'lflyout' + $rootScope.lastPanel.panelNumber;
                        }
                        $rootScope.lastPanel = null;
                    }
                    if ($rootScope.gridsterOpts) {
                        $rootScope.gridsterOpts.width = panelWidth + setWidth * 0.01;
                        setWidth = -1 * setWidth;
                    }
                    if ($rootScope.centerPanel && openedPanels != openPanels) {
                        if (!$rootScope.scrolled) {

                            //get the width of the left panels
                            var scrollLeft = 0;
                                for (var i = 1; i <= MAX_PANELS_PER_SIDE; i++) {
                                        var el = $('#lflyout' + i);
                                        if (this.panelIsOpen(el)) {
                                            scrollLeft += panelService.getPanelWidth(el, width / openPanels);
                                    }
                                }


                            var transitionDuration = $('#rflyout1').css('transitionDuration').replace('s','');
                            setTimeout('$("html, body").animate({ scrollLeft: ' + scrollLeft + ' }, 500);', parseInt(transitionDuration * 1000));

                            $rootScope.scrolled = true;
                        }
                    }
                    if(openPanels >= openedPanels){
                        $rootScope.scrolled = false;
                    }

                }
            };

            var setWidth = 1;
            panelService.scrollIntoView = function(eleID) {

                $('html, body').animate({ scrollLeft: $('#' + eleID).offset().left + 2 }, 500);
                console.log('executed scrollToElement');
                return true;
            };

            return panelService;
        }
    });

