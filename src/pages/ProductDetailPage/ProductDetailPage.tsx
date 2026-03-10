/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/preserve-manual-memoization */
import {
	Box,
	CircularProgress,
	Typography,
	Stack,
	Button,
	Divider,
	IconButton,
	useTheme,
	useMediaQuery,
	CardMedia,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useParams, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { getProductBySlug } from "@/api/product/product.api";
import { addToCart } from "@/store/slices/cart.slice";

import type { Product } from "@/types/product.type";
import type { ProductVariant } from "@/types/productCard.type";

import placeholderImg from "@/assets/images/testPerfume.png";
import { tLocal } from "@/i18n/i18n";

const SMALL_VARIANTS = ["5", "10", "20"];

export function ProductDetailPage() {
	const { t } = useTranslation();
	const { id } = useParams<{ id?: string }>();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	const [qty, setQty] = useState(1);
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

	useEffect(() => {
		if (!id) return;

		setLoading(true);
		setNotFound(false);

		getProductBySlug(id)
			.then((res) => {
				setProduct(res.data.data);
			})
			.catch(() => {
				setProduct(null);
				setNotFound(true);
			})
			.finally(() => setLoading(false));
	}, [id]);

	const variants: ProductVariant[] = useMemo(() => product?.variants ?? [], [product]);

	const normalizedVariants = useMemo(
		() =>
			variants.map((variant) => ({
				...variant,
				label: variant.name.ua.trim(),
			})),
		[variants],
	);

	const imageVariants = useMemo(
		() => normalizedVariants.filter((variant) => SMALL_VARIANTS.includes(variant.label)),
		[normalizedVariants],
	);

	const textVariants = useMemo(
		() => normalizedVariants.filter((variant) => !SMALL_VARIANTS.includes(variant.label)),
		[normalizedVariants],
	);

	useEffect(() => {
		if (normalizedVariants.length === 0) {
			setSelectedVariant(null);
			return;
		}

		const firstActiveRegular =
			normalizedVariants.find((variant) => variant.isActive && !SMALL_VARIANTS.includes(variant.label)) ?? null;

		const fallbackActive = normalizedVariants.find((variant) => variant.isActive) ?? null;

		setSelectedVariant(firstActiveRegular ?? fallbackActive ?? normalizedVariants[0] ?? null);
	}, [normalizedVariants]);

	if (loading) {
		return (
			<Box py={10} display="flex" justifyContent="center">
				<CircularProgress />
			</Box>
		);
	}

	if (notFound || !product) {
		return (
			<Box maxWidth="900px" mx="auto" p={{ xs: 2, md: 6 }} textAlign="center">
				<Typography variant="h5" fontWeight={700} mb={1}>
					{t("product.notFoundTitle", "Товар не найден")}
				</Typography>
				<Typography color="text.secondary" mb={3}>
					{t("product.notFoundText", "Возможно, ссылка устарела или товар удалён.")}
				</Typography>
				<Button variant="contained" onClick={() => navigate("/products")}>
					{t("product.backToCatalog", "Вернуться в каталог")}
				</Button>
			</Box>
		);
	}

	const API_ORIGIN = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

	const toImageUrl = (url?: string | null) => {
		if (!url) return "";
		if (url.startsWith("http")) return url;
		return `${API_ORIGIN}${url}`;
	};

	const isSmallSelected = !!selectedVariant && SMALL_VARIANTS.includes(selectedVariant.name.ua.trim());

	const displayImage = (() => {
		if (!selectedVariant) {
			return toImageUrl(product.images?.[0]?.url) || placeholderImg;
		}

		if (isSmallSelected && (selectedVariant as any).image) {
			return toImageUrl((selectedVariant as any).image) || placeholderImg;
		}

		return toImageUrl(product.images?.[0]?.url) || placeholderImg;
	})();

	const selectedSmallVariantValue = isSmallSelected ? (selectedVariant?.name.ua.trim() ?? "") : "";

	const handleRozpyvChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		const variant = normalizedVariants.find((v) => v.label === value);

		if (variant && variant.isActive) {
			setSelectedVariant(variant);
		}
	};

	return (
		<Box maxWidth="1200px" mx="auto" px={{ xs: 2, md: 6 }} py={6}>
			<Stack direction={isMobile ? "column" : "row"} spacing={6} alignItems="flex-start">
				<Box
					flex={1}
					sx={{
						bgcolor: "#fafafa",
						borderRadius: 4,
						p: 4,
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Box
						sx={{
							margin: "auto",
							width: "100%",
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "rgba(255,255,255,0.04)",
							borderRadius: 2,
							overflow: "hidden",
						}}
					>
						<CardMedia
							component="img"
							image={displayImage}
							sx={{
								width: "100%",
								height: "100%",
								objectFit: "contain",
								padding: 1,
							}}
						/>
					</Box>
				</Box>

				<Box flex={1}>
					<Typography variant="h4" fontWeight={700} mb={1}>
						{tLocal(product.name)}
					</Typography>

					<Typography variant="caption" color="text.secondary">
						SKU: {product.sku}
					</Typography>

					<Stack direction="row" spacing={0.5} alignItems="center" mt={2} mb={3}>
						{Array.from({ length: 5 }).map((_, i) => (
							<StarIcon key={i} fontSize="small" color="warning" />
						))}
						<Typography variant="body2" ml={1}>
							{product.reviewsCount} reviews
						</Typography>
					</Stack>

					<Typography fontSize={28} fontWeight={800} color="primary" mb={3}>
						{selectedVariant?.price.current} {selectedVariant?.price.currency}
					</Typography>

					{normalizedVariants.length > 0 && (
						<Box sx={{ mb: 4 }}>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: 1.5,
									width: "100%",
								}}
							>
								{imageVariants.length > 0 && (
									<FormControl fullWidth size="small">
										<InputLabel id={`rozpyv-label-${product._id}`}>{t("common.rozpiv")}</InputLabel>
										<Select
											labelId={`rozpyv-label-${product._id}`}
											value={selectedSmallVariantValue}
											label={`${t("common.rozpiv")}`}
											displayEmpty
											onChange={handleRozpyvChange}
											renderValue={(selected) => {
												if (!selected) return t("common.rozpiv");
												return `${selected} МЛ`;
											}}
											sx={{
												borderRadius: 2,
											}}
										>
											{imageVariants.map((variant) => (
												<MenuItem
													key={variant.sku}
													value={variant.label}
													disabled={!variant.isActive}
												>
													{variant.label} МЛ
												</MenuItem>
											))}
										</Select>
									</FormControl>
								)}

								{textVariants.length > 0 && (
									<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
										{textVariants.map((variant) => {
											const isSelected = selectedVariant?.name.ua.trim() === variant.label;
											const isDisabled = !variant.isActive;

											return (
												<Button
													key={variant.sku}
													variant={isSelected ? "contained" : "outlined"}
													disabled={isDisabled}
													onClick={() => {
														if (!isDisabled) setSelectedVariant(variant);
													}}
													sx={{
														minWidth: 80,
														height: 44,
														borderRadius: 8,
														fontWeight: isSelected ? 700 : 400,
														textTransform: "none",
														opacity: isDisabled ? 0.5 : 1,
													}}
												>
													{variant.label} МЛ
												</Button>
											);
										})}
									</Stack>
								)}
							</Box>
						</Box>
					)}

					<Stack direction="row" alignItems="center" spacing={2} mb={4}>
						<Stack
							direction="row"
							alignItems="center"
							spacing={1}
							sx={{ bgcolor: "#f5f5f5", borderRadius: 999, px: 1.5, py: 0.5 }}
						>
							<IconButton size="small" disabled={qty <= 1} onClick={() => setQty(Math.max(1, qty - 1))}>
								<RemoveIcon fontSize="small" />
							</IconButton>
							<Typography fontWeight={600}>{qty}</Typography>
							<IconButton size="small" onClick={() => setQty(qty + 1)}>
								<AddIcon fontSize="small" />
							</IconButton>
						</Stack>
					</Stack>

					<Button
						fullWidth
						size="large"
						variant="contained"
						disabled={!selectedVariant || !selectedVariant.isActive || product.stock === 0}
						sx={{ height: 56, fontSize: 16, fontWeight: 600, mb: 4 }}
						onClick={() =>
							selectedVariant &&
							selectedVariant.isActive &&
							dispatch(
								addToCart({
									productId: product._id,
									title: tLocal(product.name),
									image:
										isSmallSelected && (selectedVariant as any).image
											? toImageUrl((selectedVariant as any).image)
											: toImageUrl(product.images?.[0]?.url) || placeholderImg,
									variant: {
										...selectedVariant,
										image:
											isSmallSelected && (selectedVariant as any).image
												? (selectedVariant as any).image
												: (product.images?.[0]?.url ?? ""),
									},
									qty,
									price: selectedVariant.price.current,
									currency: selectedVariant.price.currency,
								}),
							)
						}
					>
						{t("common.addToCart")}
					</Button>

					<Typography variant="body2" color="text.secondary" mb={4}>
						{tLocal(product.description)}
					</Typography>

					<Divider sx={{ my: 3 }} />

					<Stack direction="row" spacing={4} />
				</Box>
			</Stack>
		</Box>
	);
}
