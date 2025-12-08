import { useState } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useTranslation } from "react-i18next";

export function Header() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const navItems = [t("nav.about"), t("nav.catalog"), t("nav.reviews"), t("nav.blog")];

	return (
		<>
			<AppBar
				position="static"
				elevation={0}
				sx={{
					backgroundColor: "white",
					color: "black",
					paddingX: 3,
					borderBottom: "1px solid #eee",
				}}
			>
				<Toolbar
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					{/* LOGO */}
					<Typography sx={{ fontWeight: 700 }}>SOY NATURE</Typography>

					{/* DESKTOP NAV */}
					<Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
						{navItems.map((item, i) => (
							<Button key={i}>{item}</Button>
						))}
					</Box>

					{/* RIGHT SIDE BUTTONS */}
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<LanguageMenu />

						<IconButton>
							<ShoppingCartOutlinedIcon />
						</IconButton>

						{/* BURGER ONLY ON MOBILE */}
						<IconButton sx={{ display: { xs: "flex", md: "none" } }} onClick={() => setOpen(true)}>
							<MenuIcon />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>

			{/* DRAWER */}
			<Drawer open={open} onClose={() => setOpen(false)}>
				<Box sx={{ width: 250 }}>
					<List>
						{navItems.map((text, index) => (
							<ListItem key={index} disablePadding>
								<ListItemButton>
									<ListItemText primary={text} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
		</>
	);
}
