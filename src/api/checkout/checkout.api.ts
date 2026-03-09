import { api } from "@/api/axios";

export interface CheckoutPayload {
	customer: {
		fullName: string;
		email: string;
		phone: string;
		address: string;
		city: string;
		comment: string;
	};
	items: {
		productId: string;
		title: string;
		qty: number;
		price: number;
		subtotal: number;
		currency: string;
		image: string;
		variant: {
			name: {
				ua: string;
				ru: string;
				en: string;
			};
			price: Record<string, never> | object;
			image: string;
			isActive: boolean;
			sku: string;
			stock: number;
		};
	}[];
	summary: {
		totalItems: number;
		totalPrice: number;
		currency: string;
	};
}

export const createOrder = (payload: CheckoutPayload) => {
	console.log(payload);

	return api.post("/orders/checkout", payload);
};
