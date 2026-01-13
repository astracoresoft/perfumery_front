import React from "react";
import { Box, Stack, Typography, IconButton, Button, Divider, useTheme, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export interface CartItem {
	id: string;
	title: string;
	image: string;
	size: string;
	color: string;
	price: number;
	discount: number;
	quantity: number;
}

interface CartProductItemProps {
	item: CartItem;
	onQtyChange: (id: string, delta: number) => void;
	onRemove: (id: string) => void;
}

const CartProductItem: React.FC<CartProductItemProps> = ({ item, onQtyChange, onRemove }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const itemTotal = item.price * item.quantity * (1 - item.discount / 100);

	return (
		<Box py={3}>
			{!isMobile ? (
				/* ================= DESKTOP ================= */
				<>
					<Stack direction="row" alignItems="center" justifyContent="space-between">
						{/* PRODUCT */}
						<Stack direction="row" spacing={2} width="40%">
							<img src={item.image} alt={item.title} width={80} />
							<Box>
								<Typography fontWeight={600}>{item.title}</Typography>
								<Typography variant="body2">ID: 000{item.id}</Typography>
								<Typography variant="body2">Size: {item.size}</Typography>

								<Stack direction="row" spacing={1} alignItems="center">
									<Typography variant="body2">Color:</Typography>
									<Box
										sx={{
											width: 14,
											height: 14,
											backgroundColor: item.color,
										}}
									/>
								</Stack>
							</Box>
						</Stack>

						{/* QTY */}
						<Stack direction="row" spacing={1} alignItems="center" width="20%" justifyContent="center">
							<IconButton onClick={() => onQtyChange(item.id, -1)}>
								<RemoveIcon />
							</IconButton>
							<Typography>{item.quantity}</Typography>
							<IconButton onClick={() => onQtyChange(item.id, 1)}>
								<AddIcon />
							</IconButton>
						</Stack>

						{/* DISCOUNT */}
						<Typography width="15%" align="center">
							{item.discount}%
						</Typography>

						{/* PRICE */}
						<Typography width="10%" align="center">
							${item.price}
						</Typography>

						{/* TOTAL */}
						<Stack width="10%" alignItems="center">
							<Typography>${itemTotal.toFixed(2)}</Typography>
							<Button size="small" onClick={() => onRemove(item.id)}>
								REMOVE
							</Button>
						</Stack>
					</Stack>

					<Divider />
				</>
			) : (
				/* ================= MOBILE ================= */
				<Box border="1px solid #e0e0e0" p={2} borderRadius={2}>
					<Stack spacing={2}>
						{/* Top */}
						<Stack direction="row" spacing={2}>
							<img src={item.image} alt={item.title} width={80} />
							<Box>
								<Typography fontWeight={600}>{item.title}</Typography>
								<Typography variant="body2">Size: {item.size}</Typography>

								<Stack direction="row" spacing={1} alignItems="center">
									<Typography variant="body2">Color:</Typography>
									<Box
										sx={{
											width: 14,
											height: 14,
											backgroundColor: item.color,
										}}
									/>
								</Stack>
							</Box>
						</Stack>

						{/* Qty */}
						<Stack direction="row" spacing={1} alignItems="center">
							<Typography width={80}>Quantity:</Typography>
							<IconButton onClick={() => onQtyChange(item.id, -1)}>
								<RemoveIcon />
							</IconButton>
							<Typography>{item.quantity}</Typography>
							<IconButton onClick={() => onQtyChange(item.id, 1)}>
								<AddIcon />
							</IconButton>
						</Stack>

						{/* Prices */}
						<Stack direction="row" justifyContent="space-between">
							<Typography>Price:</Typography>
							<Typography>${item.price}</Typography>
						</Stack>

						<Stack direction="row" justifyContent="space-between">
							<Typography>Discount:</Typography>
							<Typography>{item.discount}%</Typography>
						</Stack>

						<Stack direction="row" justifyContent="space-between">
							<Typography fontWeight={600}>Total:</Typography>
							<Typography fontWeight={600}>${itemTotal.toFixed(2)}</Typography>
						</Stack>

						<Button size="small" onClick={() => onRemove(item.id)}>
							REMOVE
						</Button>
					</Stack>
				</Box>
			)}
		</Box>
	);
};

export default CartProductItem;
