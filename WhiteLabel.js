//Global Fuse vars
var Observable = require("FuseJS/Observable");
var FileSystem = require("FuseJS/FileSystem");
var Storage = require("FuseJS/Storage");
var ImageTools = require("FuseJS/ImageTools");

//Storage vars
var SAVEUSER = "localStorage.json";
var BackgroundPictureStorage = "bg.jpg";


//Color vars
var ColorHamburgerIcon = Observable('#ffff');
var ColorHeadline = Observable('#ffff');
var ColorUserName = Observable('#ffff');
var ColorMain = Observable('#000000');
var TextColorHeadline = Observable('#000000');
var TextColor = Observable('#000000');


//Background picture
var BackgroundPicture = "Assets/bg.jpg";

//getBackground();

function getBackground(){
	fetch("http://app.ursiundbeeni.com/images/static/2017-9-6_7-48-9-358.jpg",
   { method: "GET", 
                 // headers: {"Data-User-Id": userID.value},
                  })
  .then(function(result) {
    debug_log(".....................................Foto wird im Speicher abgelegt....................................");
    
    	Storage.write(BackgroundPictureStorage, result);
    
    //Hier wird entschieden ob das Foto aus dem Storage oder das Default-Foto verwendet wird
	Storage.read(BackgroundPictureStorage).then(function(content){
		BackgroundPicture = content;
		//hier das Foto einsetzen
	}), function(error){
		//hier das Default-Foto einsetzen
	}
});
}

//disabled for testing
//checkUser(); 

function checkUser(){
//Check if there is a user and otherwise go to LoginScreen
  debug_log('......................................................Prüfe User für WhiteLabel...........................................................');
  Storage.read(SAVEUSER).then(function(content) {
    debug_log('......................................................STORAGE gelesen....................................................................');
    var data = JSON.parse(content);
    savePage.value = data.startPage;
    debug_log("Aus dem LocalStorage für WhiteLabel: " + JSON.stringify(data));
    debug_log("Startwert für WhiteLabel: " + savePage.value);
    if (data.id == "") {router.goto("LoginPage")};
    }, function(error){
      debug_log("...........................................Keine UserInfo für WhiteLabel weiter zu Login......................................... ");
      router.goto("LoginPage");
    })
  };

//If there is a user get the colors and content from backend

function getContent(){
	//tbd.
};


module.exports = {
	ColorHamburgerIcon: ColorHamburgerIcon,
	ColorHeadline: ColorHeadline,
	ColorUserName: ColorUserName,
	ColorMain: ColorMain,
	TextColorHeadline: TextColorHeadline,
	TextColor: TextColor,
	Background: BackgroundPicture
}