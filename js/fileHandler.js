function uploadFile () {
	// $("#uploadData").text("hello"); // Debug Line
	getFileContents(); // calls
};


function writeNewFile () {
	setFileConetnts();
};


function getFileContents () {
	// Use Chrome Dialogbox control to get file
	chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {

		// Process contents of file
		readOnlyEntry.file(function(file) {
			var reader = new FileReader(); // Init object
			
			
			// Async call.  runs when file parsed
			reader.onload = function(e) {
				//$("#uploadData").text(e.target.result); // output to screen
				parseCSVtoJSON(e.target.result);
			}; // end Read Call

			reader.readAsText(file); // Parse as text
		}); // end file process


	}); // end file select
};// end getFileContents



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
}; // end setFileContents





function parseCSVtoJSON (rawText) {
	var mainDataObj = [];
	var header = [];
	var index = 1;


	var lines = rawText.split('\n');
	header = lines[0].split(',');


	// Iterate over file ignoring first line - only handles upwards of 100 records
	$(lines).slice(1,101).each(function(){
		var tempAddress = [];
		var innerLines = this.split(',');

		// Create object by itterating over matched header and new innerLines
		for (var i = 0; i < innerLines.length; i++) {
			tempAddress[header[i]] = innerLines[i];
		};


		// Make main sub-object with increased nubmer reference and data-set
		mainDataObj.push({
            count: index,
            input: tempAddress
        });

        index++;

		//$("#uploadData").append(this + "<br/>");
	})

	var myString = JSON.stringify(mainDataObj);
	console.debug(mainDataObj);
	

	//$("#uploadData").append(myString); // output to screen
	basic($('#uploadData'),myString);
}


