var request = require('supertest');

// Setup enviroment.
process.env.IMPORTIO_USERGUID = "00000000-0000-0000-0000-000000000000";
process.env.IMPORTIO_APIKEY   = "MC4xOTYwMzkzNTc2ODgyNzc5NjAuOTY2NTEwNzk2Njg2NjM0NDAuMzEwNDI3NTMzOTI4MzA0OQ==";
process.env.IMPORTIO_TESTING  = true;

// We need a fixed expiry, as this is used on the signing.
var expiry = Number(process.env.IMPORTIO_EXPIRYFORTEST = 1403661734685);

dummyQuery = {"gloss":{"title":"exa gloss","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"GlossSee":"markup"}}}}};
dummyResponse = {
    "queryJson": JSON.stringify(dummyQuery),
    "expiresAt": expiry,
    "userGuid": "00000000-0000-0000-0000-000000000000",
    "orgGuid": "00000000-0000-0000-0000-000000000000",
    "digest": "fA3uYm3pLjJYdNI+HjMms9MUMn0="
};

var signer   = require('../index.js');

 describe('Simple test if server is alive and responding.', function(){
	it('Should return an JSON object', function(done){
		request("http://localhost:5000")
		.post('/')
		.send(JSON.stringify(dummyQuery))
		.set('Origin', 'http://localhost:XXXX')
		.expect('Content-Type', /json/)
		.expect(200, done);
	});

     it('Should return a signed response', function(done){
         request("http://localhost:5000")
             .post('/')
             .send(dummyQuery)
             .set('Origin', 'http://localhost:XXXX')
             .expect('Content-Type', /json/)
             .expect(dummyResponse)
             .expect(200, done);
     });

	//TODO: Test gzip response.
});