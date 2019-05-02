const app     = require('express')();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);

const Sala    = require('./sala');
const Usuario = require('./usuario');

server.listen(process.env.PORT || 8080, () => console.log('server started'));

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
    io.sockets.emit('room:users', sala.usuarios);

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
        if (sala.usuarios.length - 1 === sala.usuariosQueAcertaram.length) {
          socket.to(sala.usuarioAtual.id).emit('draw:word', {palavra: null});

          if (sala.newRound()) {
            io.sockets.emit('draw', getDraw());

            if (usuario.id === sala.usuarioAtual.id)
              socket.emit('draw:word', {palavra: sala.palavra});
            else
              socket.broadcast.to(sala.usuarioAtual.id).emit('draw:word', {palavra: sala.palavra});
          } else {
            io.sockets.emit('room:end', sala.usuarios);
          }
        }

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