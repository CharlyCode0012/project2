const { addKeyword } = require("@bot-whatsapp/bot");
const { fetchMenuWithOptions } = require("../request/menus");

async function createPrincipalFlow(flow) {
  const pirncipalMenuData = await fetchMenuWithOptions(1);
  //console.log("Menu principal: ", pirncipalMenuData);

  const answers = [];
  answers.push(pirncipalMenuData.answer);

  const menuOptions = pirncipalMenuData.options;

  const optionsTemp = [];

  menuOptions.map((option, index) => {
    answers.push(`*${index + 1}*: ${option.answer}`);
    optionsTemp.push(String(index + 1));
    optionsTemp.push(
      option.keywords.split(",").flat((keyword) => keyword.trim())
    );
  });

  answers.push("*Carrito:* Buscar un producto");
  answers.push("*Ayuda:* Duda sobre algún producto");
  answers.push("*Pagar:* Seleccionar metodo de pago");

  let options = optionsTemp.reduce((acc, val) => acc.concat(val), []);
  options = options.map((element) => element.trim());

  console.log("opciones: ", options);
  principalFlow = addKeyword(["hola", "alo", "ole", "inicio"]).addAnswer(
    answers,
    { capture: true, delay: 500 },
    async (ctx, { fallBack, flowDynamic }) => {
      const option = ctx.body;
      console.log(ctx.body);
      if (!options.includes(option)) {
        return fallBack();
      }
    },
    flow
  );

  return principalFlow;
}

module.exports = { createPrincipalFlow };
