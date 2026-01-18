import type { LocalizedString } from "./сommon.type";

export interface Category {
	_id: string;

	name: LocalizedString;
	slug: string;

	parent: string | null; // ID родительской категории
	parentCategories: Category[]; // populated, если приходит

	order: number;
	isActive: boolean;

	description: LocalizedString | null;
	image: string | null;
	icon: string | null;

	metaTitle: LocalizedString | null;
	metaDescription: LocalizedString | null;
	metaKeywords: LocalizedString | null;

	createdAt: string; // ISO
	updatedAt: string; // ISO

	__v: number;
}
