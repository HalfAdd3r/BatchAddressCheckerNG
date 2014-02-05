'use strict';

/* Controllers */

var BatchAddress = angular.module('BatchAddress', ['ngRoute', 'filehandler']);

BatchAddress.controller('MainCtrl', function($scope, MyService) {






// LEARNING ABOUT SCOPE--------------------
  $scope.addresses = [];

  $scope.address=[];
  $scope.address2=[];
  $scope.original=[];
  $scope.suggested =[];






  $scope.readFile = function () {
    $scope.addresses = [];
    MyService.fileCSVParse($scope.uploadFile, $scope);
    
  };
      
});





// ----------------------------------------
// Controller - Screen Settings
//
// Values stored in html5 localstorage using Chrome api
// ----------------------------------------
BatchAddress.controller('SettingsCtrl', function($scope) {
  // Declare
  var chromeStore = chrome.storage.local;

  // Base empty Scope
  $scope.fdxCredentials = {};

  // Recover "value2" from storage
  chromeStore.get('BatchAddress', function(value){
    $scope.$apply(function() {
      $scope.fdxCredentials = value.BatchAddress;
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

        $scope.readFile();
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
        redirectTo: '/fileLoad'
      });
  }]);
