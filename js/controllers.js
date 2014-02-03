'use strict';

/* Controllers */

var BatchAddress = angular.module('BatchAddress', ['ngRoute', 'filehandler']);

BatchAddress.controller('MainCtrl', function($scope, MyService) {


// MESSY PLAYING WITH MODULES AND FACTORIES
  console.log(MyService.value);

  MyService.getNew($scope);

  console.log($scope.bobby);
// MESSY PLAYING WITH MODULES AND FACTORIES





// LEARNING ABOUT SCOPE--------------------
  $scope.addresses = [];

  $scope.address=[];
  $scope.address2=[];
  $scope.original=[];
  $scope.suggested =[];



  // $scope.original.push({
  //   "name":"bobby",
  //   "address":"1 main st",
  //   "city":"Dayton"
  // });

  $scope.original={
    "name":"bobby",
    "address":"1 main st",
    "city":"Dayton"
  };

  $scope.suggested = ({
    "name":"suzzy",
    "address":"1 secondary st",
    "city":"Saco"
  });


  $scope.address2 ={
    "id":1,
    "status":"unchecked",
    "original": $scope.original,
    "suggested": $scope.suggested
  };

  $scope.addresses.push($scope.address2);

  $scope.neworiginal={
    "name":"Marry",
    "address":"1 main st",
    "city":"Dayton"
  };

  $scope.address={
    "id":2,
    "status":"checked",
    "original": $scope.neworiginal,
    "suggested": $scope.suggested
  };

  $scope.addresses.push($scope.address);
// LEARNING ABOUT SCOPE--------------------





/*  $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                      });
    };*/

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
