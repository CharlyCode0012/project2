import axios from "axios";

const get = async <T>(Url: string): Promise<T> => {
	try {
		const response = await axios.get<T>(Url);
		return response.data;
	} catch (error) {
		throw new Error();
	}
};

export const Http = {
	get,
};
