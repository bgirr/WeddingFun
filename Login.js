var Observable = require("FuseJS/Observable");
var Storage = require("FuseJS/Storage");
var SAVEUSER = "localStorage.json";
var SAVEPAGE = "localPage.txt"
var saveData = Observable("");
var savePage = Observable("");


key = Observable("");
showname = Observable("");
userID = Observable("");
ErrorMessage = Observable("");
defaultPage = Observable("secondPage")

ErrorMessage.value = "";

Storage.read(SAVEUSER).then(function(content) {
		var data = JSON.parse(content);
		savePage.value = data.startPage;
		if (savePage.value == 'registered') {
      router.goto("firstPage");
		}

	})





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


function login_clicked()
{	debug_log("Hier rein");
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
            console.log('OK');
            return resp.json();
        } else {

        	
            console.log('Network failure: ' + resp.status);
            ErrorMessage.value = "Es ist ein Fehler aufgetreten! Grund:" + JSON.stringify(resp.body);
            //Fehlermeldung anzeigen 
        }
    })
    .then(function(json) {
        console.log('JSON:');
        userID = json.id;
        userID.value = json.id;
        //debug_log(userID);

        //var userValue =  '{"key": "' + userID + '"}';
        var userValue = JSON.stringify(json);
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


module.exports = {
	login_clicked: login_clicked,
	key: key,
	showname: showname,
	defaultPage: defaultPage,
	ErrorMessage: ErrorMessage,
	read_file: read_file,
  switch_page: switch_page
};
