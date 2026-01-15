import { api } from "@/api/axios";

/**
 * Получить все продукты
 * GET /api/products
 */
export const getProducts = (includeInactive = true) => {
	return api.get("/products", {
		params: { includeInactive },
	});
};

/**
 * Получить продукт по slug
 * GET /api/products/slug/{slug}
 */
export const getProductBySlug = (slug: string) => {
	return api.get(`/products/slug/${slug}`);
};
