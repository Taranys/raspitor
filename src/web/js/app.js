'use strict';


// Declare app level module which depends on filters, and services
angular
    .module('raspitorApp', ['Controllers'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'views/top.html', controller: 'TopProcess'});
        $routeProvider.otherwise({redirectTo: '/'});
    }]);