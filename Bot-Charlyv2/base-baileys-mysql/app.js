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
const router = require("express").Router();
const bodyParser = require("body-parser");

const app = express();
require("dotenv").config();

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = process.env.DB_HOST ?? "localhost";
const MYSQL_DB_USER = process.env.DB_USER;
const MYSQL_DB_PASSWORD = process.env.DB_PASSWORD;
const MYSQL_DB_NAME = process.env.DB_DATABASE;
const MYSQL_DB_PORT = process.env.DB_PORT;

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

  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();

  router.post("/send", async (req, res) => {
    const { answer, to, product } = req.body ?? "Hola";
    console.log("answer: ", answer, "Cliente:", to);
    const message = ` Respuesta a la duda que solicitaste\n *${product}:* ${answer}`;

    if (typeof answer !== 'string') {
      answer = answer.toString();
    }

    try {
      
      const modProvider = await adapterProvider.getInstance();
      await modProvider.sendMessage(`521${to}@s.whatsapp.net`, { text: message });
      res.status(220).send("Se envio mensaje");
      console.log("sen envio");
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  });

  app.use(cors({ origin: "*" }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(router);

  //Router logger, remove later
  app.use((req, res, next) => {
    console.log("\x1b[33m%s\x1b[0m", `=> ${req.url}`);
    next();
  });

  app.listen(process.env.PORT, () => {
    console.log("=========================");
    console.log("Listening on port: " + process.env.PORT);
    console.log("Server is running! 😎");
    console.log("=========================\n");
  });
};

main();

