import { useEffect, useMemo, useState } from "react";
import { LanguageMenu } from "@/components/ui/LanguageSwitchButton/LanguageSwitchButton";
import {
	AppBar,
	Toolbar,
	Box,
	Typography,
	IconButton,
	Drawer,
	Button,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	MenuItem,
	Select,
	TextField,
	InputAdornment,
	Divider,
} from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getCategories } from "@/api/category/category.api";
import type { Category } from "@/types/category.type";

export function Header() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [brandSearch, setBrandSearch] = useState("");
	const [selectedBrand, setSelectedBrand] = useState("");

	const cartCount = useSelector((state: RootState) => state.cart.items.reduce((sum, i) => sum + i.qty, 0));

	// mobile search
	const [mobileSearch, setMobileSearch] = useState("");

	useEffect(() => {
		getCategories(true).then((res) => {
			setCategories(res.data.data);
		});
	}, []);

	const navItems = [
		{ label: t("nav.home"), path: "/" },
		{ label: t("nav.reviews"), path: "/reviews" },
		{ label: t("nav.blog"), path: "/blog" },
	];

	/* ---------------- DESKTOP FILTER ---------------- */

	const filteredCategories = useMemo(() => {
		return categories.filter((cat) => cat.name.toLowerCase().includes(brandSearch.toLowerCase()));
	}, [categories, brandSearch]);

	const handleBrandSelect = (slug: string) => {
		setSelectedBrand("");
		setBrandSearch("");
		navigate(`/brand/${slug}`);
	};

	const handleNavigate = (path: string) => {
		navigate(path);
		setOpen(false);
	};

	/* ---------------- MOBILE GROUPING ---------------- */

	const groupedMobileCategories = useMemo(() => {
		const filtered = categories.filter((cat) => cat.name.toLowerCase().includes(mobileSearch.toLowerCase()));

		const groups: Record<string, Category[]> = {};

		filtered.forEach((cat) => {
			const letter = cat.name.charAt(0).toUpperCase();
			if (!groups[letter]) groups[letter] = [];
			groups[letter].push(cat);
		});

		return Object.keys(groups)
			.sort()
			.reduce<Record<string, Category[]>>((acc, key) => {
				acc[key] = groups[key];
				return acc;
			}, {});
	}, [categories, mobileSearch]);

	return (
		<>
			<AppBar
				position="static"
				elevation={0}
				sx={{
					backgroundColor: "white",
					color: "black",
					px: 3,
					borderBottom: "1px solid #eee",
				}}
			>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					{/* LOGO */}
					<Typography sx={{ fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("/")}>
						SOY NATURE
					</Typography>

					{/* DESKTOP NAV */}
					<Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, alignItems: "center" }}>
						{navItems.map((item) => (
							<Button key={item.path} onClick={() => handleNavigate(item.path)}>
								{item.label}
							</Button>
						))}

						{/* DESKTOP SELECT */}
						<Select
							displayEmpty
							value={selectedBrand}
							renderValue={() => t("nav.catalog")}
							sx={{ minWidth: 220, height: 36, backgroundColor: "#fafafa" }}
							MenuProps={{
								PaperProps: { sx: { maxHeight: 320 } },
							}}
						>
							<MenuItem disableRipple>
								<TextField
									autoFocus
									fullWidth
									size="small"
									placeholder={t("search")}
									value={brandSearch}
									onChange={(e) => setBrandSearch(e.target.value)}
									onClick={(e) => e.stopPropagation()}
									onKeyDown={(e) => e.stopPropagation()}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon fontSize="small" />
											</InputAdornment>
										),
									}}
								/>
							</MenuItem>

							<Divider />

							{filteredCategories.map((cat) => (
								<MenuItem key={cat._id} onClick={() => handleBrandSelect(cat.slug)}>
									{cat.name}
								</MenuItem>
							))}
						</Select>
					</Box>

					{/* ACTIONS */}
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<LanguageMenu />

						<IconButton onClick={() => navigate("/cart")}>
							<Badge badgeContent={cartCount} color="primary" overlap="circular">
								<ShoppingCartOutlinedIcon />
							</Badge>
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>

			{/* ---------------- MOBILE DRAWER ---------------- */}
			<Drawer open={open} onClose={() => setOpen(false)}>
				<Box sx={{ width: 300, height: "100%", display: "flex", flexDirection: "column" }}>
					{/* HEADER */}
					<Box sx={{ px: 2, pt: 2 }}>
						<Typography variant="h6" fontWeight={600}>
							Menu
						</Typography>
					</Box>

					{/* NAV */}
					<List>
						{navItems.map((item) => (
							<ListItem key={item.path} disablePadding>
								<ListItemButton onClick={() => handleNavigate(item.path)}>
									<ListItemText primary={item.label} />
								</ListItemButton>
							</ListItem>
						))}
					</List>

					<Divider />

					{/* SEARCH */}
					<Box sx={{ px: 2, py: 1 }}>
						<TextField
							fullWidth
							size="small"
							placeholder={t("search")}
							value={mobileSearch}
							onChange={(e) => setMobileSearch(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon fontSize="small" />
									</InputAdornment>
								),
							}}
						/>
					</Box>

					{/* CATEGORIES */}
					<Box sx={{ flex: 1, overflowY: "auto", px: 1 }}>
						{Object.entries(groupedMobileCategories).map(([letter, items]) => (
							<Box key={letter}>
								<Typography
									sx={{
										px: 1.5,
										pt: 2,
										pb: 0.5,
										fontWeight: 600,
										color: "text.secondary",
									}}
								>
									{letter}
								</Typography>

								{items.map((cat) => (
									<ListItem key={cat._id} disablePadding>
										<ListItemButton
											onClick={() => {
												navigate(`/brand/${cat.slug}`);
												setOpen(false);
											}}
										>
											<ListItemText primary={cat.name} />
										</ListItemButton>
									</ListItem>
								))}
							</Box>
						))}

						{Object.keys(groupedMobileCategories).length === 0 && (
							<Typography sx={{ px: 2, pt: 2 }} color="text.secondary">
								{t("noResults")}
							</Typography>
						)}
					</Box>
				</Box>
			</Drawer>
		</>
	);
}
