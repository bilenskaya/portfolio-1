'use strict';

/* Filters */

angular.module('donaldPortfolio.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]).
  filter('pad', function(){
  	return function(number, pad, character){
  		character = character || '0';
  		pad = pad || 3;
  		number = number.toString();
  		return number.length >= pad ? number : new Array(pad - number.length + 1).join(character) + number;
  	}
  });
