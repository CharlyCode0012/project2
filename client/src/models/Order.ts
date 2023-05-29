export interface Order {
	id: number;
	folio: string;
	date_order: Date;
	total: number;
	amount: number;
	state: string;
	id_client: string;
	place: string;
	payment: string;
}
