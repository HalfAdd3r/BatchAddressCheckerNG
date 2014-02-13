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



        MyService.fileWriteCSV = function (file, scope){


/*            chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
                console.log("wakka");
                writableFileEntry.createWriter(function(writer) {
                    //console.log(writer);
                  writer.onerror = errorHandler;
                  writer.onwriteend = function(e) {
                    console.log('write complete');
                  };

                  writer.write(new Blob(['1234567890'], {type: 'text/plain'}));  
                });
            });*/

            console.log(file);

            var fs = null;
            var FOLDERNAME  = 'bobo';

            function initFS(fs) {
                console.log("further");

                fs.root.getDirectory(FOLDERNAME, {create: true}, function(dirEntry) {
                    console.log(dirEntry);
                    dirEntry.getFile("target.txt", {create: true, exclusive: false}, function(fileEntry) {
                        console.log(fileEntry);
                        fileEntry.createWriter(function(fileWriter) {
                        //fileWriter.onerror = onError;
                        fileWriter.onwriteend = function(e) {
                            console.log('Write completed.');
                        };
                        
                        fileWriter.write(new Blob(['1234567890'], {type: 'text/plain'}));
                      });
                    });
                });

                /*fs.root.getDirectory(...);*/
            };



            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

            window.requestFileSystem(window.TEMPORARY, 1024 * 1024, initFS);
            

            
        };



        return MyService;
    }
);


/*
function setFileConetnts () {
    // Use Chrome Dialogbox control to load/create new wb file
    chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
        
        // Async Call. Runs to wb file
        writableFileEntry.createWriter(function(writer) {
            //writer.onerror = errorHandler;
            writer.onwriteend = function(e) {
                console.log('write complete');
            }; // end Async Call

            // Actual Writeback control
            writer.write(new Blob(['1234567890'], {type: 'text/plain'}));  
        }); // end writeback
    }); // end file select
}; // end setFileContents*/
