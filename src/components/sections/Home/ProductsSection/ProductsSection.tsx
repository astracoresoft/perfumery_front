import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/ui/ProductCard/ProductCard";
import img from "@/assets/images/testPerfume.png";
import { productsFlexLayout } from "@/assets/styles/productsFlexLayout";

// eslint-disable-next-line react-refresh/only-export-components
export const products = [
	{
		id: "1",
		title: "Luxury Perfume 1",
		description: "Deep oriental fragrance with spicy and amber accords.",
		category: "Perfume",
		image: img,
		variants: [
			{ ml: 50, price: 79 },
			{ ml: 100, price: 119 },
		],
		notes: {
			top: ["Bergamot", "Pink Pepper"],
			middle: ["Amber", "Cinnamon"],
			base: ["Vanilla", "Patchouli", "Musk"],
		},
		characteristics: {
			fragranceFamily: "Oriental / Spicy",
			intensity: "Intense",
			longevity: "8–10 hours",
			sillage: "Strong",
			season: "Autumn / Winter",
			gender: "Unisex",
		},
		story: "Luxury Perfume 3 is inspired by oriental nights and warm amber tones. It opens with a spicy freshness and evolves into a deep, sensual composition.",
		howToUse:
			"Apply on pulse points such as wrists, neck and behind the ears. Avoid rubbing the fragrance into the skin.",
	},
	{
		id: "2",
		title: "Luxury Perfume 2",
		description: "Deep oriental fragrance with spicy and amber accords.",
		category: "Perfume",
		image: img,
		variants: [
			{ ml: 50, price: 79 },
			{ ml: 100, price: 119 },
		],
		notes: {
			top: ["Bergamot", "Pink Pepper"],
			middle: ["Amber", "Cinnamon"],
			base: ["Vanilla", "Patchouli", "Musk"],
		},
		characteristics: {
			fragranceFamily: "Oriental / Spicy",
			intensity: "Intense",
			longevity: "8–10 hours",
			sillage: "Strong",
			season: "Autumn / Winter",
			gender: "Unisex",
		},
		story: "Luxury Perfume 3 is inspired by oriental nights and warm amber tones. It opens with a spicy freshness and evolves into a deep, sensual composition.",
		howToUse:
			"Apply on pulse points such as wrists, neck and behind the ears. Avoid rubbing the fragrance into the skin.",
	},
	{
		id: "3",
		title: "Luxury Perfume 3",
		description: "Deep oriental fragrance with spicy and amber accords.",
		category: "Perfume",
		image: img,
		variants: [
			{ ml: 50, price: 79 },
			{ ml: 100, price: 119 },
		],
		notes: {
			top: ["Bergamot", "Pink Pepper"],
			middle: ["Amber", "Cinnamon"],
			base: ["Vanilla", "Patchouli", "Musk"],
		},
		characteristics: {
			fragranceFamily: "Oriental / Spicy",
			intensity: "Intense",
			longevity: "8–10 hours",
			sillage: "Strong",
			season: "Autumn / Winter",
			gender: "Unisex",
		},
		story: "Luxury Perfume 3 is inspired by oriental nights and warm amber tones. It opens with a spicy freshness and evolves into a deep, sensual composition.",
		howToUse:
			"Apply on pulse points such as wrists, neck and behind the ears. Avoid rubbing the fragrance into the skin.",
	},
	{
		id: "4",
		title: "Luxury Perfume 4",
		description: "Deep oriental fragrance with spicy and amber accords.",
		category: "Perfume",
		image: img,
		variants: [
			{ ml: 50, price: 79 },
			{ ml: 100, price: 119 },
		],
		notes: {
			top: ["Bergamot", "Pink Pepper"],
			middle: ["Amber", "Cinnamon"],
			base: ["Vanilla", "Patchouli", "Musk"],
		},
		characteristics: {
			fragranceFamily: "Oriental / Spicy",
			intensity: "Intense",
			longevity: "8–10 hours",
			sillage: "Strong",
			season: "Autumn / Winter",
			gender: "Unisex",
		},
		story: "Luxury Perfume 3 is inspired by oriental nights and warm amber tones. It opens with a spicy freshness and evolves into a deep, sensual composition.",
		howToUse:
			"Apply on pulse points such as wrists, neck and behind the ears. Avoid rubbing the fragrance into the skin.",
	},
];

export function ProductsSection() {
	const navigate = useNavigate();
	return (
		<Box
			p={4}
			sx={{
				display: "flex",
				flexWrap: "wrap",
				gap: 4,
				...productsFlexLayout,
			}}
		>
			{products.map((product) => (
				<ProductCard
					key={product.id}
					id={product.id}
					title={product.title}
					description={product.description}
					image={product.image}
					category={product.category}
					inStock
					variants={product.variants}
					onViewDetails={(id) => navigate(`/products/${id}`)}
				/>
			))}
		</Box>
	);
}
