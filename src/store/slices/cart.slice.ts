import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductVariant } from "@/types/productCard.type";

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
				(i) => i.productId === item.productId && i.variant.ml === item.variant.ml
			);

			if (existing) {
				existing.qty += item.qty;
			} else {
				state.items.push(item);
			}
		},

		removeFromCart(state, action: PayloadAction<{ productId: string; ml: number }>) {
			state.items = state.items.filter(
				(i) => !(i.productId === action.payload.productId && i.variant.ml === action.payload.ml)
			);
		},

		updateQty(state, action: PayloadAction<{ productId: string; ml: number; qty: number }>) {
			const item = state.items.find(
				(i) => i.productId === action.payload.productId && i.variant.ml === action.payload.ml
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
