/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useState } from "react";
import { Box, Stack, Typography, TextField, Button, Divider, Paper, Chip, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { RootState } from "@/store/store";
import { tLocal } from "@/i18n/i18n";
import { createOrder } from "@/api/checkout/checkout.api";
import { clearCart } from "@/store/slices/cart.slice";

type CheckoutFormState = {
	fullName: string;
	phone: string;
	email: string;
	city: string;
	address: string;
	comment: string;
};

type Locale = "ua" | "ru" | "en";
type LocalizedString = Record<Locale, string>;

interface Price {
	current: number;
	old: number | null;
	currency: string;
}

interface CheckoutProductVariantPayload {
	name: LocalizedString;
	price: Price;
	sku: string;
	stock: number;
	isActive: boolean;
	image: string;
}

interface CheckoutCartItemPayload {
	productId: string;
	title: string;
	image: string;
	variant: CheckoutProductVariantPayload;
	qty: number;
	price: number;
	currency: string;
	subtotal: number;
}

interface CheckoutCustomerPayload {
	fullName: string;
	phone: string;
	email: string;
	city: string;
	address: string;
	comment: string;
}

interface CheckoutSummaryPayload {
	totalItems: number;
	totalPrice: number;
	currency: string;
}

interface CreateOrderPayload {
	customer: CheckoutCustomerPayload;
	items: CheckoutCartItemPayload[];
	summary: CheckoutSummaryPayload;
}

type FormErrors = {
	fullName: string;
	phone: string;
	email: string;
	city: string;
	address: string;
};

export function CheckoutPage() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const items = useSelector((state: RootState) => state.cart.items);

	const [form, setForm] = useState<CheckoutFormState>({
		fullName: "",
		phone: "",
		email: "",
		city: "",
		address: "",
		comment: "",
	});

	const [errors, setErrors] = useState<FormErrors>({
		fullName: "",
		phone: "",
		email: "",
		city: "",
		address: "",
	});

	const [orderSuccess, setOrderSuccess] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!items.length && !orderSuccess) {
		return <Navigate to="/cart" replace />;
	}

	const total = items.reduce((sum, i) => sum + i.variant.price.current * i.qty, 0);
	const currency = items[0]?.variant.price.currency ?? "UAH";

	const phoneRegex = /^\+?[0-9]+$/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const validateField = (field: keyof CheckoutFormState, value: string) => {
		const trimmedValue = value.trim();

		switch (field) {
			case "fullName":
				if (!trimmedValue) return t("checkout.validation.fullNameRequired", "Введите имя и фамилию");
				return "";

			case "phone":
				if (!trimmedValue) return t("checkout.validation.phoneRequired", "Введите номер телефона");
				if (!phoneRegex.test(trimmedValue)) {
					return t("checkout.validation.phoneInvalid", "Телефон может содержать только цифры и знак +");
				}
				return "";

			case "email":
				if (!trimmedValue) return t("checkout.validation.emailRequired", "Введите email");
				if (!emailRegex.test(trimmedValue)) {
					return t("checkout.validation.emailInvalid", "Введите корректный email");
				}
				return "";

			case "city":
				if (!trimmedValue) return t("checkout.validation.cityRequired", "Введите город");
				return "";

			case "address":
				if (!trimmedValue) return t("checkout.validation.addressRequired", "Введите адрес");
				return "";

			default:
				return "";
		}
	};

	const handleChange = (field: keyof CheckoutFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;

		if (field === "phone") {
			value = value.replace(/[^+\d]/g, "");

			if (value.includes("+")) {
				const hasPlusAtStart = value.startsWith("+");
				value = (hasPlusAtStart ? "+" : "") + value.replace(/\+/g, "");
			}
		}

		setForm((prev) => ({
			...prev,
			[field]: value,
		}));

		if (field !== "comment") {
			setErrors((prev) => ({
				...prev,
				[field]: validateField(field, value),
			}));
		}
	};

	const validateForm = () => {
		const nextErrors: FormErrors = {
			fullName: validateField("fullName", form.fullName),
			phone: validateField("phone", form.phone),
			email: validateField("email", form.email),
			city: validateField("city", form.city),
			address: validateField("address", form.address),
		};

		setErrors(nextErrors);

		return Object.values(nextErrors).every((error) => !error);
	};

	const isFormValid = useMemo(() => {
		return (
			form.fullName.trim() !== "" &&
			form.phone.trim() !== "" &&
			form.email.trim() !== "" &&
			form.city.trim() !== "" &&
			form.address.trim() !== "" &&
			phoneRegex.test(form.phone.trim()) &&
			emailRegex.test(form.email.trim())
		);
	}, [form]);

	const handleConfirmOrder = async () => {
		if (!validateForm() || isSubmitting) return;

		const groupedItems: CheckoutCartItemPayload[] = items.map((item) => ({
			productId: item.productId,
			title: item.title,
			image: item.image,
			qty: item.qty,
			price: item.price,
			currency: item.currency,
			subtotal: item.price * item.qty,
			variant: {
				name: item.variant.name,
				price: {
					current: item.variant.price.current,
					old: item.variant.price.old ?? null,
					currency: item.variant.price.currency,
				},
				image: item.variant.image,
				isActive: item.variant.isActive,
				stock: item.variant.stock,
				sku: item.variant.sku,
			},
		}));

		const order: CreateOrderPayload = {
			customer: {
				fullName: form.fullName.trim(),
				phone: form.phone.trim(),
				email: form.email.trim(),
				city: form.city.trim(),
				address: form.address.trim(),
				comment: form.comment.trim(),
			},
			items: groupedItems,
			summary: {
				totalItems: items.reduce((sum, item) => sum + item.qty, 0),
				totalPrice: total,
				currency,
			},
		};

		try {
			setIsSubmitting(true);
			await createOrder(order);
			dispatch(clearCart());
			setOrderSuccess(true);
		} catch (error) {
			console.error("ORDER_SEND_ERROR", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (orderSuccess) {
		return (
			<Box maxWidth="700px" mx="auto" p={{ xs: 2, md: 6 }}>
				<Paper
					elevation={4}
					sx={{
						p: 4,
						borderRadius: 4,
						textAlign: "center",
					}}
				>
					<Typography variant="h4" mb={2}>
						Спасибо за заказ
					</Typography>

					<Typography variant="body1">Мы вам перезвоним в ближайшее время.</Typography>
				</Paper>
			</Box>
		);
	}

	return (
		<Box maxWidth="1100px" mx="auto" p={{ xs: 2, md: 6 }}>
			<Typography variant="h4" mb={4} textAlign="center">
				{t("checkout.title")}
			</Typography>

			<Stack direction={{ xs: "column", md: "column", lg: "row" }} spacing={4} width="100%">
				<Box flex={1} width={{ xs: "100%", md: "100%", lg: "auto" }}>
					<Typography fontWeight={700} mb={2}>
						{t("checkout.deliveryDetails")}
					</Typography>

					<Stack spacing={2} width="100%">
						<TextField
							label={t("checkout.fullName")}
							required
							fullWidth
							value={form.fullName}
							onChange={handleChange("fullName")}
							error={!!errors.fullName}
							helperText={errors.fullName}
							disabled={isSubmitting}
						/>

						<TextField
							label={t("checkout.phone")}
							required
							fullWidth
							value={form.phone}
							onChange={handleChange("phone")}
							error={!!errors.phone}
							helperText={errors.phone}
							disabled={isSubmitting}
						/>

						<TextField
							label={t("checkout.email")}
							required
							fullWidth
							value={form.email}
							onChange={handleChange("email")}
							error={!!errors.email}
							helperText={errors.email}
							disabled={isSubmitting}
						/>

						<TextField
							label={t("checkout.city")}
							required
							fullWidth
							value={form.city}
							onChange={handleChange("city")}
							error={!!errors.city}
							helperText={errors.city}
							disabled={isSubmitting}
						/>

						<TextField
							label={t("checkout.address")}
							required
							fullWidth
							value={form.address}
							onChange={handleChange("address")}
							error={!!errors.address}
							helperText={errors.address}
							disabled={isSubmitting}
						/>

						<TextField
							label={t("checkout.comment")}
							multiline
							rows={3}
							fullWidth
							value={form.comment}
							onChange={handleChange("comment")}
							disabled={isSubmitting}
						/>
					</Stack>

					<Button
						fullWidth
						size="large"
						variant="contained"
						onClick={handleConfirmOrder}
						disabled={!isFormValid || isSubmitting}
						sx={{
							mt: 4,
							height: 56,
							fontSize: 16,
							fontWeight: 600,
						}}
					>
						{isSubmitting ? <CircularProgress size={24} color="inherit" /> : t("checkout.confirmOrder")}
					</Button>
				</Box>

				<Box
					flex={1}
					width={{ xs: "100%", md: "100%", lg: "auto" }}
					sx={{
						position: { xs: "static", md: "static", lg: "sticky" },
						top: { lg: 96 },
						alignSelf: "flex-start",
					}}
				>
					<Paper
						elevation={4}
						sx={{
							p: 3,
							borderRadius: 4,
							bgcolor: "background.paper",
							width: "100%",
						}}
					>
						<Typography fontWeight={700} fontSize={18} mb={2}>
							{t("checkout.orderSummary")}
						</Typography>

						<Stack spacing={2}>
							{items.map((item) => (
								<Box
									key={`${item.productId}-${tLocal(item.variant.name)}`}
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
											<Chip size="small" label={`${tLocal(item.variant.name)} МЛ`} />

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
								{total.toFixed(2)} {currency}
							</Typography>
						</Stack>
					</Paper>
				</Box>
			</Stack>
		</Box>
	);
}
