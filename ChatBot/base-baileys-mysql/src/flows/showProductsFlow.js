const { addKeyword } = require("@bot-whatsapp/bot");
const instance = require("../request/instance.js");

const showProductsFlow = addKeyword(["folio"]).addAnswer(
  ["Ingrese el folio para ver sus products", "*Salir* (s)", "\nRespuesta:"],
  { capture: true, delay: 1000 },
  async (ctx, { fallBack, flowDynamic, endFlow }) => {
    let answer = "";
    answer = ctx.body;
    try {
      if (answer.toUpperCase() == "SALIR" || answer.toUpperCase() == "S") {
        return endFlow({ body: "Solicitud cancelada" });
      }

      const isFolio = await instance.get("/orders/orderByFolio", {
        params: { folio: answer },
      });

      if (isFolio) {
        const {
          delivery_location: deliveryLocation,
          order_details,
          order,
        } = isFolio.data;

        const { total, date_delivery } = order;

        console.log(isFolio);
        console.log("\n\nFecha: ", order.date_delivery, "\n\n");

        const principalMessage = { body: `Su pedido *${answer}* es:n\n\n` };
        const productsMessage = [];
        productsMessage.unshift(principalMessage);

        order_details?.map((order) =>
          productsMessage.push({
            body: `*Producto:* ${order.product.product_name}\n*Cantidad:* ${order.quantity}\n\n`,
          })
        );

        const finalMessage = {
          body: `La cantidad total a pagar es: $${total}\nEl lugar de entrega es: *${deliveryLocation.address}* CP: *${deliveryLocation.cp}* con horario de *${deliveryLocation.open_h}* a *${deliveryLocation.close_h}*`,
        };

        const dateMessage = {
          body: `La fecha de entrega es: ${
            date_delivery ? date_delivery : "No tiene fecha de entrega"
          }`,
        };

        const message = [];
        message.push(productsMessage, finalMessage, dateMessage);

        await flowDynamic(message);
      } else return fallBack();
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = { showProductsFlow };
