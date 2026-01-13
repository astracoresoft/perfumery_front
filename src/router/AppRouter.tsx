import { Routes, Route, Navigate } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { HomePage } from "@/pages/HomePage/HomePage";
import { ProductDetailPage } from "@/pages/ProductDetailPage/ProductDetailPage";
import { ProductsPage } from "@/pages/ProductsPage/ProductsPage";
import { ProductsCartPage } from "@/pages/ProductsCartPage/ProductsCartPage";

export function AppRouter() {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route index element={<HomePage />} />
				<Route path="/products/:id" element={<ProductDetailPage />} />
				<Route path="/products" element={<ProductsPage />} />
				<Route path="/cart" element={<ProductsCartPage />} />
				<Route path="/brand/:slug" element={<ProductsPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	);
}
