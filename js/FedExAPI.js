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
    //var GATEWAY = 'https://wsbeta.fedex.com:443/web-services/' // Main SOAP Gateway
    var GATEWAY = 'https://ws.fedex.com:443/web-services' // Main SOAP Gateway

    /*-------------------------------------------------------------------------------------
    Function: ProcessSOAP
    Arguments: ValuesIn - address list in format yet to be determined

    Function: Takes in values from input and manages actual SOAP transaction.  Helper
              functions handle building and parsing SOAP Values
    ------------------------------------------------------------------------------------- */



    function ProcessSOAP (scope, keyvalues) {
      // Init Values and open Gateway
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open('POST', GATEWAY, true);

      // Request XML string
      var sr = BuildXML(scope, keyvalues);
      console.log(sr); // Debug Line
      scope.fedexin = sr;
      scope.$apply();

      xmlhttp.onreadystatechange = function () {
        console.log(xmlhttp.responseText); // Debug line
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            //$("#test").text(xmlhttp.readyState + " " + xmlhttp.status + " " + xmlhttp.responseText);
            scope.fedexout = xmlhttp.responseText;
            scope.$apply();
            
          }
        }
      }
      
      // Send the POST request
      xmlhttp.setRequestHeader('Content-Type', 'text/xml');
      //xmlhttp.send(sr); //- TK Send Disabled while building string
    }


    /*-------------------------------------------------------------------------------------
    Function: BuildXML
    Arguments: TK - TBD

    Function: Uses input to process SOAP input
    ------------------------------------------------------------------------------------- */
    function BuildXML (scope, keyvalues) {

      var xml = '<soapenv:Envelope xmlns="http://fedex.com/ws/addressvalidation/v2" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <soapenv:Body> <AddressValidationRequest> <WebAuthenticationDetail> <UserCredential> <Key></Key> <Password></Password> </UserCredential> </WebAuthenticationDetail> <ClientDetail> <AccountNumber></AccountNumber> <MeterNumber></MeterNumber> </ClientDetail> <TransactionDetail> <CustomerTransactionId>1</CustomerTransactionId> </TransactionDetail> <Version> <ServiceId>aval</ServiceId> <Major>2</Major> <Intermediate>0</Intermediate> <Minor>0</Minor> </Version> <RequestTimestamp></RequestTimestamp> <Options> <MaximumNumberOfMatches>1</MaximumNumberOfMatches> <StreetAccuracy>LOOSE</StreetAccuracy> <DirectionalAccuracy>LOOSE</DirectionalAccuracy> <CompanyNameAccuracy>LOOSE</CompanyNameAccuracy> <ConvertToUpperCase>true</ConvertToUpperCase> <RecognizeAlternateCityNames>true</RecognizeAlternateCityNames> <ReturnParsedElements>true</ReturnParsedElements> </Options> <AddressesToValidate> </AddressesToValidate> </AddressValidationRequest> </soapenv:Body> </soapenv:Envelope>',
      xmlDoc = $.parseXML(xml),
      $xml=$(xmlDoc);
      var dataset = scope.addresses;  // Pull Address Values

      

      $xml.find('Key').text(keyvalues.key);
      $xml.find('Password').text(keyvalues.password);
      $xml.find('AccountNumber').text(keyvalues.account);
      $xml.find('MeterNumber').text(keyvalues.meter);

      var dtCurTime = new Date().toISOString(); // Get Date
      dtCurTime = dtCurTime.slice(0,dtCurTime.lastIndexOf(".")); // Remove trailing characters
      $xml.find('RequestTimestamp').text(dtCurTime);

      // XML BUilding Tests

      dataset.forEach(function (currAddress){
        console.log(currAddress.addvalues[0].name);
      });
      //$("<AddressId>First</AddressId><Address><StreetLines>1 Main Street</StreetLines> <City>Dayton</City> <StateOrProvinceCode>ME</StateOrProvinceCode> <PostalCode>04005</PostalCode> <CountryCode>US</CountryCode> </Address>").appendTo($xml.find('AddressesToValidate'));

      $xml.find('AddressesToValidate').append("<AddressId>First</AddressId><Address><StreetLines>1 Main Street</StreetLines> <City>Dayton</City> <StateOrProvinceCode>ME</StateOrProvinceCode> <PostalCode>04005</PostalCode> <CountryCode>US</CountryCode> </Address>");
      $xml.find('AddressesToValidate').after("<AddressesToValidate><AddressId>Second</AddressId><Address><StreetLines>1 Main Street</StreetLines> <City>Dayton</City> <StateOrProvinceCode>ME</StateOrProvinceCode> <PostalCode>04005</PostalCode> <CountryCode>US</CountryCode> </Address></AddressesToValidate>");
      //$xml.find('AddressesToValidate').append("<Address><StreetLines>1 Main Street</StreetLines> <City>Beverly Hills</City> <StateOrProvinceCode>CA</StateOrProvinceCode> <PostalCode>90210</PostalCode> <CountryCode>US</CountryCode> </Address>");
      // 
      //console.log(dataset[0].addvalues);


      // XML building Tests

      return new XMLSerializer().serializeToString(xmlDoc);
    };



    fedex.checkAddress = function (scope, keyvalues) {
      ProcessSOAP(scope,keyvalues);
    }; // End checkAddress







    return fedex;
  } // End Factory
); // End module