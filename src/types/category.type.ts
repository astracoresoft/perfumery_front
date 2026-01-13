export interface Category {
	_id: string;
	name: string;
	slug: string;

	parent: string | null;
	parentCategories: Category[];

	order: number;
	isActive: boolean;

	description: string | null;
	image: string | null;
	icon: string | null;

	metaTitle: string | null;
	metaDescription: string | null;
	metaKeywords: string | null;

	createdAt: string; // ISO date
	updatedAt: string; // ISO date

	__v: number;
}
