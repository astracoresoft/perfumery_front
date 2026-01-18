/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Box,
	CircularProgress,
	Typography,
	FormControl,
	Select,
	MenuItem,
	Checkbox,
	FormControlLabel,
	Autocomplete,
	TextField,
	Pagination,
	Slider,
	Chip,
	Stack,
} from "@mui/material";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SortIcon from "@mui/icons-material/Sort";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";

import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { ProductCard } from "@/components/ui/ProductCard/ProductCard";
import { getProducts } from "@/api/product/product.api";
import { getCategories } from "@/api/category/category.api";
import { addToCart } from "@/store/slices/cart.slice";

import type { Product } from "@/types/product.type";
import type { Category } from "@/types/category.type";

import img from "@/assets/images/testPerfume.png";
import { productsFlexLayout } from "@/assets/styles/productsFlexLayout";
import { tLocal } from "@/i18n/i18n";

type SortOption = "price_asc" | "price_desc" | "name_asc" | "name_desc";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function ProductsSection() {
	const { t } = useTranslation();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { slug } = useParams<{ slug?: string }>();
	const [searchParams, setSearchParams] = useSearchParams();

	/* ================= DATA ================= */

	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);

	/* ================= FILTER STATE ================= */

	const getParam = (key: string, fallback: string) => searchParams.get(key) ?? fallback;

	const [sort, setSort] = useState<SortOption>(getParam("sort", "name_asc") as SortOption);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [inStockOnly, setInStockOnly] = useState(getParam("stock", "0") === "1");
	const [page, setPage] = useState(Number(getParam("page", "1")));

	// ✅ ITEMS PER PAGE
	const [itemsPerPage, setItemsPerPage] = useState<number>(Number(getParam("limit", "12")));

	const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

	/* ================= LOAD PRODUCTS ================= */

	useEffect(() => {
		getProducts().then((res) => {
			const data = res.data.data as Product[];
			setProducts(data);

			const prices = data.map((p) => p.price.current);
			setPriceBounds([Math.min(...prices), Math.max(...prices)]);
			setPriceRange([Math.min(...prices), Math.max(...prices)]);

			setLoading(false);
		});
	}, []);

	/* ================= LOAD CATEGORIES ================= */

	useEffect(() => {
		getCategories(true).then((res) => {
			setCategories(res.data.data);
		});
	}, []);

	/* ================= APPLY BRAND FROM URL ================= */

	useEffect(() => {
		if (!slug || !categories.length) return;

		const category = categories.find((c) => c.slug === slug);

		if (category) {
			setSelectedCategories([category._id]);
			setPage(1);
		}
	}, [slug, categories]);

	/* ================= URL SYNC ================= */

	useEffect(() => {
		const params: Record<string, string> = {
			sort,
			page: String(page),
			limit: String(itemsPerPage),
		};

		if (selectedCategories.length) params.brands = selectedCategories.join(",");
		if (inStockOnly) params.stock = "1";
		if (priceRange[0] !== priceBounds[0]) params.min = String(priceRange[0]);
		if (priceRange[1] !== priceBounds[1]) params.max = String(priceRange[1]);

		setSearchParams(params, { replace: true });
	}, [sort, page, itemsPerPage, selectedCategories, inStockOnly, priceRange, priceBounds, setSearchParams]);

	useEffect(() => {
		setPage(1);
	}, [sort, selectedCategories, inStockOnly, priceRange, itemsPerPage]);

	/* ================= FILTER ================= */

	const filteredProducts = useMemo(() => {
		let result = [...products];

		if (selectedCategories.length) {
			result = result.filter(
				(p) =>
					p.categories?.some((id) => selectedCategories.includes(id)) ||
					selectedCategories.includes(p.category as any),
			);
		}

		if (inStockOnly) {
			result = result.filter((p) => p.stock > 0);
		}

		return result.filter((p) => p.price.current >= priceRange[0] && p.price.current <= priceRange[1]);
	}, [products, selectedCategories, inStockOnly, priceRange]);

	/* ================= SORT ================= */

	const sortedProducts = useMemo(() => {
		const result = [...filteredProducts];

		switch (sort) {
			case "price_asc":
				return result.sort((a, b) => a.price.current - b.price.current);
			case "price_desc":
				return result.sort((a, b) => b.price.current - a.price.current);
			case "name_desc":
				return result.sort((a, b) => tLocal(b.name).localeCompare(tLocal(a.name)));
			default:
				return result.sort((a, b) => tLocal(a.name).localeCompare(tLocal(b.name)));
		}
	}, [filteredProducts, sort]);

	/* ================= PAGINATION ================= */

	const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

	const paginatedProducts = useMemo(() => {
		const start = (page - 1) * itemsPerPage;
		return sortedProducts.slice(start, start + itemsPerPage);
	}, [page, sortedProducts, itemsPerPage]);

	/* ================= STATES ================= */

	if (loading) {
		return (
			<Box py={10} display="flex" justifyContent="center">
				<CircularProgress />
			</Box>
		);
	}

	if (!paginatedProducts.length) {
		return (
			<Box py={10} textAlign="center">
				<Typography variant="h6">{t("filters.noProducts")}</Typography>
			</Box>
		);
	}

	/* ================= RENDER ================= */

	return (
		<Box px={{ xs: 2, md: 6 }} py={4}>
			{/* FILTER BAR */}
			<Box mb={4} p={3} borderRadius={3} bgcolor="background.paper" boxShadow={1}>
				<Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
					{/* SORT */}
					<FormControl size="small" sx={{ minWidth: 220 }}>
						<Select
							value={sort}
							onChange={(e) => setSort(e.target.value as SortOption)}
							startAdornment={<SortIcon sx={{ mr: 1 }} />}
						>
							<MenuItem value="name_asc">{t("filters.sortNameAsc")}</MenuItem>
							<MenuItem value="name_desc">{t("filters.sortNameDesc")}</MenuItem>
							<MenuItem value="price_asc">{t("filters.sortPriceAsc")}</MenuItem>
							<MenuItem value="price_desc">{t("filters.sortPriceDesc")}</MenuItem>
						</Select>
					</FormControl>

					{/* ITEMS PER PAGE */}
					<FormControl size="small" sx={{ minWidth: 160 }}>
						<Select
							value={itemsPerPage}
							onChange={(e) => {
								setItemsPerPage(Number(e.target.value));
								setPage(1);
							}}
						>
							<MenuItem value={8}>8</MenuItem>
							<MenuItem value={12}>12</MenuItem>
							<MenuItem value={24}>24</MenuItem>
							<MenuItem value={48}>48</MenuItem>
						</Select>
					</FormControl>

					{/* BRANDS */}
					<Autocomplete
						multiple
						options={categories}
						disableCloseOnSelect
						getOptionLabel={(o) => tLocal(o.name)}
						value={categories.filter((c) => selectedCategories.includes(c._id))}
						onChange={(_, values) => setSelectedCategories(values.map((v) => v._id))}
						renderOption={(props, option, { selected }) => (
							<li {...props} key={option._id}>
								<Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} sx={{ mr: 1 }} />
								{tLocal(option.name)}
							</li>
						)}
						renderInput={(params) => <TextField {...params} size="small" label={t("filters.brands")} />}
						sx={{ minWidth: 280 }}
					/>

					{/* PRICE */}
					<Box sx={{ minWidth: 260 }}>
						<Stack direction="row" spacing={1} alignItems="center" mb={1}>
							<EuroOutlinedIcon fontSize="small" />
							<Typography variant="body2">
								{t("filters.price")}: {priceRange[0]} – {priceRange[1]}
							</Typography>
						</Stack>

						<Slider
							value={priceRange}
							onChange={(_, v) => setPriceRange(v as [number, number])}
							min={priceBounds[0]}
							max={priceBounds[1]}
							valueLabelDisplay="auto"
							disableSwap
						/>
					</Box>

					{/* IN STOCK */}
					<Stack direction="row" spacing={1} alignItems="center">
						<Inventory2OutlinedIcon fontSize="small" />
						<FormControlLabel
							control={
								<Checkbox checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
							}
							label={t("filters.inStock")}
						/>
					</Stack>
				</Stack>

				{/* ACTIVE FILTERS */}
				{(selectedCategories.length > 0 || inStockOnly) && (
					<Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
						{selectedCategories.map((id) => {
							const cat = categories.find((c) => c._id === id);
							if (!cat) return null;

							return (
								<Chip
									key={id}
									label={tLocal(cat.name)}
									onDelete={() => setSelectedCategories((prev) => prev.filter((c) => c !== id))}
								/>
							);
						})}

						{inStockOnly && <Chip label={t("filters.inStock")} onDelete={() => setInStockOnly(false)} />}
					</Stack>
				)}
			</Box>

			{/* GRID */}
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					gap: 4,
					...productsFlexLayout,
				}}
			>
				{paginatedProducts.map((product) => (
					<ProductCard
						key={product._id}
						id={product._id}
						title={tLocal(product.name)}
						image={product.images?.[0] ?? img}
						inStock={product.stock > 0}
						variants={product.variants}
						currency={product.price.currency}
						onViewDetails={() => navigate(`/products/${product.slug}`)}
						onAddToCart={(variant) =>
							dispatch(
								addToCart({
									productId: product._id,
									title: tLocal(product.name),
									image: product.images?.[0] ?? img,
									variant,
									qty: 1,
									price: variant.price.current,
									currency: variant.price.currency,
								}),
							)
						}
					/>
				))}
			</Box>

			{/* PAGINATION */}
			{totalPages > 1 && (
				<Box mt={6} display="flex" justifyContent="center">
					<Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} />
				</Box>
			)}
		</Box>
	);
}
