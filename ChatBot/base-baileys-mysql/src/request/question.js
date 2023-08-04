const instance = require("./instance");

async function createQuestion(to, question, keyword) {
  try {

    await instance.post("/questions", { question, to, keyword });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createQuestion };
