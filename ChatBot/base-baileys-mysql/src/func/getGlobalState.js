const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', 'state.json');

function obtenerEstadoGlobal(callback) {
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            callback(err);
          } else {
            try {
              const estado = JSON.parse(data); // Convertir el JSON en un objeto JavaScript
              const GLOBAL = estado.GLOBAL; // Recuperar el valor de la variable GLOBAL
              callback(null, GLOBAL);
            } catch (parseError) {
              callback(parseError);
            }
          }
        });
      } else {
        callback(new Error(`El archivo state.json no existe en la ruta especificada. ${filePath}`));
      }
}

module.exports = obtenerEstadoGlobal;
