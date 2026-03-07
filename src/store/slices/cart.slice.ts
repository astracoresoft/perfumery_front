import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductVariant } from "@/types/product.type";

export interface CartItem {
	productId: string;
	title: string;
	image: string;
	variant: ProductVariant;
	qty: number;
	price: number;
	currency: string;
}

interface CartState {
	items: CartItem[];
}

const initialState: CartState = {
	items: [],
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart(state, action: PayloadAction<CartItem>) {
			const item = action.payload;

			const existing = state.items.find(
				(i) => i.productId === item.productId && i.variant.name.ua.trim() === item.variant.name.ua.trim(),
			);

			if (existing) {
				existing.qty += item.qty;
			} else {
				state.items.push(item);
			}
		},

		removeFromCart(state, action: PayloadAction<{ productId: string; variantName: string }>) {
			state.items = state.items.filter(
				(i) =>
					!(
						i.productId === action.payload.productId &&
						i.variant.name.ua.trim() === action.payload.variantName.trim()
					),
			);
		},

		updateQty(state, action: PayloadAction<{ productId: string; variantName: string; qty: number }>) {
			const item = state.items.find(
				(i) =>
					i.productId === action.payload.productId &&
					i.variant.name.ua.trim() === action.payload.variantName.trim(),
			);

			if (item) {
				item.qty = Math.max(1, action.payload.qty);
			}
		},

		clearCart(state) {
			state.items = [];
		},
	},
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
