import axios from "axios";

export const instance = axios.create({
	// baseURL: "https://server-production-4487.up.railway.app/api/",
	baseURL: "http://localhost:3200/api",
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	},
});
