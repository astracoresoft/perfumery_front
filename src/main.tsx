import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./i18n";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/theme/theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<App />
	</ThemeProvider>
);
