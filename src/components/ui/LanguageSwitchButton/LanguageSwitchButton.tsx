import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";

export function LanguageMenu() {
	const { i18n } = useTranslation();
	const [anchor, setAnchor] = useState<null | HTMLElement>(null);

	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchor(e.currentTarget);

	const handleClose = () => setAnchor(null);

	const changeLang = (lng: string) => {
		i18n.changeLanguage(lng);
		handleClose();
	};

	return (
		<>
			<IconButton onClick={handleOpen}>
				<LanguageIcon />
			</IconButton>

			<Menu anchorEl={anchor} open={Boolean(anchor)} onClose={handleClose}>
				<MenuItem onClick={() => changeLang("ru")}>RU</MenuItem>
				<MenuItem onClick={() => changeLang("ua")}>UA</MenuItem>
			</Menu>
		</>
	);
}
