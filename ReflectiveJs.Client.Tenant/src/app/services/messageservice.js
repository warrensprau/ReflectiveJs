angular
    .module('messaging', ['ng'])

    .factory('messageService', function () {
        return {

        };
    })

    .provider('messageService', {
        $get: function ($rootScope) {

            var loadingMessages = [];

            var messageService = {}

            messageService.showLoading = function () {
                return loadingMessages.length > 0;
            }

            messageService.getLoadingMessages = function () {
                return loadingMessages;
            }

            messageService.getLoadingMessage = function (key) {

                for (var i = 0; i < loadingMessages.length; i++) {
                    if (loadingMessages[i].indexOf(key) >= 0) {
                        var msg = loadingMessages[i];
                        loadingMessages.splice(i, 1);
                        return msg; //$rootScope.loadingMessages[i];
                    }
                }
            };

            $rootScope.$on('loadingData', function (event, data) {

                var inIt = false;
                for (var i = 0; i < loadingMessages.length; i++) {
                    if (loadingMessages[i] == data) {
                        inIt = true;
                    }
                }
                if (!inIt) {
                    loadingMessages.push(data);

                }
            });

            $rootScope.$on('loadedData', function (event, data) {

                for (var i = 0; i < loadingMessages.length; i++) {
                    if (loadingMessages[i] == data) {
                        loadingMessages.splice(i, 1);
                    }
                }
            });

            return messageService;
        }
    })

