import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

import { ProductsSection } from "@/components/sections/Products/ProductsSection/ProductsSection";
import { getCategories } from "@/api/category/category.api";

import type { Category } from "@/types/category.type";

export function ProductsPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getCategories(true)
			.then((res) => {
				setCategories(res.data.data);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	/* ================= LOADING ================= */

	if (loading) {
		return (
			<Box py={10} display="flex" justifyContent="center">
				<CircularProgress />
			</Box>
		);
	}

	/* ================= EMPTY ================= */

	if (categories.length === 0) {
		return (
			<Box py={10} textAlign="center">
				<Typography variant="h6">Categories not found</Typography>
			</Box>
		);
	}

	/* ================= RENDER ================= */

	return <ProductsSection categories={categories} />;
}
