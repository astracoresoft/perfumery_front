import { useEffect, useMemo, useState } from "react";
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
	Badge,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";
import { getCategories } from "@/api/category/category.api";
import type { Category } from "@/types/category.type";

import { LanguageMenu } from "@/components/ui/LanguageSwitchButton/LanguageSwitchButton";
import { tLocal } from "@/i18n/i18n";

import logo from "@/assets/images/logo.jpg";

export function Header() {
	useTranslation();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [brandSearch, setBrandSearch] = useState("");
	const [mobileSearch, setMobileSearch] = useState("");
	const [selectedBrand, setSelectedBrand] = useState("");

	const cartCount = useSelector((state: RootState) => state.cart.items.reduce((sum, i) => sum + i.qty, 0));

	useEffect(() => {
		getCategories(true).then((res) => {
			setCategories(res.data.data);
		});
	}, []);

	const navItems = [{ label: t("nav.home"), path: "/" }];

	/* ================= GROUP CATEGORIES ================= */

	const groupedCategories = useMemo(() => {
		const searchValue = (open ? mobileSearch : brandSearch).toLowerCase();

		const filtered = categories.filter((cat) => tLocal(cat.name).toLowerCase().includes(searchValue));

		const groups: Record<string, Category[]> = {};

		filtered.forEach((cat) => {
			const letter = tLocal(cat.name).charAt(0).toUpperCase();
			if (!groups[letter]) groups[letter] = [];
			groups[letter].push(cat);
		});

		return Object.keys(groups)
			.sort()
			.reduce<Record<string, Category[]>>((acc, letter) => {
				acc[letter] = groups[letter].sort((a, b) => tLocal(a.name).localeCompare(tLocal(b.name)));
				return acc;
			}, {});
	}, [categories, brandSearch, mobileSearch, open]);

	/* ================= HANDLERS ================= */

	const handleBrandSelect = (slug: string) => {
		setSelectedBrand("");
		setBrandSearch("");
		setMobileSearch("");
		setOpen(false);
		navigate(`/brand/${slug}`);
	};

	const handleNavigate = (path: string) => {
		navigate(path);
		setOpen(false);
	};

	/* ================= RENDER ================= */

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
					<Box
						component="img"
						src={logo}
						alt="Logo"
						onClick={() => navigate("/")}
						sx={{
							borderRadius: "50%",
							p: 2,
							height: 120,
							cursor: "pointer",
							objectFit: "contain",
						}}
					/>

					{/* DESKTOP NAV */}
					<Box
						sx={{
							display: { xs: "none", md: "flex" },
							gap: 3,
							alignItems: "center",
						}}
					>
						{navItems.map((item) => (
							<Button key={item.path} onClick={() => handleNavigate(item.path)}>
								{item.label}
							</Button>
						))}

						{/* CATALOG */}
						<Select
							displayEmpty
							value={selectedBrand}
							renderValue={() => t("nav.catalog")}
							sx={{
								minWidth: 240,
								height: 38,
								px: 1.5,
								borderRadius: "999px",
								backgroundColor: "#fafafa",
								boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
								"& fieldset": { border: "none" },
							}}
							MenuProps={{
								PaperProps: {
									sx: {
										mt: 1,
										borderRadius: "16px",
										maxHeight: 420,
										boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
									},
								},
							}}
						>
							{/* SEARCH */}
							<Box
								sx={{
									position: "sticky",
									top: 0,
									zIndex: 1,
									backgroundColor: "background.paper",
									px: 2,
									py: 1.5,
									borderBottom: "1px solid",
									borderColor: "divider",
								}}
								onClick={(e) => e.stopPropagation()}
							>
								<TextField
									autoFocus
									fullWidth
									size="small"
									placeholder={t("search")}
									value={brandSearch}
									onChange={(e) => setBrandSearch(e.target.value)}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon fontSize="small" />
											</InputAdornment>
										),
									}}
								/>
							</Box>

							{Object.entries(groupedCategories).map(([letter, items]) => (
								<Box key={letter}>
									<Typography
										sx={{
											px: 3,
											py: 0.5,
											fontSize: 11,
											fontWeight: 700,
											letterSpacing: "0.18em",
											textTransform: "uppercase",
											color: "text.secondary",
										}}
									>
										{letter}
									</Typography>

									{items.map((cat) => (
										<MenuItem
											key={cat._id}
											onClick={() => handleBrandSelect(cat.slug)}
											sx={{ px: 3, py: 1 }}
										>
											{tLocal(cat.name)}
										</MenuItem>
									))}
								</Box>
							))}

							{Object.keys(groupedCategories).length === 0 && (
								<Typography sx={{ px: 3, py: 3, textAlign: "center" }} color="text.secondary">
									{t("noResults")}
								</Typography>
							)}
						</Select>
					</Box>

					{/* ACTIONS */}
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<LanguageMenu />

						<IconButton onClick={() => navigate("/cart")}>
							<Badge badgeContent={cartCount} color="primary">
								<ShoppingCartOutlinedIcon />
							</Badge>
						</IconButton>

						<IconButton sx={{ display: { xs: "flex", md: "none" } }} onClick={() => setOpen(true)}>
							☰
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>

			{/* ================= MOBILE DRAWER ================= */}
			<Drawer open={open} onClose={() => setOpen(false)}>
				<Box sx={{ width: 300, height: "100%", display: "flex", flexDirection: "column" }}>
					<Box sx={{ px: 2, pt: 2 }}>
						<Typography variant="h6" fontWeight={600}>
							Menu
						</Typography>
					</Box>

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

					<Box sx={{ flex: 1, overflowY: "auto", px: 1 }}>
						{Object.entries(groupedCategories).map(([letter, items]) => (
							<Box key={letter}>
								<Typography sx={{ px: 1.5, pt: 2, fontWeight: 600 }}>{letter}</Typography>

								{items.map((cat) => (
									<ListItem key={cat._id} disablePadding>
										<ListItemButton onClick={() => handleBrandSelect(cat.slug)}>
											<ListItemText primary={tLocal(cat.name)} />
										</ListItemButton>
									</ListItem>
								))}
							</Box>
						))}

						{Object.keys(groupedCategories).length === 0 && (
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
