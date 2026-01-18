import { Box, Typography, Stack, Button, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import CartProductItem from "@/components/ui/CartProductsItem/CartProductsItem";
import { updateQty, removeFromCart } from "@/store/slices/cart.slice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CartSection = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const items = useSelector((state: RootState) => state.cart.items);
	const navigate = useNavigate();

	const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
	const currency = items[0]?.currency ?? "UAH";

	return (
		<Box maxWidth="1200px" mx="auto" p={{ xs: 2, md: 6 }}>
			<Typography variant="h4" align="center" mb={4}>
				{t("common.cart")}
			</Typography>

			<Divider />

			{items.length === 0 ? (
				<Typography align="center" mt={6} mb={6}>
					{t("checkout.emptyCart", "Корзина пуста")}
				</Typography>
			) : (
				items.map((item) => (
					<CartProductItem
						key={`${item.productId}-${item.variant.sku}`}
						item={item}
						onQtyChange={(productId, sku, qty) => dispatch(updateQty({ productId, sku, qty }))}
						onRemove={(productId, sku) => dispatch(removeFromCart({ productId, sku }))}
					/>
				))
			)}

			<Divider sx={{ mt: 2 }} />

			<Stack direction="row" justifyContent="space-between" mt={4}>
				<Typography fontWeight={700}>{t("common.total")}</Typography>
				<Typography fontWeight={700}>
					{total} {currency}
				</Typography>
			</Stack>

			<Button fullWidth variant="contained" sx={{ mt: 4 }} onClick={() => navigate("/checkout")}>
				{t("common.checkout")}
			</Button>
		</Box>
	);
};

export default CartSection;
