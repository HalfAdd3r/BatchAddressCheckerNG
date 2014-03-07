// ----------------------------------------
// fileHandler - Angular JS Factory
//
// Manages Google Chrome based file read and write
// ----------------------------------------


angular.module('fileHandler', []).

    factory('filehandler', function($http) {
        var filehandler = {};


        // -------------------------------------------------------------------------------------
        // Function: parseCSVtoJSON
        // Arguments: rawText - text values from CSV File; scope - loadable scope
        //
        // Function: Loads lines of CSV file into scope as sequential objects
        // -------------------------------------------------------------------------------------         
        function parseCSVtoJSON (rawText, scope) {
            var index = 1;
            var lines = rawText.split('\n');

            // Iterate over file ignoring first line - only handles upwards of 100 records
            $(lines).slice(1,101).each(function(){
                var innerLines = this.split(',');

                // Build new Address
                tempAddress = [{
                    index:index,
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

                // Build main object - address container
                newAddress = {
                    addvalues:tempAddress,
                    checkvalues:"",
                    selection:0
                };

                scope.addresses.push(newAddress);
                index++;
            });
            scope.$apply();
        } // end parseCSVtoJSON



        // -------------------------------------------------------------------------------------
        // Function: filehandler.fileCSVParse
        // Arguments: file - file object from directive; scope - loadable scope
        //
        // Function: public function that reads provided file.  Calls helper to parse
        // -------------------------------------------------------------------------------------  
        filehandler.fileCSVParse = function (file, scope){
            var reader = new FileReader();
            reader.onload = function (e){
                parseCSVtoJSON(e.target.result, scope);
            };

            reader.readAsText(file);
        };



        // -------------------------------------------------------------------------------------
        // Function: filehandler.fileWriteCSV
        // Arguments: scope - loadable scope
        //
        // Function: public function that writes provided scope values out to CSV file
        // -------------------------------------------------------------------------------------  
        filehandler.fileWriteCSV = function (scope){
            // Chrome OS Call to select file - Cannot use filesyste object due to sandboxing
            chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
                
                writableFileEntry.createWriter(function(writer) {

                  writer.onwriteend = function(e) {
                    console.log('write complete');
                    scope.wstatus = "Export Complete";
                    scope.$apply();
                  };

                  // CSV File Header
                  var strOutput = "name,company,address1,address2,city,state,zip,country,resi\n";

                  // Iterate over object to load values
                  scope.addresses.forEach(function (curAddress){
                    var actAddress;

                    // Main decision point for which value to write back to file
                    if (curAddress.selection ===0){
                        actAddress = curAddress.addvalues[0];
                    } else {
                        actAddress = curAddress.checkvalues[0];
                    }

                    strOutput = strOutput + 
                        actAddress.name + "," +
                        actAddress.company + "," +
                        actAddress.address1 + "," +
                        actAddress.address2 + "," +
                        actAddress.city + "," +
                        actAddress.state + "," +
                        actAddress.zip + "," +
                        actAddress.country + "," +
                        actAddress.resi + "\n";
                  }); // End forEach

                  writer.write(new Blob([strOutput], {type: 'text/plain'}));  
                });
            });
        };

        // Return new factory        
        return filehandler;
    }
);