const { addKeyword } = require("@bot-whatsapp/bot");
const { adapterProvider} = require("./adapterProvider");

const { methodFlow } = require("./methodFlow");
const { placeFlow } = require("./placeFlow");

const {
  fetchProduct,
  messageProduct,
  messageProductsCart,
} = require("../request/products.js");

const moduleContext = require("../context/userContext");

const { ProductCart, Cart } = require("../models/Cart.js");

function agregarProductoAlCarrito(productData, userId, userContext) {
  // Verificar si el usuario ya tiene un carrito
  if ((!userContext.cart || Object.entries(userContext.cart).length === 0)) {
    // Si no tiene carrito, crear uno nuevo
    userContext.cart = new Cart();
  }

  // Obtener el carrito del usuario
  const cart = userContext.cart;

  // Buscar si el producto ya está en el carrito
  const existingProduct = cart?.products?.find(
    (prod) => prod.id === productData.id
  );

  

  if (existingProduct) {
    if(existingProduct.quantity + 1 > productData.stock){
      console.log("")
    }
    // El producto ya existe en el carrito, actualizar la cantidad y el precio total
    existingProduct.quantity += 1;
    existingProduct.totalPrice =
      existingProduct.price * existingProduct.quantity;
  } else {
    // El producto no existe en el carrito, crear uno nuevo y agregarlo
    const newProduct = new ProductCart(productData);
    cart.products.push(newProduct);
  }

  // Actualizar el precio total del carrito
  cart.totalPrice += productData.price;

  moduleContext.saveContextOnFile(userId, userContext);
}

function removeProductFromCart(userId, productId, userContext) {
  // Obtener el contexto del usuario
  moduleContext.removeProductFromCartInContextAndFile(
    userId,
    productId,
    userContext
  );
}

//flujo para eliminar productos
const flowSelectPopProduct = addKeyword(["2", "quitar"])
  .addAction(async (ctx, { flowDynamic, fallBack, gotoFlow, endFlow }) => {
    const userId = ctx.from;
    const contextUser = moduleContext.initializeContextFromFile(userId);
    let cart = contextUser?.cart ? contextUser.cart : { products: [] };
    const message = messageProductsCart(cart);

    if (cart.products.length > 0) {
      message.unshift({ body: "Que producto quiere quitar?" });
      await flowDynamic(message);
    } else {
      await flowDynamic(message);
      return endFlow();
    }
  })
  .addAnswer(
    ["Ingrese el número"],
    { capture: true, delay: 300 },
    async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
      const index = ctx.body;
      const userId = ctx.from;
      const contextUser = moduleContext.initializeContextFromFile(userId);
      let cart = contextUser?.cart ? contextUser.cart : { products: [] };

      const indexProduct = index - 1;

      if (!(indexProduct >= 0 && indexProduct < cart.products.length)) {
        await flowDynamic({ body: "Ingrese un rango válido" });
        return fallBack();
      } else {
        const removeProduct = cart.products[indexProduct];
        await flowDynamic({ body: "A punto de eliminar" });
        removeProductFromCart(userId, removeProduct.id, contextUser);
        await gotoFlow(menuProducts);
      }
    }
  );

const flowSearchProduct = addKeyword(["1", "ingresar"]).addAnswer(
  ["Ingresa una palabra clave: "],
  {
    capture: true,
    delay: 700,
  },
  async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
    try {
      const keyword = ctx.body;
      const userId = ctx.from;

      const prod = await fetchProduct(keyword);
      //console.log("\n\nProd:", prod);

      const message = messageProduct(prod);

      if (prod.id === "") {
        await flowDynamic({ body: "No se encontro ninguno producto" });
        return fallBack();
      } else {
        const userContext = moduleContext.initializeContextFromFile(userId);
        await flowDynamic([message, { body: "Se agrego con exito" }]);
        agregarProductoAlCarrito(prod, userId, userContext);
        await gotoFlow(menuProducts);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const menuProducts = addKeyword(["2", "pedir"]).addAnswer(
  [
    "*PEDIDO:*\n",
    "*1.-* Agregar",
    "*2.-* Quitar",
    "*3.-* Metodo de Pago",
    "*4.-* Lugar de entrega",
    "*5.-* Salir",
  ],
  {
    capture: true,
    delay: 500,
  },
  async (ctx, { fallBack, endFlow }) => {
    try {
      const option = ctx.body;
      if (!["1", "2", "3", "4", "5"].includes(option)) return fallBack();

      if (option == "5")
        return endFlow({
          body: "Gracias por su preferencia",
        });
    } catch (error) {
      console.log(error);
    }
  },
  [flowSearchProduct, flowSelectPopProduct, methodFlow, placeFlow]
);

module.exports = { menuProducts };
