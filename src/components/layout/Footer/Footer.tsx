import { Box, Container, Typography, Link, IconButton, Divider, Stack } from "@mui/material";

import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

export function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				mt: 10,
				pt: 6,
				pb: 4,
				bgcolor: "background.paper",
				borderTop: "1px solid",
				borderColor: "divider",
			}}
		>
			<Container maxWidth="lg">
				{/* TOP */}
				<Stack direction={{ xs: "column", md: "row" }} spacing={6} justifyContent="space-between">
					{/* BRAND */}
					<Box maxWidth={360}>
						<Typography variant="h6" fontWeight={700} gutterBottom>
							Perfume Boutique
						</Typography>

						<Typography variant="body2" color="text.secondary" mb={2}>
							Exclusive niche fragrances. Carefully selected. Delivered with care.
						</Typography>

						<Stack direction="row" spacing={1}>
							<IconButton size="small">
								<InstagramIcon />
							</IconButton>
							<IconButton size="small">
								<FacebookIcon />
							</IconButton>
							<IconButton size="small">
								<TwitterIcon />
							</IconButton>
						</Stack>
					</Box>

					{/* NAVIGATION */}
					<Stack spacing={1} minWidth={140}>
						<Typography variant="subtitle1" fontWeight={600}>
							Shop
						</Typography>

						<Link href="/products" underline="hover" color="inherit">
							All products
						</Link>
						<Link href="/brands" underline="hover" color="inherit">
							Brands
						</Link>
					</Stack>

					{/* SUPPORT */}

					{/* CONTACT */}
					<Stack spacing={1} minWidth={200}>
						<Typography variant="subtitle1" fontWeight={600}>
							Contact
						</Typography>

						<Stack direction="row" spacing={1} alignItems="center">
							<EmailOutlinedIcon fontSize="small" />
							<Typography variant="body2">support@perfumeboutique.com</Typography>
						</Stack>

						<Stack direction="row" spacing={1} alignItems="center">
							<PhoneOutlinedIcon fontSize="small" />
							<Typography variant="body2">+49 30 1234 5678</Typography>
						</Stack>
					</Stack>
				</Stack>

				<Divider sx={{ my: 4 }} />

				{/* BOTTOM */}
				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={2}
					justifyContent="space-between"
					alignItems={{ xs: "flex-start", md: "center" }}
				>
					<Typography variant="body2" color="text.secondary">
						© {new Date().getFullYear()} Perfume Boutique. All rights reserved.
					</Typography>
				</Stack>
			</Container>
		</Box>
	);
}
