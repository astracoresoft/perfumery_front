/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/preserve-manual-memoization */
import {
	Box,
	Typography,
	Stack,
	Button,
	Divider,
	IconButton,
	Chip,
	CircularProgress,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { useParams, Navigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { getProductBySlug } from "@/api/product/product.api";
import { addToCart } from "@/store/slices/cart.slice";
import type { Product } from "@/types/product.type";
import type { ProductVariant } from "@/types/productCard.type";

import placeholderImg from "@/assets/images/testPerfume.png";

export function ProductDetailPage() {
	const { id: slug } = useParams<{ id: string }>();
	const dispatch = useDispatch();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [qty, setQty] = useState(1);
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

	useEffect(() => {
		if (!slug) return;

		getProductBySlug(slug)
			.then((res) => setProduct(res.data.data))
			.finally(() => setLoading(false));
	}, [slug]);

	const variants: ProductVariant[] = useMemo(() => {
		if (!product) return [];
		if (product.variants.length > 0) return product.variants as ProductVariant[];
		return [{ ml: 50, price: product.price.current }];
	}, [product]);

	useEffect(() => {
		if (variants.length > 0) setSelectedVariant(variants[0]);
	}, [variants]);

	if (loading) {
		return (
			<Box py={10} display="flex" justifyContent="center">
				<CircularProgress />
			</Box>
		);
	}

	if (!product) {
		return <Navigate to="/" replace />;
	}

	return (
		<Box maxWidth="1200px" mx="auto" px={{ xs: 2, md: 6 }} py={6}>
			<Stack direction={isMobile ? "column" : "row"} spacing={6} alignItems="flex-start">
				{/* IMAGE COLUMN */}
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
						component="img"
						src={product.images?.[0] ?? placeholderImg}
						alt={product.name}
						sx={{
							width: "100%",
							maxWidth: 360,
							objectFit: "contain",
						}}
					/>
				</Box>

				{/* INFO COLUMN */}
				<Box flex={1}>
					<Typography variant="h4" fontWeight={700} mb={1}>
						{product.name}
					</Typography>

					<Typography variant="caption" color="text.secondary">
						SKU: {product.sku}
					</Typography>

					{/* RATING */}
					<Stack direction="row" spacing={0.5} alignItems="center" mt={2} mb={3}>
						{Array.from({ length: 5 }).map((_, i) => (
							<StarIcon key={i} fontSize="small" color="warning" />
						))}
						<Typography variant="body2" ml={1}>
							{product.reviewsCount} reviews
						</Typography>
					</Stack>

					{/* PRICE */}
					<Typography fontSize={28} fontWeight={800} color="primary" mb={3}>
						{selectedVariant?.price} {product.price.currency}
					</Typography>

					{/* VARIANTS */}
					<Typography fontWeight={600} mb={1}>
						Volume
					</Typography>

					<Stack direction="row" spacing={1} mb={4}>
						{variants.map((v) => (
							<Chip
								key={v.ml}
								label={`${v.ml} ml`}
								clickable
								onClick={() => setSelectedVariant(v)}
								sx={{
									borderRadius: 2,
									fontWeight: selectedVariant?.ml === v.ml ? 700 : 400,
									bgcolor: selectedVariant?.ml === v.ml ? "primary.main" : "transparent",
									color: selectedVariant?.ml === v.ml ? "white" : "text.primary",
									border: "1px solid",
									borderColor: selectedVariant?.ml === v.ml ? "primary.main" : "divider",
								}}
							/>
						))}
					</Stack>

					{/* QTY */}
					<Stack direction="row" alignItems="center" spacing={2} mb={4}>
						<Stack
							direction="row"
							alignItems="center"
							spacing={1}
							sx={{
								bgcolor: "#f5f5f5",
								borderRadius: 999,
								px: 1.5,
								py: 0.5,
							}}
						>
							<IconButton size="small" disabled={qty <= 1} onClick={() => setQty(Math.max(1, qty - 1))}>
								<RemoveIcon fontSize="small" />
							</IconButton>

							<Typography fontWeight={600}>{qty}</Typography>

							<IconButton size="small" onClick={() => setQty(qty + 1)}>
								<AddIcon fontSize="small" />
							</IconButton>
						</Stack>

						<Typography variant="body2" color="text.secondary">
							In stock: {product.stock}
						</Typography>
					</Stack>

					{/* CTA */}
					<Button
						fullWidth
						size="large"
						variant="contained"
						disabled={!selectedVariant || product.stock === 0}
						sx={{
							height: 56,
							fontSize: 16,
							fontWeight: 600,
							mb: 4,
						}}
						onClick={() =>
							selectedVariant &&
							dispatch(
								addToCart({
									productId: product.slug,
									title: product.name,
									image: product.images?.[0] ?? placeholderImg,
									variant: selectedVariant,
									qty,
									price: selectedVariant.price,
									currency: product.price.currency,
								})
							)
						}
					>
						Add to cart
					</Button>

					{/* DESCRIPTION */}
					<Typography variant="body2" color="text.secondary" mb={4}>
						{product.description}
					</Typography>

					<Divider sx={{ my: 3 }} />

					{/* ACTIONS */}
					<Stack direction="row" spacing={4}>
						<Stack direction="row" spacing={1} alignItems="center">
							<ShareIcon fontSize="small" />
							<Typography variant="body2">Share</Typography>
						</Stack>

						<Stack direction="row" spacing={1} alignItems="center">
							<MailOutlineIcon fontSize="small" />
							<Typography variant="body2">Contact</Typography>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Box>
	);
}
