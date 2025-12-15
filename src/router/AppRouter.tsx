import { Routes, Route } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { HomePage } from "@/pages/HomePage/HomePage";
import { ProductDetailPage } from "@/pages/ProductDetailPage/ProductDetailPage";

export function AppRouter() {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="/products/:id" element={<ProductDetailPage />} />
			</Route>
		</Routes>
	);
}
