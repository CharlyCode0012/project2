const instance = require("./instance");

async function fetchPaymentMethods() {
  try {
    const { data: methods } = await instance.get("/payment_methods");
    return methods;
  } catch (error) {
    console.log(error);
  }
}

function messageMethods(methods = [{}]) {
  const data = methods.map((method, indexMethod) => ({
    body: `*${indexMethod + 1}.-* ${method.name} *Banco:* ${
      method.bank
    } *Subsidiarías:* ${method.subsidary}.\n*Tarjeta:* ${
      method.no_card
    } *CLABE:* ${method.CLABE}\n`,
  }));

  return data;
}

module.exports = { fetchPaymentMethods, messageMethods };
