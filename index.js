process.title = 'james-dashbut';

process.on('uncaughtException', function (e) {
	console.log('Uncaught Exception...');
	console.log(e.stack);
	process.exit(99);
});

var net = require('net'),
		request = require('request');

var client = new net.Socket();

var sendToLcn = function (command) {
	client.connect(4224, 'domiq.localdomain', function () {
		console.log('Connected');
		client.write(command + '\n');
		client.destroy();
	});
};

var dashConfig = {
	buttons: {
		"50:f5:da:15:19:c9": {
			name: "playdoh",
			lcn: "LCN.sendkey.0.12.B8=hit" // Steckdosen aussen
		},
		"50:f5:da:9d:31:f4": {
			name: "power point" // leer
		},
		"88:71:e5:5d:9e:7e": {
			name: "nerf",
			lcn: "LCN.sendkey.0.70.A2=hit" // Buero Steckdose
		},
		"50:f5:da:80:ce:d8": {
			name: "barbantia"
		},
		"ac:63:be:1a:1e:f7": {
			name: "somat/ohne"
		},
		"ac:63:be:6b:4f:41": {
			name: "nobo",
			lcn: "LCN.sendkey.0.50.A1=hit" // Garage
		},
		"ac:63:be:e0:5c:12": {
			name: "dreamies",
			lcn: "LCN.relay.0.13.7=toggle" // Bad OG Licht/Std
		},
		"50:f5:da:d3:b0:ac": {
			name: "eukanuba"
		},
		"f0:27:2d:c1:55:1d": {
			name: "bio zentrale",
			lcn: "LCN.sendkey.0.50.A1=hit" // Garage
		},
		"b4:7c:9c:9f:2c:3f": {
			name: "durex"
		},
		"ac:63:be:03:2e:9a": {
			name: "rexel",
			lcn: "LCN.sendkey.0.63.A1=hit" // Licht Terrasse
		},
		"78:e1:03:5e:82:54": {
			name: "nescafe",
			http: "http://sonoff-silvia.localdomain/cm?cmnd=Power1%20toggle" // Silvia
		}
	}
};

var sendSlackMessage = function (message) {
	var options = {
		uri: 'https://hooks.slack.com/services/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',
		method: 'POST',
		json: {
			"text": message
		}
	};
	request(options, function (error, response, body) {
		if (error) {
			console.log('Error! (sendMessage/request)', error);
		}
	});
};

var sendHttpRequest = function (url) {
	var options = {
		uri: url,
		method: 'GET'
	};
	request(options, function (error, response, body) {
		if (error) {
			console.log('Error! (sendHttpRequest/request)', error);
		}
	});

};

var dash_button = require('node-dash-button');

sendSlackMessage(Object.keys(dashConfig.buttons).join(', '));
var dash = dash_button(Object.keys(dashConfig.buttons), null, null, "all");

var silent = {};
dash.on("detected", function (id) {
	console.log('detected ' + id);
	if (dashConfig.buttons.hasOwnProperty(id)) {
		var button = dashConfig.buttons[id];
		if (button && (!silent.hasOwnProperty(id) || !silent[id])) {
			silent[id] = true;
			setTimeout(function () {
				silent[id] = false;
			}, 7000);

			if (button.name) {
				console.log(button.name);
				sendSlackMessage('Dashbutton: ' + button.name + ' (' + id + ')');
			}

			if (button.lcn && button.lcn !== "") {
				sendToLcn(button.lcn);
			}
			if (button.http && button.http !== "") {
				sendHttpRequest(button.http);
			}
		}
	}
});
