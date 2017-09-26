var Observable = require("FuseJS/Observable");
var music_user_value = Observable("");
var music = Observable(""); 
var music_image = Observable("");
var music_JSON = Observable();
var music_urL = 'https://ws.audioscrobbler.com/2.0/?method=track.search&track=' + music_user_value.value + '&api_key=3e56246655a7a46c2d011bed1a1b807c&format=json';

//https://ws.audioscrobbler.com/2.0/?method=track.search&track=as&api_key=3e56246655a7a46c2d011bed1a1b807c&format=json
var musicLength = music_user_value.length;

var UploadMessage = Observable("");
var UploadMessageVisible = Observable("Hidden");


music_user_value.onValueChanged(function () {
        MusicMessage();
        musicList();
});

function musicList() {   

var music_urL = 'https://ws.audioscrobbler.com/2.0/?method=track.search&track=' + music_user_value.value + '&api_key=3e56246655a7a46c2d011bed1a1b807c&format=json';
					 fetch(music_urL)
                        .then(function(response) { return response.json(); })
                        .then(function(responseObject) { 
                            MusicMessageDone ();
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
                           // music.value = JSON.stringify(json_object); 
                            //debug_log(JSON.stringify(music.value.results.trackmatches.track[1].image[2]["#text"]));
                            //music.value = responseObject.music.results.trackmatches.track;
                            	//JSON.parse(music.value);

                        });
}



function MusicMessage () {
  UploadMessage.value = "Titel wird gesucht...";
  UploadMessageVisible.value = "Visible";
}


function MusicMessageDone () {
    UploadMessageVisible.value = "Hidden";
};

function MusicMessageError () {
  UploadMessageVisible.value = "Hidden";
   UploadMessage.value = "Keine Internetverbindung!";
   UploadMessageVisible.value = "Visible";
   var ani = setTimeout(UploadMessageDisable, 2000);
};

module.exports = {
	music: music,
    music_JSON: music_JSON,
	musicList: musicList,
	music_user_value: music_user_value,
	music_image: music_image
}