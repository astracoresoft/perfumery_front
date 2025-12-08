import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	palette: {
		mode: "light",

		primary: {
			main: "#1976d2",
		},

		secondary: {
			main: "#ff4081",
		},

		background: {
			default: "#ffffff",
			paper: "#ffffff",
		},

		text: {
			primary: "#111",
			secondary: "#555",
		},
	},

	typography: {
		fontFamily: "Inter, Arial, sans-serif",

		h1: {
			fontSize: "2.5rem",
			fontWeight: 700,
		},

		h2: {
			fontSize: "2rem",
			fontWeight: 600,
		},

		body1: {
			fontSize: "1rem",
			fontWeight: 400,
		},
	},
});
