'use strict';

angular.module('Controllers', [])
    .controller('TopProcess', function ($scope, $location) {
        $scope.topData = {}
        $scope.eventBus = new vertx.EventBus($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/eventbus');

        $scope.filterTop = function(input){
            return input.cpu >= 1 || input.mem >= 1;
        };

        $scope.eventBus.onopen = function () {
            $scope.eventBus.registerHandler('web.client', function (message) {
                $scope.$apply(function () {
                    $scope.topData = message;

                    $scope.cpuGauge.redraw($scope.topData.avgCpu + Math.random()*20-5);
                    $scope.memGauge.redraw($scope.topData.memPerc + Math.random()*20-5);

//                    $scope.updateChartValue($scope.topData.avgCpu, $scope.topData.memPerc);
//
//                    $scope.chart.setData( $scope.getData() );
                })
            });
        }

        $scope.createGauge = function(id, name) {
            var gauge = new Gauge(id, {
                size: 150,
                label: name,
                minorTicks: 5,
                yellowZones : { from: 75, to: 90 },
                redZones : { from: 90, to: 100 }
            });
            gauge.render();
            return gauge;
        }

        $scope.cpuGauge = $scope.createGauge("cpuGaugeContainer","CPU");
        $scope.memGauge = $scope.createGauge("memoryGaugeContainer","Memory");

//        $scope.chartValues = [{cpu:0,mem:0}];
//        $scope.updateChartValue = function(cpu,mem) {
//            if( $scope.chartValues.length >= 10 ) {
//                $scope.chartValues.shift();
//            }
//            $scope.chartValues.push({
//                cpu : cpu,
//                mem : mem
//            });
//        }



//        $scope.getData = function() {
//            var chartData = {
//                xScale: "linear",
//                yScale: "linear",
//                type: "line-dotted",
//                xMin : 1,
//                xMax : 10,
//                yMin : 0,
//                yMax : 100,
//                "main": [
//                    {
//                        "data": []
//                    }
//                ],
//                "comp": [
//                    {
//                        "type": "line",
//                        "data": []
//                    }
//                ]
//
//            };
//            for(var i = 0; i < $scope.chartValues.length; i++) {
//                chartData.main[0].data.push({
//                    "x": i+1,
//                    "y": $scope.chartValues[i].cpu
//                });
//                chartData.comp[0].data.push({
//                    "x": i+1,
//                    "y": $scope.chartValues[i].mem
//                })
//            }
//            return chartData;
//        }
//
//        $scope.chart = new xChart('line', $scope.getData(), '#chart');
    })