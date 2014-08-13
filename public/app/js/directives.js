'use strict';

/* Directives */


angular.module('donaldPortfolio.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('keypress', 
  	function($document, $rootScope) {
	    return {
	      restrict: 'A',
	      link: function() {
	        $document.bind('keydown', function(e) {
	           $rootScope.$broadcast('keypress',e , String.fromCharCode(e.which));
	        });
	     }
	   }
	})
