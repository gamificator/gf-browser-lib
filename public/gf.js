(function(window, document, SockJS, options){

	options = options || {};

	function _typeof (it, type) {
		if (type != null) {
			if (type === "undefined" && (it == null || isNaN(it))) {
				return true;
			}
			return Object.prototype.toString.call(it).toLowerCase() === ("[object "+type+"]").toLowerCase();
		} else {
			return Object.prototype.toString.call(it).slice(8,-1).toLowerCase();
		}
	}

	var onLibraryReady = [],
	    transport      = null;

	if (SockJS == null) {
		var script = document.createElement('script');
		script['src'] = "http://cdn.sockjs.org/sockjs-0.3.min.js";
		script['onload'] = function() {
			SockJS = window['SockJS'];
			transport = createTransport();
			var handler;
			while (handler = onLibraryReady.pop()) {
				handler();
			}
		}
		document.head.appendChild(script);
	}

	function Client (userId) {
		this.userId = userId;
		this.transport = null;
		this.offline = [];
		this.listeners = {};
	}

	Client.prototype.ready = function(transport) {

		this.transport = transport;

		var self = this;

		transport.addEventListener('message', function(data) {
			self.onMessage(data);
		});

		transport.addEventListener('close', function() {
			self.onClose();
		});

		if (this.transport.readyState !== 1) {
			transport.addEventListener('open', function() {
				self.flush();
			})
		} else {
			this.flush();
		}
	};

	Client.prototype.flush = function() {
		var message;
		while (message = this.offline.pop()) {
			message[message.type]['userId'] = this.userId;
			var payload = JSON.stringify(message);
			this.transport.send(payload);
		}
	};

	Client.prototype.send = function(data) {
		if (this.transport == null ||
			this.transport.readyState !== 1) {
			this.offline.push(data);
		} else {
			data[data.type]['userId'] = this.userId;
			var payload = JSON.stringify(data);
			this.transport.send(payload);
		}
	};

	Client.prototype.increment = function(id, count, extra) {

		if (_typeof(count, "object")) {
			extra = count;
			count = null;
		}
		count = parseInt(count) || 1;

		this.send({'type':'Increment', 'Increment':{
			'id':    id,
			'count': count,
			'extra': extra || {}
		}});
		return this;
	};

	Client.prototype.set = function(global, value) {
		this.send({
			'type':'Set', 'Set':{
				'id':    global,
				'value': value
			}
		});
		return this;
	};

	Client.prototype.unlock = function() {
		throw new Error('Not implemented yet');
	};

	Client.prototype.pause = function() {
		throw new Error('Not implemented yet');
	};

	Client.prototype.resume = function() {
		throw new Error('Not implemented yet');
	};

	Client.prototype.list = function(query, fields, callback, ctx) {
		throw new Error('Not implemented yet');
	};

	Client.prototype.onMessage = function(raw) {
		var data = JSON.parse(raw.data);
		this.emit('achivement', data);
	};

	Client.prototype.onClose = function() {
		this.emit('close');
	};

	Client.prototype.on = function(event, listener) {
		var event_listeners = this.listeners[event];
		if (event_listeners == null) {
			this.listeners[event] = [listener];
		} else {
			event_listeners.push(listener);
		}
	};

	Client.prototype.emit = function(event, a1) {
		var event_listeners = this.listeners[event];
		if (event_listeners != null && event_listeners.length > 0) {
			for (var i=0, l=event_listeners.length; i<l; i++) {
				var listener = event_listeners[i];
				listener(a1);
			}
		}
	};

	function createTransport () {
		return new SockJS(gf.serverUrl());
	}

	var gf = {};

	gf.connect = function(userId) {

		var client = new Client(userId);

		if (transport == null) {
			onLibraryReady.push(function() {
				client.ready(transport);
			});
		} else {
			client.ready(transport);
		}

		var ctor;
		(ctor = function(){}).prototype = client;

		return new ctor;
	}

	gf.serverUrl = function(){

		var defaultUrl = 'http://gf-ws-frontend.herokuapp.com/ws';

		return options.serverUrl || defaultUrl;
	};

	window['gf'] = gf;

})(window, document, window.SockJS, window.gf);