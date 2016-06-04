'use strict';
// modulo para abstrair o log. No futuro caso deseje armazenar o log em um arquivo sobreescreveria os metodos daqui e GG.
module.exports = {
  write : console.log,
  error : console.error
}
