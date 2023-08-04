const { addKeyword } = require("@bot-whatsapp/bot");
const { fetchProduct, messageProducts, messageProduct } = require("../request/products");
const { createQuestion } = require("../request/question");


const helperFlow = addKeyword(["ayuda", "duda"])
.addAnswer(
    [
        "Ingrese la palabra clave del producto sobre el cual tiene duda y separado por una coma *,* la duda",
        "*EJEMPLO:*",
        "PS5, ¿Cuál es la capacidad de su disco duro?"
    ],
    {
        capture: true,
        delay: 500,
    },
    async (ctx, {flowDynamic, fallBack})=>{
        const request = ctx.body;

        const number = ctx.from;

        const options = request.split(',');

        const keyword = options[0];

        const question = options[1];

        const product = await fetchProduct(keyword);
        if(!product){
            await flowDynamic({body: "No hay un producto con esa palabra clave"});
            return fallBack();
        }else{
            const message = ["El producto que selecciono es: "]
            const messag = messageProduct(product);

            message.push(messag);

            message.push("Se ha envíado su duda, pronto le responderemos, muchas gracias por su preferencia");

            await createQuestion(number, question, keyword);

            await flowDynamic(message);
        }
    }
);


module.exports = { helperFlow }