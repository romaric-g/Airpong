import { io } from 'socket.io-client';

// https://airpong.herokuapp.com/
// http://localhost:4000
const socket = io('https://airpong.herokuapp.com/');

socket.emit('play')
socket.on('reverseplay', () => {
  console.log('reverseplay')
})


export default socket;
