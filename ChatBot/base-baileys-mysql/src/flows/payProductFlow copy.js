const { addKeyword } = require("@bot-whatsapp/bot");
const {
  fetchPaymentMethods,
  messageMethods,
} = require("../request/paymentMethods");
const {
  fetchDeliveryPlaces,
  messagePlaces,
} = require("../request/deliveryPlaces");
const moduleContext = require("../context/userContext");

const Product = require("../models/Product");

const userContexts = moduleContext.initializeUserContextsFromFiles();

let places = [];

function analyzePaymentMethodInContext(userId, paymentMethod) {
  // Obtener el contexto del usuario
  const userContext = moduleContext.getUserContext(userId);

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

function analyzePlaceDeliveryInContext(userId, lugarEntrega) {
  // Obtener el contexto del usuario
  const userContext = moduleContext.getUserContext(userId);

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

async function createPlacesFlow() {
  const placesData = await fetchDeliveryPlaces();
  //console.log("Menu principal: ", pirncipalMenuData);

  const answers = ["*Lugares*\n"];

  const options = [];

  placesData.map((place, index) => {
    answers.push(`*${index + 1}.-* *${place.name}*\n*Dirección:* ${place.address} *CP*: ${place.cp}\n*Horario* de ${place.open_h} a ${place.close_h}`);
    options.push(`${index + 1}`);
  });

  answers.push("\n\nSeleccione uno:");

  const placeFlow = addKeyword(["2", "lugar", "lugares"]).addAnswer(
    answers,
    { capture: true, delay: 500 },
    async (ctx, { fallBack, flowDynamic }) => {
      const option = ctx.body;
      const userId = ctx.from;
      console.log(ctx.body);
      if (!options.includes(option)) {
        return fallBack();
      } else {
        const index = option - 1;
        const place = placesData[index];
        analyzePlaceDeliveryInContext(userId, place);
        await flowDynamic("se mando el lugar");
      }
    }
  );

  return placeFlow;
}

async function paymentMethodFlow() {
    
  const paymentMethodsData = await fetchPaymentMethods();
  //console.log("Menu principal: ", pirncipalMenuData);

  const answers = ["*Metodos*\n"];

  const options = [];

  paymentMethodsData.map((method, index) => {
    answers.push(
      `*${index + 1}.-* ${method.name} *Banco:* ${
        method.bank
      } *Subsidiarías:* ${method.subsidary}.\n*Tarjeta:* ${
        method.no_card
      } *CLABE:* ${method.CLABE}\n`
    );
    options.push(`${index + 1}`);
  });

  console.log("opciones: ", options);
  const paymentFlow = addKeyword(["1","metodo", "metodos"]).addAnswer(
    answers,
    { capture: true, delay: 500 },
    async (ctx, { fallBack, gotoFlow }) => {
      const option = ctx.body;
      const userId = ctx.from;
      console.log(ctx.body);
      if (!options.includes(option)) {
        return fallBack();
      } else {
        const index = option - 1;
        const method = paymentMethodsData[index];
        analyzePaymentMethodInContext(userId, method);
        gotoFlow()
      }
    }
  );

  return paymentFlow;
}

async function createPaymentFlow(){
    const paymentFlow = await paymentMethodFlow();
    const placeFlow = await createPlacesFlow();
    const flow = addKeyword(["pagar"]).addAnswer(
        ["*1.-* Metodo de Pago", "*2.-* Lugares de entrega", "3.- Salir"],
        { capture: true, delay: 500 },
        async (ctx, { fallBack, endFlow}) => {
          const option = ctx.body;
          const userId = ctx.from;
          console.log(ctx.body);
          if (option != '3' && option != '2' && option != '1') {
            return fallBack();
          } 
          if(option == '3'){
            return endFlow("Se ha agregado tu pedido");
          }

        },
        [paymentFlow, placeFlow]
      );
    
      return flow;
}

module.exports = {
  createPaymentFlow,
};
