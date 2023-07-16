const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const { createProvider } = require("@bot-whatsapp/bot");

const adapterProvider = createProvider(BaileysProvider);

module.exports = { adapterProvider };
