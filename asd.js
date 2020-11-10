


  client.on('error', function(e) {
    if(e.code == 'ECONNREFUSED') {
        console.log('Is the server running at ' + PORT + '?');

        client.setTimeout(4000, function() {
            client.connect(PORT, HOST, function(){
                console.log('CONNECTED TO: ' + HOST + ':' + PORT);
                client.write('I am the inner superman');
            });
        });

        console.log('Timeout for 5 seconds before trying port:' + PORT + ' again');

    }   
});

function connect() {
    var ws = new WebSocket('ws://localhost:8080');
    ws.onopen = function() {
      // subscribe to some channels
      ws.send(JSON.stringify({
          //.... some message the I must send when I connect ....
      }));
    };
  
    ws.onmessage = function(e) {
      console.log('Message:', e.data);
    };
  
    ws.onclose = function(e) {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(function() {
        connect();
      }, 1000);
    };
  
    ws.onerror = function(err) {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      ws.close();
    };
  }
  
  connect();








  client.on('close', function(e) {
    client.setTimeout(10000, function() {
        // client.connect(HOST_PORT, HOST_IP);
        console.log("Client on close......")
    })
});



