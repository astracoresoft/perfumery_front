import type { LocalizedString } from "./сommon.type";

export interface ProductVariant {
	sku: string;
	name: LocalizedString;
	price: {
		current: number;
		old: number;
		currency: string;
	};
	stock: number;
	isActive: boolean;
}
