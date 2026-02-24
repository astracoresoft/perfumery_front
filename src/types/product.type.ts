import type { LocalizedString, Price } from "./сommon.type";

export interface ProductVariant {
	name: LocalizedString;
	price: Price;
	sku: string;
	stock: number;
	isActive: boolean;
	image: string;
}

export interface ImageVariant {
	url: string;
	alt: string | null;
	order: number;
	isMain: boolean;
}

export interface ProductAttribute {
	name: LocalizedString;
	value: LocalizedString;
	unit: string | null;
}

export interface ProductCustomFields {
	gender?: string;
	concentration?: string;
	country?: string;
	brand?: string;
	[key: string]: string | undefined;
}

export interface Product {
	_id: string;

	name: LocalizedString;
	slug: string;

	description: LocalizedString;
	shortDescription: LocalizedString;

	/**
	 * Главная категория (ID Category)
	 */
	category: string | null;

	/**
	 * Дополнительные категории (ID Category[])
	 */
	categories: string[];

	price: Price;

	variants: ProductVariant[];
	attributes: ProductAttribute[];

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

	metaTitle: LocalizedString | null;
	metaDescription: LocalizedString | null;
	metaKeywords: LocalizedString | null;

	customFields: ProductCustomFields;

	images: ImageVariant[];

	createdAt?: string; // иногда не приходит
	updatedAt: string;

	__v: number;
}
