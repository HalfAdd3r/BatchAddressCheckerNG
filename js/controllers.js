'use strict';

/* Controllers */

var BatchAddress = angular.module('BatchAddress', ['ngRoute']);

BatchAddress.controller('MainCtrl', function($scope) {


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


  $scope.address={
    "id":2,
    "status":"checked",
    "original": $scope.original,
    "suggested": $scope.suggested
  };

  $scope.addresses.push($scope.address);

  $scope.fdxCredentials = {
    'account': '123',
    'key': '234',
    'meter': '345',
    'password': '456'
  };



});


 
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
        controller: 'MainCtrl'
      }).
      otherwise({
        redirectTo: '/fileLoad'
      });
  }]);
