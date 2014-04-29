var http = require('http'),
    ecstatic = require('ecstatic');

http.createServer(
	ecstatic({
		root: __dirname+"/public",
		autoIndex: true
	})
).listen(8084);