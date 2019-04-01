var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080, () => console.log('server started'));

let draw, userDrawing;
io.on('connection', (socket) => {
  console.log(socket.id, 'connected!')

  if(!userDrawing) 
    userDrawing = socket.id;

  const getDraw = () => ({ draw, canDraw: socket.id === userDrawing });
  socket.emit('draw', getDraw());

  socket.on('draw', ({ drawUpdate }) => {
    // if(socket.id === userDrawing) {
      draw = drawUpdate;
      socket.broadcast.emit('draw', getDraw());
    // }
  });

  socket.on('disconnect', () => { 
    if(socket.id === userDrawing)
      userDrawing = null;
  });
});