import axios from "axios";
import { ParamsHttp } from "models/ParamsHttp";

const customAxios = () => {
	const conn = axios;
};

const get = async <T>(Url: string): Promise<T> => {
	try {
		const response = await axios.get<T>(Url);
		return response.data;
	}
	catch (error) {
		throw new Error();
	}
};

export const http = {
	get,
};
