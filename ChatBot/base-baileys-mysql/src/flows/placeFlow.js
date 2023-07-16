const { addKeyword } = require("@bot-whatsapp/bot");
const { menuPago } = require("./menuPagoFlow");

const moduleContext = require("../context/userContext");

const {
  fetchDeliveryPlaces,
  messagePlaces,
} = require("../request/deliveryPlaces");

let places = [];

function analyzePlaceDeliveryInContext(userId, lugarEntrega, userContext) {

  // Verificar si el usuario tiene un contexto
  if (!userContext) {
    console.log("El usuario no tiene un contexto.");
    return;
  }

  // Verificar si el usuario tiene un lugar de entrega
  if (!userContext.deliveryLocation) {
    // No existe un lugar de entrega, crear uno nuevo
    userContext.deliveryLocation = lugarEntrega;
  } else {
    // Existe un lugar de entrega, actualizarlo
    userContext.deliveryLocation = {
      ...userContext.deliveryLocation,
      ...lugarEntrega,
    };
  }

  // Guardar el contexto actualizado en el archivo

  moduleContext.saveContextOnFile(userId, userContext);

  console.log(
    "Lugar de entrega analizado y actualizado en el contexto y en el archivo."
  );
}

const placeFlow = addKeyword(["4", "lugar"])
  .addAnswer(
    ["*Lugares*"],
    { capture: false, delay: 400 },
    async (ctx, { flowDynamic, gotoFlow }) => {
      try {
        places = await fetchDeliveryPlaces();
        const message = messagePlaces(places);

        await flowDynamic(message);
      } catch (error) {
        console.log(error);
      }
    }
  )
  .addAnswer(
    ["Seleccione uno: "],
    {
      capture: true,
      delay: 400,
    },
    async (ctx, { flowDynamic, gotoFlow }) => {
      try {
        const userId = ctx.from;
        const answer = ctx.body;
        const index = answer - 1;

        if (!(index >= 0 && index < places.length)) {
          await flowDynamic({ body: "Ingrese un valor valido" });
          return fallBack();
        }

        const place = places[index];
        const userContext = moduleContext.getUserContext(userId);
        analyzePlaceDeliveryInContext(userId, place, userContext);
        return await gotoFlow(menuPago);
      } catch (error) {
        console.log(error);
      }
    }
  );

module.exports = { placeFlow };
