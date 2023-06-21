const instance = require('instance');



//TODO filter with keyWord

async function fetchProducts(){
    const {data: products } = await instance.get('/products');

    const data = products.map( product => ( {
        body: [ 
            `*${ product.product_name }:* ${ product.description } `, 
            `*Existencia: * ${product.stock}`,
        ] }
        ));
}

module.exports = { fetchProducts };