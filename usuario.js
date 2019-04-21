class Usuario {

  /**
   * @param {string} id 
   * @param {string} nome 
   */
  constructor(id, nome) {
    /** @type {string} */
    this.id = id;

    /** @type {string} */
    this.nome = nome;

    /** @type {number} */
    this.pontuacao = 0;
  }
  
}

module.exports = Usuario;