const instance = require("./instance");
const fs = require("fs");
const Product = require("../models/Product");


async function fetchProduct(productKeyword) {
  try {
    const { data: productData } = await instance.get(
      "products/searchByKeyword",
      { params: { search: productKeyword } }
    );
    const product = new Product(productData);
    return product;
  } catch (error) {
    console.log(error);
    return { error: "Error al traer el producto" };
  }
}

async function fetchProducts() {
  let products = [new Product()];
  try {
    const { data: productsData } = await instance.get("/products");
    products = productsData.map((product) => new Product(product));

    return products;
  } catch (error) {
    console.log(error);
    return { error: "Error al traer productos" };
  }
}

async function downloadFileProducts(catalogID) {
  try {
    const response = await instance.get("/products/downloadWithCatalogId", {
      params: {
        catalogID: catalogID,
      },
      responseType: "blob",
    });

    // Guardar el archivo recibido en disco
    const filePath = "src/Catalog/Productos " + catalogID + ".xlsx";
    fs.writeFileSync(filePath, response.data);
    console.log("Archivo descargado correctamente");
  } catch (error) {
    console.error("Error al hacer la petición:", error);
  }
}

function messageProducts(products = [new Product()]) {
  const data = products.map((prod) => ({
    body: `
        ${prod.product_name} 
        \nDescripción: ${prod.description} 
        \nPrecio: ${prod.price}
        \nExistencia: ${prod.stock}`,
    media: `http://127.0.0.1:3200/api/images/${prod.id}`,
  }));

  return data;
}

function messageProduct(prod) {
  const message = {
    body: `${prod.product_name} 
        \nDescripción: ${prod.description} 
        \nPrecio: ${prod.price}
        \nExistencia: ${prod.stock}`,
  };

  return message;
}

function messageProductsCart(cart) {
  let message;
  if (cart.products.length > 0) {
    message = cart.products.map((prod, indexProduct) => ({
      body: `*${indexProduct + 1}*.- Nombre: ${prod.product_name} Cantidad: ${
        prod.quantity
      }`,
    }));
  } else {
    message = { body: "No tiene ningun producto :b" };
  }

  return message;
}

module.exports = {
  fetchProducts,
  fetchProduct,
  downloadFileProducts,
  messageProduct,
  messageProducts,
  messageProductsCart
};
