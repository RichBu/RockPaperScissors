
//  GLOBALS.js file for EquipDemo


var configData = {
    imgDir: "assets/images/",
    idBttnLink: "#btnLink",
    idBttnUserInput: "#bttnUserInput",
    idBttnTest: "#btnTest",                //just for test options
    inputUserName: "#input-userName",
    firebaseStorage: "/games/user",         //prior to tacking on user number
    firebaseMainGame: "/games",
    firebaseStatusFolder: "/status",
    firebaseRefreshBit: "/status/refreshUsers",
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
var dbUserStatusFolder;

var dbIncomingRec;
var dbOppStorageArea;
var dbRefreshScreenBit;

Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }

var gameObj = {
    //everything for playing the game
    currStatus: { 
        //object for current status
        stateLevel: 0,  //state of the game play
        retStatus: function() {
            //returns status of current game
            statusMessage = [
                'startup waiting for user login',   //0
                'waiting to read number of users',  //1
                'waiting to pick opponent',         //2
                '',                                 //3
                '',                                 //4
                'waiting for ACK to start a game',          //5  A=accept  X=deny
                'waiting for both answers to come in ',     //10
                'processing the game '                      //15
            ];
        }
    }

};


var dispAllUsersOnPage_start = function (shouldRefresh) {
    //start the async transer, if needed
    console.log("entered display");
    if (connectionObj.linkActive) {
        //only continue if the link is active
        if (shouldRefresh) {
            connectionObj.clearLocalStack();
            connectionObj.getAllUsersOnLine();
        };
    };
};


var dispAllUsersOnPage_contin = function () {
    //display all of the users currently on-line
    //if want to pull all the data in, then set refresh to true
    //this function assumes that all the data is already in the array if not
    //first make sure that it is on-line
    console.log("another user");
    if (connectionObj.linkActive) {
        //only if link is active
        //watch out for infinite loop
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

        //now loop thru all the names and put on-line
        var endVal = connectionObj.usersOnLine.length;
        for (var i = 0; i < endVal; i++) {  //each new button is on a new row
            var newRow = $("<div>");
            $(newRow).addClass("row");
            var newLine = $("<p>");
            var lineText = connectionObj.retUserOnLineName(i);
            if (connectionObj.retUserOnLineRec(i).isPlaying) {
                lineText += " playing against " + connectionObj.retUserOnLineRec(i).inRec.name;
            } else {
                lineText += " free to play";
            };

            if (connectionObj.retUserOnLineRec(i).isPlaying) {
                $(newLine).text(lineText);
                $(newLine).appendTo(newRow);
                $(newRow).appendTo(divCurrUsers);
            } else {
                //if it is an active user that can play then
                //put at the top of the screen and wrap with a button
                var buttonTag = $("<button>");
                buttonTag.attr("data-user-select", i);
                buttonTag.addClass("user_select");
                $(buttonTag).text(lineText);
                $(buttonTag).appendTo(newRow);
                $(newRow).prependTo(divCurrUsers);
            };
        };
        var rowStatusFooter = $("<div>").addClass("row");
        var statusFooter = $("<p>");
        var statusFooterText = $("<p>");
        $(statusFooterText).text("Available:");
        $(statusFooterText).appendTo(statusFooter);
        $(statusFooter).appendTo(rowStatusFooter);
        $(rowStatusFooter).prependTo(divCurrUsers);
        if ( endVal < connectionObj.currNumberOfConn ) {
            //do not have all the user's names, so loop back around
            //watch out, maybe infinite loop
            setTimeout( dispAllUsersOnPage_start(true),1000 );
        };
    };
}; // disp Users On Page


var evalUserSelect = function() {
    //clicked on a user
    var userClick = $(this).attr("data-user-select");
    //this will now correspond to the usersOnLine[] array
    //so store the users info into the currUserRec
    //make some short handed annotation for usage
    var cuStack = connectionObj.usersOnLine;  //use as input
    var oppRec = cuStack[userClick].outRec; //the actual record of the opponent
    var currRec = connectionObj.currUserRec;  //use as output
    if( oppRec.ID === currRec.outRec.ID) {
        //user picked himself
        alert( "you picked yourself");
    } else {
        //out record goes to the in record of the opponent
        dbOppStorageArea = database.ref( oppRec.ID + "/inRec" );
    
        currRec.inRec.ID = oppRec.ID;
        currRec.inRec.name = oppRec.name;
        currRec.inRec.msg = oppRec.msg;
        currRec.inRec.choice = oppRec.choice;
        currRec.inRec.score = oppRec.score;
        currRec.inRec.ACK = oppRec.ACK;

        currRec.outRec.choice = "?";
        currRec.outRec.ACK = "ACK";
        currRec.outRec.score = 0;
        //currRec.inRec.ACK = "RST";    
        connectionObj.writeCurrUserRec();
        connectionObj.writeToOppRec();
    };
};



