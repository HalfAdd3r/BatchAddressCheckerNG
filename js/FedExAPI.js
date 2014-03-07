// ----------------------------------------
// FedExAPI - Angular JS Factory
//
// Eventual full AngularJS interface for FedEx Web Services
// See www.fedex.com/developer
// ----------------------------------------


angular.module('FedExAPI', []).
  factory('fedex', function() {
    var fedex = {};  // Init FedEx Object
    var GATEWAY = 'https://ws.fedex.com:443/web-services'; // Main SOAP Gateway



    // -------------------------------------------------------------------------------------
    // Function: loadScope
    // Arguments: scope - usable/loadable scope; xmlinput - returned SOAP query values
    //
    // Function: Moves values from SOAP response to scope
    // ------------------------------------------------------------------------------------- 
    function loadScope (scope,xmlinput) {
      xmlDoc = $.parseXML(xmlinput);
      var $xml=$(xmlDoc);

      $xml.find( "AddressResults" ).each(function( index ) {
        var newIndex = $(this).find("AddressId"); // Index value
        var newResi = $(this).find("ResidentialStatus"); // Residential flag
        var newValues = $(this).find("Address"); // overall address nodes
        var curInputAddress = scope.addresses[index]; // Master value indexed location

        // Value = Argument ? True : False
        newResi = (newResi.text() === "RESIDENTIAL") ? newResi = "R" : newResi = "C";
        
        var newAddress = [new scope.stdAddress(
          newIndex.text(),   
          curInputAddress.addvalues[0].name,
          curInputAddress.addvalues[0].company,
          newValues.find("StreetLines").text(),
          "",
          newValues.find("City").text(),
          newValues.find("StateOrProvinceCode").text(),
          newValues.find("PostalCode").text(),
          newValues.find("CountryCode").text(),
          newResi
        )];

        curInputAddress.checkvalues=newAddress; // Load new string value into main
        scope.$apply();
        
      });
    }



    // -------------------------------------------------------------------------------------
    // Function: ProcessSOAP
    // Arguments: scope - loadable scope; keyvalues - object with FedEx API keys
    //
    // Function: Takes in values from input and manages actual SOAP transaction.  Helper
    //           functions handle building and parsing SOAP Values
    // ------------------------------------------------------------------------------------- 
    function ProcessSOAP (scope, keyvalues) {
      // Init Values and open Gateway
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', GATEWAY, true);

      // Request XML string
      var sr = BuildXML(scope, keyvalues);
      scope.fedexin = sr;
      scope.$apply();

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            loadScope(scope,xmlhttp.responseText);
          }
        }
      };
      
      xmlhttp.setRequestHeader('Content-Type', 'text/xml'); // Send the POST request
      xmlhttp.send(sr); //- TK Send Disabled while building string
    }



    // -------------------------------------------------------------------------------------
    // Function: BuildXML
    // Arguments: scope - loadable scope; keyvalues - object with FedEx API keys
    //
    // Function: Helper function that builds xml transaction from scope input
    // ------------------------------------------------------------------------------------- 
    function BuildXML (scope, keyvalues) {
      // Framework XML
      var xml = '<soapenv:Envelope xmlns="http://fedex.com/ws/addressvalidation/v2" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <soapenv:Body> <AddressValidationRequest> <WebAuthenticationDetail> <UserCredential> <Key></Key> <Password></Password> </UserCredential> </WebAuthenticationDetail> <ClientDetail> <AccountNumber></AccountNumber> <MeterNumber></MeterNumber> </ClientDetail> <TransactionDetail> <CustomerTransactionId>1</CustomerTransactionId> </TransactionDetail> <Version> <ServiceId>aval</ServiceId> <Major>2</Major> <Intermediate>0</Intermediate> <Minor>0</Minor> </Version> <RequestTimestamp></RequestTimestamp> <Options> <MaximumNumberOfMatches>1</MaximumNumberOfMatches> <StreetAccuracy>LOOSE</StreetAccuracy> <DirectionalAccuracy>LOOSE</DirectionalAccuracy> <CompanyNameAccuracy>LOOSE</CompanyNameAccuracy> <ConvertToUpperCase>true</ConvertToUpperCase> <RecognizeAlternateCityNames>true</RecognizeAlternateCityNames> <ReturnParsedElements>true</ReturnParsedElements> </Options></AddressValidationRequest> </soapenv:Body> </soapenv:Envelope>';
      var dataset = scope.addresses;  // Pull Address Values

      xmlDoc = $.parseXML(xml);
      var $xml=$(xmlDoc);

      // Insert API Auth. Values
      $xml.find('Key').text(keyvalues.key);
      $xml.find('Password').text(keyvalues.password);
      $xml.find('AccountNumber').text(keyvalues.account);
      $xml.find('MeterNumber').text(keyvalues.meter);

      // Insert Date Strings 
      var dtCurTime = new Date().toISOString(); // Get Date
      dtCurTime = dtCurTime.slice(0,dtCurTime.lastIndexOf(".")); // Remove trailing characters
      $xml.find('RequestTimestamp').text(dtCurTime);

      // Insert Address Values
      dataset.forEach(function (currAddress){
        actAddress = currAddress.addvalues[0];
        strVales = "<AddressesToValidate><AddressId>" + actAddress.index + "</AddressId>" +
          "<Address><StreetLines>" + actAddress.address1 + "</StreetLines>" +
          "<City>" + actAddress.city + "</City>" +
          "<StateOrProvinceCode>" + actAddress.state + "</StateOrProvinceCode>" +
          "<PostalCode>" + actAddress.zip + "</PostalCode>" +
          "<CountryCode>" + actAddress.country + "</CountryCode></Address></AddressesToValidate>";

        // Insert elements - use diffrent selectros to keep in order
        if (actAddress.index==1) {
          $xml.find('Options').after(strVales);
        } else{
          $xml.find('AddressesToValidate:last').after(strVales);
        }
      });

      return new XMLSerializer().serializeToString(xmlDoc);
    }

    

    // -------------------------------------------------------------------------------------
    // Function: fedex.checkAddress
    // Arguments: scope - loadable scope; keyvalues - object with FedEx API keys
    //
    // Function: Public call-able function to use API and load values into scope
    // -------------------------------------------------------------------------------------     
    fedex.checkAddress = function (scope, keyvalues) {
      ProcessSOAP(scope,keyvalues);
    }; // End checkAddress


    // Return new factory
    return fedex;
  } // End Factory
); // End module