/*
----------------------------------------
FedExAPI - Angular JS Factory

Eventual full AngularJS interface for FedEx Web Services
See www.fedex.com/developer
----------------------------------------
*/

angular.module('FedExAPI', []).
  factory('fedex', function($http, $q) {
    var fedex = {};

    fedex.hello = function (scope) {
      scope.fedexin = "bob";
      scope.$apply();

    }; //end fedex.hello







    return fedex;
  } // End Factory
); // End module