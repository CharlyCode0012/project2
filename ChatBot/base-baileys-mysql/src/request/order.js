const instance = require("./instance");

const moduleContext = require("../context/userContext");
const userContexts = moduleContext.initializeUserContextsFromFiles();

async function createOrder(userId) {
  try {

    const places = await instance.post("/orders", {});
    return places;

  } catch (error) {
    console.log(error);
  }
}

module.exports = { createOrder };
