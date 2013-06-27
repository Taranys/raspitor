'use strict';

angular.module('Controllers', [])
    .controller('TopProcess', function ($scope, $location) {
        $scope.topData = {}
        $scope.eventBus = new vertx.EventBus($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/eventbus');

        $scope.filterTop = function (input) {
            return input.cpu >= 1 || input.mem >= 1;
        };

        $scope.eventBus.onopen = function () {
            $scope.eventBus.registerHandler('web.client', function (message) {
                $scope.$apply(function () {
                    $scope.topData = message;

                    $scope.cpuGauge.redraw($scope.topData.avgCpu);
                    $scope.memGauge.redraw($scope.topData.memPerc);
                })
            });
        }

        $scope.createGauge = function (id, name) {
            var gauge = new Gauge(id, {
                size: 150,
                label: name,
                minorTicks: 5,
                yellowZones: { from: 75, to: 90 },
                redZones: { from: 90, to: 100 }
            });
            gauge.render();
            return gauge;
        }

        $scope.cpuGauge = $scope.createGauge("cpuGaugeContainer", "CPU");
        $scope.memGauge = $scope.createGauge("memoryGaugeContainer", "Memory");
    })