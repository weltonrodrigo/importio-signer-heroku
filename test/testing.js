var request = require('supertest');

// Create a dummy apikey
var apiKey = '';
for (i=0; i< 8; i++){
	apiKey += Math.random();
}
apiKey = new Buffer(apiKey).toString('base64');

// Setup enviroment.
process.env.IMPORTIO_USERGUID = 00000000-0000-0000-0000-000000000000; 
process.env.IMPORTIO_APIKEY = apiKey
process.env.IMPORTIO_TESTING = true;

// We need a fixed expiry, as this is used on the signing.
var expiry = process.env.IMPORTIO_EXPIRYFORTEST = 1403644656416;

dummyQuery = {"gloss":{"title":"exa gloss","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"GlossSee":"markup"}}}}};
dummyResponse = {
    "queryJson": JSON.stringify(dummyQuery),
    "expiresAt": expiry,
    "userGuid": "0",
    "orgGuid": "00000000-0000-0000-0000-000000000000",
    "digest": "MzEZ6lUFd3ejT7fPT4bbY61B3vk=" // How to test this?
}

var signer   = require('../index.js');

 describe('Simple test if server is alive and responding', function(){
	it('Should return an JSON object', function(done){
		request("http://localhost:5000")
		.post('/')
		.send(dummyQuery)
		.set('Origin', 'http://localhost:XXXX')
		.expect('Content-Type', /json/)
		.expect(200, done);
	});

	//TODO: How to test if the digest is OK? it behaves non-deterministic (the same query do not result on the
	// same digest.

	//TODO: Test gzip response.
});