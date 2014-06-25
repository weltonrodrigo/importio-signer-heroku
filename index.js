var connect = require('connect');
var morgan  = require('morgan');
var http 	= require('http');
var crypto 	= require('crypto');
var compression = require('compression');

// Your keys.
var userGuid = process.env.IMPORTIO_USERGUID;
var apiKey   = process.env.IMPORTIO_APIKEY;
var orgGuid  = "00000000-0000-0000-0000-000000000000";

var rawKey   = new Buffer(apiKey, 'base64');

// We need a static expiry for testing.
var expiry = process.env.IMPORTIO_TESTING && process.env.IMPORTIO_EXPIRYFORTEST? 
	process.env.IMPORTIO_EXPIRYFORTEST: undefined;


// Creates a Hmac SHA1 based on a key.
function sign (query, expiry){

	var hmac = crypto.createHmac('sha1', rawKey);

	// console.log(query);
	// console.log(JSON.stringify(query));

	 // 24 hours expiration. set to "null" for no expiry.
	 // If we are on a testing environment, use a fixed expiry date.
	var myExpiry = expiry? expiry: (Date.now() + (60*60*24)) * 1000;
	var check = query + ':' + userGuid + ':' + myExpiry;

	// console.log(check);
	hmac.update(check)
	var digest = hmac.digest('base64');	
	// console.log(digest);

	var signedQuery = {
		"queryJson": query,
		"expiresAt": myExpiry,
		"userGuid": userGuid,
		"orgGuid": orgGuid,
		"digest": digest
	};
	// console.log(JSON.stringify(signedQuery));
	return JSON.stringify(signedQuery);
}

var app = connect();
app.use(morgan());
app.use(compression());

// simple function to get raw body data.
app.use(function(req, res, next){
   var data = "";
   req.on('data', function(chunk){ data += chunk})
   req.on('end', function(){
      req.rawBody = data;
      next();
   })
})

// Main route
app.use(function(req, res){
	var origin = req.headers['origin'];
	// console.log(JSON.stringify(req.headers));

	res.setHeader('Content-Type', 'application/json');

	if(origin){
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Allow-Origin", origin);
	}

	res.end(sign(req.rawBody, expiry));
})

var port = Number(process.env.PORT || 5000);

http.createServer(app).listen(port, function(){
	console.log("Server started on port " + port);
});