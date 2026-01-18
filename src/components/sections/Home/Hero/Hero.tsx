import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import img from "@/assets/images/testPerfume.png";

export function Hero() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<Box
			component="section"
			sx={{
				position: "relative",
				overflow: "hidden",
				px: { xs: 3, md: 10 },
				py: { xs: 8, md: 14 },
				background: `
          radial-gradient(
            circle at top right,
            rgba(0,0,0,0.04),
            transparent 60%
          ),
          linear-gradient(
            180deg,
            #fdfdfd 0%,
            #f4f4f4 100%
          )
        `,
			}}
		>
			{/* BACKGROUND BLUR SHAPE */}
			<Box
				sx={{
					position: "absolute",
					top: "-120px",
					right: "-120px",
					width: 320,
					height: 320,
					borderRadius: "50%",
					background: "rgba(0,0,0,0.05)",
					filter: "blur(80px)",
				}}
			/>

			<Box
				sx={{
					position: "relative",
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					alignItems: "center",
					justifyContent: "space-between",
					gap: 8,
				}}
			>
				{/* TEXT */}
				<Box maxWidth={520}>
					<Typography
						sx={{
							fontSize: { xs: "14px", md: "15px" },
							letterSpacing: "0.18em",
							textTransform: "uppercase",
							color: "text.secondary",
							mb: 2,
						}}
					>
						Niche Fragrances
					</Typography>

					<Typography
						variant="h1"
						sx={{
							fontSize: { xs: "20px", md: "30px" },
							fontWeight: 600,
							lineHeight: 1.15,
							mb: 3,
						}}
					>
						{t("home.heroTitle", "Fragrance as an identity")}
					</Typography>

					<Typography
						sx={{
							fontSize: "18px",
							color: "text.secondary",
							maxWidth: 460,
							mb: 4,
						}}
					>
						{t(
							"home.heroSubtitle",
							"A curated selection of niche perfumes crafted to be felt, remembered, and unmistakably yours.",
						)}
					</Typography>

					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/products")}
						sx={{
							px: 4,
							py: 1.5,
							borderRadius: "999px",
							textTransform: "none",
							fontSize: "15px",
							letterSpacing: "0.04em",
						}}
					>
						{t("home.catalogButton", "Explore the collection")}
					</Button>
				</Box>

				{/* IMAGE */}
				<Box
					sx={{
						width: { xs: "100%", md: 420 },
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Box
						component="img"
						src={img}
						alt="Niche perfume bottle"
						sx={{
							width: "100%",
							maxWidth: 420,
							borderRadius: "22px",
							objectFit: "contain",
							boxShadow: `
                0 30px 60px rgba(0,0,0,0.08),
                inset 0 0 0 1px rgba(255,255,255,0.4)
              `,
						}}
					/>
				</Box>
			</Box>
		</Box>
	);
}
