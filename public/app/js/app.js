'use strict';


// Declare app level module which depends on filters, and services
angular.module('donaldPortfolio', [
  'ngRoute',
  'donaldPortfolio.filters',
  'donaldPortfolio.services',
  'donaldPortfolio.directives',
  'donaldPortfolio.controllers'
]).
config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  	$routeProvider.when('/', {templateUrl: 'partials/landing.html', controller: 'MyCtrl1'});
  	$routeProvider.when('/d3', {templateUrl: 'partials/d3.html', controller: 'MyCtrl1'});
  	$routeProvider.when('/snake', {templateUrl: 'partials/snake.html', controller: 'MyCtrl2'});
  	$routeProvider.when('/404', {templateUrl: 'partials/404.html', controller: 'MyCtrl2'});
	$routeProvider.otherwise({templateUrl: 'partials/404.html'});
  
  	$locationProvider.html5Mode(true);
}]);
angular.module('donaldPortfolio').run(['$route', function($route)  {
  $route.reload(); //reload location change missed by nested ng-view
}]);