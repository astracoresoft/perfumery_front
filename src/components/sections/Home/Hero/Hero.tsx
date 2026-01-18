import { Box, Button, Typography, Stack } from "@mui/material";
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
				px: { xs: 3, md: 12 },
				py: { xs: 10, md: 18 },
				background: `
          radial-gradient(800px circle at 85% 20%, rgba(0,0,0,0.06), transparent 60%),
          radial-gradient(600px circle at 10% 80%, rgba(0,0,0,0.04), transparent 55%),
          linear-gradient(180deg, #fdfdfd 0%, #f3f3f3 100%)
        `,
			}}
		>
			{/* DECORATIVE BLUR */}
			<Box
				sx={{
					position: "absolute",
					top: "-180px",
					right: "-180px",
					width: 420,
					height: 420,
					borderRadius: "50%",
					background: "rgba(0,0,0,0.06)",
					filter: "blur(120px)",
					zIndex: 0,
				}}
			/>

			<Stack
				direction={{ xs: "column", md: "row" }}
				alignItems="center"
				justifyContent="space-between"
				spacing={{ xs: 8, md: 12 }}
				sx={{ position: "relative", zIndex: 1 }}
			>
				{/* TEXT BLOCK */}
				<Box maxWidth={560}>
					<Typography
						sx={{
							fontSize: { xs: "12px", md: "13px" },
							letterSpacing: "0.32em",
							textTransform: "uppercase",
							color: "text.secondary",
							mb: 3,
						}}
					>
						Niche Fragrances
					</Typography>

					<Typography
						component="h1"
						sx={{
							fontSize: { xs: "32px", md: "48px", lg: "56px" },
							fontWeight: 600,
							lineHeight: 1.08,
							letterSpacing: "-0.02em",
							mb: 4,
						}}
					>
						{t("home.heroTitle", "Нишевые и брендовые парфюмы")}
					</Typography>

					<Typography
						sx={{
							fontSize: { xs: "16px", md: "18px" },
							color: "text.secondary",
							lineHeight: 1.7,
							maxWidth: 480,
							mb: 6,
						}}
					>
						{t("home.heroSubtitle", "Ароматы, которые раскрывают индивидуальность и остаются в памяти.")}
					</Typography>

					<Stack direction="row" spacing={2} flexWrap="wrap">
						<Button
							variant="contained"
							size="large"
							onClick={() => navigate("/products")}
							sx={{
								px: 5,
								py: 1.6,
								borderRadius: "999px",
								textTransform: "none",
								fontSize: "15px",
								fontWeight: 500,
								boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
								"&:hover": {
									boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
								},
							}}
						>
							{t("home.catalogButton", "Смотреть каталог")}
						</Button>
					</Stack>
				</Box>

				{/* IMAGE BLOCK */}
				<Box
					sx={{
						width: { xs: "100%", md: 460 },
						display: "flex",
						justifyContent: "center",
						position: "relative",
					}}
				>
					<Box
						component="img"
						src={img}
						alt="Niche perfume bottle"
						sx={{
							width: "100%",
							maxWidth: 420,
							borderRadius: "26px",
							objectFit: "contain",
							transform: "translateY(0)",
							transition: "transform 0.6s ease",
							boxShadow: `
                0 40px 80px rgba(0,0,0,0.18),
                inset 0 0 0 1px rgba(255,255,255,0.5)
              `,
							"&:hover": {
								transform: "translateY(-8px)",
							},
						}}
					/>
				</Box>
			</Stack>
		</Box>
	);
}
