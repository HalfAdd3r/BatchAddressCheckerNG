// ----------------------------------------
// fileHandler - Angular JS Factory
//
// Manages Google Chrome based file read and write
// ----------------------------------------

// Init Angular Object
var BatchAddress = angular.module('BatchAddress', ['ngRoute', 'fileHandler', 'FedExAPI']);

// ----------------------------------------
// Controller - Primary Scope Controller
// ----------------------------------------
BatchAddress.controller('MainCtrl', function($scope, $rootScope, filehandler, fedex) {

  // Standardized Address object stdAddress
  $scope.stdAddress = function (index, name, company,address1, address2,city,state,zip,country,resi) {
    this.index = index;
    this.name = name;
    this.company = company;
    this.address1 = address1;
    this.address2 = address2;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.country = country;
    this.resi = resi;
  };


  
  // readFile - External function
  // Loads data into scope from csv file
  $scope.readFile = function () {
    $scope.addresses = [];
    filehandler.fileCSVParse($scope.uploadFile, $scope);
    $rootScope.addresses = $scope.addresses;
  };


  // readFile - External function
  // loads data into scope from csv file
  $scope.writeFile = function () {
    filehandler.fileWriteCSV($rootScope);
  };

  // runFedex - External function
  // Loads data into scope from csv file
  $scope.runFedex = function () {
    fedex.checkAddress($scope, $rootScope.fdxCredentials);
  };

}); 



// ----------------------------------------
// Controller - Screen Settings
//
// Values stored in html5 localstorage using Chrome api
// ----------------------------------------
BatchAddress.controller('SettingsCtrl', function($scope, $rootScope) {
  var chromeStore = chrome.storage.local;

  $scope.fdxCredentials = {};

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
        redirectTo: '/fileLoad'
      });
  }]);