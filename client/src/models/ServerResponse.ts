export interface ServerResponse {
	success?: any;
	err?: boolean;
	statusText?: string;
	status: number;
	message?: string;
}

export const initialSereverResponse: ServerResponse = {
	success: {},
	err: false,
	status: 200,
};
