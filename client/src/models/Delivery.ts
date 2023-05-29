export interface Delivery {
	id: number;
	date_delivery: Date;
	rest: number;
	state: boolean;
	id_client: string;
	place: string;
	folio: string;
	order_state: string;
}
