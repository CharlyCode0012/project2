export interface ParamsHttp {
	mehod: string;
	url?: string;
	baseUrl?: string;
	data?: unknown;
	headers: { "X-Requested-With": "XMLHttpRequest" } | unknown;
	params?: unknown;
	responseType?: string;
	responseEncoding?: string;
	xsrfCookieName: "XSRF-TOKEN" | string;
	xsrfHeaderName: "X-XSRF-TOKEN" | string;
}
