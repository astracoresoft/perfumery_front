import type { ProductVariant } from "./product.type";

export interface CartItem {
	productId: string;
	title: string;
	image: string;

	variant: ProductVariant;

	qty: number;
	price: number;
	currency: string;
}
