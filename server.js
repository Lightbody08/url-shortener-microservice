var app = require('express')();
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var url = process.env.MONGOLAB_URI;

app.get('/new/:url(*)', function (req, res) {
	res.send(req.params.url);
	console.log(req.params.url);
});

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log("Unable to connect to server:", err);
  } else {
    console.log("Connected to server!")
  };
});

app.listen(process.env.PORT || 80, function () {
	if(process.env.PORT) {
		console.log('Example app listening on port' + process.env.PORT + '!');
	}
	if(80) {
		console.log('Example app listening on port 80!');
	}
	
});