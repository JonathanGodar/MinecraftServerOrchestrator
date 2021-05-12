const io = require('socket.io-client');

const socket = io('http://127.0.0.1:3019', { transports: ['websocket'] });

socket.on('connect', () => {
  console.log('connected!');
});

// socket.on('hello', (data) => {
//   console.log(data);
// });

socket.onAny((evtName, ...dta) => {
    console.log(evtName);
    console.log(dta);

});
