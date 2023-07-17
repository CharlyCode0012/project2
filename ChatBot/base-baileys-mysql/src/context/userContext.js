const fs = require("fs");
const path = require("path");

const userContexts = initializeUserContextsFromFiles();

function getUserContext(usuario) {
  if (!userContexts[usuario]) {
    userContexts[usuario] = {};
  }
  return userContexts[usuario];
}

function addUserContext(usuario, context) {
  userContexts[usuario] = context;
}

function initializeContextFromFile(userId) {
  let rutaArchivo = path.join(__dirname, "json", userId);

  if (!rutaArchivo.endsWith(".json")) {
    rutaArchivo += ".json";
  }

  if (fs.existsSync(rutaArchivo)) {
    const contenidoArchivo = fs.readFileSync(rutaArchivo, "utf-8");
    const contexto = JSON.parse(contenidoArchivo);

    return contexto;
  }

  return {};
}

// Función para inicializar el objeto userContexts con la información de todos los archivos
function initializeUserContextsFromFiles() {
  const directorioArchivos = __dirname + "/json"; // Directorio actual, ajusta esto según tu estructura de carpetas
  const userContexts = {};

  // Leer todos los archivos en el directorio
  const archivos = fs.readdirSync(directorioArchivos);

  // Iterar sobre los archivos y cargar su contenido en userContexts
  archivos.forEach((archivo) => {
    const extension = path.extname(archivo);
    if (extension === ".json") {
      const usuario = path.basename(archivo, extension);
      const nombreArchivo = path.join(directorioArchivos, archivo);
      const contexto = initializeContextFromFile(nombreArchivo);
      userContexts[usuario] = contexto;
    }
  });

  // Verificar si no se encontraron archivos
  if (archivos.length === 0) {
    console.log(
      "No se encontraron archivos de contexto en el directorio especificado."
    );
  }

  return userContexts;
}

function saveContextOnFile(userId, userContext) {
  const directorioArchivos = path.join(__dirname, "json");
  const rutaArchivo = path.join(directorioArchivos, `${userId}.json`);

  // Obtener el contexto existente desde el archivo
  let contextoExistente = {};
  if (fs.existsSync(rutaArchivo)) {
    const contenidoArchivo = fs.readFileSync(rutaArchivo, "utf-8");
    contextoExistente = JSON.parse(contenidoArchivo);
  }

  // Fusionar el contexto existente con el nuevo contexto
  const contextoActualizado = { ...contextoExistente, ...userContext };

  // Guardar el contexto actualizado en el archivo
  const contextoJSON = JSON.stringify(contextoActualizado, null, 4);
  fs.writeFileSync(rutaArchivo, contextoJSON);
}

function updateContextOnFile(userId, userContext) {
  const directorioArchivos = path.join(__dirname, "json");
  const rutaArchivo = path.join(directorioArchivos, `${userId}.json`);

  // Verificar si el archivo existe
  if (!fs.existsSync(rutaArchivo)) {
    // Si el archivo no existe, se crea un nuevo archivo con el contexto actualizado
    saveContextOnFile(userId, userContext);
    return;
  }

  // Obtener el contexto existente desde el archivo
  const contenidoArchivo = fs.readFileSync(rutaArchivo, "utf-8");
  const contextoExistente = JSON.parse(contenidoArchivo);

  // Fusionar el contexto existente con el nuevo contexto
  const contextoActualizado = { ...contextoExistente, ...userContext };
  console.log("Actualizado: ", contextoActualizado);

  // Guardar el contexto actualizado en el archivo
  const contextoJSON = JSON.stringify(contextoActualizado, null, 4);
  console.log("JSON: ", contextoJSON);
  fs.writeFileSync(rutaArchivo, contextoJSON);
}

function removeProductFromCartInContextAndFile(userId, productId, userContext) {
  // Verificar si el usuario tiene un contexto
  if (!userContext) {
    console.log("El usuario no tiene un contexto.");
    return;
  }

  // Verificar si el usuario tiene un carrito
  if (!userContext.cart) {
    console.log("El usuario no tiene un carrito.");
    return;
  }

  // Obtener el carrito del usuario
  const cart = userContext.cart;

  // Buscar el índice del producto en el carrito
  const indiceProducto = cart.products.findIndex(
    (prod) => prod.id === productId
  );

  // Verificar si se encontró el producto
  if (indiceProducto === -1) {
    console.log("El producto no existe en el carrito.");
    return;
  }

  // Eliminar el producto del carrito
  const productoEliminado = cart.products.splice(indiceProducto, 1)[0];

  // Restar el precio del producto eliminado del precio total del carrito
  cart.totalPrice -= productoEliminado.price * productoEliminado.quantity;

  // Guardar el contexto actualizado en el archivo
  updateContextOnFile(userId, userContext);

  console.log(
    "Producto eliminado del carrito en el contexto y actualizado en el archivo:",
    productoEliminado
  );
}

function removeElementFromContext(userId, userContext, elementoKey) {
  // Verificar si el usuario tiene un contexto
  if (!userContext) {
    console.log("El usuario no tiene un contexto.");
    return;
  }

  // Verificar si la propiedad existe en el contexto
  if (!userContext.hasOwnProperty(elementoKey)) {
    console.log("La propiedad no existe en el contexto.");
    return;
  }

  // Eliminar la propiedad del contexto
  userContext[elementoKey] = {};
  console.log("after delete: ", userContext);

  // Guardar el contexto actualizado en el archivo
  updateContextOnFile(userId, userContext);

  console.log(
    `Propiedad "${elementoKey}" eliminada del contexto del usuario y actualizada en el archivo.`
  );
}

function createFolio() {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let folio = "";

  for (let i = 0; i < 10; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    folio += caracteres[indice];
  }

  return folio;
}

function addFolioToContext(userId, userContext) {

  // Verificar si el usuario tiene un contexto
  if (!userContext) {
    console.log("El usuario no tiene un contexto.");
    return;
  }

  // Generar el folio
  const folio = createFolio();

  // Agregar el folio al contexto
  userContext.folio = folio;

  // Guardar el contexto actualizado en el archivo
  updateContextOnFile(userId, userContext);

  console.log(
    `Folio "${folio}" agregado al contexto del usuario y actualizado en el archivo.`
  );
}

module.exports = {
  getUserContext,
  addUserContext,
  saveContextOnFile,
  initializeContextFromFile,
  updateContextOnFile,
  initializeUserContextsFromFiles,
  removeProductFromCartInContextAndFile,
  removeElementFromContext,
  addFolioToContext,
};
