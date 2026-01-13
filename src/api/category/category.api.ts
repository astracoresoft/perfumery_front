import { api } from "../axios";

// 🔹 Все категории (бренды)
export const getCategories = (includeInactive = true) => {
	return api.get("/categories", {
		params: { includeInactive },
	});
};

// 🔹 Категория (бренд) по slug
export const getCategoryBySlug = (slug: string) => {
	return api.get(`/categories/slug/${slug}`);
};
