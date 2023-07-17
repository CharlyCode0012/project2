const { addKeyword } = require("@bot-whatsapp/bot");

const moduleContext = require("../context/userContext");
const { createOrder } = require("../request/order");

/*TODO, verificar que el contexto contenga carrito con minimo un producto; lugar de entrega y metodo de pago, 
al tenerlos que  me mande como mensaje la cantidad a pagar y los productos así como su cantidad, 
de ahí preguntar al usuario si esta de acuerdo y si la respuesta es si generar folio y mandarlo,
así como usar API REST
 */
const payFlow = addKeyword(["3", "pagar"]).addAnswer(
  ["*Pagos*", "\n¿Desea pagar?", "Si (s)", "No (n)"],
  {
    capture: true,
    delay: 500,
  },
  async (ctx, { flowDynamic, gotoFlow, fallBack, endFlow }) => {
    let answer = "";
    answer = ctx.body;
    const userId = ctx.from;

    const userContext = moduleContext.initializeContextFromFile(userId);

    const {
      cart = null,
      paymentMethod = null,
      deliveryLocation = null,
    } = userContext;

    if (!(cart && Object.entries(cart).length > 0 && cart.products.length  > 0)) {
      return await flowDynamic({
        bdoy: "No tiene ninguno producto en su carrito",
      });
    }

    if (!(paymentMethod && Object.entries(paymentMethod).length > 0)) {
      return await flowDynamic({
        body: "No ha seleccionado un método de pago",
      });
    }

    if (!(deliveryLocation && Object.entries(deliveryLocation).length > 0)) {
      return await flowDynamic({
        body: "No ha seleccionado un lugar de entrega",
      });
    }

    if (answer.toUpperCase() == "SI" || answer.toUpperCase() == "S") {
      const userContext = moduleContext.initializeContextFromFile(userId);
      moduleContext.addFolioToContext(userId, userContext);
      await flowDynamic({body: `Tu *folio* es: ${userContext.folio}\nLo que debes de pagar es: ${userContext.cart.totalPrice}`})
      await createOrder(userId, userContext);
      moduleContext.removeElementFromContext(userId, userContext, "paymentMethod");
      moduleContext.removeElementFromContext(userId, userContext, "deliveryLocation");
      moduleContext.removeElementFromContext(userId, userContext, "cart");

      console.log("Propiedades eliminadas. Contexto actualizado:", userContext);
      moduleContext.saveContextOnFile(userId, userContext);
    }

    if (answer.toUpperCase() == "NO" || answer.toUpperCase() == "N") {
      return endFlow({body: "Gracias por su preferencia"});
    }
  }
);

module.exports = { payFlow };
