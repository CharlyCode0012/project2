class Product {
    id = "";
    product_name = "";
    price = 0.0;
    keyword = "";
    stock = 0;
    description = "";

    constructor(productData){
        this.id = productData.id ?? "";
        this.product_name = productData.product_name ?? "";
        this.keyword = productData.key_word ?? "";
        this.price = productData.price ?? 0;
        this.stock = productData.stock ?? 0;
        this.description = productData.description ?? "";
    }

}

module.exports = Product;