import * as React from "react";
import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	Box,
	Button,
	Chip,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import type { ProductVariant } from "@/types/productCard.type";

export interface ProductCardProps {
	id: string;
	title: string;
	description: string;
	image: string;
	category?: string;
	inStock?: boolean;
	variants: ProductVariant[];
	currency: string;

	onAddToCart: (variant: ProductVariant) => void;
	onViewDetails: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
	id,
	title,
	description,
	image,
	category,
	currency,
	inStock = true,
	variants,
	onAddToCart,
	onViewDetails,
}) => {
	const [selectedMl, setSelectedMl] = React.useState<number>(variants[0].ml);

	const selectedVariant = variants.find((v) => v.ml === selectedMl)!;

	return (
		<Card
			sx={{
				width: "100%",
				borderRadius: 3,
				boxShadow: 3,
				transition: "0.3s",
				"&:hover": {
					boxShadow: 6,
					transform: "translateY(-4px)",
				},
			}}
		>
			<CardMedia component="img" height="200" image={image} alt={title} sx={{ objectFit: "contain" }} />

			<CardContent>
				<Stack direction="row" spacing={1} mb={1}>
					{category && <Chip label={category} size="small" />}
					<Chip
						label={inStock ? "In stock" : "Out of stock"}
						size="small"
						color={inStock ? "success" : "error"}
					/>
				</Stack>

				<Typography variant="h6" fontWeight={600} gutterBottom>
					{title}
				</Typography>

				<Typography variant="body2" color="text.secondary" mb={2}>
					{description}
				</Typography>

				<ToggleButtonGroup
					exclusive
					size="small"
					value={selectedMl}
					onChange={(_, value) => value && setSelectedMl(value)}
					sx={{ mb: 2 }}
				>
					{variants.map((v) => (
						<ToggleButton key={v.ml} value={v.ml}>
							{v.ml} ml
						</ToggleButton>
					))}
				</ToggleButtonGroup>

				<Box mb={2}>
					<Typography variant="h6" fontWeight={700}>
						{selectedVariant.price} {currency}
					</Typography>
				</Box>

				<Stack direction="row" spacing={1}>
					<Button
						variant="contained"
						fullWidth
						disabled={!inStock}
						onClick={() => onAddToCart(selectedVariant)}
					>
						Add to cart
					</Button>

					<Button variant="outlined" fullWidth onClick={() => onViewDetails(id)}>
						Details
					</Button>
				</Stack>
			</CardContent>
		</Card>
	);
};
