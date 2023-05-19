const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = 'localhost'
const MYSQL_DB_USER = 'root'
const MYSQL_DB_PASSWORD = '0906Gean.0906'
const MYSQL_DB_NAME = 'data_bot'
const MYSQL_DB_PORT = '3306'

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

const flowCatalogos = addKeyword(['1', 'Catalogo']).addAnswer(['Esoty obteniendo el cataloog, por favor espere...']);

const flowSecundario = addKeyword(['2', 'Contactar', 'humano']).addAnswer(['Estamos contactando con alguien']);

/* const flowButton =  addKeyword(['4', 'Botones']).addAnswer('Este mensaje envia tres botones', {
    buttons: [{ body: 'Boton 1' }, { body: 'Boton 2' }, { body: 'Boton 3' }],
});
 */
const flowDocs = addKeyword(['3', 'documentacion', 'doc']).addAnswer(
    [
        '📄 Aquí encontras las documentación: ',
        'https://bot-whatsapp.netlify.app/',
    ],
    null,
    null,
    [flowSecundario]
)



const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        'Muchas gracias por tu preferencia', 'Tenga un excelente día'
    ]
)



const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
.addAnswer(['Hola buenas tardes, este es un bot de una tienda', '¿En que puedo ayudarte?'])
.addAnswer(['*1* Catalogo', '*2* Contactar con un humano', '*3* Documentacion'], null, null, 
[flowCatalogos, flowSecundario, flowDocs]);

const main = async () => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT,
    })
    const adapterFlow = createFlow([flowPrincipal, flowGracias])
    const adapterProvider = createProvider(WebWhatsappProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()