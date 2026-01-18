export type Locale = "ua" | "ru" | "en";

export type LocalizedString = Record<Locale, string>;

export interface Price {
	current: number;
	old: number;
	currency: string;
}
