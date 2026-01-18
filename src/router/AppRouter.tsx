import { Routes, Route, Navigate } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { HomePage } from "@/pages/HomePage/HomePage";
import { ProductDetailPage } from "@/pages/ProductDetailPage/ProductDetailPage";
import { ProductsPage } from "@/pages/ProductsPage/ProductsPage";
import { ProductsCartPage } from "@/pages/ProductsCartPage/ProductsCartPage";
import { ProductsSection } from "@/components/sections/Products/ProductsSection/ProductsSection";
import { CheckoutPage } from "@/pages/CheckoutPage/CheckoutPage";

export function AppRouter() {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route index element={<HomePage />} />
				<Route path="/products/:id" element={<ProductDetailPage />} />
				<Route path="/products" element={<ProductsPage />} />
				<Route path="/checkout" element={<CheckoutPage />} />
				<Route path="/cart" element={<ProductsCartPage />} />
				<Route path="/brand/:slug" element={<ProductsSection />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	);
}
