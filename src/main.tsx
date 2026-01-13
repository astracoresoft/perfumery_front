import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/theme/theme.ts";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "@/store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<ThemeProvider theme={theme}>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<CssBaseline />
				<App />
			</PersistGate>
		</Provider>
	</ThemeProvider>
);
