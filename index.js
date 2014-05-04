var http = require('http'),
    ecstatic = require('ecstatic');

var port = process.env.PORT || 8084;

http.createServer(
	ecstatic({
		root: __dirname+"/public",
		autoIndex: true
	})
).listen(port, function() {
	console.log('listening at %s', port);
});