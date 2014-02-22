/*
---------------------------------------------------------------------------------------
FileName: FedExAPI.js
Function: Main control for "Process" tab.  Will run and interact with FedEx API set
---------------------------------------------------------------------------------------
*/

var GATEWAY = 'https://wsbeta.fedex.com:443/web-services/' // Main SOAP Gateway


/*-------------------------------------------------------------------------------------
Function: RunSoap
Arguments: N/A

Function: Button Response Handler
------------------------------------------------------------------------------------- */
function RunSoap () {
  // $("#test").text("Running Test"); // Debug Message
  ProcessSOAP("<XML>Really</XML>"); // TK - argument in place for passing input values
};


/*-------------------------------------------------------------------------------------
Function: ProcessSOAP
Arguments: ValuesIn - address list in format yet to be determined

Function: Takes in values from input and manages actual SOAP transaction.  Helper
          functions handle building and parsing SOAP Values
------------------------------------------------------------------------------------- */
function ProcessSOAP (ValuesIn) {
  // Init Values and open Gateway
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', GATEWAY, true);

  // Request XML string
  var sr = BuildXML();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        $("#test").text(xmlhttp.readyState + " " + xmlhttp.status + " " + xmlhttp.responseText);
      }
    }
  }
  
  // Send the POST request
  xmlhttp.setRequestHeader('Content-Type', 'text/xml');
  xmlhttp.send(sr);
}


/*-------------------------------------------------------------------------------------
Function: BuildXML
Arguments: TK - TBD

Function: Uses input to process SOAP input
------------------------------------------------------------------------------------- */
function BuildXML () {

  //var xml = '<soapenv:Envelope xmlns:q0="http://fedex.com/ws/track/v8" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><q0:TrackRequest><q0:WebAuthenticationDetail><q0:UserCredential><q0:Key></q0:Key><q0:Password></q0:Password></q0:UserCredential></q0:WebAuthenticationDetail><q0:ClientDetail><q0:AccountNumber></q0:AccountNumber><q0:MeterNumber></q0:MeterNumber></q0:ClientDetail><q0:TransactionDetail><q0:CustomerTransactionId>Track Example</q0:CustomerTransactionId></q0:TransactionDetail><q0:Version><q0:ServiceId>trck</q0:ServiceId><q0:Major>8</q0:Major><q0:Intermediate>0</q0:Intermediate><q0:Minor>0</q0:Minor></q0:Version><q0:SelectionDetails><q0:PackageIdentifier><q0:Type>TRACKING_NUMBER_OR_DOORTAG</q0:Type><q0:Value></q0:Value></q0:PackageIdentifier></q0:SelectionDetails><q0:ProcessingOptions>INCLUDE_DETAILED_SCANS</q0:ProcessingOptions></q0:TrackRequest></soapenv:Body></soapenv:Envelope>',
  var xml = '<soapenv:Envelope xmlns="http://fedex.com/ws/addressvalidation/v2" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <soapenv:Body> <AddressValidationRequest> <WebAuthenticationDetail> <UserCredential> <Key></Key> <Password></Password> </UserCredential> </WebAuthenticationDetail> <ClientDetail> <AccountNumber></AccountNumber> <MeterNumber></MeterNumber> </ClientDetail> <TransactionDetail> <CustomerTransactionId>1</CustomerTransactionId> </TransactionDetail> <Version> <ServiceId>aval</ServiceId> <Major>2</Major> <Intermediate>0</Intermediate> <Minor>0</Minor> </Version> <RequestTimestamp>0001-01-01T00:00:00</RequestTimestamp> <Options> <MaximumNumberOfMatches>5</MaximumNumberOfMatches> <StreetAccuracy>LOOSE</StreetAccuracy> <DirectionalAccuracy>LOOSE</DirectionalAccuracy> <CompanyNameAccuracy>LOOSE</CompanyNameAccuracy> <ConvertToUpperCase>true</ConvertToUpperCase> <RecognizeAlternateCityNames>true</RecognizeAlternateCityNames> <ReturnParsedElements>true</ReturnParsedElements> </Options> <AddressesToValidate> <AddressId>First</AddressId> <Address> <StreetLines>1 Main Street</StreetLines> <City>Dayton</City> <StateOrProvinceCode>ME</StateOrProvinceCode> <PostalCode>04005</PostalCode> <CountryCode>US</CountryCode> </Address> </AddressesToValidate> </AddressValidationRequest> </soapenv:Body> </soapenv:Envelope>',
  xmlDoc = $.parseXML(xml),
  $xml=$(xmlDoc);

  // Grabbing Secure Values from Settings and loading into fields
  $xml.find('Key').text($("#FedExKey").val());
  $xml.find('Password').text($("#FedExPassword").val());
  $xml.find('AccountNumber').text($("#FedExAccount").val());
  $xml.find('MeterNumber').text($("#FedExMeter").val());
  //$xml.find('Value').text("582336384037");

  return new XMLSerializer().serializeToString(xmlDoc);
}