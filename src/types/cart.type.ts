export interface CartItem {
	productId: string; // product._id или slug
	name: string;
	image: string;
	price: number;
	currency: string;
	ml: number;
	qty: number;
}
