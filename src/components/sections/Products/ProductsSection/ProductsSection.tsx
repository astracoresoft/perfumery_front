/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Box,
	CircularProgress,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Checkbox,
	Autocomplete,
	TextField,
	Pagination,
	Slider,
	Stack,
	Chip,
} from "@mui/material";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SortIcon from "@mui/icons-material/Sort";
// import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

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

const parseCSV = (v: string | null) =>
	(v ?? "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);

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

	console.log(products);
	console.log(categories);

	/* ================= FILTER STATE ================= */

	const getParam = (key: string, fallback: string) => searchParams.get(key) ?? fallback;

	const [sort, setSort] = useState<SortOption>(getParam("sort", "name_asc") as SortOption);

	// ✅ default 8
	const [itemsPerPage, setItemsPerPage] = useState<number>(Number(getParam("limit", "8")));
	const [page, setPage] = useState<number>(Number(getParam("page", "1")));

	// ✅ brand ids
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [inStockOnly, setInStockOnly] = useState(getParam("stock", "0") === "1");

	const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

	/* ================= LOAD DATA ================= */

	useEffect(() => {
		let alive = true;

		Promise.all([getProducts(), getCategories(true)])
			.then(([prodRes, catRes]) => {
				if (!alive) return;

				const data = prodRes.data.data as Product[];
				setProducts(data);

				const cats = catRes.data.data as Category[];
				setCategories(cats);

				if (data.length) {
					const prices = data.map((p) => p.price.current);
					const min = Math.min(...prices);
					const max = Math.max(...prices);
					setPriceBounds([min, max]);

					// если в URL нет min/max — выставляем дефолт
					const urlMin = searchParams.get("min");
					const urlMax = searchParams.get("max");
					setPriceRange([urlMin ? Number(urlMin) : min, urlMax ? Number(urlMax) : max]);
				}

				setLoading(false);
			})
			.catch(() => setLoading(false));

		return () => {
			alive = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ================= INIT FROM URL (brands query) ================= */

	useEffect(() => {
		// если пользователь открыл /products?brands=...
		const brands = parseCSV(searchParams.get("brands"));
		if (brands.length) setSelectedCategories(brands);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ================= APPLY BRAND FROM /brand/:slug ================= */

	useEffect(() => {
		if (!slug || !categories.length) return;

		const cat = categories.find((c) => c.slug === slug);

		if (cat) {
			setSelectedCategories([cat._id]);
			setPage(1);
		} else {
			// slug есть, но такой категории нет
			setSelectedCategories([]);
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

		if (priceBounds[0] !== 0 || priceBounds[1] !== 0) {
			if (priceRange[0] !== priceBounds[0]) params.min = String(priceRange[0]);
			if (priceRange[1] !== priceBounds[1]) params.max = String(priceRange[1]);
		}

		setSearchParams(params, { replace: true });
	}, [sort, page, itemsPerPage, selectedCategories, inStockOnly, priceRange, priceBounds, setSearchParams]);

	useEffect(() => {
		setPage(1);
	}, [sort, itemsPerPage, selectedCategories, inStockOnly, priceRange]);

	/* ================= HELPERS: category id extraction ================= */

	const getCategoryIdsFromProduct = (p: any): string[] => {
		const ids: string[] = [];

		// p.category может быть string или object
		if (p?.category) {
			if (typeof p.category === "string") ids.push(p.category);
			else if (typeof p.category === "object" && p.category._id) ids.push(p.category._id);
		}

		// p.categories может быть string[] или object[]
		if (Array.isArray(p?.categories)) {
			for (const c of p.categories) {
				if (typeof c === "string") ids.push(c);
				else if (typeof c === "object" && c?._id) ids.push(c._id);
			}
		}

		// убираем дубликаты
		return Array.from(new Set(ids));
	};

	/* ================= FILTER ================= */

	const filteredProducts = useMemo(() => {
		let result = [...products];

		if (selectedCategories.length) {
			result = result.filter((p: any) => {
				const ids = getCategoryIdsFromProduct(p);
				return ids.some((id) => selectedCategories.includes(id));
			});
		}

		if (inStockOnly) result = result.filter((p) => p.stock > 0);

		// price guard
		if (priceBounds[0] !== 0 || priceBounds[1] !== 0) {
			result = result.filter((p) => p.price.current >= priceRange[0] && p.price.current <= priceRange[1]);
		}

		return result;
	}, [products, selectedCategories, inStockOnly, priceRange, priceBounds]);

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

	const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));

	const paginatedProducts = useMemo(() => {
		const safePage = Math.min(page, totalPages);
		const start = (safePage - 1) * itemsPerPage;
		return sortedProducts.slice(start, start + itemsPerPage);
	}, [page, sortedProducts, itemsPerPage, totalPages]);

	/* ================= STATES ================= */

	if (loading) {
		return (
			<Box py={10} display="flex" justifyContent="center">
				<CircularProgress />
			</Box>
		);
	}

	if (!sortedProducts.length) {
		return (
			<Box py={10} mt={10} textAlign="center">
				<Typography variant="h6">{t("filters.noProducts")}</Typography>
			</Box>
		);
	}

	const API_ORIGIN = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

	const toImageUrl = (url?: string | null) => {
		if (!url) return "";
		if (url.startsWith("http")) return url; // уже абсолютная
		return `${API_ORIGIN}${url}`; // относительная -> абсолютная
	};
	/* ================= RENDER ================= */

	return (
		<Box px={{ xs: 2, md: 6 }} py={4}>
			{/* FILTER BAR */}
			<Box mb={4} p={3} borderRadius={3} bgcolor="background.paper" boxShadow={1}>
				<Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
					<FormControl size="small" fullWidth>
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

					<FormControl size="small" fullWidth>
						<InputLabel>{t("filters.perPage")}</InputLabel>
						<Select
							value={itemsPerPage}
							label={t("filters.perPage")}
							onChange={(e) => setItemsPerPage(Number(e.target.value))}
						>
							{[8, 12, 24, 48].map((n) => (
								<MenuItem key={n} value={n}>
									{n}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Autocomplete
						multiple
						options={categories}
						disableCloseOnSelect
						getOptionLabel={(o) => tLocal(o.name)}
						value={categories.filter((c) => selectedCategories.includes(c._id))}
						onChange={(_, values) => setSelectedCategories(values.map((v) => v._id))}
						renderOption={(props, option, { selected }) => (
							<li {...props} key={option._id}>
								<Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
								{tLocal(option.name)}
							</li>
						)}
						renderInput={(params) => <TextField {...params} size="small" label={t("filters.brands")} />}
						fullWidth
					/>

					<Box width="100%">
						<Typography variant="body2" mb={0.5}>
							{t("filters.price")}: {priceRange[0]} – {priceRange[1]}
						</Typography>
						<Slider
							value={priceRange}
							onChange={(_, v) => setPriceRange(v as [number, number])}
							min={priceBounds[0]}
							max={priceBounds[1]}
						/>
					</Box>

					{/* <FormControlLabel
						control={<Checkbox checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />}
						label={
							<Stack direction="row" spacing={1} alignItems="center">
								<Typography variant="body2">{t("filters.inStock")}</Typography>
							</Stack>
						}
					/> */}
				</Stack>

				{/* ACTIVE */}
				{(selectedCategories.length > 0 || inStockOnly) && (
					<Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
						{selectedCategories.map((id) => {
							const cat = categories.find((c) => c._id === id);
							if (!cat) return null;

							return (
								<Chip
									key={id}
									label={tLocal(cat.name)}
									onDelete={() => setSelectedCategories((prev) => prev.filter((x) => x !== id))}
								/>
							);
						})}

						{inStockOnly && <Chip label={t("filters.inStock")} onDelete={() => setInStockOnly(false)} />}
					</Stack>
				)}
			</Box>

			{/* PRODUCTS */}
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, ...productsFlexLayout }}>
				{paginatedProducts.map((product) => (
					<ProductCard
						key={product._id}
						id={product._id}
						slug={product.slug}
						title={tLocal(product.name)}
						image={toImageUrl(product.images?.[0]?.url) || img}
						inStock={product.stock > 0}
						variants={product.variants}
						currency={product.price.currency}
						onViewDetails={(slug) => navigate(`/products/${slug}`)}
						onAddToCart={(variant) =>
							dispatch(
								addToCart({
									productId: product._id,
									title: tLocal(product.name),
									image: toImageUrl(product.images?.[0]?.url) || img,
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
