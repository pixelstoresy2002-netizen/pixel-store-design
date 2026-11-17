import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { bilingualSpecificationsSchema, serviceHighlightsSchema } from "../src/lib/structured-content";
import {
  prototypeBanners as sourcePrototypeBanners,
  prototypeCatalog as sourcePrototypeCatalog,
  prototypeOfferCount,
  prototypeProductsPart0,
  prototypeProductsPart1,
  prototypeProductsPart2,
  prototypeProductsPart3,
  prototypeServicePart0,
  prototypeServicePart1,
  prototypeServicePart2,
} from "./approved-prototype-seed-data";

type BilingualText = { readonly ar: string; readonly en: string };
type PrototypeBrand = { readonly id: string; readonly name: string; readonly country: BilingualText; readonly featured: boolean };
type PrototypeTag = { readonly id: string; readonly name: BilingualText; readonly subtitle: BilingualText; readonly applicableCategories: readonly string[] };
type PrototypeCategory = { readonly id: string; readonly parentId?: string; readonly name: BilingualText; readonly description: BilingualText; readonly useCaseIds: readonly string[] };
type PrototypeProduct = {
  readonly id: string; readonly sku: string; readonly name: BilingualText; readonly description: BilingualText;
  readonly categoryId: string; readonly subcategoryId?: string | null; readonly brandId: string; readonly useCaseIds: readonly string[];
  readonly priceUsd: number; readonly condition: "NEW" | "USED"; readonly availability: "IN_STOCK" | "OUT_OF_STOCK" | "ON_REQUEST";
  readonly primaryImage: string; readonly secondaryImage: string; readonly galleryImages?: readonly string[];
  readonly isBestSeller: boolean; readonly isNewArrival: boolean; readonly isFeatured: boolean; readonly isActive?: boolean;
  readonly laptopSpecs?: { readonly processor: string; readonly memory: string; readonly storage: string; readonly display: string };
  readonly specs: readonly { readonly label: BilingualText; readonly value: BilingualText }[];
};
type PrototypeService = {
  readonly id: string; readonly slug: string; readonly title: BilingualText; readonly subtitle: BilingualText; readonly summary?: BilingualText;
  readonly description: BilingualText; readonly galleryImages?: readonly string[]; readonly highlights: readonly { readonly title: BilingualText; readonly description: BilingualText }[];
  readonly checklist: readonly BilingualText[]; readonly turnaroundNote: BilingualText; readonly isActive: boolean; readonly isFeatured: boolean; readonly sortOrder?: number;
};
type PrototypeBanner = { readonly id: string; readonly targetView: string; readonly targetCategory?: string; readonly targetSubcategory?: string };
type PrototypeCatalog = {
  readonly settings: { readonly storeName: BilingualText; readonly tagline: BilingualText; readonly usdToSypRate: number; readonly phone: string };
  readonly brands: readonly PrototypeBrand[]; readonly tags: readonly PrototypeTag[]; readonly categories: readonly PrototypeCategory[];
};

export const prototypeCatalog = sourcePrototypeCatalog as unknown as PrototypeCatalog;
export const prototypeBanners = sourcePrototypeBanners as unknown as { readonly hero: readonly PrototypeBanner[]; readonly promo: readonly PrototypeBanner[] };

export const approvedProducts: readonly PrototypeProduct[] = [
  ...prototypeProductsPart0,
  ...prototypeProductsPart1,
  ...prototypeProductsPart2,
  ...prototypeProductsPart3,
] as const;

export const approvedServices: readonly PrototypeService[] = [
  prototypeServicePart0,
  prototypeServicePart1,
  prototypeServicePart2,
] as const;

export const developmentSiteSettingsId = "00000000-0000-4000-8000-000000000001";

export type SeedValidationSummary = {
  brands: number;
  useCaseTags: number;
  categories: number;
  products: number;
  laptopSpecs: number;
  productImageKeysSkipped: number;
  services: number;
  serviceImages: number;
  heroBannersSkipped: number;
  promoBannersSkipped: number;
  offersSkipped: number;
};

function fail(message: string): never {
  throw new Error(`Pixel Store seed data is invalid: ${message}`);
}

function assertUnique(values: readonly string[], label: string) {
  if (new Set(values).size !== values.length) fail(`duplicate ${label}`);
}

function localServiceImageKey(url: string) {
  if (!url.startsWith("/assets/services/") || !url.endsWith(".svg")) fail(`unsupported service image path: ${url}`);
  return `local-demo:${url.slice(1)}`;
}

export function effectiveCategorySlug(product: (typeof approvedProducts)[number]) {
  return product.subcategoryId ?? product.categoryId;
}

export function productSlug(product: (typeof approvedProducts)[number]) {
  const slug = product.id.replace(/^prod-/u, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) fail(`invalid product slug source: ${product.id}`);
  return slug;
}

export function dollarsToCents(value: number) {
  const cents = value * 100;
  if (!Number.isSafeInteger(cents) || cents < 0) fail(`invalid USD value: ${value}`);
  return cents;
}

export function validateApprovedSeedData(assetExists: (assetPath: string) => boolean = (assetPath) => existsSync(resolve(process.cwd(), "public", assetPath.slice(1)))): SeedValidationSummary {
  const categories = prototypeCatalog.categories;
  const tags = prototypeCatalog.tags;
  const brands = prototypeCatalog.brands;
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const tagIds = new Set(tags.map((tag) => tag.id));
  const brandIds = new Set(brands.map((brand) => brand.id));

  assertUnique(brands.map((brand) => brand.id), "brand identifier");
  assertUnique(tags.map((tag) => tag.id), "use-case identifier");
  assertUnique(categories.map((category) => category.id), "category identifier");
  assertUnique(approvedProducts.map((product) => product.sku), "product SKU");
  assertUnique(approvedProducts.map(productSlug), "product slug");
  assertUnique(approvedServices.map((service) => service.slug), "service slug");

  for (const category of categories) {
    if (category.parentId && !categoryById.has(category.parentId)) fail(`orphan category: ${category.id}`);
    for (const tagId of category.useCaseIds) if (!tagIds.has(tagId)) fail(`unknown category use case: ${category.id}/${tagId}`);
  }

  let laptopSpecs = 0;
  let productImageKeysSkipped = 0;
  for (const product of approvedProducts) {
    if (!brandIds.has(product.brandId)) fail(`unknown product brand: ${product.id}/${product.brandId}`);
    const effectiveCategory = categoryById.get(effectiveCategorySlug(product));
    if (!effectiveCategory) fail(`unknown product category: ${product.id}`);
    if (product.subcategoryId && effectiveCategory.parentId !== product.categoryId) fail(`invalid selected child category: ${product.id}`);
    for (const tagId of product.useCaseIds) if (!tagIds.has(tagId)) fail(`unknown product use case: ${product.id}/${tagId}`);
    dollarsToCents(product.priceUsd);
    const gallery = product.galleryImages ?? [];
    if (gallery.length > 5) fail(`product gallery exceeds five images: ${product.id}`);
    if (new Set(gallery).size !== gallery.length) fail(`duplicate product gallery key: ${product.id}`);
    productImageKeysSkipped += gallery.length;
    bilingualSpecificationsSchema.parse(product.specs.map((specification) => ({
      labelAr: specification.label.ar,
      labelEn: specification.label.en,
      valueAr: specification.value.ar,
      valueEn: specification.value.en,
    })));
    if (product.laptopSpecs) {
      if (Object.values(product.laptopSpecs).some((value) => !value.trim())) fail(`incomplete laptop specifications: ${product.id}`);
      laptopSpecs += 1;
    }
  }

  let serviceImages = 0;
  for (const service of approvedServices) {
    if ("thermalBenchmark" in service) fail(`unverified thermal benchmark present: ${service.slug}`);
    const gallery = service.galleryImages ?? [];
    if (gallery.length === 0 || gallery.length > 5) fail(`invalid service gallery size: ${service.slug}`);
    if (new Set(gallery).size !== gallery.length) fail(`duplicate service gallery path: ${service.slug}`);
    for (const image of gallery) {
      localServiceImageKey(image);
      if (!assetExists(image)) fail(`missing local service asset: ${image}`);
    }
    serviceImages += gallery.length;
    serviceHighlightsSchema.parse(service.highlights.map((highlight) => ({
      titleAr: highlight.title.ar,
      titleEn: highlight.title.en,
      descriptionAr: highlight.description.ar,
      descriptionEn: highlight.description.en,
    })));
  }

  for (const banner of [...prototypeBanners.hero, ...prototypeBanners.promo]) {
    if (banner.targetView !== "category") fail(`unsupported banner destination: ${banner.id}`);
    const category = banner.targetCategory ? categoryById.get(banner.targetCategory) : undefined;
    if (!category) fail(`missing banner category destination: ${banner.id}`);
    if (banner.targetSubcategory) {
      const child = categoryById.get(banner.targetSubcategory);
      if (!child || child.parentId !== category.id) fail(`invalid banner child destination: ${banner.id}`);
    }
  }

  if (prototypeCatalog.settings.phone !== "+963 933 811 106") fail("approved primary phone changed unexpectedly");
  if (prototypeCatalog.settings.usdToSypRate !== 12_500) fail("approved store exchange rate changed unexpectedly");

  return {
    brands: brands.length,
    useCaseTags: tags.length,
    categories: categories.length,
    products: approvedProducts.length,
    laptopSpecs,
    productImageKeysSkipped,
    services: approvedServices.length,
    serviceImages,
    heroBannersSkipped: prototypeBanners.hero.length,
    promoBannersSkipped: prototypeBanners.promo.length,
    offersSkipped: prototypeOfferCount,
  };
}

export function getLocalServiceImageIdentity(url: string) {
  return localServiceImageKey(url);
}
