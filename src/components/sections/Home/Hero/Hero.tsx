import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
// import heroImage from "@/assets/images/lavender.png"; // когда появится

export function Hero() {
	const { t } = useTranslation();

	return (
		<Box
			component="section"
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "60px 80px",
				backgroundColor: "#fafafa",
				borderRadius: "16px",
			}}
		>
			{/* TEXT BLOCK */}
			<Box sx={{ maxWidth: "500px" }}>
				<Typography
					variant="h1"
					sx={{
						fontSize: "42px",
						fontWeight: 700,
						mb: 2,
					}}
				>
					{t("home.heroTitle")}
				</Typography>

				<Typography
					variant="body1"
					sx={{
						fontSize: "18px",
						marginBottom: "20px",
					}}
				>
					{t("home.heroSubtitle")}
				</Typography>

				<Button variant="outlined" size="large">
					{t("home.catalogButton")}
				</Button>
			</Box>

			{/* IMAGE BLOCK */}
			<Box sx={{ display: "flex", justifyContent: "center" }}>
				{/* <Box component="img" src={heroImage} alt="Lavender candle" sx={{ width: "400px" }} /> */}
			</Box>
		</Box>
	);
}
