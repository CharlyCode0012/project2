const instance = require("./instance");

const moduleContext = require("../context/userContext");
const userContexts = moduleContext.initializeUserContextsFromFiles();

async function createOrder(userId, userContext) {
  try {
    const places = await instance.post(
      "/orders",
      { userContext },
      { params: { clientId: userId } }
    );
    return places;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createOrder };
