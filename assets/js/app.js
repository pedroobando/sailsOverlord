
  //var socket = io.connect();
  if (typeof console !== 'undefined') {
    console.log('=> Conection to Sails.js....');
  }

  io.socket.on('connect', function socketConnected() {

    io.socket.on('message', function messageRecived(message) {
      console.log('New coment message recived:: ', message);
    });

    io.socket.get('/user/subscribe');

    console.log(
      'Socket ...... \n'+
      '............. \n'
    );

  });

