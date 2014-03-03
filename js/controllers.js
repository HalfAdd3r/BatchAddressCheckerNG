'use strict';

/* Controllers */

var BatchAddress = angular.module('BatchAddress', ['ngRoute', 'fileHandler', 'FedExAPI']);

BatchAddress.controller('MainCtrl', function($scope, $rootScope, filehandler, fedex) {


  /*
  readFile - External function
    loads data into scope from csv file
  */
  $scope.readFile = function () {
    $scope.addresses = [];
    filehandler.fileCSVParse($scope.uploadFile, $scope);
    $rootScope.addresses = $scope.addresses;
  };



  // readFile - External function
  //  loads data into scope from csv file
  $scope.writeFile = function () {
    //$scope.addresses = [];
    filehandler.fileWriteCSV($rootScope);
  };

  // runFedex - External function
  //  loads data into scope from csv file
  $scope.runFedex = function () {
    $scope.fedexout = [];
    //$scope.addresses = [];
    //console.log($rootScope.fdxCredentials);
    fedex.checkAddress($scope, $rootScope.fdxCredentials);
    $rootScope.fedexout = $scope.fedexout;
    //masterScope();
  };
}); 



// ----------------------------------------
// Controller - Screen Settings
//
// Values stored in html5 localstorage using Chrome api
// ----------------------------------------
BatchAddress.controller('SettingsCtrl', function($scope, $rootScope) {
  // Declare
  var chromeStore = chrome.storage.local;

  // Base empty Scope
  $scope.fdxCredentials = {};

  // Recover "value2" from storage
  chromeStore.get('BatchAddress', function(value){
    $scope.$apply(function() {
      $scope.fdxCredentials = value.BatchAddress;
      $rootScope.fdxCredentials = $scope.fdxCredentials;
    });
  });

  // Button Handler - update stored value
  $scope.update = function(){
    chromeStore.set({'BatchAddress': $scope.fdxCredentials});
  };
});



// ----------------------------------------
// Directive - loadFile
//
// Gets file and loads values into Scope
// ----------------------------------------
BatchAddress.directive('loadFile', function(){
  return{
    // Link new function to element el and involve declared scope
    link: function($scope, el){
      el.bind('change', function(e){ // bind on change event
        // Add new scope value "uploadFile" and apply
        $scope.uploadFile = (e.srcElement || e.target).files[0]; // Live File added to socpe
        $scope.$apply(); // Apply to scope

        $scope.readFile(); // Call Export Function
      });
    }
  };
});



// ----------------------------------------
// Directive - writeFile
//
// Exports scope to csv text file
// ----------------------------------------
BatchAddress.directive('writeFile', function(){
  return{
    // Link new function to element el and involve declared scope
    link: function($scope, el){
      el.bind('click', function(e){ // bind on change event
        // Add new scope value "exportFile" and apply
        $scope.writeFile();  // Call Import Function
      });
    }
  };
});



// ----------------------------------------
// Directive - runFedex
//
// Exports scope to csv text file
// ----------------------------------------
BatchAddress.directive('runFedex', function(){
  return{
    // Link new function to element el and involve declared scope
    link: function($scope, el){
      el.bind('click', function(e){ // bind on change event
        // Add new scope value "exportFile" and apply
        $scope.runFedex();  // Call Import Function
      });
    }
  };
});



// ----------------------------------------
// Route - Main provider for Project
// ----------------------------------------
BatchAddress.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/fileLoad', {
        templateUrl: 'partials/viewLoadFile.html',
        controller: 'MainCtrl'
      }).
      when('/runFedEx', {
        templateUrl: 'partials/viewRunFedEx.html',
        controller: 'MainCtrl'
      }).
      when('/addressSelect', {
        templateUrl: 'partials/viewAddressSelect.html',
        controller: 'MainCtrl'
      }).
      when('/fileExport', {
        templateUrl: 'partials/viewFileExport.html',
        controller: 'MainCtrl'
      }).
      when('/settings', {
        templateUrl: 'partials/viewSettings.html',
        controller: 'SettingsCtrl'
      }).
      otherwise({
        redirectTo: '/runFedEx'
      });
  }]);
