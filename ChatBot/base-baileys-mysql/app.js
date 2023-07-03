const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MySQLAdapter = require("@bot-whatsapp/database/mysql");

const path = require("path");
const fs = require("fs");
const cors = require("cors");
const express = require("express");
const app = express();
const router = require("express").Router();
const bodyParser = require("body-parser");
require("dotenv").config();

const adapterProvider = createProvider(BaileysProvider);

const instance = require('./src/request/instance.js');
const {fetchCatalogs} = require('./src/request/catalog.js');
const {downloadFileProducts} = require('./src/request/products.js');

const regexDate = /^(?:(?:(?:0?[1-9]|1\d|2[0-8])[/](?:0?[1-9]|1[0-2])|(?:29|30)[/](?:0?[13-9]|1[0-2])|31[/](?:0?[13578]|1[02]))[/](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[/]0?2[/](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/;
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

let folio, date_delivery, catalog, clientName, clientNumber;
let cart = [], catalogs = [];




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

async function sendCatalogProducts(to, catalogID){

    try {
        const file = fs.readFileSync('src/Catalog/Productos '+catalogID+'.xlsx');
    
        /* const modProvider = await adapterProvider.getInstance();
        const media = await BaileysProvider.prepareMessageMedia(file, BaileysProvider.MessageType, { mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename: 'Productos '+catalogID+'.xlsx' });
        await modProvider.sendMessage(chatId, media, MessageType.document); */
        const modProvider = await adapterProvider.getInstance();
        await modProvider.sendMessage(`${to}@s.whatsapp.net`, {text: `Ve al enlace para descagargar el catálogo\n*Link:*\n http://localhost:3200/api/products/downloadWithCatalogId?catalogID=${catalogID}`});
        console.log('Archivo enviado correctamente');
    } catch (error) {
        console.error('Error al hacer la petición:', error);
    }
}

async function sendConfirmDate( to, text, folio ){
    const message = `${ text }\n` +
    `El folio es: *${ folio }*\n\n` + 
    `Para ver sus productos mande *folio*\n`+ 
    `Para agendar una fecha de entrega envíe *agendar*`;

    try {
        const modProvider = await adapterProvider.getInstance();
        await modProvider.sendMessage( `521${to}@s.whatsapp.net`, { text: message });

    } catch ( error ) {

        console.log( error );
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




const flowScheduleDate = addKeyword([ "Agendar", "Agendar fecha", "Agenda" ]).addAnswer(
    [
        "Ingrese el folio para agendar cita: ",
    ],  
    { capture: true ,
    delay: 2000},
    async ( ctx, { fallBack, flowDynamic }) => {

        const getFolio = async () => {
        try {

            const isFolio = await instance.get( '/deliveries/searchByFolio', { params: { search: ctx.body }});
            if( isFolio )
                folio = ctx.body;
            else
                return fallBack();

        } catch ( error ) {

            console.error( error );

        }
    }

    await flowDynamic( getFolio() );
    }
).addAnswer([ "Ingrese la fecha en formato *DD/MM/AAAA*:" ],
    { 
        capture: true,
        delay: 2000 
    },
    async (ctx, { fallBack, flowDynamic }) => {

        date_delivery = ctx.body;
        if( !regexDate.test( date_delivery ))
            return fallBack();

    try {

        await instance.put( `/deliveries/folio/${ folio }`, { date_delivery });

    } catch ( error ) {

        console.error( error );

    }
});

const flowCatalogos = addKeyword([ "1", "Catalogo" ]).addAnswer(
    [
        "Estoy obteniendo los catálogos"
    ],
    {delay: 2000},
    async ( ctx, { flowDynamic }) => {
        try {
            catalogs = await fetchCatalogs();
            console.log(catalogs);
            await flowDynamic(catalogs); 
        } catch (error) {
            console.log(error);
        }
    } 
).addAnswer(
    "Ingrese un catalogo de acuerdo al numero",
    {
        capture: true,
        delay: 1000,
    },
    async (ctx, { fallBack, flowDynamic }) => {

        try {
            let indexCatalog = ctx.body;
            clientNumber = ctx.from;
            console.log(clientNumber);

            if(isNaN(indexCatalog)){
                return fallBack();
            }

            indexCatalog -= 1;
            catalog = catalogs[indexCatalog];
            console.log(catalog);

            //await downloadFileProducts(catalog?.id);
            //await sendCatalogProducts(clientNumber, catalog?.id);
            await sendCatalogProducts(clientNumber, catalog?.id);

        } catch (error) {
            console.error(error);
        }
    }
);

const flowCart = addKeyword([ "cart", "carrito", "carro", "comprar" ]).addAnswer(
    [
        "Para poder obtener la información de un producto ingrese la palabra clave de este",
        "La palabra clave la puedes encontrar en el catalogo",
        "\n*1* Catalogo",
        "*2* Ingresar un producto"
    ],
    { 
        capture: true, 
        delay: 2000,
    }, 
    async ( ctx, { fallBack, flowDynamic }) => {
        const option = ctx.body;
        if(option !== 1 || option !== 2)
            return fallBack();
    },
    [ flowCatalogos ]
    ).addAnswer(
    [
        "Ingresa una palabra clave: "
    ],
    { 
        capture: true,
        delay: 700,
    },
    async ( ctx, { fallBack, flowDynamic }) => {
        try {
            const keyWord = ctx.body;
            const product = instance.get('/products/searchBykeyWord', {params: {search: keyWord}});
            if(!product){
                await flowDynamic("No se encontró un producto con esa palabra clave");
                return fallBack();
            }
            const message = {
                body: `
                ${product.product_name} 
                \nDescripción: ${product.description} 
                \nPrecio: ${product.price}
                \nExistencia: ${product.stock}`,
                media: `http://127.0.0.1:3200/api/images/${product.id}`
            }
            await flowDynamic(message);
        } catch (error) {
            
        }
    },
); 




const flowSecundario = addKeyword([ "2", "Contactar", "humano" ]).addAnswer([
    "Estamos contactando con alguien",
]);

/* const flowButton =  addKeyword(['4', 'Botones']).addAnswer('Este mensaje envia tres botones', {
    buttons: [{ body: 'Boton 1' }, { body: 'Boton 2' }, { body: 'Boton 3' }],
});
 */
const flowDocs = addKeyword([ "3", "documentacion", "doc" ]).addAnswer(
    [
        "📄 Aquí encontras las documentación: ",
        "https://bot-whatsapp.netlify.app/",
    ],
    null,
    null,
    [flowSecundario]
);

const flowGracias = addKeyword([ "gracias", "grac" ]).addAnswer(
    [
        "Muchas gracias por tu preferencia",
        "Tenga un excelente día",
    ]
);

const flowPrincipal = addKeyword([ "hola", "ole", "alo", "inicio" ]).
    /* `addAnswer` is a method used to add a response to a specific keyword or set of keywords in a
    chatbot flow. It takes in an array of strings as the response message and can also include
    additional parameters such as buttons or child flows. */
addAnswer([
    "Hola buenas tardes, este es un bot de una tienda",
    "¿En que puedo ayudarte?",
],
{
    delay: 500,
})
.addAnswer(
    [ "*1* Catalogo", "*2* Contactar con un humano", "*3* Documentacion" ],
    {delay: 500},
    null,
    [flowCatalogos, flowSecundario, flowDocs, flowCart]
);

const main = async () => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT,
    });

    const adapterFlow = createFlow([ flowPrincipal, flowScheduleDate, flowCart ]);


    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();


    router.get( "/QR", ( req, res ) => {

        const imagePath = path.join( __dirname, "bot.qr.png" );
        //console.log( imagePath );

        try {

            res.sendFile( imagePath );

        } catch ( error ) {

            console.error( error );
            res.status( 400 ).send( "Error" );

        }
    });


    router.post( "/sendAnswer", async ( req, res ) => {
        const { question,answer, to, product } = req.body;
        try {

            await sendAnswer( to, answer, question, product );
            res.status( 220 ).send( "Se envio mensaje" );

        } catch ( error ) {

            res.send( error );

        }
    });

    router.post( "/sendConfirmDate", async ( req, res ) => {
        const { folio, message, to } = req.body;

        try {

            await sendConfirmDate( to, message, folio );
            res.status( 220 ).send( "Se envio mensaje" );

        } catch ( error ) {

            res.send( error );

        }
    });

    app.use( cors({ origin: "*" }));
    app.use( bodyParser.json());
    app.use( bodyParser.urlencoded({ extended: true }));

  //Router logger, remove later
    app.use(( req, res, next ) => {
        console.log( "\x1b[33m%s\x1b[0m", `=> ${ req.url }`);
        next();
    });

    app.use( router );

    app.listen(process.env.PORT, () => {
        console.log("=========================");
        console.log("Listening on port: " + process.env.PORT);
        console.log("Server is running! 😎");
        console.log("=========================\n");
    });
};

main();


