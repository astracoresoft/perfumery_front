import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ru from "./ru.json";
import uk from "./ua.json";

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			ru: { translation: ru },
			uk: { translation: uk },
		},

		fallbackLng: "ru",

		supportedLngs: ["ru", "uk"],

		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
