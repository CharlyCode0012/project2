const { addKeyword } = require("@bot-whatsapp/bot");
const {
  fetchPaymentMethods,
  messageMethods,
} = require("../request/paymentMethods");

const { menuPago } = require("./menuPagoFlow");

const moduleContext = require("../context/userContext");

let paymentMethods = [];

function analyzePaymentMethodInContext(userId, paymentMethod, userContext) {
  // Verificar si el usuario tiene un contexto
  if (!userContext) {
    console.log("El usuario no tiene un contexto.");
    return;
  }

  // Verificar si el usuario tiene un método de pago
  if (!userContext.paymentMethod) {
    // No existe un método de pago, crear uno nuevo
    userContext.paymentMethod = paymentMethod;
  } else {
    // Existe un método de pago, actualizarlo
    userContext.paymentMethod = {
      ...userContext.paymentMethod,
      ...paymentMethod,
    };
  }

  // Guardar el contexto actualizado en el archivo

  moduleContext.saveContextOnFile(userId, userContext);

  console.log(
    "Método de pago analizado y actualizado en el contexto y en el archivo."
  );
}

const methodFlow = addKeyword(["3", "metodo"])
  .addAnswer(
    ["*Metodos de Pago*"],
    {
      capture: false,
      delay: 600,
    },
    async (ctx, { flowDynamic }) => {
      try {
        console.log("\n\nCTX: ", ctx);
        paymentMethods = await fetchPaymentMethods();
        const message = messageMethods(paymentMethods);

        await flowDynamic(message);
      } catch (error) {
        console.log(error);
      }
    }
  )
  .addAnswer(
    ["Seleccion un método de pago: "],
    {
      capture: true,
      delay: 1000,
    },
    async (ctx, { fallBack, flowDynamic, endFlow }) => {
      try {
        const userId = ctx.from;
        const answer = ctx.body;
        const index = answer - 1;

        if (!(index >= 0 && index < paymentMethods.length)) {
          await flowDynamic({ body: "Ingrese un valor valido" });
          return fallBack();
        }

        const method = paymentMethods[index];
        // Obtener el contexto del usuario
        const userContext = moduleContext.getUserContext(userId);
        analyzePaymentMethodInContext(userId, method, userContext);
        endFlow({ body: "Se ha seleccionado el método de pago" });
      } catch (error) {
        console.log(error);
      }
    }
  );

module.exports = {
  methodFlow,
};
