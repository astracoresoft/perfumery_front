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
import { tLocal } from "@/i18n/i18n";
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
	onViewDetails: (slug: string) => void; // ✅ slug
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

	const [selectedSku, setSelectedSku] = React.useState<string>(variants[0]?.sku);
	const selectedVariant = variants.find((v) => v.sku === selectedSku)!;

	return (
		<Card sx={{ width: "100%", borderRadius: 3 }}>
			<Box
				sx={{
					margin: "auto",
					width: 200, // размер контейнера
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
					value={selectedSku}
					onChange={(_, v) => v && setSelectedSku(v)}
					sx={{ mt: 2, mb: 2, flexWrap: "wrap" }}
				>
					{variants.map((v) => (
						<ToggleButton key={v.sku} value={v.sku}>
							{tLocal(v.name)}
						</ToggleButton>
					))}
				</ToggleButtonGroup>

				<Typography variant="h6" fontWeight={700} mb={2}>
					{selectedVariant.price.current} {selectedVariant.price.currency}
				</Typography>

				<Stack direction="row" spacing={1}>
					<Button variant="contained" fullWidth onClick={() => onAddToCart(selectedVariant)}>
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
