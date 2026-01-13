/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/preserve-manual-memoization */
import { Box, Typography, Stack, Button, Divider, IconButton, Chip, CircularProgress } from "@mui/material";
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
			<Box p={6} display="flex" justifyContent="center">
				<CircularProgress />
			</Box>
		);
	}

	if (!product) {
		return <Navigate to="/" replace />;
	}

	return (
		<Box maxWidth="1200px" mx="auto" p={{ xs: 2, md: 6 }}>
			<Stack direction={{ xs: "column", md: "row" }} spacing={6}>
				<Box flex={1}>
					<img
						src={product.images?.[0] ?? placeholderImg}
						alt={product.name}
						style={{ width: "100%", maxWidth: 420, objectFit: "contain" }}
					/>
				</Box>

				<Box flex={1}>
					<Typography variant="h5" fontWeight={700} mb={1}>
						{product.name}
					</Typography>

					<Typography variant="caption" color="text.secondary">
						SKU: {product.sku}
					</Typography>

					<Stack direction="row" spacing={0.5} alignItems="center" mt={1} mb={3}>
						{Array.from({ length: 5 }).map((_, i) => (
							<StarIcon key={i} fontSize="small" />
						))}
						<Typography variant="body2" ml={1}>
							{product.reviewsCount} reviews
						</Typography>
					</Stack>

					<Typography variant="h6" fontWeight={700} mb={3}>
						{selectedVariant?.price}
					</Typography>

					<Typography fontWeight={600} mb={1}>
						Volume
					</Typography>
					<Stack direction="row" spacing={1} mb={3}>
						{variants.map((v) => (
							<Chip
								key={v.ml}
								label={`${v.ml} ml`}
								clickable
								color={selectedVariant?.ml === v.ml ? "primary" : "default"}
								onClick={() => setSelectedVariant(v)}
							/>
						))}
					</Stack>

					<Stack direction="row" alignItems="center" spacing={2} mb={4}>
						<IconButton onClick={() => setQty(Math.max(1, qty - 1))}>
							<RemoveIcon />
						</IconButton>
						<Typography>{qty}</Typography>
						<IconButton onClick={() => setQty(qty + 1)}>
							<AddIcon />
						</IconButton>
					</Stack>

					<Button
						fullWidth
						size="large"
						variant="contained"
						disabled={!selectedVariant || product.stock === 0}
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
						sx={{ mb: 4 }}
					>
						Add to cart
					</Button>

					<Typography variant="body2" color="text.secondary">
						{product.description}
					</Typography>

					<Divider sx={{ my: 3 }} />

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
