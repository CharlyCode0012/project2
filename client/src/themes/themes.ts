import { PaletteMode, PaletteOptions } from "@mui/material";

export type Mode = PaletteMode;

export type ThemeName = "red" | "blue" | "green";

type ThemeColors = {
	[name in ThemeName]: {
		[mode in Mode]: PaletteOptions;
	};
};

export const themes: ThemeColors = {
	red: {
		light: {
			primary: {
				main: "#f4c0c0",
			},
			secondary: {
				main: "#edc6a9",
			},
			error: {
				main: "#f5f2b8",
			},
			warning: {
				main: "#dbf4af",
			},
			info: {
				main: "#bae0da",
			},
			success: {
				main: "#f5cbdf",
			},
		},
		dark: {
			primary: {
				main: "#a65f6d",
			},
			secondary: {
				main: "#a1735c",
			},
			error: {
				main: "#aca873",
			},
			warning: {
				main: "#83a68c",
			},
			info: {
				main: "#648ca6",
			},
			success: {
				main: "#a68493",
			},
			background: {
				default: "#1e0014",
				paper: "#3d0c18",
			},
			text: {
				primary: "#ffffff",
				secondary: "rgba(255, 255, 255, 0.7)",
			},
		},
	},
	blue: {
		light: {
			primary: {
				main: "#aec5eb",
			},
			secondary: {
				main: "#f4ea8e",
			},
			error: {
				main: "#f4b5b0",
			},
			warning: {
				main: "#e2a3b7",
			},
			info: {
				main: "#b3b6b7",
			},
			success: {
				main: "#b3d9c6",
			},
		},
		dark: {
			primary: {
				main: "#5e6c82",
			},
			secondary: {
				main: "#768076",
			},
			error: {
				main: "#905e68",
			},
			warning: {
				main: "#7d6f90",
			},
			info: {
				main: "#6f7677",
			},
			success: {
				main: "#759c91",
			},
			background: {
				default: "#617b98",
				paper: "#8fa2b9",
			},
			text: {
				primary: "#ffffff",
				secondary: "rgba(255, 255, 255, 0.7)",
			},
		},
	},
	green: {
		light: {
			primary: {
				main: "#c6f1d6",
			},
			secondary: {
				main: "#f5cbcb",
			},
			error: {
				main: "#ebd8b7",
			},
			warning: {
				main: "#cfc3cf",
			},
			info: {
				main: "#b5d6ea",
			},
			success: {
				main: "#f4ebc1",
			},
		},
		dark: {
			primary: {
				main: "#76a68f",
			},
			secondary: {
				main: "#a67979",
			},
			error: {
				main: "#a68d71",
			},
			warning: {
				main: "#91828f",
			},
			info: {
				main: "#779ca3",
			},
			success: {
				main: "#a6ad79",
			},
			background: {
				default: "#8abf99", // Verde pastel más oscuro
				paper: "#a5cbbf", // Verde pastel más claro
			},
			text: {
				primary: "#ffffff",
				secondary: "rgba(255, 255, 255, 0.7)",
			},
		},
	},
};
