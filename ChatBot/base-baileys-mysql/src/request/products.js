const instance = require('./instance');
const fs = require('fs');


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

async function downloadFileProducts(catalogID) {
    try {
        const response = await instance.get('/products/downloadWithCatalogId', {
            params: {
                catalogID: catalogID
            },
            responseType: 'blob'
        });

        // Guardar el archivo recibido en disco
        const filePath = 'src/Catalog/Productos '+catalogID+'.xlsx'
        fs.writeFileSync(filePath, response.data);
        console.log('Archivo descargado correctamente');
    } catch (error) {
        console.error('Error al hacer la petición:', error);
    }
}

module.exports = { fetchProducts, downloadFileProducts };