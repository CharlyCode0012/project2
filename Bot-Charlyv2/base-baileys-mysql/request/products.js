const instance = require('instance');




async function fetchProducts(){
    const {data: products } = await instance.get('/products');

    const data = products.map(product => ({body: [`*${product.name}:* ${product}]}))
}