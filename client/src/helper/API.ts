import axios, { AxiosRequestConfig } from "axios";

axios.defaults.baseURL = "https://server-production-4487.up.railway.app/api/";

axios.defaults.headers.post["Content-Type"] =
	"application/x-www-form-urlencoded";

const get = async <T extends object>(
	endpoint: string,
	options: AxiosRequestConfig
) => {
	try {
		console.log(options);
		const response = await axios.get<T>(endpoint, options);
		const info = await response.data;
		return info;
	}
	catch (error: unknown) {
		if (axios.isAxiosError(error)) console.log(error);
		else console.log(error);
	}
};

const post = async <T extends object>(
	endpoint: string,
	options: AxiosRequestConfig
): Promise<T | undefined> => {
	try {
		const response = await axios.post<T>(endpoint, options);
		const info = response.data;
		return info;
	}
	catch (error: unknown) {
		if (axios.isAxiosError(error)) console.log(error);
		else console.log(error);
	}
};

const put = async <T extends object>(
	endpoint: string,
	options: AxiosRequestConfig
): Promise<T | undefined> => {
	try {
		const response = await axios.put<T>(endpoint, options);
		const info = response.data;
		return info;
	}
	catch (error: unknown) {
		if (axios.isAxiosError(error)) console.log(error);
		else console.log(error);
	}
};

const remove = async (
	endpoint: string,
	options: AxiosRequestConfig
): Promise<void> => {
	try {
		await axios.delete(endpoint, options);
	}
	catch (error: unknown) {
		if (axios.isAxiosError(error)) console.log(error);
		else console.log(error);
	}
};

export const http = {
	get,
	post,
	put,
	remove,
};
