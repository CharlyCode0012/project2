import axios from "axios";

axios.defaults.baseURL = "https://api.example.com";

axios.defaults.headers.post["Content-Type"] =
	"application/x-www-form-urlencoded";

const get = async <T>(endpoint: string, options: any) => {
	try {
		const response = await axios.get<T>(endpoint, options);
		const info = await response.data;
		return info;
	}
	catch (error: any) {
		throw new Error("hubo un error", error.message);
	}
};

const post = async <T>(endpoint: string, options: any): Promise<T> => {
	try {
		const response = axios.post(endpoint, options);
		const info = await (await response).data;
		return info;
	}
	catch (error: any) {
		throw new Error("hubo un error", error.message);
	}
};

export const http = {
	get,
	post,
};
