/*
---------------------------------------------------------------------------------------
FileName: SettingsManager.js
Function: Provide handlers and functions for Settings Tab 
---------------------------------------------------------------------------------------
*/

var chromeStore = chrome.storage.local; // Reusable storage object


/*-------------------------------------------------------------------------------------
Function: changeSettings
Arguments: N/A

Function: Take form values and load into ChromeStore
------------------------------------------------------------------------------------- */
function changeSettings(){
	var FedExValues = {};

	FedExValues["FedExAccount"] = $("#FedExAccount").val();
	FedExValues["FedExKey"] = $("#FedExKey").val();
	FedExValues["FedExMeter"] = $("#FedExMeter").val();
	FedExValues["FedExPassword"] = $("#FedExPassword").val();

    chromeStore.set(FedExValues);
};



/*-------------------------------------------------------------------------------------
Function: loadSettings
Arguments: N/A

Function: Load Chromestore values into form for visability when needed
------------------------------------------------------------------------------------- */
function loadSettings(){
	var FedExValues;
	
    chromeStore.get(FedExValues, function (myitems) {
		$("#FedExAccount").val(myitems.FedExAccount);
    	$("#FedExKey").val(myitems.FedExKey);
		$("#FedExMeter").val(myitems.FedExMeter);
		$("#FedExPassword").val(myitems.FedExPassword);
    });
};


/*-------------------------------------------------------------------------------------
Chrome Storeage Change Listener - calls loadSettings
------------------------------------------------------------------------------------- */
chrome.storage.onChanged.addListener(function (){
	loadSettings();
});