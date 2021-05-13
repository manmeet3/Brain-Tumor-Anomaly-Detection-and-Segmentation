//Example POST method invocation
var Client = require('node-rest-client').Client;

var client = new Client();

// set content-type header and data as json in args parameter
var args = {
	data: { file: "hello" },
	headers: { "Content-Type": "application/json" }
};

client.post("http://remote.site/rest/xml/method", args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});

// registering remote methods
client.registerMethod("postMethod", "http://remote.site/rest/json/method", "POST");

client.methods.postMethod(args, function (data, response) {
	// parsed response body as js object
	console.log(data);
	// raw response
	console.log(response);
});
