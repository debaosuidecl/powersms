import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:7000');
function subscribeToTimer(cb) {
  socket.on('start', timestamp => cb(null, timestamp));
  // socket.emit('subscribeToTimer', 1000);
}
export { subscribeToTimer };
