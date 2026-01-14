export type SortOption = "price_asc" | "price_desc" | "name_asc" | "name_desc";

export interface ProductFilters {
	inStockOnly: boolean;
	minPrice?: number;
	maxPrice?: number;
	sort: SortOption;
}
