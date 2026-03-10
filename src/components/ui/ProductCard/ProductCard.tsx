/* eslint-disable @typescript-eslint/no-explicit-any */
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
	FormControl,
	Select,
	MenuItem,
	InputLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import type { ProductVariant } from "@/types/product.type";

export interface ProductCardProps {
	id: string;
	slug: string;
	title: string;
	image: string;
	inStock?: boolean;
	variants: ProductVariant[];
	currency: string;
	onAddToCart: (variant: ProductVariant) => void;
	onViewDetails: (slug: string) => void;
}

const SMALL_VARIANTS = ["5", "10", "20"];

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

	const toImageUrl = React.useCallback(
		(url?: string | null) => {
			if (!url) return "";
			if (url.startsWith("http")) return url;
			return `${API_ORIGIN}${url}`;
		},
		[API_ORIGIN],
	);

	const normalizedVariants = React.useMemo(
		() =>
			variants.map((variant) => ({
				...variant,
				label: variant.name.ua.trim(),
			})),
		[variants],
	);

	const imageVariants = React.useMemo(
		() => normalizedVariants.filter((variant) => SMALL_VARIANTS.includes(variant.label)),
		[normalizedVariants],
	);

	const textVariants = React.useMemo(
		() => normalizedVariants.filter((variant) => !SMALL_VARIANTS.includes(variant.label)),
		[normalizedVariants],
	);

	const firstActiveVariant = React.useMemo(() => {
		const firstActiveRegular = normalizedVariants.find(
			(variant) => variant.isActive && !SMALL_VARIANTS.includes(variant.label),
		);

		if (firstActiveRegular) return firstActiveRegular;

		return normalizedVariants.find((variant) => variant.isActive);
	}, [normalizedVariants]);
	const [selectedVariantName, setSelectedVariantName] = React.useState("");

	React.useEffect(() => {
		if (!selectedVariantName && firstActiveVariant) {
			setSelectedVariantName(firstActiveVariant.label);
		}
	}, [selectedVariantName, firstActiveVariant]);

	const selectedVariant = React.useMemo(
		() => normalizedVariants.find((variant) => variant.label === selectedVariantName),
		[normalizedVariants, selectedVariantName],
	);

	const displayImage = React.useMemo(() => {
		if (!selectedVariant) {
			return toImageUrl(image) || image;
		}

		const isSmallVariant = SMALL_VARIANTS.includes(selectedVariant.label);

		if (isSmallVariant && selectedVariant.image) {
			return toImageUrl(selectedVariant.image);
		}

		return toImageUrl(image) || image;
	}, [selectedVariant, image, toImageUrl]);

	const selectedSmallVariant = React.useMemo(
		() => imageVariants.find((variant) => variant.label === selectedVariantName)?.label || "",
		[selectedVariantName, imageVariants],
	);

	const handleBigVariantChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
		if (value) {
			setSelectedVariantName(value);
		}
	};

	const handleRozpyvChange = (event: any) => {
		setSelectedVariantName(event.target.value);
	};

	return (
		<Card
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: 3,
				overflow: "hidden",
				boxShadow: 2,
			}}
		>
			<Box
				sx={{
					px: 2,
					pt: 2,
				}}
			>
				<Box
					sx={{
						height: { xs: 180, sm: 210, md: 220 },
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 2,
						overflow: "hidden",
						backgroundColor: "rgba(255,255,255,0.04)",
					}}
				>
					<CardMedia
						component="img"
						image={displayImage}
						alt={title}
						sx={{
							width: "100%",
							height: "100%",
							objectFit: "contain",
							p: 1.5,
						}}
					/>
				</Box>
			</Box>

			<CardContent
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					p: 2,
				}}
			>
				<Box sx={{ mb: 1.5 }}>
					<Chip
						label={inStock ? t("common.inStock") : t("common.outOfStock")}
						size="small"
						color={inStock ? "success" : "error"}
					/>
				</Box>

				<Box
					sx={{
						minHeight: { xs: 64, sm: 72 },
						mb: 2,
					}}
				>
					<Typography
						variant="h6"
						fontWeight={600}
						sx={{
							lineHeight: 1.3,
							fontSize: { xs: "1.05rem", sm: "1.1rem" },
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
						}}
					>
						{title}
					</Typography>
				</Box>

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 1.5,
						minHeight: 110,
						mb: 2,
					}}
				>
					{imageVariants.length > 0 && (
						<FormControl fullWidth size="small">
							<InputLabel id={`rozpyv-label-${slug}`}>{t("common.rozpiv")}</InputLabel>
							<Select
								labelId={`rozpyv-label-${slug}`}
								value={selectedSmallVariant}
								label={`${t("common.rozpiv")}`}
								displayEmpty
								onChange={handleRozpyvChange}
								renderValue={(selected) => {
									if (!selected) return t("common.rozpiv");
									return `${selected} МЛ`;
								}}
								sx={{
									borderRadius: 2,
								}}
							>
								{imageVariants.map((variant) => (
									<MenuItem key={variant.sku} value={variant.label} disabled={!variant.isActive}>
										{variant.label} МЛ
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					{textVariants.length > 0 && (
						<ToggleButtonGroup
							exclusive
							size="small"
							value={textVariants.some((v) => v.label === selectedVariantName) ? selectedVariantName : ""}
							onChange={handleBigVariantChange}
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 1,
								"& .MuiToggleButtonGroup-grouped": {
									borderRadius: 999,
									border: "1px solid rgba(25,118,210,0.35) !important",
									margin: 0,
								},
							}}
						>
							{textVariants.map((variant) => (
								<ToggleButton
									key={variant.sku}
									value={variant.label}
									disabled={!variant.isActive}
									sx={{
										minWidth: 86,
										height: 42,
										px: 2,
										fontSize: "0.95rem",
										borderRadius: 999,
										textTransform: "none",
										color: "primary.main",
										opacity: !variant.isActive ? 0.5 : 1,
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
									{variant.label} МЛ
								</ToggleButton>
							))}
						</ToggleButtonGroup>
					)}
				</Box>

				<Box sx={{ mt: "auto" }}>
					<Box sx={{ minHeight: 40, mb: 2 }}>
						<Typography variant="h6" fontWeight={700}>
							{selectedVariant
								? `${selectedVariant.price.current} ${selectedVariant.price.currency}`
								: "—"}
						</Typography>
					</Box>

					<Stack direction="row" spacing={1} sx={{ alignItems: "stretch" }}>
						<Button
							variant="contained"
							fullWidth
							disabled={!selectedVariant}
							onClick={() => {
								if (selectedVariant) onAddToCart(selectedVariant);
							}}
							sx={{
								minHeight: 50,
							}}
						>
							{t("common.addToCart")}
						</Button>

						<Button
							variant="outlined"
							fullWidth
							onClick={() => onViewDetails(slug)}
							sx={{
								minHeight: 50,
							}}
						>
							{t("common.details")}
						</Button>
					</Stack>
				</Box>
			</CardContent>
		</Card>
	);
};
