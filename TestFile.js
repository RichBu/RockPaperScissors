

//test file for sending stuff into the browser real time


var user02 = database.ref( "/games");
user02.once("value")
    .then( function(snapshot){
        var test = snapshot.exists();
        console.log( "test = " + test);
        console.log(user02);
        console.log( snapshot);
    });


//forEach will enumerate the top level children in DataSnap Shot
//try this routine to pull out all of the data records of who is on-line

var query = firebase.database().ref("/games").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
      console.log( childData.userID);
  });
});

