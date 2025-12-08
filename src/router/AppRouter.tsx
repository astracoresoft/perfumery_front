import { Routes, Route } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { HomePage } from "@/pages/HomePage/HomePage";

export function AppRouter() {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route path="/" element={<HomePage />} />
			</Route>
		</Routes>
	);
}
