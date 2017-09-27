//Fuse vars
var Observable = require("FuseJS/Observable");
var Camera = require("FuseJS/Camera");
var CameraRoll = require("FuseJS/CameraRoll");
var ImageTools = require("FuseJS/ImageTools");
var FileSystem = require("FuseJS/FileSystem");
var Storage = require("FuseJS/Storage");


//Storage vars
var SAVEUSER = "localStorage.json";
var SAVETHUMBNAIL = "localThumbnail.json";
var SAVEPAGE = "localPage.txt"
var saveData = Observable("");
var savePage = Observable("");

var BackgroundPicture = Observable("http://app.ursiundbeeni.com/images/background_main.jpg");
var pictures = Observable();


var question = Observable();
var selectMusic = Observable();
var scheduleList = Observable();
var InfoList = Observable();
var QuestionID = Observable();
var answerID = Observable();
var answerVisible = Observable();
var questionVisible = Observable();
var checkQuestions = Observable();
var teams = Observable();
var chooseTeam = Observable();
var WhiteBackground = Observable("Hidden");
var SAVESCHEDULE = "localSchedule.txt";
var Headline = Observable("Ursi & Beeni");
var HeaderImage = Observable("http://app.ursiundbeeni.com/images/stamp_white.png");

//Color vars
var ColorHamburgerIcon = Observable('#ffff');
var ColorHeadline = Observable('#ffff');
var ColorUserName = Observable('#ffff');
var ColorMain = Observable('#000000');
var TextColorHeadline = Observable('#000000');
var TextColor = Observable('#000000');

//Visibility vars
var ScheduleVisibility = Observable("Hidden");
var InfoVisibility = Observable("Hidden");
var PhotoVisibility = Observable("Hidden");
var QuizVisibility = Observable("Hidden");
var MusicVisibility = Observable("Hidden");


key = Observable("");
showname = Observable("");
userID = Observable("");
ErrorMessage = Observable("");
defaultPage = Observable("secondPage")

var UploadMessage = Observable("");
var UploadMessageVisible = Observable("Hidden");

ErrorMessage.value = "";


var images = Observable();
var favIcon = Observable("Hidden"); 


var music_user_value = Observable("");
var music = Observable(""); 
var music_image = Observable("");
var music_JSON = Observable();
var music_urL = 'https://ws.audioscrobbler.com/2.0/?method=track.search&track=' + music_user_value.value + '&api_key=3e56246655a7a46c2d011bed1a1b807c&format=json';

var musicLength = music_user_value.length;


checkUser();
getBackgroundImage();
getHeadline();
getHeaderImage();
getColors();
getMenuVisibility();

//Push Notification
var push = require("FuseJS/Push");

push.on("registrationSucceeded", function(regID){
  console.log("Push Notification Registration Succeded: " + regID);
  //Hier die regID mit der UserID an das Backend schicken 
  //Error Handling --> Nach Zeit erneut versuchen
});

push.on("error", function(reason){
  console.log("Push Notification Registration failed: " + reason);
  //Error Handling definieren --> Nach Zeit erneut versuchen
});

push.on("receivedMessage", function(payload){
  console.log("Recieved Push Notification: " + payload);
  //Hier eventuell Action ergänzen
});


function checkUser(){
  debug_log('Prüfe User...........................................................');
  Storage.read(SAVEUSER).then(function(content) {
    debug_log('STORAGE gelesen');
    var data = JSON.parse(content);
    savePage.value = data.startPage;
    debug_log("Aus dem LocalStorage: " + JSON.stringify(data));
    debug_log("Startwert: " + savePage.value);
    if (data.id == "") {router.goto("LoginPage")};
    }, function(error){
      debug_log("ERRRRRRRORRRRRRRRR");
      router.goto("LoginPage");
    })
  }


music_user_value.onValueChanged(function () {
        musicList();
});

function setWhiteBackground() {
  WhiteBackground.value = "Visible";
}

function setPhotoBackground() {
  WhiteBackground.value = "Hidden";
}

function selectedMusic(){

  disableQuestion();
  Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    userID.value = data.id;
    debug_log("UserID: " + userID.value);
  })
 isLoading(); 
fetch("http://app.ursiundbeeni.com/songs/api/withUser/",
   { method: "GET", 
                  headers: {"Data-User-Id": userID.value},
                  })
  .then(function(result) {
    debug_log("Hier kommt gleich ein Ergebnis...");
    if (result.status !== 200) {
      debug_log(result.status);
    }
  selectMusic.replaceAll([]);
  result.json().then(function(data) {
  debug_log("Übersicht ist da!");
  debug_log(JSON.stringify(data));
  data.sort(function(a, b){return new Date(b.numberOfHearts) - new Date(a.numberOfHearts)});
  var laenge = 0;
  var laenge = data.length;

  for (var i=0; i<laenge; i++) {
    if (data[i].heartByCurrentUser == false) {
    data[i].Color = "#000000"
    data[i].heartByCurrentUser = "Hidden";
  }
  if (data[i].heartByCurrentUser == true)   {
  data[i].Color = "#E91E63" 
  data[i].heartByCurrentUser = "Visible"
  }
  var item = data[i];
  selectMusic.add(item);
  isBusy.deactivate();
  //pictures.sort(function(a, b){return new Date(b.dateAdded) - new Date(a.dateAdded)});
    }
    //Storage.write(SAVETHUMBNAIL, pictures);
    //debug_log(JSON.stringify(pictures));
  });
});
};



function musicList() {

    
    Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    userID.value = data.id;
    debug_log("UserID: " + userID.value);
  })
var music_urL = 'https://ws.audioscrobbler.com/2.0/?method=track.search&track=' + music_user_value.value + '&api_key=3e56246655a7a46c2d011bed1a1b807c&format=json';
           fetch(music_urL)
                        .then(function(response) { 
                           if (response.status !== 200) {
                               debug_log(result.status);
                             }
                          return response.json(); })
                        .then(function(responseObject) { 
                            music.value = responseObject;
                            var laenge =  responseObject.results.trackmatches.track.length;
                            debug_log('Anzahl Suchergebnisse: ' +laenge);
                            //json_object = JSON.parse(responseObject);
                            for (var i=0; i<laenge; i++) {
                              //var item = responseObject.results.trackmatches.track[i];
                              //music.add(item);
                              //json_object.results.trackmatches.track[i].imageNew.add(music.value.results.trackmatches.track[i].image[2]["#text"];);
                              //imageNew = 'Test';
                              responseObject.results.trackmatches.track[i].imageNew = responseObject.results.trackmatches.track[i].image[2]["#text"];
                              //music.value.results.trackmatches.track[i].add(imageNew); 
                              //debug_log(music.value.results.trackmatches.track[1].imageNew);
                              debug_log('Die Image-URL ist: ' + music.value.results.trackmatches.track[i].imageNew);
                              //music.add(image);
                            }
                            
                            debug_log(JSON.stringify(responseObject));
                            debug_log("Hier ist die Musik");
                            
                            music_JSON.value = responseObject;
                            isBusy.deactivate();
                           // music.value = JSON.stringify(json_object); 
                            //debug_log(JSON.stringify(music.value.results.trackmatches.track[1].image[2]["#text"]));
                            //music.value = responseObject.music.results.trackmatches.track;
                              //JSON.parse(music.value);

                        });
}


function addMusic(b){
  debug_log('Das kommt aus der ux: ' + JSON.stringify(b.data));
  var music_mbid = b.data.mbid;
  var music_name = b.data.name;
  var music_artist = b.data.artist;
  var music_imageUrl = b.data.imageNew;
  debug_log('User: ' + userID.value);
  //var bodyText = '{"key": "' + key.value + '", "showName": "' + showname.value + '"}';
  var body_Music = '{"name":"' + music_name +'", "artist": "' + music_artist + '", "imageUrl": "' + music_imageUrl + '", "mbid":"' + music_mbid + '"}'
    fetch('http://app.ursiundbeeni.com/songs/api/addSongWish/',
     { method: "POST", 
         headers: {"Data-User-Id": userID.value, 
        "Content-Type": "application/json"},
          body: body_Music
        })
  .then(function(response) {
            console.log("Musik erfolgreich angelegt!");
            console.log(response.status);
            if (response.status == 200){
              MusicMessageDone();
              music_user_value.value =" ";
            }
            else {
              MusicMessageError();
            }
            return response.json();
        }).then(function(responseObject) {
          debug_log('Das ist der Response: ' + JSON.stringify(responseObject));


        /*  for (var i=0; i<pictures.length; i++) {
           // debug_log('Prüfe' + JSON.stringify(pictures.value.id));
            if (pictures.value.id == responseObject.id){
              debug_log('Change');
              pictures.heartByCurrentUser = 'Visible'
            }
          }

          */
          
        }).catch(function(e){
            console.log('Es ist folgender Fehler aufgetretetn: ' + JSON.stringify(e.status));
        }).then(function() {
          //Meldung wieder ausblenden hier
          debug_log('Fertig'); 
          })
}


function likeMusic(a) {
  var MusicID = a.data.id;
  debug_log(JSON.stringify(a.data));

  debug_log('Schicke Request mit MusicID ' + MusicID + ' und UserID: ' + userID.value);
  isLoading();
  fetch('http://app.ursiundbeeni.com/songs/api/heart/'+ MusicID +'/',
     { method: "POST", 
         headers: {"Data-User-Id": userID.value, 
      "Content-Type": "text/plain"}})
 .then(function(response) {
            console.log("Favorit erfolgreich angelegt!");
            console.log(response.status);

   /*         if (response.status == 200) {
              pictures[a.data.id].heartByCurrentUser = "Visible"
            } */
            return response.json();
        }).then(function(responseObject) {
          debug_log('Das ist der FavResponse: ' + JSON.stringify(responseObject));
          debug_log(JSON.stringify(responseObject.id));
          music_user_value="";
          isBusy.deactivate();
          musicList();
          selectedMusic();
});
}


function dislikeMusic(a) {
  var MusicID = a.data.id;
  debug_log(JSON.stringify(a.data));

  debug_log('Schicke Request mit MusicID ' + MusicID + ' und UserID: ' + userID.value);
  isLoading();
  fetch('http://app.ursiundbeeni.com/songs/api/heart/'+ MusicID +'/',
     { method: "DELETE", 
         headers: {"Data-User-Id": userID.value, 
      "Content-Type": "text/plain"}})
 .then(function(response) {
            console.log("Favorit erfolgreich angelegt!");
            console.log(response.status);
   /*         if (response.status == 200) {
              pictures[a.data.id].heartByCurrentUser = "Visible"
            } */
            return response.json();
        }).then(function(responseObject) {
          debug_log('Das ist der FavResponse: ' + JSON.stringify(responseObject));
          debug_log(JSON.stringify(responseObject.id));
          isBusy.deactivate();
          selectedMusic();
});
}



function MusicMessage () {
  UploadMessageVisible.value = "Hidden";
  UploadMessage.value = "Titel wird gesucht...";
  UploadMessageVisible.value = "Visible";
  var ani = setTimeout(UploadMessageDisable, 2000);
} 


function MusicMessageDone () {
    UploadMessageVisible.value = "Hidden";
    UploadMessage.value = "Titel wurde hinzugefügt";
    UploadMessageVisible.value = "Visible";
    var ani = setTimeout(UploadMessageDisable, 2000);
};

function MusicMessageError () {
  UploadMessageVisible.value = "Hidden";
   UploadMessage.value = "Keine Internetverbindung!";
   UploadMessageVisible.value = "Visible";
   var ani = setTimeout(UploadMessageDisable, 2000);
};




var response_ok = false;


function getuserID () {
    Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    userName.value = data.showName;
    userID.value = data.id;
    if(data.id == ""){
      debug_log("Hier gibt es keine ID");
    }
    debug_log('Die UserID ist: ' + userID.value);
    debug_log('Der UserName ist: ' + userName.value);
  })
}


function takePicture ()
{
   Camera.takePicture(1280,960).then(function(image) {
            CameraRoll.publishImage(image);
            return ImageTools.getBufferFromImage(image).then(function(buffer) {
                return fetch('https://content.dropboxapi.com/2/files/upload', 
                  { method: "POST", 
                  headers: {"Authorization": "Bearer ig8CID6XnEwAAAAAAAAD6Jkw0ctldVWMPeG2n5ElxEtcXhL0s-LPvJRePVHJNWaM",
                  "Dropbox-API-Arg": '{"path":"/hochzeit/logo4.png"}',
                  "Content-type": "application/octet-stream",

                  },
                  body: buffer });
            });
        }).then(function(response) {
            console.log("Got response");
            response_ok = response.ok;
            console.log(response_ok);
            return response.json();
        }).then(function(responseObject) {
          console.log("Hier der Response:");
          console.log(JSON.stringify(responseObject));
          thumbnails();
        }).catch(function(e){
            console.log("Error");
            console.log(e);
        });

};


function CameraRollWedding ()
{
  getuserID();
  isLoading();
   CameraRoll.getImage(1280,960).then(function(image) {
            return ImageTools.getBase64FromImage(image).then(function(buffer) {
                return fetch('http://app.ursiundbeeni.com/images/api/uploadImage/base64/body/', 
                  { method: "POST", 
                  headers: {"Data-User-Id": userID.value},
                  body: "data:image/jpeg;base64,"+ buffer

                  });
            });
        }).then(function(response) {
            console.log("Got response");
            console.log(response.status);
            response_ok = response.ok;
            console.log(response_ok);
             if (response.status == 200){
              UploadMessageDone();
              isBusy.deactivate();
              }
            if (response.status >= 300){
              UploadMessageError();
              isBusy.deactivate();
            }
            return response.json();
        }).then(function(responseObject) {
          console.log("Hier der Response:");
          console.log(JSON.stringify(responseObject));
          var item = responseObject;
          pictures[0].add(item);          
          debug_log("Neues Bild ist hier!");
        }).catch(function(e){
            debug_log("Error");
            debug_log(e);
        });
      
};

function UploadMessage () {
  UploadMessage.value = "Foto wird hochgeladen...";
  UploadMessageVisible.value = "Visible";
}


function UploadMessageDone () {
    UploadMessageVisible.value = "Hidden";
   UploadMessage.value = "Upload erfolgreich!";
   UploadMessageVisible.value = "Visible";
   var ani = setTimeout(UploadMessageDisable, 2000);
};

function UploadMessageError () {
  UploadMessageVisible.value = "Hidden";
   UploadMessage.value = "Upload fehlgeschlagen!";
   UploadMessageVisible.value = "Visible";
   var ani = setTimeout(UploadMessageDisable, 2000);
};

function UploadMessageDisable (){
  UploadMessageVisible.value = "Hidden";
 }


function isLoading () {
    isBusy.activate();
}

function stopLoading() {
   isBusy.deactivate();
}

function PictureWedding ()
{   
  getuserID();
   Camera.takePicture(1280,960).then(function(image) {
            debug_log("Hier kommt das Bild!")
            CameraRoll.publishImage(image);
            return ImageTools.getBase64FromImage(image).then(function(buffer) {
              debug_log("Schicke an Backend");
              isLoading ();
                return fetch('http://app.ursiundbeeni.com/images/api/uploadImage/base64/body/', 
                  { method: "POST", 
                  headers: {"Data-User-Id": userID.value},
                  body: "data:image/jpeg;base64,"+ buffer
                  });
            });    
        }).then(function(response) {
            debug_log("Verschickt");
            debug_log(response.status);
            response_ok = response.ok;
            debug_log(response_ok);
            if (response.status == 200){
              UploadMessageDone();
              isBusy.deactivate();
              }
            if (response.status >= 300){
              UploadMessageError();
              isBusy.deactivate();
            }
            return response.json();
        }).then(function(responseObject) {
          var item = responseObject;
          pictures[0].add(item);
          debug_log("Hier der Response:");
          debug_log(JSON.stringify(responseObject));
          thumbnails();
        }).catch(function(e){
            debug_log("Error");
            debug_log(e);
        });

};



function thumbnails(){

  disableQuestion();
  isLoading ();
  Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    userID.value = data.id;
    debug_log("USER: " + userID.value);
    debug_log("UserID: " + userID.value);
  })
  
fetch("http://app.ursiundbeeni.com/images/api/withUser/",
   { method: "GET", 
                  headers: {"Data-User-Id": userID.value},
                  })
  .then(function(result) {
    if (result.status !== 200) {
      debug_log(result.status);
    }
  pictures.replaceAll([]);
  result.json().then(function(data) {
  debug_log("Übersicht ist da!");
  debug_log(JSON.stringify(data));
  data.sort(function(a, b){return new Date(b.dateAdded) - new Date(a.dateAdded)});
  
  var laenge = 0;
  var laenge = data.length;

  for (var i=0; i<laenge; i++) {
    if (data[i].heartByCurrentUser == false) {
    data[i].Color = "#000000"
    data[i].heartByCurrentUser = "Hidden";
  }
  if (data[i].heartByCurrentUser == true)   {
  data[i].Color = "#E91E63" 
  data[i].heartByCurrentUser = "Visible"
  }
  var item = data[i];
  pictures.add(item);
  isBusy.deactivate();
  };
});
});
}

function likeImage(a){

  var ImageID = a.data.id;
  debug_log(JSON.stringify(a.data));

  debug_log('Schicke Request mit ImageID ' + ImageID + ' und UserID: ' + userID.value);
  isLoading();
  fetch('http://app.ursiundbeeni.com/images/api/heart/'+ ImageID +'/',
     { method: "POST", 
         headers: {"Data-User-Id": userID.value, 
      "Content-Type": "text/plain"}})
 .then(function(response) {
            console.log("Favorit erfolgreich angelegt!");
            console.log(response.status);
   /*         if (response.status == 200) {
              pictures[a.data.id].heartByCurrentUser = "Visible"
            } */
             if (response.status == 200){
              
              isBusy.deactivate();
              }
            if (response.status >= 300){
              MusicMessageError();
              isBusy.deactivate();
            }
            return response.json();
        }).then(function(responseObject) {
          debug_log('Das ist der FavResponse: ' + JSON.stringify(responseObject));
          debug_log(JSON.stringify(responseObject.id));
          thumbnails();
});
}

function dislikeImage(a){

  isLoading();
  var ImageID = a.data.id;
  debug_log(JSON.stringify(a.data));

  debug_log('Schicke Request mit ImageID ' + ImageID + ' und UserID: ' + userID.value);

  fetch('http://app.ursiundbeeni.com/images/api/heart/'+ ImageID +'/',
     { method: "DELETE", 
         headers: {"Data-User-Id": userID.value, 
      "Content-Type": "text/plain"}})
 .then(function(response) {
            console.log("FavIcon entfernt!");
            console.log(response.status);
            if (response.status == 200){
              
              isBusy.deactivate();
              }
            if (response.status >= 300){
              MusicMessageError();
              isBusy.deactivate();}
   /*         if (response.status == 200) {
              pictures[a.data.id].heartByCurrentUser = "Visible"
            } */
            return response.json();
        }).then(function(responseObject) {
          debug_log('Das ist der FavResponse: ' + JSON.stringify(responseObject));
          debug_log(JSON.stringify(responseObject.id));
          thumbnails();
});
}




function getSchedule () {
disableQuestion();
isLoading();
fetch("http://app.ursiundbeeni.com/appContent/api/schedule/",
   { method: "GET", 
                  headers: {"Data-User-Id": userID.value},
                  })
  .then(function(result) {
    debug_log("Hier kommt gleich ein Ergebnis...");
    if (result.status !== 200) {
      MusicMessageError ();
      debug_log(result.status);
      isBusy.deactivate();
    }
  scheduleList.replaceAll([]);
  result.json().then(function(data) {
  debug_log("Übersicht ist da!");
  debug_log(JSON.stringify(data));
  data.sort(function(a, b){return new Date(b.dateAdded) - new Date(a.dateAdded)});
  var laenge = data.length;
  for (i=0; i<laenge; i++){
  var item = data[i];
  scheduleList.add(item);}
 // debug_log('Hier die Schedule Einträge: ' + scheduleList.value);
    //Storage.write(SAVESCHEDULE, scheduleList);
  isBusy.deactivate();
  //pictures.sort(function(a, b){return new Date(b.dateAdded) - new Date(a.dateAdded)});
    })
  })
}


function getInfos () {
disableQuestion();
isLoading();
fetch("http://app.ursiundbeeni.com/appContent/api/text/",
   { method: "GET", 
                  headers: {"Data-User-Id": userID.value},
                  })
  .then(function(result) {
    debug_log("Hier kommt gleich ein Ergebnis...");
    if (result.status !== 200) {
      debug_log(result.status);
      isBusy.deactivate();
    }
  InfoList.replaceAll([]);
  result.json().then(function(data) {
  debug_log("Übersicht ist da!");
  debug_log(JSON.stringify(data));
  data.sort(function(a, b){return new Date(b.dateAdded) - new Date(a.dateAdded)});
  var laenge = data.length;
  for (i=0; i<laenge; i++){
  var item = data[i];
  InfoList.add(item);}
  isBusy.deactivate();
  //pictures.sort(function(a, b){return new Date(b.dateAdded) - new Date(a.dateAdded)});
    })
  })
}


function read_file () {
  debug_log("Versuche zu lesen!");
  Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    saveData.value = data.id;
    savePage.value = data.startPage;
    debug_log(savePage.value);
    debug_log(saveData.value);
  })
};




//setInterval(quizQuestion() , 3000);

function disableQuestion() {
  setWhiteBackground();
  debug_log('Disable Funktion...');
  if(checkQuestions.value === true) {
    debug_log("--------------------Stoppen-------------------");
    clearInterval(myvar);
    checkQuestions.value = false;}
    debug_log("++++++++++++++++PRÜFEN+++++++++" + checkQuestions.value);
    stopLoading();
}

function quizQuestion () {
  setWhiteBackground();
  teamUser();
 myvar = setInterval(function(){ 
  debug_log("Prüfe ob ich Frage holen soll...")
if (checkQuestions.value === true) {
  debug_log("Hole die Frage vom Backend....")
GetQuestion();  
} }, 3000); 

}

function GetQuestion() {
  chooseTeam.value = 'Hidden';
  teams.replaceAll([]);
 Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    userID.value = data.id;
    debug_log("USER: " + userID.value);
    debug_log("UserID: " + userID.value);
  })
  
fetch("http://app.ursiundbeeni.com/game/api/activeQuestion/",
   { method: "GET", 
                  headers: {'Content-Type': "text/plain",
                  "Data-User-Id": userID.value},
                  })
  .then(function(result) {
    if (result.status !== 200) {
      debug_log(result.status);
    }
  result.json().then(function(data) {
  debug_log("Übersicht ist da!");
  debug_log('Daten: ' + JSON.stringify(data));
  question.value = data;
  QuestionID.value = data.id;
  debug_log('Fragenummer: ' + QuestionID.value);
  if (data.responseOfCurrentUser == null) {
    answerVisible.value = "Hidden";
    questionVisible.value = "Visible";
  }
  else {
    answerVisible.value = "Visible";
    questionVisible.value = "Hidden";
  }
});
});

  fetch('http://app.ursiundbeeni.com/game/api/activeQuestion/',
    {method: "GET",
    headers: {"Data-User-Id": userID.value, 
      "Content-Type": "text/plain"}
  })
 }

 function answerQuestion(a) {

  debug_log(JSON.stringify(a.data));
  isLoading();

  if (a.data.label == "A") {
    answerID.value = "0";
    debug_log('Schicke Antwort: ' + answerID.value);
  }
    if (a.data.label == "B") {
    answerID.value = "1";
    debug_log('Schicke Antwort: ' + answerID.value);  
  }
    if (a.data.label == "C") {
    answerID.value = "2";
    debug_log('Schicke Antwort: ' + answerID.value);
  }
    if (a.data.label == "D") {
    answerID.value = "3";
    debug_log('Schicke Antwort: ' + answerID.value);
  }
      if (a.data.label == "E") {
    answerID.value = "4";
    debug_log('Schicke Antwort: ' + answerID.value);
  }
      if (a.data.label == "F") {
    answerID.value = "5";
    debug_log('Schicke Antwort: ' + answerID.value);
  }
      if (a.data.label == "G") {
    answerID.value = "6";
    debug_log('Schicke Antwort: ' + answerID.value);
  }
        if (a.data.label == "H") {
    answerID.value = "7";
    debug_log('Schicke Antwort: ' + answerID.value);
  }
   
  //debug_log('Schicke Request mit ImageID ' + ImageID + ' und UserID: ' + userID.value);

  fetch('http://app.ursiundbeeni.com/game/api/response/'+ QuestionID.value +'/',
     { method: "POST", 
         headers: {"Data-User-Id": userID.value, 
      "Content-Type": "text/plain",
      "Data-Response-Index": answerID.value}})
 .then(function(response) {
            console.log("Antwort abgegeben!");
            console.log(response.status);
   /*         if (response.status == 200) {
              pictures[a.data.id].heartByCurrentUser = "Visible"
            }  */
            question.replaceAll([]);
            //question.value = '{"questionText":"Was ist ein Chapter Lead?"}';
            GetQuestion();
             isBusy.deactivate();
            return response.json();
        }).then(function(responseObject) {
          debug_log('Das ist der AnswerResponse: ' + JSON.stringify(responseObject));
          debug_log(JSON.stringify(responseObject.id));
           isBusy.deactivate();
}); 

 }


 function teamUser () {
    teams.replaceAll([]);
    debug_log("Prüfe das Team des Users.......");
    fetch('http://app.ursiundbeeni.com/game/api/teamOfUser/',
    {method: "GET",
    headers: {"Data-User-Id": userID.value, 
      "Content-Type": "text/plain"}})
      .then(function(response){
        debug_log('Inhalt aus Team des Users: ' + JSON.stringify(response._bodyText));
        if (response._bodyText === "") {
          question.replaceAll([]);
          debug_log("Hole mir die möglichen Teams.......");
           fetch('http://app.ursiundbeeni.com/game/api/team/')
           .then(function(response){
            debug_log('Mögliche Teams: ' + JSON.stringify(response._bodyText));
            return response.json();
           }).then(function(responseObject) {
            debug_log('Mögliche Teams: ' + JSON.stringify(responseObject));
            var length = responseObject.length;
            debug_log('Länge ist: ' + length);
            for (i=0; i<length; i++){
              var item = responseObject[i];
              teams.add(item);
            }
            chooseTeam.value = 'Visible';
            debug_log('Hier die Teams: ' + teams.value);
           })
      } else{
        chooseTeam.value = 'Hidden';
        checkQuestions.value = true;
      }})

  };

  function setTeam(a) {
    debug_log(JSON.stringify(a.data));
    var teamId = a.data.id;
    debug_log('Choosen team: ' + teamId);
    fetch('http://app.ursiundbeeni.com/game/api/team/join/' + teamId + '/',
    {method: "PUT",
    headers: {
      "Data-User-Id": userID.value,
       "Content-Type": "text/plain"
    }}).then(function(response){
      debug_log(response.status);
      debug_log('Hier der Response: ' + response._bodyText);
      if(response.status <= 299) {
        chooseTeam.value = 'Hidden';
        checkQuestions.value = true;
        quizQuestion();
      }
      else{
        teamUser();
      }
    })
  };


function LogOut() {
  disableQuestion();
  userID.value="";
  Storage.deleteSync("localStorage.json");
  router.goto("LoginPage");
};


function login_clicked()
{ debug_log("Hier rein");
  ErrorMessage.value = "";
  var bodyText = '{"key": "' + key.value + '", "showName": "' + showname.value + '"}';
  //"{key" + key.value + ", showName: " + showname.value + "}";

  debug_log(bodyText);

  fetch('http://app.ursiundbeeni.com/users/api/registerUser/', 
                  {method: "POST", 
                  headers: {
                  "Content-type": "application/json",
                  },
                  body: bodyText
                  })

  .then(function(resp) {
        if (resp.status == 200) {
            console.log(resp.status);
            return resp.json();
        } else {

          
            console.log('Network failure: ' + resp.status);
            ErrorMessage.value = "Es ist ein Fehler aufgetreten!" ;
            //Fehlermeldung anzeigen 
        }
    })
    .then(function(json) {
        userID.value = json.id;
        //debug_log(userID);
        //var userValue =  '{"key": "' + userID + '"}';
        var userValue = JSON.stringify(json);
        debug_log('Hier das Ergebnis: ' + userValue.value);
        //debug_log(userValue);
        Storage.write(SAVEUSER, userValue);
        //debug_log(userValue);
        var userPage = 'firstPage';
        //debug_log(userPage);
        Storage.write(SAVEPAGE, userPage)
        debug_log('Die ID ist: ' + userID.value);
        router.goto("firstPage");
          //Response ID abspeichern
      //Username abspeichern
      //Seite auf SinglePage wechslen

    })   
/*    .catch(function(err) {
        console.log('Error');
        console.log("Fehlergrund: " + JSON.stringify(err));
    });
*/
}

function getBackgroundImage () {
    Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    BackgroundPicture.value = data.backgroundImage;
    userID.value = data.id;
    if(data.id == ""){
      debug_log("Hier gibt es keine ID");
    }
    debug_log('Die UserID ist: ' + userID.value);
    debug_log('Der UserName ist: ' + userName.value);
  })
};

function getHeadline () {
    Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    Headline.value = data.headline;
    userID.value = data.id;
    if(data.id == ""){
      debug_log("Hier gibt es keine ID");
    }
    debug_log('Die UserID ist: ' + userID.value);
    debug_log('Der UserName ist: ' + userName.value);
  })
};

function getHeaderImage () {
    Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    HeaderImage.value = data.headerImage;
    userID.value = data.id;
    if(data.id == ""){
      debug_log("Hier gibt es keine ID");
    }
    debug_log('Die UserID ist: ' + userID.value);
    debug_log('Der UserName ist: ' + userName.value);
  })
};

function getColors () {
    Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    ColorHamburgerIcon.value = "#ffff";//data.ColorHamburgerIcon;
    ColorHeadline.value = "#ffff"; //data.ColorHeadline;
    ColorUserName.value = "#ffff"; //data.ColorUserName;
    ColorMain.value = data.primaryColor;
    TextColorHeadline.value = "#000000"; //data.TextColorHeadline;
    TextColor.value = "#000000"; //data.TextColor;
    userID.value = data.id;
    if(data.id == ""){
      debug_log("Hier gibt es keine ID");
    }
    debug_log('Die UserID ist: ' + userID.value);
    debug_log('Der UserName ist: ' + userName.value);
  })
};

function getFonts () {
    Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    MenuText.value = "Assets/FOnts/" + "built_titling_rg.otf"; //data.MenuText;;
    MutedText.value = "Assets/FOnts/" + "built_titling_rg.otf"; //data.MutedText;
    userID.value = data.id;
    if(data.id == ""){
      debug_log("Hier gibt es keine ID");
    }
    debug_log('Die UserID ist: ' + userID.value);
    debug_log('Der UserName ist: ' + userName.value);
  })
};

function getMenuVisibility () {
    Storage.read(SAVEUSER).then(function(content) {
    var data = JSON.parse(content);
    ScheduleVisibility.value = "Visible";//data.ScheduleVisibility;
    InfoVisibility.value = "Visible"; //data.InfoVisibility;
    PhotoVisibility.value = data.hideImageAndMusicInNavigation;
    QuizVisibility.value = "Visible"; //data.QuizVisibility;
    MusicVisibility.value = data.hideImageAndMusicInNavigation;
    userID.value = data.id;
    if(data.id == ""){
      debug_log("Hier gibt es keine ID");
    }
    debug_log('Die UserID ist: ' + userID.value);
    debug_log('Der UserName ist: ' + userName.value);
  })
};



  function login (responseObject) {
          console.log("Hier der Response:");
          console.log(JSON.stringify(responseObject));
          userID.value = responseObject.id;
          debug_log(userID.value);
      router.goto("firstPage");
    };


  function switch_page () {
    debug_log("geklickt");
router.goto("firstPage");
  };



function setPage1Headline(){
  Headline.value = "Ablaufplan";
}

function setPage2Headline(){
  Headline.value = "Location";
}

function setPage3Headline(){
  Headline.value = "Info";
}

function setPage4Headline(){
  Headline.value = "Alle Fotos";
}

function setPage5Headline(){
  Headline.value = "Quiz";
}

function setPage6Headline(){
  Headline.value = "Alle Lieder";
  setWhiteBackground();
}

function setPage7Headline(){
  Headline.value = "Info";
}

function setPage8Headline(){
  Headline.value = "Info";
}

function setPage9Headline(){
  Headline.value = "Info";
}

function setPage10Headline(){
  Headline.value = "Info";
}


    module.exports = {
    pictures: pictures,
    thumbnails: thumbnails,
    likeImage: likeImage,
    favIcon: favIcon,
    PictureWedding: PictureWedding,
    CameraRollWedding: CameraRollWedding,
    login_clicked: login_clicked,
    key: key,
    showname: showname,
    defaultPage: defaultPage,
    ErrorMessage: ErrorMessage,
    read_file: read_file,
    switch_page: switch_page,
    UploadMessage: UploadMessage,
    UploadMessageVisible: UploadMessageVisible,
    music: music,
    music_JSON: music_JSON,
    musicList: musicList,
    music_user_value: music_user_value,
    music_image: music_image,
    addMusic: addMusic,
    selectedMusic: selectedMusic,
    selectMusic: selectMusic,
    likeMusic: likeMusic,
    dislikeMusic: dislikeMusic,
    dislikeImage: dislikeImage,
    quizQuestion: quizQuestion,
    question: question,
    answerQuestion: answerQuestion,
    answerVisible: answerVisible,
    questionVisible: questionVisible,
    isLoading: isLoading,
    quizQuestion: quizQuestion,
    disableQuestion: disableQuestion,
    teams: teams,
    setTeam: setTeam,
    LogOut: LogOut,
    chooseTeam: chooseTeam,
    WhiteBackground: WhiteBackground,
    getSchedule: getSchedule,
    scheduleList: scheduleList,
    InfoList: InfoList,
    getInfos: getInfos,
    setPhotoBackground: setPhotoBackground,
    setWhiteBackground: setWhiteBackground,
    setPage1Headline: setPage1Headline,
    setPage2Headline: setPage2Headline,
    setPage3Headline: setPage3Headline,
    setPage4Headline: setPage4Headline,
    setPage5Headline: setPage5Headline,
    setPage6Headline: setPage6Headline,
    setPage7Headline: setPage7Headline,
    setPage8Headline: setPage8Headline,
    setPage9Headline: setPage9Headline,
    setPage10Headline: setPage10Headline,
    Headline: Headline,
    ColorHamburgerIcon: ColorHamburgerIcon,
    ColorHeadline: ColorHeadline,
    ColorUserName: ColorUserName,
    ColorMain: ColorMain,
    TextColorHeadline: TextColorHeadline,
    TextColor: TextColor,
    Background: BackgroundPicture,
    HeaderImage: HeaderImage,
    ScheduleVisibility: ScheduleVisibility, 
    InfoVisibility: InfoVisibility, 
    PhotoVisibility: PhotoVisibility,
    QuizVisibility: QuizVisibility, 
    MusicVisibility: MusicVisibility 
    }