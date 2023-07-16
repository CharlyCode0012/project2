const { addKeyword } = require("@bot-whatsapp/bot");
const { fetchCatalogs, messsageCatalogs } = require("../request/catalog.js");
const { adapterProvider } = require("./adapterProvider.js");


let catalogs = [];

async function sendCatalogProducts(to, catalogID) {
    try {
      const modProvider = await adapterProvider.getInstance();
  
      await modProvider.sendMessage(`${to}@s.whatsapp.net`, {
        text: `Ve al enlace para descagargar el catálogo\n*Link:*\n http://localhost:3200/api/products/downloadWithCatalogId?catalogID=${catalogID}`,
      });
    } catch (error) {
      console.error("Error al hacer la petición:", error);
    }
  }

const catalogsFlow = addKeyword(["1", "Catalogo"])
  .addAnswer(
    ["Estoy obteniendo los catálogos"],
    { delay: 2000 },
    async (ctx, { flowDynamic }) => {
      try {
        catalogs = await fetchCatalogs();
        message = messsageCatalogs(catalogs);
        await flowDynamic(message);
      } catch (error) {
        console.log(error);
      }
    }
  )
  .addAnswer(
    "Ingrese un catalogo de acuerdo al numero",
    {
      capture: true,
      delay: 1000,
    },
    async (ctx, { fallBack, flowDynamic }) => {
      try {
        let indexCatalog = ctx.body;
        const clientNumber = ctx.from;
        console.log(clientNumber);

        if (isNaN(indexCatalog)) {
          return fallBack();
        }

        indexCatalog -= 1;
        const catalog = catalogs[indexCatalog];
        console.log(catalog);

        //await downloadFileProducts(catalog?.id);
        //await sendCatalogProducts(clientNumber, catalog?.id);
        console.log(sendCatalogProducts);
        await sendCatalogProducts(clientNumber, catalog?.id);
      } catch (error) {
        console.error(error);
      }
    }
  );

module.exports = { catalogsFlow };
