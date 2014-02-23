/*
----------------------------------------
fileHandler - Angular JS Factory

Manages Chrome based file read and write
----------------------------------------
*/

angular.module('fileHandler', []).
    factory('filehandler', function($http) {
        var filehandler = {};

        function parseCSVtoJSON (rawText, scope) {
            var index = 1;
            
            var lines = rawText.split('\n');
            

            // Iterate over file ignoring first line - only handles upwards of 100 records
            $(lines).slice(1,101).each(function(){
                var innerLines = this.split(',');

                // LATER write fancy loop to create dynamically named CSV headers
                tempAddress = [{
                    name:innerLines[0],
                    company:innerLines[1],
                    address1:innerLines[2],
                    address2:innerLines[3],
                    city:innerLines[4],
                    state:innerLines[5],
                    zip:innerLines[6],
                    country:innerLines[7],
                    resi:innerLines[8]
                }];

                //console.log(tempAddress); // Debug Line

                newAddress = {
                    index:index,
                    addvalues:tempAddress,
                    checkvalues:tempAddress
                };

                //console.log(newAddress); // Debug Line

                scope.addresses.push(newAddress);

                index++;
            });
            scope.$apply();
        }; // end parseCSVtoJSON



    	filehandler.fileCSVParse = function (file, scope){
    		var reader = new FileReader();
            reader.onload = function (e){
                parseCSVtoJSON(e.target.result, scope);
                //console.log(e.target.result);
            };

            reader.readAsText(file);
        };



        filehandler.fileWriteCSV = function (scope){


            chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
                console.log(scope.addresses);
                console.log("wakka");
                writableFileEntry.createWriter(function(writer) {
                    console.log(writer);
                  //writer.onerror = errorHandler;
                  writer.onwriteend = function(e) {
                    console.log('write complete');
                    scope.wstatus = "Export Complete";
                    scope.$apply();
                  };

                  var val1 = scope.addresses[1].city;

                  writer.write(new Blob([val1], {type: 'text/plain'}));  
                });
            });

            console.log("wakka");
            
        };
        
        return filehandler;
    }
);