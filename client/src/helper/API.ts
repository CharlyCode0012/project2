import axios, { AxiosRequestConfig } from "axios";
import { config } from "dotenv";
config();

const instance = axios.create({
	baseURL: process.env.SERVER_HOST,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	},
});

const get = async <T extends object>(endpoint: string, options: any) => {
	try {
		console.log(options);
		const response = await instance.get<T>(endpoint, options);
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
	options: any
): Promise<T | undefined> => {
	try {
		const response = await instance.post<T>(endpoint, JSON.stringify(options));
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
		const response = await instance.put<T>(endpoint, options);
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
		await instance.delete(endpoint, options);
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
