class PlaceDelivery {
    id = "";
    name = "";
    address = "";
    cp = "";
    open_h = "";
    close_h = "";

    constructor(deliveryData){
        this.id = deliveryData.id;
        this.name = deliveryData.name;
        this.address = deliveryData.address;
        this.cp = deliveryData.cp;
        this.open_h = deliveryData.open_h;
        this.close_h = deliveryData.close_h;
    }

}

module.exports = PlaceDelivery;