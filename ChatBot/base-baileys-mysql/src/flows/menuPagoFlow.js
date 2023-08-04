const { addKeyword } = require("@bot-whatsapp/bot");

const { catalogsFlow } = require("./catalogFlow");
const { menuProducts } = require("./menuProductsFlow");
const { payFlow } = require("./payFlow");

const menuPago = addKeyword([
  "comprar",
  "carrito",
  "cart"
]).addAnswer(
  [
    "*Menu para ordenar*",
    "\n*1.-* Catálogo",
    "*2.-* Pedir",
    "*3.-* Pagar",
    "*4.-* Salir",
  ],
  {
    capture: true,
    delay: 1000,
  },
  async (ctx, { fallBack, endFlow }) => {
    const option = ctx.body;

    if (!["1", "2", "3", "4"].includes(option)) return fallBack();

    if (option == "4") return endFlow({ body: "Gracias por su preferencia" });
  },
  [catalogsFlow, menuProducts, payFlow]
);

module.exports = { menuPago };
