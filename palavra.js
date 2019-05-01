const palavras = [
  'casa',
  'árvore',
  'sol',
  'faca',
  'avião'
]

const randomInt = (a, b) => Math.floor(Math.random() * b) + a

module.exports = () => {
  return palavras[randomInt(0, palavras.length)]
}