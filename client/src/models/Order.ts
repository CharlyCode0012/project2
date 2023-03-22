export interface Order {
	id: number;
	folio: string;
	date_order: Date;
	total: number;
	state: string;
	id_client: string;
	id_place: string;
	id_payment_method: string;
}
