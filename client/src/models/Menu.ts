export interface Option {
	index: number;
	brief: string;
	description: string;
	keywords: string[];
	action: null;
}

export type MenuData = Option[];
