// ----------------------------------------
// filehandler
//
// Values stored in html5 localstorage using Chrome api
// ----------------------------------------

angular.module('filehandler', []).
    factory('MyService', function($http) {
        var MyService = {};

        function parseCSVtoJSON (rawText, scope) {
            var mainDataObj = [];
            var header = [];
            //var index = 1;
            
            var lines = rawText.split('\n');
            header = lines[0].split(',');


            // Iterate over file ignoring first line - only handles upwards of 100 records
            $(lines).slice(1,101).each(function(){
                var tempAddress = [];
                var innerLines = this.split(',');

                // LATER write fancy loop to create dynamically named CSV headers
                tempAddress = ({
                    "name":innerLines[0],
                    "company":innerLines[1],
                    "address1":innerLines[2],
                    "address2":innerLines[3],
                    "city":innerLines[4],
                    "state":innerLines[5],
                    "zip":innerLines[6],
                    "country":innerLines[7],
                    "resi":innerLines[8]
                });

                scope.addresses.push(tempAddress);

                //index++;
            });
            scope.$apply();
        }; // end parseCSVtoJSON



    	MyService.fileCSVParse = function (file, scope){
    		var reader = new FileReader();
            reader.onload = function (e){
                parseCSVtoJSON(e.target.result, scope);
                //console.log(e.target.result);
            };

            reader.readAsText(file);
        };



        MyService.fileWriteCSV = function (scope){


            chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
                console.log(scope.addresses);
                console.log("wakka");
                writableFileEntry.createWriter(function(writer) {
                    console.log(writer);
                  //writer.onerror = errorHandler;
                  writer.onwriteend = function(e) {
                    console.log('write complete');
                  };

                  var val1 = scope.addresses[1].city;

                  writer.write(new Blob([val1], {type: 'text/plain'}));  
                });
            });

            console.log("wakka");
            
        };
        
        return MyService;
    }
);