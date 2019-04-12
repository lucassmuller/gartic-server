const app     = require('express')();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);

const Sala    = require('./sala');
const Usuario = require('./usuario');

server.listen(8080, () => console.log('server started'));

const sala = new Sala(1, 'Sem tempo irmão');

io.on('connection', (socket) => {
  console.log(socket.id, 'connected!')

  const usuario = new Usuario(socket.id, 'Luis');

  sala.conectarUsuario(usuario);

  const getDraw = () => ({
    draw: sala.desenho,
    canDraw: usuario.id === sala.usuarioAtual.id
  });

  socket.emit('draw', getDraw());

  socket.on('draw', ({ drawUpdate }) => {
    sala.setDesenho(drawUpdate, usuario);

    // sala.usuarios.forEach(u => {
    //     if(u.id != sala.usuarioAtual.id)
    //       //TODO
    // });

    socket.broadcast.emit('draw', getDraw());
  });

  socket.on('disconnect', () => sala.desconectarUsuario(usuario));
});