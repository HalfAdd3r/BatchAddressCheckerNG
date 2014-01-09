/*
---------------------------------------------------------------------------------------
FileName: mainRouter.js
Function: Main button and event control for whole program.  Redirects to other tabs
          as needed.
---------------------------------------------------------------------------------------
*/

onload = function() {
  // $("#test").text("Main");  // Debug Entry Message
  loadSettings(); // Load Settings Values


  // Tab movement Control - Bootstrap
  $(document).ready(function ($) {
    $('#tabs').tab();
  });

  // Settings Change Click 
  $("#settingChange").click(function () {
    changeSettings();
  });    

  // Main FedEx API initiation
  $("#soap").click(function () {
    RunSoap();
  });

  // Main FileUploadHandler
  $("#fileUpload").click(function () {
    uploadFile();
  });

  // Main FileUploadHandler
  $("#fileWrite").click(function () {
    writeNewFile();
  });

} // End File 

