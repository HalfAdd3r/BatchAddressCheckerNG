/*(function (module){
	var fileHandler = function  () {
		return "bob was here";
	};


	module.factory("Sue");


}(angular.module("BatchAddress.Sue")));*/

/*angular.module('fileHandler',[]).factory('filereader',function(){
	return "bob";
})*/

angular.module('filehandler', []).
    factory('MyService', function($http) {
        var MyService = {};

        function init () {
        	MyService.value = 1234567;
        }

        init();

        /*MyService.value = 12345;*/
/*        $http.get('resources/data.json').success(function(response) {
            MyService.data = response;
        });*/

    	MyService.getNew = function (scope){
    		scope.bobby = "New world order";
    	};

        return MyService;
    }
);