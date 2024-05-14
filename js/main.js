(function () {
    'use strict'
    angular
    .module('acare', [])
    .controller('mainController', function($scope) {
      var vm = this;
      vm.step = 0;

      vm.$onInit = function(){
        console.log("Init ok");
        
      }
    })
})();