var net = require('net');

var client = new net.Socket();

var dash_button = require('node-dash-button');
var dash = dash_button("ac:63:be:1a:1e:f7", null, null, "all");
dash.on("detected", function (){
  console.log("ding");
  client.connect(4224, '192.168.50.50', function() {
      console.log('Connected');
      client.write('LCN.sendkey.0.70.A2=hit' + '\n');
      client.destroy();
  });
});
