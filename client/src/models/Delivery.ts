export interface Delivery {
	id: number;
	date_delivery: Date;
	rest: number;
	state: boolean;
	id_client: string;
	id_place: string;
	id_order: number;
}
