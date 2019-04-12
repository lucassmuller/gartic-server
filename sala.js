class Sala {

  constructor(id, nome) {
    this.id = id;
    this.nome = nome;
    this.usuarios = [];
  }

  conectarUsuario(usuario) {
    if (this.usuarios.length === 0)
      this.usuarioAtual = usuario;

    this.usuarios.push(usuario);
  }

  desconectarUsuario(usuario) {
    this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);

    if (this.usuarioAtual.id = usuario.id)
      this.usuarioAtual = this.usuarios[0];
  }

  setDesenho(desenho, usuario) {
    if (this.usuarioAtual.id == usuario.id)
      this.desenho = desenho;
  }

}

module.exports = Sala;