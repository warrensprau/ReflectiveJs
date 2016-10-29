angular
    .module('viewUtil')
    .controller(
        'MessagesController',
        ['$scope', '$rootScope', 'messageService', messagesController]);


function messagesController($scope, $rootScope, messageService) {

    $scope.showLoading = messageService.showLoading;

    $scope.getLoadingMessages = messageService.getLoadingMessages;
}


