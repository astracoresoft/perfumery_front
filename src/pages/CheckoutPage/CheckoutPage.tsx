import { Box, Stack, Typography, TextField, Button, Divider, Paper, Chip } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { RootState } from "@/store/store";
import { tLocal } from "@/i18n/i18n";

export function CheckoutPage() {
	const { t } = useTranslation();
	const items = useSelector((state: RootState) => state.cart.items);

	if (!items.length) {
		return <Navigate to="/cart" replace />;
	}

	const total = items.reduce((sum, i) => sum + i.variant.price.current * i.qty, 0);

	const currency = items[0].variant.price.currency;

	return (
		<Box maxWidth="1100px" mx="auto" p={{ xs: 2, md: 6 }}>
			<Typography variant="h4" mb={4} textAlign="center">
				{t("checkout.title")}
			</Typography>

			<Stack direction={{ xs: "column", md: "row" }} spacing={4}>
				{/* ================= FORM ================= */}
				<Box flex={1}>
					<Typography fontWeight={700} mb={2}>
						{t("checkout.deliveryDetails")}
					</Typography>

					<Stack spacing={2}>
						<TextField label={t("checkout.fullName")} required />
						<TextField label={t("checkout.phone")} required />
						<TextField label={t("checkout.email")} />
						<TextField label={t("checkout.city")} required />
						<TextField label={t("checkout.address")} required />
						<TextField label={t("checkout.comment")} multiline rows={3} />
					</Stack>

					<Button
						fullWidth
						size="large"
						variant="contained"
						sx={{
							mt: 4,
							height: 56,
							fontSize: 16,
							fontWeight: 600,
						}}
					>
						{t("checkout.confirmOrder")}
					</Button>
				</Box>

				{/* ================= SUMMARY ================= */}
				<Box
					flex={1}
					sx={{
						position: "sticky",
						top: 96,
						alignSelf: "flex-start",
					}}
				>
					<Paper
						elevation={4}
						sx={{
							p: 3,
							borderRadius: 4,
							bgcolor: "background.paper",
						}}
					>
						<Typography fontWeight={700} fontSize={18} mb={2}>
							{t("checkout.orderSummary")}
						</Typography>

						<Stack spacing={2}>
							{items.map((item) => (
								<Box
									key={`${item.productId}-${item.variant.sku}`}
									sx={{
										p: 2,
										borderRadius: 2,
										bgcolor: "#f7f7f7",
									}}
								>
									<Stack spacing={0.5}>
										<Typography fontWeight={600} fontSize={14}>
											{item.title}
										</Typography>

										<Stack direction="row" justifyContent="space-between" alignItems="center">
											<Chip size="small" label={tLocal(item.variant.name)} />

											<Typography variant="body2" color="text.secondary">
												× {item.qty}
											</Typography>
										</Stack>

										<Typography fontWeight={700} textAlign="right">
											{item.variant.price.current * item.qty} {currency}
										</Typography>
									</Stack>
								</Box>
							))}
						</Stack>

						<Divider sx={{ my: 3 }} />

						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Typography fontWeight={700} fontSize={18}>
								{t("checkout.total")}
							</Typography>

							<Typography fontWeight={800} fontSize={20} color="primary">
								{total} {currency}
							</Typography>
						</Stack>
					</Paper>
				</Box>
			</Stack>
		</Box>
	);
}
