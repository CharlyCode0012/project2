export interface PlacesDelivery {
	id: number;
	name: string;
	address: string;
	cp: string;
	open_h: string;
	close_h: string;
}

export interface DisplayedDeliveryPlace {
	id: number;
	township: string;
	street: string;
	colony: string;
	homeNumber: number;
	cp: number;
	schedule: string;
}
