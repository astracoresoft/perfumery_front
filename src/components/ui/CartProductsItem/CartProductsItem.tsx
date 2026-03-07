import { Box, Typography, IconButton, Stack } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type { CartItem } from "@/store/slices/cart.slice";

interface CartProductItemProps {
	item: CartItem;
	onQtyChange: (productId: string, variantName: string, qty: number) => void;
	onRemove: (productId: string, variantName: string) => void;
}

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const toImageUrl = (url?: string | null) => {
	if (!url) return "";
	if (url.startsWith("http")) return url;
	return `${API_ORIGIN}${url}`;
};

const CartProductItem = ({ item, onQtyChange, onRemove }: CartProductItemProps) => {
	const variantName = item.variant.name.ua.trim();

	return (
		<Box py={3} display="flex" gap={2} alignItems="center">
			<Box
				component="img"
				src={toImageUrl(item.variant.image || item.image)}
				alt={item.title}
				sx={{
					width: 90,
					height: 90,
					objectFit: "contain",
					borderRadius: 2,
					bgcolor: "#fafafa",
					p: 1,
				}}
			/>

			<Box flex={1}>
				<Typography fontWeight={700}>{item.title}</Typography>
				<Typography variant="body2" color="text.secondary">
					{variantName} МЛ
				</Typography>
				<Typography fontWeight={600}>
					{item.price} {item.currency}
				</Typography>
			</Box>

			<Stack direction="row" alignItems="center" spacing={1}>
				<IconButton
					onClick={() => onQtyChange(item.productId, variantName, item.qty - 1)}
					disabled={item.qty <= 1}
				>
					<RemoveIcon />
				</IconButton>

				<Typography minWidth={24} textAlign="center">
					{item.qty}
				</Typography>

				<IconButton onClick={() => onQtyChange(item.productId, variantName, item.qty + 1)}>
					<AddIcon />
				</IconButton>
			</Stack>

			<IconButton onClick={() => onRemove(item.productId, variantName)}>
				<DeleteOutlineIcon />
			</IconButton>
		</Box>
	);
};

export default CartProductItem;
