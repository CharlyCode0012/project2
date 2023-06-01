const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MySQLAdapter = require("@bot-whatsapp/database/mysql");

const cors = require("cors");
const express = require("express");
const app = express();
const router = require("express").Router();
const bodyParser = require("body-parser");
require("dotenv").config();

const adapterProvider = createProvider(BaileysProvider);


/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = process.env.DB_HOST ?? "localhost";
const MYSQL_DB_USER = process.env.DB_USER;
const MYSQL_DB_PASSWORD = process.env.DB_PASSWORD;
const MYSQL_DB_NAME = process.env.DB_DATABASE;
const MYSQL_DB_PORT = process.env.DB_PORT;

/**
 * Aqui van las funciones para las peticiones del bot
 */

async function sendAnswer(to, answer, question, product){
  const message = `Duda que solicitaste: ${question}\n\n` +
  `Producto: *${product}*\n\n` + `Respuesta: ${answer}`;

    try {
      
      const modProvider = await adapterProvider.getInstance();
      await modProvider.sendMessage(`521${to}@s.whatsapp.net`, { text: message });

    } catch (error) {
      console.log(error);
      return error;
    }
}

 //TO DO validate that the date_order withthe folio not exists
  /**TO DO remove the numbers 521 from sendMessage, because the ctx of addAnswer contains a property
   * named 'from' that contains the cellphone number the client in the form:S '521XXXXXXXXXX'.
  */

async function sendConfirmDate(to, text, folio){
  const message = `${text}\n` +
  `El folio es: *${folio}*\n\n` + 
  `Para ver sus productos mande *folio*\n`+ 
  `Para agendar una fecha de entrega envíe *agendar*`;

    try {
      
      const modProvider = await adapterProvider.getInstance();
      await modProvider.sendMessage(`521${to}@s.whatsapp.net`, { text: message });

    } catch (error) {
      console.log(error);
      return error;
    }
}



/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */
const flowScheduleDate = addKeyword(["Agendar", "Agendar fecha", "Agenda"]).addAnswer(
  [
    "Ingrese una fecha en el formato",
    "*AAAA-MM-DD*\n",
    "Ingrese la fecha:"
  ],
  {capture: true},
  (ctx, {flowDynamic}) =>{
    console.log(ctx);
  }
);


const flowCatalogos = addKeyword(["1", "Catalogo"]).addAnswer([
  "Esoty obteniendo el cataloog, por favor espere...",
]);

const flowSecundario = addKeyword(["2", "Contactar", "humano"]).addAnswer([
  "Estamos contactando con alguien",
]);

/* const flowButton =  addKeyword(['4', 'Botones']).addAnswer('Este mensaje envia tres botones', {
    buttons: [{ body: 'Boton 1' }, { body: 'Boton 2' }, { body: 'Boton 3' }],
});
 */
const flowDocs = addKeyword(["3", "documentacion", "doc"]).addAnswer(
  [
    "📄 Aquí encontras las documentación: ",
    "https://bot-whatsapp.netlify.app/",
  ],
  null,
  null,
  [flowSecundario]
);

const flowGracias = addKeyword(["gracias", "grac"]).addAnswer([
  "Muchas gracias por tu preferencia",
  "Tenga un excelente día",
]);

const flowPrincipal = addKeyword(["hola", "ole", "alo"])
  ./* `addAnswer` is a method used to add a response to a specific keyword or set of keywords in a
  chatbot flow. It takes in an array of strings as the response message and can also include
  additional parameters such as buttons or child flows. */
  addAnswer([
    "Hola buenas tardes, este es un bot de una tienda",
    "¿En que puedo ayudarte?",
  ])
  .addAnswer(
    ["*1* Catalogo", "*2* Contactar con un humano", "*3* Documentacion"],
    null,
    null,
    [flowCatalogos, flowSecundario, flowDocs]
  );

const main = async () => {
  const adapterDB = new MySQLAdapter({
    host: MYSQL_DB_HOST,
    user: MYSQL_DB_USER,
    database: MYSQL_DB_NAME,
    password: MYSQL_DB_PASSWORD,
    port: MYSQL_DB_PORT,
  });

  const adapterFlow = createFlow([flowPrincipal, flowScheduleDate]);
 

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();

  router.post("/sendAnswer", async (req, res) => {
    const { question,answer, to, product } = req.body;
    try {
      
      await sendAnswer(to, answer, question, product);
      res.status(220).send("Se envio mensaje");
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  });

  router.post("/sendConfirmDate", async (req, res) => {
    const { folio, message, to} = req.body;
    try {
      
      await sendConfirmDate(to, message, folio);
      res.status(220).send("Se envio mensaje");
    } catch (error) {
      res.send(error);
      console.log(error);
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
};

main();


