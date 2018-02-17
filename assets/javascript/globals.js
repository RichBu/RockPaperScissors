
//  GLOBALS.js file for EquipDemo


var configData = {
    imgDir: "assets/images/",
    idBttnLink: "#btnLink",
    idBttnUserInput: "#bttnUserInput",
    idBttnTest: "#btnTest",                //just for test options
    inputUserName: "#input-userName",
    firebaseStorage: "/games/user",         //prior to tacking on user number
    firebaseMainGame: "/games",
    divCurrUsers: "#currUsers"
};

//make global variables for now, so can easily debug at anytime without
//having to set breakpoints

var connConfig;
var database;
var connectionsRef;
var connectedRef;
var dbUserGameStorageMain;
var dbUserStorageArea;


var dispAllUsersOnPage = function (shouldRefresh) {
    //display all of the users currently on-line
    //if want to pull all the data in, then set refresh to true
    //this function assumes that all the data is already in the array if not
    //first make sure that it is on-line
    var endVal = connectionObj.usersOnLine.length;
    console.log("# users = " + endVal);
    if (connectionObj.linkActive) {
        //only if link is active
        console.log("displaying the users");
        if (shouldRefresh) {
            connectionObj.clearLocalStack();
            connectionObj.getAllUsersOnLine();
        };
        var divCurrUsers = configData.divCurrUsers;
        $(divCurrUsers).html("");  //wipe out the section
        //add break between active and non-active players
        var rowStatusHeader = $("<div>").addClass("row");
        var statusHeader = $("<p>");
        var statusHeaderText = $("<span>");
        $(statusHeaderText).text("Playing:");
        $(statusHeaderText).appendTo(statusHeader);
        $(statusHeader).appendTo(rowStatusHeader);
        $(rowStatusHeader).appendTo(divCurrUsers);
        console.log("added user");

        //now loop thru all the names and put on-line
        var endVal = connectionObj.usersOnLine.length;
        console.log("# users = " + endVal);
        for (var i = 0; i < endVal; i++) {  //each new button is on a new row
            var newRow = $("<div>");
            $(newRow).addClass("row");
            var newLine = $("<p>");
            var lineText = connectionObj.retUserOnLineName(i);
            if (connectionObj.retUserOnLineRec(i).isPlaying) {
                lineText += " playing against " + connectionObj.retUserOnLineRec(i).playingAgainstName;
            } else {
                lineText += " free to play";
            };

            $(newLine).text(lineText);
            $(newLine).appendTo(newRow);

            if (connectionObj.retUserOnLineRec(i).isPlaying) {
                $(newRow).appendTo(divCurrUsers);
            } else {
                $(newRow).prependTo(divCurrUsers);
            };
            console.log(lineText);
        };
        var rowStatusFooter = $("<div>").addClass("row");
        var statusFooter = $("<p>");
        var statusFooterText = $("<p>");
        $(statusFooterText).text("Available:");
        $(statusFooterText).appendTo(statusFooter);
        $(statusFooter).appendTo(rowStatusFooter);
        $(rowStatusFooter).prependTo(divCurrUsers);
    };
}; // disp Users On Page



