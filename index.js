process.title = 'james-dashbutton';

var net = require('net');

var client = new net.Socket();

var sendToLcn = function(command) {
  	client.connect(4224, '192.168.50.50', function() {
      		console.log('Connected');
      		client.write(command + '\n');
      		client.destroy();
  	});
};

var dash_button = require('node-dash-button');
var dash = dash_button(["50:f5:da:15:19:c9", "50:f5:da:9d:31:f4", "ac:63:be:1a:1e:f7", "88:71:e5:5d:9e:7e"], null, null, "all");
dash.on("detected", function (id){

  if (id == "50:f5:da:15:19:c9") {
  	console.log("playdoh");
	sendToLcn('LCN.sendkey.0.12.B8=hit');
  }

  if (id == "50:f5:da:9d:31:f4") {
  	console.log("power point");
	sendToLcn('LCN.sendkey.0.60.A2=hit');
  }

  if (id == "88:71:e5:5d:9e:7e") {
  	console.log("nerf");
	sendToLcn('LCN.sendkey.0.70.A2=hit');
  }

  if (id == "ac:63:be:1a:1e:f7") {
  	console.log("white");
	sendToLcn('LCN.sendkey.0.50.A1=hit');
  }
});
