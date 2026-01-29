import type { ImageVariant, ProductVariant } from "./product.type";

export interface CartItem {
	productId: string;
	title: string;
	image: ImageVariant[];

	variant: ProductVariant;

	qty: number;
	price: number;
	currency: string;
}
