'use strict';

/* Controllers */

var controllersModule = angular.module('donaldPortfolio.controllers', [])
  .controller('MyCtrl1', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.game = {};
    console.log('main controller made');
    $rootScope.$on('save-game', function(args, obj){
      $scope.game = obj;
    });

  }])
  .controller('MyCtrl2', ['$scope', function($scope) { 

  }]);
