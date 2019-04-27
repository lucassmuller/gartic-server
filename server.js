const app     = require('express')();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);

const Sala    = require('./sala');
const Usuario = require('./usuario');

server.listen(8080, () => console.log('server started'));

const sala = new Sala(1, 'Sem tempo irmão');

io.on('connection', (socket) => {
  /** @type {Usuario} */
  let usuario;

  socket.on('user:join', ({ name }) => {
    usuario = new Usuario(socket.id, name);
    
    if (!sala.conectarUsuario(usuario))
      return;
    
    console.log(usuario.nome, 'connected!');
    socket.emit('user:connected', usuario);
    socket.emit('room:users', sala.usuarios);

    const getDraw = () => ({
      draw: sala.desenho,
      canDraw: sala.usuarioAtual
    });

    if (sala.usuarioAtual.id === usuario.id) {
      socket.emit('draw:word', {palavra: sala.palavra});
    }
  
    socket.emit('draw', getDraw());
    socket.on('draw', ({ drawUpdate }) => {
      sala.setDesenho(drawUpdate, usuario);
  
      socket.broadcast.emit('draw', getDraw());
    });

    socket.on('draw:opinion', ({ opinion }) => {
      if (sala.checkPalavra(opinion, usuario)) {
        socket.emit('room:users', sala.usuarios);
        socket.broadcast.emit('room:users', sala.usuarios);
      }
    });
  
    socket.on('disconnect', () => {
      console.log(usuario.nome, 'disconnected!');

      sala.desconectarUsuario(usuario, () => {
        socket.broadcast.emit('draw', getDraw());
        socket.broadcast.to(sala.usuarioAtual.id).emit('draw:word', {palavra: sala.palavra});
      });
      
      socket.broadcast.emit('room:users', sala.usuarios);
    });
  });
});