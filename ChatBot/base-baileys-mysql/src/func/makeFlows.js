const { addKeyword } = require("@bot-whatsapp/bot");
const { fetchMenusWithOptions } = require("../request/menus.js");
let menus = [];

/**
 * functions to make some proseadure
 */
function makeFlows(flows) {
  const functionalFlows = flows.map((flow, flowIndex) => {
    let nestedFlows = null;
    if (flow["nested"]) nestedFlows = makeFlows(flow["nested"]);

    const objectFlow = addKeyword(flow["addKeywords"]).addAnswer(
      flow["addAnswer"],
      { delay: 500 },
      null,
      nestedFlows ?? null
    );

    return objectFlow;
  });

  return functionalFlows;
}

// Función para generar los flujos de opciones
function pseudoFlow(options, processedMenus = [], parentNested = []) {
  let countOption = 0;
  return options.flatMap((option) => {
    if (processedMenus.includes(option.menuId)) {
      return [];
    }

    const addKeywords = [];
    addKeywords.push(String(++countOption));
    addKeywords.push(
      option.keywords.split(",").map((keyword) => keyword.trim())
    );
    let addAnswer = [];
    let nested = [];

    if (option.action_type === "Submenu") {
      const submenu = menus.find((menu) => menu.id === option.reference);
      processedMenus.push(submenu.id);
      nested = pseudoFlow(submenu.options, processedMenus, nested);
      addAnswer = nested.map(
        (nestedOption, nestedIndex) =>
          `*${nestedIndex + 1}*: ${submenu.options[nestedIndex].option}`
      );
    } else {
      addAnswer = [option.answer];
    }

    const result = {
      addKeywords: addKeywords.flat(),
      addAnswer,
      nested,
    };

    parentNested.push(result);

    return [result];
  });
}

async function getFlows() {
  let renderFlows = [];
  try {
    menus = await fetchMenusWithOptions();

    const flows = pseudoFlow(
      menus.flatMap((menu) => {
        const menuOptions = menu.options.map((option) => {
          return { menuId: menu.id, ...option };
        });
        return menuOptions;
      })
    );
    
    renderFlows = makeFlows(flows);
    return renderFlows;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = { getFlows };
