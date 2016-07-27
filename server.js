var app = require('express')();
var validURL = require('valid-url');
var faker = require('faker');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;

//Get Homepage of app.
app.get('/', function (req, res) {
	res.sendFile('index.html', {root:__dirname});
});

//Get the page that displays original URL and shortened URL.
app.get('/new/:url(*)', function (req, res) {
	MongoClient.connect(url, function (err, db) {
	//If there is an error connecting, display that error.
	  if (err) {
	    console.log("Unable to connect to server: ", err);
	  } else {
	  	//Show that we are connected to the mLab server.
	    console.log("Connected to server!")

	    //Create a variable that accesses database.
	    //Create a variable that contains the requested URL.
	    var collection = db.collection('links');
	  	var params = req.params.url;
	  	var appHome = req.get('host') + "/";

	  	//Function that will  check if the URL is a valid URL.
	  	//If so, create an object for that URL with its
	  	//original URL, then the shortened URL.
	  	//Send the object.
	  	var newURL = function (db, callback){
	  		//Check to see if a shortlink for the requested URL already exists.
	  		//If it does, show it. Else, create one.
	  		collection.findOne({"url": params}, {short: 1, _id: 0}, function (err, doc) {
	  			if (doc != null) {
	  				res.json({original_url: params, short_url: appHome + doc.short});
	  			} else {
	  				if (validURL.isUri(params)) {
			  			var shortURL = faker.random.word() + faker.random.word();
						var reqURL = { url: params, short: shortURL};
				  		collection.insert([reqURL]);
				  		res.json({original_url: params, short_url: appHome + shortURL });
			  		}else {
			  			//If the URL is not valid, send error.
			  			res.send('This URL is not valid, please try a properly formatted URL to continue.')
			  		}
	  			}
	  		});
	  	}
	  	//Close database.
	  	newURL(db, function (){
	  		db.close();
	  	});
	  }  
	});
});

//Shortened link to the original URL.
app.get('/:shortened', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) {
	    console.log("Unable to connect to server: ", err);
	  } else {
		  	//Show that we are connected to the mLab server.
		    console.log("Connected to server!")

		    //Create a variable that accesses database.
		    //Create a variable that contains the shortened URL.
		    var collection = db.collection('links');
		  	var params = req.params.shortened;

		  	var aquireURL = function (db, callback) {
		  		collection.findOne({"short": params}, {url: 1, _id:0}, function (err, doc) {
		  			if (doc != null) {
		  				res.redirect(doc.url);
		  			} else {
		  				res.json({error: "No valid shortened URL found!"})
		  			}
		  		});
		  	}

		  	//Close database.
		  	aquireURL(db, function () {
		  		db.close();
		  	});
		 
		}
	});
});


app.listen(process.env.PORT || 80, function () {
	if(process.env.PORT) {
		console.log('Example app listening on port' + process.env.PORT + '!');
	}
	if(80) {
		console.log('Example app listening on port 80!');
	}
});