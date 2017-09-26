var Observable = require("FuseJS/Observable");
//var camera = require('FuseJS/Camera');
var Storage = require("FuseJS/Storage");
var SAVEUSER = "localStorage.json";

var userName = Observable("");
var userID = Observable("");



Storage.read(SAVEUSER).then(function(content) {
		var data = JSON.parse(content);
		userName.value = data.showName;
		userID.value = data.id;
		debug_log(userID.value);
		debug_log(userName.value);
	})


function Person(picture){
	this.picture = picture;
}

function Item(time, ampm, title, project, people){
	this.time = time;
	this.ampm = ampm;
	this.title = title;
	this.project = project;
	this.people = people;
}


function Picture(){
	camera.takePicture(640,480).then(function(image)
{
    //Do things with image here
}).catch(function(error) {
    //Something went wrong, see error for details
});
}

var items = Observable(
	new Item(14, "Uhr", "Kirchliche Trauung", "Maria unterm Kreuz", Observable()),
	new Item(15, "Uhr", "Kaffee und Kuchen", "Maria unterm Kreuz", Observable()),
	new Item(18, "Uhr", "Abendveranstaltung", "N8Stallung", [new Person("Assets/logo.png")])
);

var locations = Observable(
	new Item(8, "Uhr", "Kirchliche Trauung", "Maria unterm Kreuz", Observable()),
	new Item(9, "Uhr", "Kaffee und Kuchen", "Maria unterm Kreuz", Observable()),
	new Item(10, "Uhr", "Abendveranstaltung", "N8Stallung", [new Person("Assets/logo.png")])
);

var itemsView = items.map(function(item, index){
	return {
		item : item, delay : index * 0.08,
		lineDelay : (items.length - index + 1) * 0.1,
		isLast : index === items.length - 1,
		hasTitle : item.title.length > 0,
		hasProject : item.project.length > 0,
		hasPeople : item.people.length > 0
	};

});

var img_opacity = '0.8'

module.exports =  {
	items: itemsView,
	img_opacity: img_opacity,
	userName: userName

};
