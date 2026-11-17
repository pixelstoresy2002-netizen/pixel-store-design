/**
 * Run only against an approved empty development or demonstration database:
 *   npm run db:seed
 *
 * This seed never resets data, does not run automatically, and only creates
 * records that are missing by their stable natural identifiers.
 */
import "dotenv/config";

import { Prisma, PrismaClient, ProductCondition, StockStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { bilingualSpecificationsSchema, serviceHighlightsSchema } from "../src/lib/structured-content";
import {
  approvedProducts,
  approvedServices,
  developmentSiteSettingsId,
  dollarsToCents,
  effectiveCategorySlug,
  getLocalServiceImageIdentity,
  productSlug,
  prototypeCatalog,
  validateApprovedSeedData,
} from "./seed-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to run the Pixel Store seed.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

function fail(message: string): never {
  throw new Error(`Pixel Store seed failed safely: ${message}`);
}

function normalizeBrandName(value: string) {
  return value.trim().replace(/\s+/gu, " ").toLocaleLowerCase("en-US");
}

function getProductExtraSpecs(product: (typeof approvedProducts)[number]) {
  return bilingualSpecificationsSchema.parse(product.specs.map((specification) => ({
    labelAr: specification.label.ar,
    labelEn: specification.label.en,
    valueAr: specification.value.ar,
    valueEn: specification.value.en,
  }))) as Prisma.InputJsonValue;
}

async function seedApprovedPrototypeData() {
  const validation = validateApprovedSeedData();

  const result = await prisma.$transaction(async (transaction) => {
    const protectedBefore = await Promise.all([
      transaction.user.count(),
      transaction.session.count(),
      transaction.account.count(),
      transaction.verification.count(),
      transaction.customerRequest.count(),
      transaction.analyticsEvent.count(),
    ]);

    const tagIds = new Map<string, string>();
    let createdTags = 0;
    for (const [index, tag] of prototypeCatalog.tags.entries()) {
      const existing = await transaction.useCaseTag.findUnique({ where: { slug: tag.id }, select: { id: true } });
      if (existing) {
        tagIds.set(tag.id, existing.id);
        continue;
      }
      const created = await transaction.useCaseTag.create({
        data: {
          slug: tag.id,
          nameAr: tag.name.ar,
          nameEn: tag.name.en,
          descriptionAr: tag.subtitle.ar,
          descriptionEn: tag.subtitle.en,
          sortOrder: (index + 1) * 10,
          isActive: true,
        },
        select: { id: true },
      });
      tagIds.set(tag.id, created.id);
      createdTags += 1;
    }

    const brandIds = new Map<string, string>();
    let createdBrands = 0;
    for (const [index, brand] of prototypeCatalog.brands.entries()) {
      const normalizedName = normalizeBrandName(brand.name);
      const [byNormalizedName, bySlug] = await Promise.all([
        transaction.brand.findUnique({ where: { normalizedName }, select: { id: true, slug: true } }),
        transaction.brand.findUnique({ where: { slug: brand.id }, select: { id: true, normalizedName: true } }),
      ]);
      if (byNormalizedName && bySlug && byNormalizedName.id !== bySlug.id) fail(`brand identity conflict: ${brand.id}`);
      if (byNormalizedName) {
        brandIds.set(brand.id, byNormalizedName.id);
        continue;
      }
      if (bySlug) fail(`brand slug belongs to a different brand: ${brand.id}`);
      const created = await transaction.brand.create({
        data: {
          slug: brand.id,
          name: brand.name,
          normalizedName,
          descriptionAr: `المنشأ: ${brand.country.ar}`,
          descriptionEn: `Origin: ${brand.country.en}`,
          sortOrder: (index + 1) * 10,
          isActive: true,
        },
        select: { id: true },
      });
      brandIds.set(brand.id, created.id);
      createdBrands += 1;
    }

    const categoryIds = new Map<string, string>();
    let createdCategories = 0;
    for (const [index, category] of prototypeCatalog.categories.entries()) {
      const parentSlug = "parentId" in category ? category.parentId : undefined;
      const parentId = parentSlug ? categoryIds.get(parentSlug) : null;
      if (parentSlug && !parentId) fail(`category parent was not resolved: ${category.id}`);
      const existing = await transaction.category.findUnique({ where: { slug: category.id }, select: { id: true, parentId: true } });
      if (existing) {
        if (existing.parentId !== parentId) fail(`existing category has a different parent: ${category.id}`);
        categoryIds.set(category.id, existing.id);
        continue;
      }
      const useCaseTagIds = category.useCaseIds.map((tagId) => {
        const id = tagIds.get(tagId);
        if (!id) fail(`category use-case tag is missing: ${category.id}/${tagId}`);
        return { id };
      });
      const created = await transaction.category.create({
        data: {
          slug: category.id,
          parentId,
          nameAr: category.name.ar,
          nameEn: category.name.en,
          descriptionAr: category.description.ar,
          descriptionEn: category.description.en,
          imageUrl: null,
          imagePublicId: null,
          sortOrder: (index + 1) * 10,
          isActive: true,
          useCaseTags: { connect: useCaseTagIds },
        },
        select: { id: true },
      });
      categoryIds.set(category.id, created.id);
      createdCategories += 1;
    }

    let createdProducts = 0;
    let createdLaptopSpecs = 0;
    for (const [index, product] of approvedProducts.entries()) {
      const slug = productSlug(product);
      const [bySlug, bySku] = await Promise.all([
        transaction.product.findUnique({ where: { slug }, select: { id: true, sku: true } }),
        transaction.product.findUnique({ where: { sku: product.sku }, select: { id: true, slug: true } }),
      ]);
      if (bySlug && bySlug.sku !== product.sku) fail(`product slug belongs to another SKU: ${slug}`);
      if (bySku && bySku.slug !== slug) fail(`product SKU belongs to another slug: ${product.sku}`);
      if (bySlug || bySku) continue;

      const categoryId = categoryIds.get(effectiveCategorySlug(product));
      const brandId = brandIds.get(product.brandId);
      if (!categoryId || !brandId) fail(`product relation is unresolved: ${product.id}`);
      const useCaseTags = product.useCaseIds.map((tagId) => {
        const id = tagIds.get(tagId);
        if (!id) fail(`product use-case tag is missing: ${product.id}/${tagId}`);
        return { id };
      });
      await transaction.product.create({
        data: {
          slug,
          sku: product.sku,
          nameAr: product.name.ar,
          nameEn: product.name.en,
          brandId,
          categoryId,
          descriptionAr: product.description.ar,
          descriptionEn: product.description.en,
          shortDescriptionAr: product.description.ar,
          shortDescriptionEn: product.description.en,
          priceUsdCents: dollarsToCents(product.priceUsd),
          stockStatus: product.availability as StockStatus,
          condition: product.condition as ProductCondition,
          isBestSeller: product.isBestSeller,
          isNewArrival: product.isNewArrival,
          isFeatured: product.isFeatured,
          isActive: "isActive" in product ? product.isActive !== false : true,
          sortOrder: (index + 1) * 10,
          extraSpecs: getProductExtraSpecs(product),
          useCaseTags: { connect: useCaseTags },
          laptopSpecs: "laptopSpecs" in product && product.laptopSpecs ? { create: product.laptopSpecs } : undefined,
        },
      });
      createdProducts += 1;
      if ("laptopSpecs" in product && product.laptopSpecs) createdLaptopSpecs += 1;
    }

    let createdServices = 0;
    let createdServiceImages = 0;
    for (const [index, service] of approvedServices.entries()) {
      const existing = await transaction.storeService.findUnique({ where: { slug: service.slug }, select: { id: true } });
      if (existing) continue;
      const highlights = serviceHighlightsSchema.parse(service.highlights.map((highlight) => ({
        titleAr: highlight.title.ar,
        titleEn: highlight.title.en,
        descriptionAr: highlight.description.ar,
        descriptionEn: highlight.description.en,
      }))) as Prisma.InputJsonValue;
      const gallery = service.galleryImages ?? [];
      await transaction.storeService.create({
        data: {
          slug: service.slug,
          nameAr: service.title.ar,
          nameEn: service.title.en,
          shortDescriptionAr: service.summary?.ar ?? service.subtitle.ar,
          shortDescriptionEn: service.summary?.en ?? service.subtitle.en,
          descriptionAr: service.description.ar,
          descriptionEn: service.description.en,
          highlights,
          // The prototype checklist has no per-step descriptions required by the
          // production workflow schema, so it is intentionally not fabricated.
          workflowSteps: Prisma.JsonNull,
          isFeatured: service.isFeatured,
          isActive: service.isActive,
          sortOrder: ((service.sortOrder ?? index + 1) * 10),
          images: {
            create: gallery.map((url, imageIndex) => ({
              publicId: getLocalServiceImageIdentity(url),
              url,
              altAr: `${service.title.ar} — صورة ${imageIndex + 1}`,
              altEn: `${service.title.en} — image ${imageIndex + 1}`,
              sortOrder: imageIndex,
            })),
          },
        },
      });
      createdServices += 1;
      createdServiceImages += gallery.length;
    }

    const settings = await transaction.siteSettings.findMany({ select: { id: true } });
    if (settings.length > 1) fail("multiple SiteSettings records already exist");
    let createdSettings = 0;
    if (settings.length === 0) {
      await transaction.siteSettings.create({
        data: {
          id: developmentSiteSettingsId,
          storeNameAr: prototypeCatalog.settings.storeName.ar,
          storeNameEn: prototypeCatalog.settings.storeName.en,
          storeDescriptionAr: prototypeCatalog.settings.tagline.ar,
          storeDescriptionEn: prototypeCatalog.settings.tagline.en,
          usdToSypRate: prototypeCatalog.settings.usdToSypRate,
          phone: "+963 933 811 106",
          // The prototype WhatsApp value is a placeholder and is intentionally
          // not treated as the approved primary phone.
          whatsapp: null,
          email: null,
          addressAr: null,
          addressEn: null,
          facebook: null,
          instagram: null,
        },
      });
      createdSettings = 1;
    }

    const protectedAfter = await Promise.all([
      transaction.user.count(),
      transaction.session.count(),
      transaction.account.count(),
      transaction.verification.count(),
      transaction.customerRequest.count(),
      transaction.analyticsEvent.count(),
    ]);
    if (protectedBefore.some((count, index) => count !== protectedAfter[index])) fail("protected authentication or customer-history data changed");

    return {
      createdTags,
      createdBrands,
      createdCategories,
      createdProducts,
      createdLaptopSpecs,
      createdServices,
      createdServiceImages,
      createdSettings,
    };
  }, { maxWait: 10_000, timeout: 60_000 });

  console.log(JSON.stringify({
    status: "complete",
    created: result,
    skippedByDesign: {
      productImages: validation.productImageKeysSkipped,
      offers: validation.offersSkipped,
      heroBanners: validation.heroBannersSkipped,
      promoBanners: validation.promoBannersSkipped,
    },
  }));
}

function getSafeErrorCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error.code : "UNKNOWN";
}

try {
  await seedApprovedPrototypeData();
} catch (error) {
  console.error(`Pixel Store seed failed (${getSafeErrorCode(error)}).`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
