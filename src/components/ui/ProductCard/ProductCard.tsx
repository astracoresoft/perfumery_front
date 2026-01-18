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
} from "@mui/material";

import type { ProductVariant } from "@/types/product.type";
import { tLocal } from "@/i18n/i18n";
import { useTranslation } from "react-i18next";

export interface ProductCardProps {
	id: string;
	title: string;
	image: string;
	inStock?: boolean;
	variants: ProductVariant[];
	currency: string;

	onAddToCart: (variant: ProductVariant) => void;
	onViewDetails: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
	id,
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
			<CardMedia component="img" image={image} alt={title} />

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
					sx={{ mt: 2, mb: 2 }}
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
					<Button variant="outlined" fullWidth onClick={() => onViewDetails(id)}>
						{t("common.details")}
					</Button>
				</Stack>
			</CardContent>
		</Card>
	);
};
