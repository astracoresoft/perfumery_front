import { Outlet } from "react-router-dom";
import { Header } from "../../components/layout/Header/Header";

export function MainLayout() {
	return (
		<>
			<Header />

			<main>
				<Outlet />
			</main>
		</>
	);
}
