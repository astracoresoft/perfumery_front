import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/ui/ProductCard/ProductCard";
import { getProducts } from "@/api/product/product.api";
import type { Product } from "@/types/product.type";
import type { ProductVariant } from "@/types/productCard.type";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cart.slice";
import img from "@/assets/images/testPerfume.png";
import { productsFlexLayout } from "@/assets/styles/productsFlexLayout";

export function ProductsSection() {
	const navigate = useNavigate();
	const { slug } = useParams<{ slug?: string }>();
	const dispatch = useDispatch();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getProducts().then((res) => {
			setProducts(res.data.data);
			setLoading(false);
		});
	}, []);

	const filteredProducts = useMemo(() => {
		if (!slug) return products;

		return products.filter((product) => {
			if (product.category === slug) return true;
			if (product.categories?.includes(slug)) return true;
			return false;
		});
	}, [products, slug]);

	if (loading) {
		return (
			<Box p={6} display="flex" justifyContent="center">
				<CircularProgress />
			</Box>
		);
	}

	if (filteredProducts.length === 0) {
		return (
			<Box p={6} textAlign="center">
				<Typography>No products in this category</Typography>
			</Box>
		);
	}

	return (
		<Box
			p={4}
			sx={{
				display: "flex",
				flexWrap: "wrap",
				gap: 4,
				...productsFlexLayout,
			}}
		>
			{filteredProducts.map((product) => {
				// 🔥 FALLBACK variants (пока бэк пустой)
				const variants: ProductVariant[] =
					product.variants.length > 0
						? (product.variants as ProductVariant[])
						: [
								{
									ml: 50,
									price: product.price.current,
								},
						  ];

				return (
					// внутри map
					<ProductCard
						id={product.slug}
						title={product.name}
						description={product.shortDescription}
						image={product.images?.[0] ?? img}
						category={product.category ?? "Perfume"}
						inStock={product.stock > 0}
						variants={variants}
						currency={product.price.currency}
						onViewDetails={(slug) => navigate(`/products/${slug}`)}
						onAddToCart={(variant) =>
							dispatch(
								addToCart({
									productId: product.slug,
									title: product.name,
									image: product.images?.[0] ?? img,
									variant,
									qty: 1,
									price: variant.price,
									currency: product.price.currency,
								})
							)
						}
					/>
				);
			})}
		</Box>
	);
}
