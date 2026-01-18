import { Box, Stack, Typography, TextField, Button, Divider, Paper } from "@mui/material";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import type { RootState } from "@/store/store";
import { tLocal } from "@/i18n/i18n";

export function CheckoutPage() {
	const items = useSelector((state: RootState) => state.cart.items);

	if (!items.length) {
		return <Navigate to="/cart" replace />;
	}

	const total = items.reduce((sum, i) => sum + i.variant.price.current * i.qty, 0);

	const currency = items[0].variant.price.currency;

	return (
		<Box maxWidth="900px" mx="auto" p={{ xs: 2, md: 6 }}>
			<Typography variant="h4" mb={4} textAlign="center">
				Checkout
			</Typography>

			<Stack direction={{ xs: "column", md: "row" }} spacing={4}>
				{/* FORM */}
				<Box flex={1}>
					<Typography fontWeight={700} mb={2}>
						Delivery details
					</Typography>

					<Stack spacing={2}>
						<TextField label="Full name" required />
						<TextField label="Phone" required />
						<TextField label="Email" />
						<TextField label="City" required />
						<TextField label="Address" required />
						<TextField label="Comment" multiline rows={3} />
					</Stack>

					<Button fullWidth size="large" variant="contained" sx={{ mt: 4 }}>
						Confirm order
					</Button>
				</Box>

				{/* SUMMARY */}
				<Paper elevation={3} sx={{ flex: 1, p: 3, borderRadius: 3 }}>
					<Typography fontWeight={700} mb={2}>
						Order summary
					</Typography>

					<Stack spacing={1}>
						{items.map((item) => (
							<Stack
								key={`${item.productId}-${item.variant.sku}`}
								direction="row"
								justifyContent="space-between"
							>
								<Typography variant="body2">
									{item.title} — {tLocal(item.variant.name)} × {item.qty}
								</Typography>

								<Typography variant="body2">
									{item.variant.price.current * item.qty} {currency}
								</Typography>
							</Stack>
						))}
					</Stack>

					<Divider sx={{ my: 2 }} />

					<Stack direction="row" justifyContent="space-between">
						<Typography fontWeight={700}>Total</Typography>
						<Typography fontWeight={700}>
							{total} {currency}
						</Typography>
					</Stack>
				</Paper>
			</Stack>
		</Box>
	);
}
