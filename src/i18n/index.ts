import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ru from "./ru.json";
import ua from "./ua.json";

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			ru: { translation: ru },
			ua: { translation: ua },
		},

		fallbackLng: "ru",

		supportedLngs: ["ru", "ua"],

		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
			lookupLocalStorage: "i18nextLng",
		},

		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
