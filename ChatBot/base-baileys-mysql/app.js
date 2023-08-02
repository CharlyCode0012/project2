const {
  createBot,
  createFlow,
  addKeyword,
  addAnswer,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const MySQLAdapter = require("@bot-whatsapp/database/mysql");
const { adapterProvider } = require("./src/flows/adapterProvider");
const fs = require('fs');

const express = require("express");
const app = express();
const router = require("express").Router();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const io = require("socket.io-client");
const async = require("async");
require("dotenv").config();

const { scheduleDateFlow } = require("./src/flows/scheduleDateFlow.js");
const { menuPago } = require("./src/flows/menuPagoFlow");
const { getFlows } = require("./src/func/makeFlows.js");
const { createPrincipalFlow } = require("./src/flows/principalFlow");
const { helperFlow } = require("./src/flows/helperFlow");
const { menuProducts } = require("./src/flows/menuProductsFlow");
const { payFlow } = require("./src/flows/payFlow");
const { showProductsFlow } = require("./src/flows/showProductsFlow");



/**
 * creamos el adapterProvider
 */

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = process.env.DB_HOST ?? "localhost";
const MYSQL_DB_USER = process.env.DB_USER;
const MYSQL_DB_PASSWORD = process.env.DB_PASSWORD;
const MYSQL_DB_NAME = process.env.DB_DATABASE;
const MYSQL_DB_PORT = process.env.DB_PORT;

/**
 * Aqui van las variables que usaré en el sistema
 */
//variables from the dataBase or relationated with it.
let flows = [];

let isFirstRun = false;
let GLOBAL = false

/**
  function to do some proceadure
*/

function saveStateOnFile() {
  const estado = { GLOBAL }; // Crear un objeto con la variable GLOBAL
  const data = JSON.stringify(estado, null, 2); // Convertir el objeto a formato JSON con formato legible (indentación de 2 espacios)

  fs.writeFile('state.json', data, (err) => {
    if (err) {
      console.error('Error al guardar el estado en el archivo:', err);
    } else {
      console.log('Estado guardado en el archivo correctamente.');
    }
  });
}


/**
 * functions to send some information to the cient.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendOrderFailed(to, folio, products) {
  let valTo = to.substring(0, 3);

  if (valTo == "521") {
    valTo = to;
  } else {
    valTo = `521${to}`;
  }

  const messages = [
    `Su pedido con el folio: *${folio}* no se comprobó su pago\n\nLos productos de ese pedido eran`,
  ];

  products?.map((product, index) => {
    const mess = `*Nombre:* ${product.name}\n *Cantidad:* ${product.quantity}`;
    messages.push(mess);
  });

  try {
    const modProvider = await adapterProvider.getInstance();
    const delayBetweenMessages = 2000; //2 seg de delay
    const fullMessage = messages.join('\n\n'); // Unir todos los mensajes en uno solo

      await delay(delayBetweenMessages);
      await modProvider.sendMessage(`${valTo}@s.whatsapp.net`, {
        text: fullMessage,
      });
    
  } catch (error) {
    console.log(error);
    return error;
  }
}
async function sendAnswer(to, answer, question, product) {
  let valTo = to.substring(0, 3);

  if (valTo == "521") {
    valTo = to;
  } else {
    valTo = `521${to}`;
  }

  const message =
    `Duda que solicitaste: ${question}\n\n` +
    `Producto: *${product}*\n\n` +
    `Respuesta: ${answer}`;

  try {
    const modProvider = await adapterProvider.getInstance();
    await modProvider.sendMessage(`${valTo}@s.whatsapp.net`, { text: message });
  } catch (error) {
    console.log(error);
    return error;
  }
}

//TO DO validate that the date_order withthe folio not exists
/**TO DO remove the numbers 521 from sendMessage, because the ctx of addAnswer contains a property
 * named 'from' that contains the cellphone number the client in the form:S '521XXXXXXXXXX'.
 */

async function sendConfirmDate(to, text, folio) {
  let valTo = to.substring(0, 3);

  if (valTo == "521") {
    valTo = to;
  } else {
    valTo = `521${to}`;
  }

  const message =
    `${text}\n` +
    `El folio es: *${folio}*\n\n` +
    `Para ver sus productos mande *folio*\n` +
    `Para agendar una fecha de entrega envíe *agendar*`;

  try {
    const modProvider = await adapterProvider.getInstance();
    await modProvider.sendMessage(`${valTo}@s.whatsapp.net`, { text: message });
  } catch (error) {
    console.log(error);
    return error;
  }
}

/**
 * Socket-client and routes
 */

// URL del servidor WebSocket
const socketURL = "http://localhost:3200"; // Reemplaza con la URL de tu servidor WebSocket

// Conectar al servidor WebSocket
const socket = io(socketURL);

// Escuchar eventos desde el servidor
socket.on("connect", () => {
  console.log("Conectado al servidor WebSocket");
});

socket.on("menu_updated_event", async () => {
  console.log("Evento de actualización de menú recibido desde el servidor");
  //main();
  flows = await getFlows();

  flows.map((flow, index) => {
    console.log("Keyword: ", flow.ctx.keyword);
    console.log("addAnswer: ", flow.ctx.answer);
  });

  //console.log(flows);
  flows.push(menuPago);
  flows.push(helperFlow);
  flows.push(payFlow);

  const principalFlow = await createPrincipalFlow(flows);

  const adapterFlow = createFlow([
    principalFlow,
    scheduleDateFlow,
    showProductsFlow,
  ]);

  if (bot) {
    bot.then((botInstance) => {
      botInstance.setFlowClass = adapterFlow;
      // Ahora la instancia de CoreClass puede ser eliminada y el recolector de basura liberará la memoria ocupada por ella
    });
  }
  // Realiza las acciones que deseas al recibir el evento de actualización del menú
  // Por ejemplo, actualizar la interfaz de usuario o volver a cargar los datos del menú
});

// Emitir eventos al servidor
socket.emit("menu_updated");

const responseQueue = async.queue(async (task) => {
  try {
    const { data } = task;
    console.log("Evento de order rechazada recibido");
    console.log("Folio del pedido procesado:", data.folio);
    console.log("ID del cliente:", data.to);
    console.log("Productos:", data.products);
    const { to, folio, products } = data;
    await sendOrderFailed(to, folio, products);
  } catch (error) {
    console.error("Error al procesar la respuesta:", error);
  }
}, 1); // 1 indica que solo se procesa un elemento a la vez

socket.on("orderProcessed", (data) => {
  // Agregar la respuesta a la cola para procesarla en orden
  responseQueue.push({ data });
});

// Manejar errores de conexión
socket.on("connect_error", (error) => {
  console.error("Error al conectar al servidor de Socket.IO:", error);
});

// Desconectar del servidor de Socket.IO
socket.on("disconnect", () => {
  console.log("Desconectado del servidor de Socket.IO");
});

router.get("/QR", (req, res) => {
  const imagePath = path.join(__dirname, "bot.qr.png");
  //console.log( imagePath );
  try {
    res.sendFile(imagePath);
  } catch (error) {
    console.error(error);
    res.status(400).send("Error");
  }
});

router.get('/off', (req,res) => {
  GLOBAL = false
  saveStateOnFile();
  res.send('APAGADO')
});

router.get('/on', (req,res) => {
  GLOBAL = true
  saveStateOnFile();
  res.send('PRENDIDO')
});

router.post("/sendAnswer", async (req, res) => {
  const { question, answer, to, product } = req.body;
  try {
    await sendAnswer(to, answer, question, product);
    res.status(220).send("Se envio mensaje");
  } catch (error) {
    res.send(error);
  }
});

router.post("/sendConfirmDate", async (req, res) => {
  const { folio, message, to } = req.body;

  try {
    await sendConfirmDate(to, message, folio);
    res.status(220).send("Se envio mensaje");
  } catch (error) {
    res.send(error);
  }
});

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Router logger, remove later
app.use((req, res, next) => {
  console.log("\x1b[33m%s\x1b[0m", `=> ${req.url}`);
  next();
});

app.use(router);

app.listen(process.env.PORT, () => {
  console.log("=========================");
  console.log("Listening on port: " + process.env.PORT);
  console.log("Server is running! 😎");
  console.log("=========================\n");
});

async function createInstance() {
  const adapterDB = new MySQLAdapter({
    host: MYSQL_DB_HOST,
    user: MYSQL_DB_USER,
    database: MYSQL_DB_NAME,
    password: MYSQL_DB_PASSWORD,
    port: MYSQL_DB_PORT,
  });

  flows.push(menuPago);
  flows.push(helperFlow);
  flows.push(payFlow);

  const principalFlow = await createPrincipalFlow(flows);
  //console.log("\nprincipal flow: ", principalFlow);

  const adapterFlow = createFlow([
    principalFlow,
    scheduleDateFlow,
    showProductsFlow,
  ]);

  bot = createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
}

async function main() {
  flows = await getFlows();
  flows.map((flow) => {
    console.log("flujo: ", flow);
    //console.log("nested: ", flow.ctx.options.nested)
  });

  if (!isFirstRun) {
    isFirstRun = true;
    createInstance();
    QRPortalWeb();
  }
}

main();

module.exports = { sendConfirmDate };
