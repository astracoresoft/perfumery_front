export interface Product {
	_id: string;

	name: string;
	slug: string;

	description: string;
	shortDescription: string;

	category: string | null;
	categories: string[];

	price: {
		current: number;
		old: number;
		currency: string;
	};

	variants: never[]; // пока пусто — можно типизировать позже
	attributes: never[]; // JSON array string → массив

	sku: string;
	stock: number;
	order: number;

	isActive: boolean;
	isNew: boolean;
	isFeatured: boolean;
	isOnSale: boolean;

	views: number;
	sales: number;
	rating: number;
	reviewsCount: number;

	metaTitle: string | null;
	metaDescription: string | null;
	metaKeywords: string | null;

	images: string[]; // или { url: string }[], если бэк изменится

	createdAt: string;
	updatedAt: string;

	__v: number;
}
