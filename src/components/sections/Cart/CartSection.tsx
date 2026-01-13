/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography, Stack, Button, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import CartProductItem from "@/components/ui/CartProductsItem/CartProductsItem";
import { updateQty, removeFromCart } from "@/store/slices/cart.slice";

const CartSection = () => {
	const dispatch = useDispatch();
	const items = useSelector((state: RootState) => state.cart.items);

	const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
	const currency = items[0]?.currency ?? "UAH";

	return (
		<Box maxWidth="1200px" mx="auto" p={{ xs: 2, md: 6 }}>
			<Typography variant="h4" align="center" mb={4}>
				CART
			</Typography>

			<Divider />

			{items.length === 0 ? (
				<Typography align="center" mt={6}>
					Cart is empty
				</Typography>
			) : (
				items.map((item: any) => (
					<CartProductItem
						key={`${item.productId}-${item.variant.ml}`}
						item={item}
						onQtyChange={(productId, ml, qty) => dispatch(updateQty({ productId, ml, qty }))}
						onRemove={(productId, ml) => dispatch(removeFromCart({ productId, ml }))}
					/>
				))
			)}

			<Divider sx={{ mt: 2 }} />

			<Stack direction="row" justifyContent="space-between" mt={4}>
				<Typography fontWeight={700}>TOTAL</Typography>
				<Typography fontWeight={700}>
					{total} {currency}
				</Typography>
			</Stack>

			<Button fullWidth variant="contained" sx={{ mt: 4 }}>
				CHECKOUT
			</Button>
		</Box>
	);
};

export default CartSection;
