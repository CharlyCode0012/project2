export interface MenuData {
	id: string;
	title: string;
	instruction: string;
	options: MenuOption[];
}

export type OptionActionType = "menu" | "catalog" | "link" | "message";

// TODO: Update type for messages and links
export type OptionAction = MenuData | Catalog | string

export interface MenuOption {
	id: string;
	index: number;
	brief: string;
	description: string;
	keywords: string[];
	actionType: OptionActionType;
	action: OptionAction;
}

export interface Catalog {
	id: string;
	name: string;
	description: string;
	products: string[];
}

// TODO: Create models for message and action
