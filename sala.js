const Usuario        = require('./usuario');
const sortearPalavra = require('./palavra');

class Sala {

  /**
   * @param {number} id 
   * @param {string} nome 
   */
  constructor(id, nome) {
    /** @type {number} */
    this.id = id;

    /** @type {string} */
    this.nome = nome;

    /** @type {Array<Usuario>} */
    this.usuarios = [];

    /** @type {Array<Usuario>} */
    this.usuariosQueAcertaram = [];
    
    /** @type {Usuario} */
    this.usuarioAtual = null;

    /** @type {string} */
    this.palavra = sortearPalavra();

    /** @type {number} */
    this.rodadas = 1;
  }

  /**
   * @param {Usuario} usuario 
   */
  conectarUsuario(usuario) {
    // limite de 8 usuários
    if (this.usuarios.length === 8)
      return false;
    
    if (this.usuarios.length === 0)
      this.usuarioAtual = usuario;

    this.usuarios.push(usuario);
    return true;
  }

  /**
   * @param {Usuario} usuario 
   * @param {(usuario: Usuario) => void} onUsuarioAtualChange
   */
  desconectarUsuario(usuario, onUsuarioAtualChange) {
    this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);

    if (this.usuarioAtual && this.usuarioAtual.id === usuario.id) {
      this.newRound();
      this.usuarioAtual && onUsuarioAtualChange(this.usuarioAtual);
    }
  }

  /**
   * @param {Object} desenho
   * @param {Usuario} usuario 
   */
  setDesenho(desenho, usuario) {
    if (this.usuarioAtual.id === usuario.id)
      this.desenho = desenho;
  }

  /**
   * @param {string} palavra 
   * @param {Usuario} usuario 
   */
  checkPalavra(palavra, usuario) {
    if (this.palavra.toLowerCase() === palavra.toLowerCase()
      && !this.usuariosQueAcertaram.find(u => u.id === usuario.id)) {
      usuario.pontuacao += 10 - this.usuariosQueAcertaram.length;
      this.usuarioAtual.pontuacao += 5;
      this.usuariosQueAcertaram.push(usuario);
      return true;
    }
  }

  reset() {
    this.palavra = '';
    this.desenho = null;
    this.usuarios = [];
    this.usuarioAtual = null;
    this.usuariosQueAcertaram = [];
  }

  newRound() {
    if (this.rodadas === this.usuarios.length) {
      return false;
    } else {
      this.palavra = sortearPalavra();
      const usuario = this.usuarios.shift();
      this.usuarioAtual = this.usuarios[0];
      this.usuarios.push(usuario);
      this.usuariosQueAcertaram = [];
      this.rodadas++;
      this.desenho = null;
      return true;
    }
  }

}

module.exports = Sala;