const { addKeyword } = require("@bot-whatsapp/bot");

/*TODO, verificar que el contexto contenga carrito con minimo un producto; lugar de entrega y metodo de pago, 
al tenerlos que  me mande como mensaje la cantidad a pagar y los productos así como su cantidad, 
de ahí preguntar al usuario si esta de acuerdo y si la respuesta es si generar folio y mandarlo,
así como usar API REST
 */
const payFlow = addKeyword(["3", "pagar"]).addAnswer(
  ["Pagos"],
  {
    capture: true,
    delay: 500,
  },
  async (ctx, { flowDynamic, gotoFlow, fallBack }) => {}
);

module.exports = { payFlow };
