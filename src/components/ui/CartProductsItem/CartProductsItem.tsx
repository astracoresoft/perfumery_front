import { Box, Stack, Typography, IconButton, useTheme, useMediaQuery, CardMedia } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import type { CartItem } from "@/store/slices/cart.slice";
import { tLocal } from "@/i18n/i18n";

interface CartProductItemProps {
	item: CartItem;
	onQtyChange: (productId: string, sku: string, qty: number) => void;
	onRemove: (productId: string, sku: string) => void;
}

const CartProductItem = ({ item, onQtyChange, onRemove }: CartProductItemProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const total = item.price * item.qty;

	console.log(item);

	return (
		<Box
			sx={{
				bgcolor: "background.paper",
				borderRadius: 3,
				boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
				p: 2,
				mb: 3,
			}}
		>
			<Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems={isMobile ? "stretch" : "center"}>
				{/* IMAGE */}
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
						image={item.image}
						sx={{
							width: "100%",
							height: "100%",
							objectFit: "contain", // всегда помещается без искажений
							padding: 1, // опционально, чтоб были поля
						}}
					/>
				</Box>

				{/* INFO */}
				<Stack spacing={0.5} flex={1}>
					<Typography fontWeight={600} fontSize={16}>
						{item.title}
					</Typography>

					<Typography variant="body2" color="text.secondary">
						{tLocal(item.variant.name)} МЛ
					</Typography>

					<Typography variant="body2">
						{item.price} {item.currency}
					</Typography>
				</Stack>

				{/* RIGHT */}
				<Stack
					direction={isMobile ? "row" : "column"}
					alignItems="center"
					justifyContent="space-between"
					spacing={isMobile ? 2 : 1}
				>
					{/* QTY */}
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						sx={{
							bgcolor: "#f5f5f5",
							borderRadius: 999,
							px: 1.5,
							py: 0.5,
						}}
					>
						<IconButton
							size="small"
							disabled={item.qty <= 1}
							onClick={() => onQtyChange(item.productId, item.variant.sku, item.qty - 1)}
						>
							<RemoveIcon fontSize="small" />
						</IconButton>

						<Typography fontWeight={600}>{item.qty}</Typography>

						<IconButton
							size="small"
							onClick={() => onQtyChange(item.productId, item.variant.sku, item.qty + 1)}
						>
							<AddIcon fontSize="small" />
						</IconButton>
					</Stack>

					{/* TOTAL */}
					<Typography fontWeight={700} fontSize={18} color="primary">
						{total} {item.currency}
					</Typography>

					{/* REMOVE */}
					<IconButton color="error" onClick={() => onRemove(item.productId, item.variant.sku)}>
						<DeleteOutlineIcon />
					</IconButton>
				</Stack>
			</Stack>
		</Box>
	);
};

export default CartProductItem;
