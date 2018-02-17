
//  GLOBALS.js file for EquipDemo


var configData = {
    imgDir: "assets/images/",
    idBttnLink : "#btnLink",
    idBttnUserInput : "#bttnUserInput",
    idBttnTest : "#btnTest",                //just for test options
    inputUserName : "#input-userName",
    firebaseStorage : "/games/user",         //prior to tacking on user number
    firebaseMainGame : "/games"
};

//make global variables for now, so can easily debug at anytime without
//having to set breakpoints

var connConfig;
var database;
var connectionsRef;
var connectedRef;
var dbUserGameStorageMain;
var dbUserStorageArea;



