import { Box, Stack, Typography, IconButton, Button, Divider, useTheme, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type { CartItem } from "@/store/slices/cart.slice";

interface CartProductItemProps {
	item: CartItem;
	onQtyChange: (productId: string, ml: number, qty: number) => void;
	onRemove: (productId: string, ml: number) => void;
}

const CartProductItem = ({ item, onQtyChange, onRemove }: CartProductItemProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const total = item.price * item.qty;

	return (
		<Box py={3}>
			{!isMobile ? (
				<>
					<Stack direction="row" alignItems="center" justifyContent="space-between">
						{/* PRODUCT */}
						<Stack direction="row" spacing={2} width="40%">
							<img src={item.image} alt={item.title} width={80} />
							<Box>
								<Typography fontWeight={600}>{item.title}</Typography>
								<Typography variant="body2">{item.variant.ml} ml</Typography>
							</Box>
						</Stack>

						{/* QTY */}
						<Stack direction="row" spacing={1} alignItems="center">
							<IconButton onClick={() => onQtyChange(item.productId, item.variant.ml, item.qty - 1)}>
								<RemoveIcon />
							</IconButton>

							<Typography>{item.qty}</Typography>

							<IconButton onClick={() => onQtyChange(item.productId, item.variant.ml, item.qty + 1)}>
								<AddIcon />
							</IconButton>
						</Stack>

						<Typography>
							{item.price} {item.currency}
						</Typography>

						<Typography fontWeight={600}>
							{total} {item.currency}
						</Typography>

						<Button onClick={() => onRemove(item.productId, item.variant.ml)}>REMOVE</Button>
					</Stack>

					<Divider sx={{ mt: 2 }} />
				</>
			) : (
				<Box border="1px solid #e0e0e0" p={2} borderRadius={2}>
					<Stack spacing={2}>
						<Typography fontWeight={600}>{item.title}</Typography>
						<Typography>{item.variant.ml} ml</Typography>

						<Stack direction="row" spacing={1} alignItems="center">
							<IconButton onClick={() => onQtyChange(item.productId, item.variant.ml, item.qty - 1)}>
								<RemoveIcon />
							</IconButton>

							<Typography>{item.qty}</Typography>

							<IconButton onClick={() => onQtyChange(item.productId, item.variant.ml, item.qty + 1)}>
								<AddIcon />
							</IconButton>
						</Stack>

						<Typography>
							{total} {item.currency}
						</Typography>

						<Button onClick={() => onRemove(item.productId, item.variant.ml)}>REMOVE</Button>
					</Stack>
				</Box>
			)}
		</Box>
	);
};

export default CartProductItem;
