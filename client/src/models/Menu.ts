export interface MenuData {
	id: string;
	name: string;
	answer: string;
	principalMenu: boolean;
	options: MenuOption[];
}

export type MenuOptionActionType = "Submenu" | "catalog" | "link" | "message";

export type SubMenuOptionActionType = "catalog" | "link" | "message";

export interface MenuOption {
	id: string;
	answer: number;
	option: string;
	keywords: string[];
	action_type: MenuOptionActionType | SubMenuOptionActionType;
	reference: string;
	referenceName: string;
}
