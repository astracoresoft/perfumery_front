import { products } from "@/components/sections/Home/ProductsSection/ProductsSection";
import { Box, Typography, Chip, Stack, Button, Divider } from "@mui/material";
import { useParams, Navigate } from "react-router-dom";

export function ProductDetailPage() {
	const { id } = useParams<{ id: string }>();
	const product = products.find((p) => p.id === id);

	if (!product) {
		return <Navigate to="/" replace />;
	}

	return (
		<Box maxWidth="1200px" mx="auto" p={6}>
			{/* ===== TOP SECTION ===== */}
			<Stack direction={{ xs: "column", md: "row" }} spacing={6} mb={8}>
				{/* Image */}
				<Box flex={1}>
					<img src={product.image} alt={product.title} style={{ width: "100%", maxWidth: 420 }} />
				</Box>

				{/* Main info */}
				<Box flex={2}>
					<Chip label={product.category} sx={{ mb: 2 }} />

					<Typography variant="h4" fontWeight={700} gutterBottom>
						{product.title}
					</Typography>

					<Typography color="text.secondary" mb={4}>
						{product.description}
					</Typography>

					<Typography variant="h6" fontWeight={600} mb={2}>
						Available volumes
					</Typography>

					<Stack direction="row" spacing={2} mb={4}>
						{product.variants.map((v) => (
							<Chip key={v.ml} label={`${v.ml} ml — €${v.price}`} />
						))}
					</Stack>

					<Button variant="contained" size="large">
						Add to cart
					</Button>
				</Box>
			</Stack>

			{/* ===== FRAGRANCE NOTES ===== */}
			<Box mb={6}>
				<Typography variant="h5" fontWeight={700} mb={3}>
					Fragrance notes
				</Typography>

				<Stack direction={{ xs: "column", md: "row" }} spacing={4}>
					<Box>
						<Typography fontWeight={600}>Top notes</Typography>
						{product.notes.top.map((note) => (
							<Typography key={note} color="text.secondary">
								• {note}
							</Typography>
						))}
					</Box>

					<Box>
						<Typography fontWeight={600}>Heart notes</Typography>
						{product.notes.middle.map((note) => (
							<Typography key={note} color="text.secondary">
								• {note}
							</Typography>
						))}
					</Box>

					<Box>
						<Typography fontWeight={600}>Base notes</Typography>
						{product.notes.base.map((note) => (
							<Typography key={note} color="text.secondary">
								• {note}
							</Typography>
						))}
					</Box>
				</Stack>
			</Box>

			<Divider sx={{ my: 6 }} />

			{/* ===== CHARACTERISTICS ===== */}
			<Box mb={6}>
				<Typography variant="h5" fontWeight={700} mb={3}>
					Characteristics
				</Typography>

				<Stack spacing={1}>
					<Typography>Fragrance family: {product.characteristics.fragranceFamily}</Typography>
					<Typography>Intensity: {product.characteristics.intensity}</Typography>
					<Typography>Longevity: {product.characteristics.longevity}</Typography>
					<Typography>Sillage: {product.characteristics.sillage}</Typography>
					<Typography>Season: {product.characteristics.season}</Typography>
					<Typography>Gender: {product.characteristics.gender}</Typography>
				</Stack>
			</Box>

			<Divider sx={{ my: 6 }} />

			{/* ===== STORY ===== */}
			<Box mb={6}>
				<Typography variant="h5" fontWeight={700} mb={2}>
					About the fragrance
				</Typography>

				<Typography color="text.secondary">{product.story}</Typography>
			</Box>

			{/* ===== HOW TO USE ===== */}
			<Box>
				<Typography variant="h5" fontWeight={700} mb={2}>
					How to use
				</Typography>

				<Typography color="text.secondary">{product.howToUse}</Typography>
			</Box>
		</Box>
	);
}
