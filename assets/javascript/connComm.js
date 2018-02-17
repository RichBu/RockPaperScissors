

//  connComm  communications and connections objects

//by Rich Budek 02/14/2018


//connConfig is set to global in the globals.js
connConfig = {
    apiKey: "AIzaSyDAnVeqfmMPjDq_vosN1R9NnMoHJQRsW3k",
    authDomain: "rockpaperscissors-21cc5.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-21cc5.firebaseio.com",
    projectId: "rockpaperscissors-21cc5",
    storageBucket: "rockpaperscissors-21cc5.appspot.com",
    messagingSenderId: "948424377410"
};


var userType = {        //stored in database
    userID: "",         //user ID, usually just sequence number
    name: "",           //user name, if known
    isPlaying: false,   //does he have a partner
    status: "",        //waiting for response, ack choice 
    playingAgainstID: "",
    playingAgainstName: "",    //who playing with by name
    userScore: 0,
    userChoice: "",            //R, P, S  
    //-=ack/waiting  ?=want to play
    opponentScore: 0,
    opponentChoice: "",         //R, P, S
    EOR: ""                    //place keeper
};

var connectionObj = {
    currUserRec: userType,
    linkActive: false,  //link is false until turned on
    currNumberOfConn: 0,   //number of connections brought out from event listener

    userRecStore: {   //record stored to database

    },

    usersOnLine: [],       //array of user type


    initCurrUserRec: function () {
        //this.currUserRec.userID = "";             //user ID, usually just sequence number
        this.currUserRec.name = "";           //user name, if known
        this.currUserRec.isPlaying = false;  //is it a server ?
        this.currUserRec.playingAgainstID = "";
        this.currUserRec.playingAgainstName = "";    //who playing with by name
        this.currUserRec.userWins = 0;
        this.currUserRec.userLosses = 0;
        this.currUserRec.userChoice = "";            //R, P, S
        this.currUserRec.opponentWins = 0;
        this.currUserRec.opponentLossea = 0;
        this.currUserRec.opponentChoice = "";         //R, P, S
    },

    setUserReadyToPlay: function () {
        this.currUserRec.isPlaying = false;  //not currently playing
        this.currUserRec.playingAgainstID = "";
        this.currUserRec.playingAgainstName = "";    //who playing with by name
        this.currUserRec.userWins = 0;
        this.currUserRec.userLosses = 0;
        this.currUserRec.userChoice = "";            //R, P, S
        this.currUserRec.opponentScore = 0;
        this.currUserRec.opponentWins = 0;
        this.currUserRec.opponentLossea = 0;
        this.currUserRec.opponentChoice = "";         //R, P, S        
    },

    pushToLocalStack: function ( recObjIn ) {
        //adds to local stack from userType varb
        var newUser = jQuery.extend(true, {}, recObjIn );
        this.usersOnLine.push(newUser);
    },

    pushToLocalStack_w_Clear: function () {
        //push current userType to stack & then clear userType
        this.pushToLocalStack();
        this.init();
    },

    clearLocalStack: function () {
        //go thru the entire stack and pop off
        var endVal = this.usersOnLine.length;
        for (var i = 0; i < endVal; i++) {
            this.usersOnLine.pop();
        };
    },

    getAllUsersOnLine: function () {
        //will loop thru and get all the users on-line
        var query = firebase.database().ref(configData.firebaseMainGame).orderByKey();
        query.once("value")
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    // key will be "ada" the first time and "alan" the second time
                    var key = childSnapshot.key;
                    // childData will be the actual contents of the child
                    var childData = childSnapshot.val();
                    var newRecObj = jQuery.extend(true, {}, childData);
                    connectionObj.pushToLocalStack( newRecObj );
                    console.log(childData.userID +  " " + childData.name );
                });
            });
    },

    retUserOnLineName: function( userNum ) {
        //returns the users name from the array
        var outVal = "";
        outVal = connectionObj.usersOnLine[userNum].name;
        return outVal;
    },

    retUserOnLineRec: function( userNum ) {
        //not sure this is an editable object
        //but returns the entire object
        var outVal = connectionObj.usersOnLine[userNum];
        return outVal;        
    },

    EOR: ""    //place keeper
};




var startConnection = function () {
    console.log("connecting");
    firebase.initializeApp(connConfig);

    // Create a variable to reference the database.
    database = firebase.database();

    // -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
    // connectionsRef references a specific location in our database.
    // All of our connections will be stored in this directory.
    connectionsRef = database.ref("/connections");
    dbUserGameStorageMain = database.ref(configData.firebaseMainGame);

    // '.info/connected' is a special location provided by Firebase that is updated every time
    // the client's connection state changes.
    // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    connectedRef = database.ref(".info/connected");

    // When the client's connection state changes...
    connectedRef.on("value", function (snap) {
        console.log(snap);
        // If they are connected..
        if (snap.val()) {   //executes with the value is finally set to true

            // Add user to the connections list.
            var con = connectionsRef.push(true);

            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });

    // When first loaded or when the connections list changes...
    connectionsRef.on("value", function (snap) {

        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        connectionObj.currNumberOfConn = snap.numChildren();
        $("#numUsers").text(connectionObj.currNumberOfConn + " active connections");
        connectionObj.linkActive = true;  //link is active
        connectionObj.currUserRec.userID = configData.firebaseStorage + numeral(connectionObj.currNumberOfConn).format("0000");
        dbUserStorageArea = database.ref(connectionObj.currUserRec.userID);
        dbUserStorageArea.onDisconnect().remove();
        showLinkButtonStatus();
        dispAllUsersOnPage(true);   //refresh entire area
    });
};


var stopConnection = function () {

};

var showLinkButtonStatus = function () {
    //display the proper link button status
    if (connectionObj.linkActive === false) {
        $(configData.idBttnLink).text("TURN LINK ON");
        $(configData.idBttnLink).css("background-color", "red");
    } else {
        $(configData.idBttnLink).text("TURN LINK OFF");
        $(configData.idBttnLink).css("background-color", "green");
    };
};
