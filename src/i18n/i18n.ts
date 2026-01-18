import type { LocalizedString } from "@/types/сommon.type";
import i18n from "i18next";

export type Lang = "ua" | "ru" | "en";

export const getLang = (): Lang => {
	const lng = i18n.language?.split("-")[0];

	if (lng === "ua" || lng === "ru" || lng === "en") {
		return lng;
	}

	return "ru";
};

export const tLocal = (obj?: LocalizedString | null): string => {
	if (!obj) return "";
	const lang = getLang();
	return obj[lang] ?? obj.en ?? Object.values(obj)[0];
};
