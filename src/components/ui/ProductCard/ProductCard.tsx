import * as React from "react";
import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	Button,
	Chip,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Box,
} from "@mui/material";

import type { ProductVariant } from "@/types/product.type";
// import { tLocal } from "@/i18n/i18n";
import { useTranslation } from "react-i18next";

export interface ProductCardProps {
	id: string; // _id
	slug: string; // ✅ slug
	title: string;
	image: string;
	inStock?: boolean;
	variants: ProductVariant[];
	currency: string;

	onAddToCart: (variant: ProductVariant) => void;
	onViewDetails: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
	slug,
	title,
	image,
	inStock = true,
	variants,
	onAddToCart,
	onViewDetails,
}) => {
	const { t } = useTranslation();

	const API_ORIGIN = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

	const toImageUrl = (url?: string | null) => {
		if (!url) return "";
		if (url.startsWith("http")) return url;
		return `${API_ORIGIN}${url}`;
	};

	const [selectedVariantName, setSelectedVariantName] = React.useState("");
	const selectedVariant = variants.find((v) => v.name.ua.trim() === selectedVariantName);

	return (
		<Card sx={{ width: "100%", borderRadius: 3 }}>
			<Box
				sx={{
					margin: "auto",
					width: 300, // размер контейнера
					height: 200,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(255,255,255,0.04)", // опционально
					borderRadius: 2, // опционально
					overflow: "hidden",
				}}
			>
				<CardMedia
					component="img"
					image={image}
					alt={title}
					sx={{
						width: "100%",
						height: "100%",
						objectFit: "contain", // всегда помещается без искажений
						padding: 1, // опционально, чтоб были поля
					}}
				/>
			</Box>

			<CardContent>
				<Stack direction="row" spacing={1} mb={1}>
					<Chip
						label={inStock ? t("common.inStock") : t("common.outOfStock")}
						size="small"
						color={inStock ? "success" : "error"}
					/>
				</Stack>

				<Typography variant="h6" fontWeight={600}>
					{title}
				</Typography>

				<ToggleButtonGroup
					exclusive
					size="small"
					value={selectedVariantName}
					onChange={(_, v) => v && setSelectedVariantName(v)}
					sx={{
						mt: 2,
						mb: 2,
						border: 0,
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
						<Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "nowrap" }}>
							{variants
								.filter((v) => ["5", "10", "20"].includes(v.name.ua.trim()))
								.map((v) => {
									const label = v.name.ua.trim();
									const isSelected = selectedVariantName === label;
									const isDisabled = !v.isActive;

									return (
										<Box
											key={`${v.name.ua}-${v.image}`}
											sx={{
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												opacity: isDisabled ? 0.5 : 1,
											}}
										>
											<Box
												sx={{
													width: 80,
													height: 80,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													overflow: "hidden",
													border: "1px solid",
													borderColor: isSelected ? "primary.main" : "rgba(25,118,210,0.35)",
													borderBottom: 0,
													bgcolor: isSelected ? "rgba(25,118,210,0.08)" : "transparent",
													cursor: isDisabled ? "not-allowed" : "pointer",
													pointerEvents: isDisabled ? "none" : "auto",
												}}
											>
												<Box
													component="img"
													src={toImageUrl(v.image)}
													alt=""
													sx={{
														width: "100%",
														height: "100%",
														objectFit: "contain",
														p: 1,
														filter: isDisabled ? "grayscale(1)" : "none",
													}}
												/>
											</Box>

											<ToggleButton
												value={label}
												disabled={isDisabled}
												sx={{
													minWidth: 80,
													height: 44,
													textTransform: "none",
													borderTopLeftRadius: 0,
													borderTopRightRadius: 0,
													borderBottomLeftRadius: 8,
													borderBottomRightRadius: 8,
													border: "1px solid rgba(25,118,210,0.35)",
													color: "primary.main",
													"&.Mui-selected": {
														bgcolor: "primary.main",
														color: "white",
														borderColor: "primary.main",
													},
													"&.Mui-selected:hover": {
														bgcolor: "primary.dark",
													},
												}}
											>
												{label} МЛ
											</ToggleButton>
										</Box>
									);
								})}
						</Box>

						<Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "nowrap" }}>
							{variants
								.filter((v) => !["5", "10", "20"].includes(v.name.ua.trim()))
								.map((v) => {
									const label = v.name.ua.trim();
									const isDisabled = !v.isActive;

									return (
										<ToggleButton
											key={`${v.name.ua}-${v.image}`}
											value={label}
											disabled={isDisabled}
											sx={{
												minWidth: 80,
												height: 44,
												textTransform: "none",
												borderRadius: 8,
												border: "1px solid rgba(25,118,210,0.35)",
												color: "primary.main",
												opacity: isDisabled ? 0.5 : 1,
												"&.Mui-selected": {
													bgcolor: "primary.main",
													color: "white",
													borderColor: "primary.main",
												},
												"&.Mui-selected:hover": {
													bgcolor: "primary.dark",
												},
											}}
										>
											{label} МЛ
										</ToggleButton>
									);
								})}
						</Box>
					</Box>
				</ToggleButtonGroup>

				<Typography variant="h6" fontWeight={700} mb={2}>
					{selectedVariant?.price.current} {selectedVariant?.price.currency}
				</Typography>

				<Stack direction="row" spacing={1}>
					<Button
						variant="contained"
						fullWidth
						disabled={!selectedVariant}
						onClick={() => {
							if (selectedVariant) onAddToCart(selectedVariant);
						}}
					>
						{t("common.addToCart")}
					</Button>
					<Button variant="outlined" fullWidth onClick={() => onViewDetails(slug)}>
						{t("common.details")}
					</Button>
				</Stack>
			</CardContent>
		</Card>
	);
};
