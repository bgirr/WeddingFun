var Observable = require("FuseJS/Observable");
var MenuItems = Observable();

var text1 = Observable();

function Text(header, text){
	this.header = header;
	this.text = text;
}

    var p2 = fetch('https://weddingfun-cookingtest.rhcloud.com/events/api/appContentUnified/1/')
                        p2.then(function(response) { return response.json(); })
                        .then(function(responseObject) { 
                            MenuItems.value = responseObject; 
                            new Text("Titeel", "Text");
                            	console.log(Text.value);
                                debug_log("Hier sind wir");
                        });





module.exports = {
    MenuItems: MenuItems,
    Text: Text
		}


