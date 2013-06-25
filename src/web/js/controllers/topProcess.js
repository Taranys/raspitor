'use strict';

angular.module('Controllers', [])
    .controller('TopProcess', function ($scope, $location) {
        $scope.topData = {}
        $scope.eventBus = new vertx.EventBus($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/eventbus');

        $scope.eventBus.onopen = function () {
            $scope.eventBus.registerHandler('web.client', function (message) {
                $scope.$apply(function () {
                    $scope.topData = message;
                })
            });
        }
    })