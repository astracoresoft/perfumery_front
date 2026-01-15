/* eslint-disable react-hooks/set-state-in-effect */
import {
	Box,
	CircularProgress,
	Typography,
	FormControl,
	Select,
	MenuItem,
	Checkbox,
	FormControlLabel,
	Slider,
	Autocomplete,
	TextField,
	Pagination,
} from "@mui/material";

import SortIcon from "@mui/icons-material/Sort";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { ProductCard } from "@/components/ui/ProductCard/ProductCard";
import { getProducts } from "@/api/product/product.api";
import { addToCart } from "@/store/slices/cart.slice";

import type { Product } from "@/types/product.type";
import type { ProductVariant } from "@/types/productCard.type";
import type { Category } from "@/types/category.type";

import img from "@/assets/images/testPerfume.png";
import { productsFlexLayout } from "@/assets/styles/productsFlexLayout";

/* ================= TYPES ================= */

type SortOption = "price_asc" | "price_desc" | "name_asc" | "name_desc";

interface Props {
	categories?: Category[];
}

/* ================= ICONS ================= */

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/* ================= COMPONENT ================= */

export function ProductsSection({ categories = [] }: Props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	/* ================= URL STATE ================= */

	const getParam = (key: string, fallback: string) => searchParams.get(key) ?? fallback;

	const [sort, setSort] = useState<SortOption>(getParam("sort", "name_asc") as SortOption);

	const [selectedCategories, setSelectedCategories] = useState<string[]>(
		getParam("brands", "").split(",").filter(Boolean)
	);

	const [inStockOnly, setInStockOnly] = useState(getParam("stock", "0") === "1");

	const [page, setPage] = useState(Number(getParam("page", "1")));
	const [itemsPerPage, setItemsPerPage] = useState(Number(getParam("limit", "12")));

	const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

	/* ================= LOAD PRODUCTS ================= */

	useEffect(() => {
		getProducts().then((res) => {
			const data = res.data.data as Product[];
			setProducts(data);

			const prices = data.map((p) => p.price.current);
			const min = Math.min(...prices);
			const max = Math.max(...prices);

			setPriceBounds([min, max]);
			setPriceRange([min, max]);

			setLoading(false);
		});
	}, []);

	/* ================= SAVE URL ================= */

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

	/* ================= RESET PAGE ================= */

	useEffect(() => {
		setPage(1);
	}, [sort, selectedCategories, inStockOnly, priceRange]);

	/* ================= FILTER ================= */

	const filteredProducts = useMemo(() => {
		let result = [...products];

		// 🔥 БРЕНДЫ — ТОЛЬКО ЕСЛИ У ТОВАРА ОНИ ЕСТЬ
		if (selectedCategories.length) {
			result = result.filter(
				(p) => p.categories?.length && p.categories.some((c) => selectedCategories.includes(c))
			);
		}

		if (inStockOnly) {
			result = result.filter((p) => p.stock > 0);
		}

		result = result.filter((p) => p.price.current >= priceRange[0] && p.price.current <= priceRange[1]);

		return result;
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
				return result.sort((a, b) => b.name.localeCompare(a.name));
			default:
				return result.sort((a, b) => a.name.localeCompare(b.name));
		}
	}, [filteredProducts, sort]);

	/* ================= PAGINATION ================= */

	const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

	const paginatedProducts = useMemo(() => {
		const start = (page - 1) * itemsPerPage;
		return sortedProducts.slice(start, start + itemsPerPage);
	}, [sortedProducts, page, itemsPerPage]);

	/* ================= LOADING ================= */

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
				<Typography variant="h6">No products found</Typography>
			</Box>
		);
	}

	/* ================= RENDER ================= */

	return (
		<Box px={{ xs: 2, md: 6 }} py={4}>
			{/* FILTER BAR */}
			<Box
				display="flex"
				flexWrap="wrap"
				gap={3}
				mb={4}
				p={3}
				borderRadius={3}
				bgcolor="background.paper"
				boxShadow={1}
			>
				<FormControl size="small" sx={{ minWidth: 200 }}>
					<Select
						value={sort}
						onChange={(e) => setSort(e.target.value as SortOption)}
						startAdornment={<SortIcon sx={{ mr: 1 }} />}
					>
						<MenuItem value="name_asc">Name A → Z</MenuItem>
						<MenuItem value="name_desc">Name Z → A</MenuItem>
						<MenuItem value="price_asc">Price ↑</MenuItem>
						<MenuItem value="price_desc">Price ↓</MenuItem>
					</Select>
				</FormControl>

				<FormControl size="small" sx={{ minWidth: 120 }}>
					<Select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
						<MenuItem value={8}>8 / page</MenuItem>
						<MenuItem value={12}>12 / page</MenuItem>
						<MenuItem value={24}>24 / page</MenuItem>
						<MenuItem value={48}>48 / page</MenuItem>
					</Select>
				</FormControl>

				<Autocomplete
					multiple
					options={categories}
					disableCloseOnSelect
					getOptionLabel={(o) => o.name}
					value={categories.filter((c) => selectedCategories.includes(c.slug))}
					onChange={(_, values) => setSelectedCategories(values.map((v) => v.slug))}
					renderOption={(props, option, { selected }) => (
						<li {...props} key={option._id}>
							<Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} sx={{ mr: 1 }} />
							{option.name}
						</li>
					)}
					renderInput={(params) => <TextField {...params} size="small" label="Brands" />}
					sx={{ minWidth: 280 }}
				/>

				<Box sx={{ minWidth: 260 }}>
					<Box display="flex" alignItems="center" gap={1}>
						<EuroOutlinedIcon fontSize="small" />
						<Typography variant="body2">Price range</Typography>
					</Box>
					<Slider
						value={priceRange}
						onChange={(_, v) => setPriceRange(v as [number, number])}
						min={priceBounds[0]}
						max={priceBounds[1]}
						valueLabelDisplay="auto"
						disableSwap
					/>
				</Box>

				<FormControlLabel
					control={<Checkbox checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />}
					label={
						<Box display="flex" alignItems="center" gap={1}>
							<Inventory2OutlinedIcon fontSize="small" />
							In stock only
						</Box>
					}
				/>
			</Box>

			{/* GRID */}
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, ...productsFlexLayout }}>
				{paginatedProducts.map((product) => {
					const variants: ProductVariant[] = product.variants.length
						? product.variants
						: [{ ml: 50, price: product.price.current }];

					return (
						<ProductCard
							key={product.slug}
							id={product.slug}
							title={product.name}
							description={product.shortDescription || "No description"}
							image={product.images?.[0] ?? img}
							category={product.category ?? undefined}
							inStock={product.stock > 0}
							variants={variants}
							currency={product.price.currency}
							onViewDetails={() => navigate(`/products/${product.slug}`)}
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

			{totalPages > 1 && (
				<Box mt={6} display="flex" justifyContent="center">
					<Pagination
						count={totalPages}
						page={page}
						onChange={(_, p) => setPage(p)}
						color="primary"
						shape="rounded"
					/>
				</Box>
			)}
		</Box>
	);
}
