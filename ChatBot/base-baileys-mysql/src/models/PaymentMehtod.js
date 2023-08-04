class PaymentMethod {
    id = "";
    name = "";
    CLABE = "";
    no_card = "";
    bank = "";
    subsidary = "";

    constructor(paymentMethodData){
        this.id = paymentMethodData.id;
        this.name = paymentMethodData.name;
        this.CLABE = paymentMethodData.CLABE;
        this.no_card = paymentMethodData.no_card;
        this.bank = paymentMethodData.bank;
        this.subsidary = paymentMethodData.subsidary;
    }

}

module.exports = PaymentMethod;