import axios from "axios";

const instance = axios.create({
	baseURL: "https://server-production-0b53.up.railway.app/api/",
	// baseURL: "http://localhost:3200/api",
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	},
});

const instanceBot = axios.create({
	baseURL: "https://chatbot-production-f3e4.up.railway.app",
	// baseURL: "http://localhost:3500",
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	},
});

export { instance, instanceBot };
