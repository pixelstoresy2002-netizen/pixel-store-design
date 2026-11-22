import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getOfferTemporalState,
  mapCategory,
  mapHomepageBanners,
  mapOffer,
  mapProduct,
  mapStoreService,
  serializeBigIntForClient,
} from './design-adapters.ts';
import { mapCustomerRequestForAdmin } from './admin-contract.ts';
import { convertUsdCentsToSyp } from './money.ts';

const date = new Date('2026-11-17T12:00:00.000Z');

test('maps a product from cents and derives parent/subcategory hierarchy', () => {
  const product = mapProduct({
    id: 'product-uuid', slug: 'rog-g16', sku: 'PXL-1', nameAr: 'حاسوب', nameEn: 'Laptop',
    descriptionAr: 'وصف', descriptionEn: 'Description', priceUsdCents: 149_099,
    stockStatus: 'IN_STOCK', condition: 'NEW', isBestSeller: true, isNewArrival: false,
    isFeatured: true, isActive: true, createdAt: date, updatedAt: date,
    extraSpecs: [{ labelAr: 'المعالج', labelEn: 'CPU', valueAr: 'رايزن', valueEn: 'Ryzen' }],
    category: { slug: 'gaming-laptops', parent: { slug: 'laptops' } }, brand: { slug: 'asus' },
    useCaseTags: [{ slug: 'gaming' }],
    laptopSpecs: { processor: 'Ryzen', memory: null, storage: '1TB', display: 'QHD' },
    images: [{ url: '/second.jpg', sortOrder: 20 }, { url: '/first.jpg', sortOrder: 10 }],
  });

  assert.equal(product.priceUsd, 1490.99);
  assert.equal(product.categoryId, 'laptops');
  assert.equal(product.subcategoryId, 'gaming-laptops');
  assert.equal(product.primaryImage, '/first.jpg');
  assert.deepEqual(product.galleryImages, ['/first.jpg', '/second.jpg']);
  assert.equal(product.laptopSpecs?.memory, '');
  assert.deepEqual(product.specs[0]?.label, { ar: 'المعالج', en: 'CPU' });
});

test('keeps ProductImage media authoritative while deriving a decorative fallback', () => {
  const product = mapProduct({
    id: 'id', slug: 'slug', sku: 'sku', nameAr: 'أ', nameEn: 'A', descriptionAr: 'ب', descriptionEn: 'B',
    priceUsdCents: 0, stockStatus: 'ON_REQUEST', condition: 'USED', isBestSeller: false,
    isNewArrival: false, isFeatured: false, isActive: true, createdAt: date, updatedAt: date,
    extraSpecs: null, category: { slug: 'audio', parent: null }, brand: { slug: 'brand' },
    useCaseTags: [], laptopSpecs: null, images: [],
  });
  const category = mapCategory({
    slug: 'audio', nameAr: 'صوت', nameEn: 'Audio', descriptionAr: null, descriptionEn: null, imageUrl: '/assets/categories/audio.svg',
    sortOrder: 10, isActive: true, parent: null, useCaseTags: [],
  });

  // No ProductImage records are invented: the media collection remains empty.
  // primaryImage is only the documented category-based decorative visual.
  assert.equal(product.primaryImage, 'audio-earbuds-front');
  assert.equal(product.secondaryImage, 'audio-earbuds-front');
  assert.deepEqual(product.galleryImages, []);
  assert.equal(category.id, 'audio');
  assert.equal(category.parentId, undefined);
  assert.equal(category.visualKey, '/assets/categories/audio.svg');
});

test('derives offer state from server time and maps only active offers as UI-active', () => {
  const base = {
    id: 'offer', productId: 'product', titleAr: 'عرض', titleEn: 'Offer', priceUsdCents: 9_900,
    startsAt: new Date('2026-11-17T11:00:00.000Z'), endsAt: new Date('2026-11-17T13:00:00.000Z'),
    isEnabled: true, isExclusive: false, createdAt: date, updatedAt: date,
  };
  assert.equal(getOfferTemporalState(base, date), 'ACTIVE');
  assert.equal(mapOffer(base, date).isActive, true);
  assert.equal(getOfferTemporalState({ ...base, isEnabled: false }, date), 'DISABLED');
  assert.equal(getOfferTemporalState({ ...base, startsAt: new Date('2026-11-18T00:00:00.000Z') }, date), 'SCHEDULED');
  assert.equal(getOfferTemporalState({ ...base, endsAt: new Date('2026-11-17T11:00:00.000Z') }, date), 'EXPIRED');
  assert.deepEqual(mapHomepageBanners([]), { heroSlides: [], promoBanners: [] });
});

test('limits ordered service galleries and serializes BigInt at the client boundary', () => {
  const service = mapStoreService({
    id: 'service', slug: 'maintenance', nameAr: 'صيانة', nameEn: 'Maintenance',
    shortDescriptionAr: 'قصير', shortDescriptionEn: 'Short', descriptionAr: 'تفصيل', descriptionEn: 'Detail',
    highlights: [{ titleAr: 'ميزة', titleEn: 'Benefit', descriptionAr: 'وصف', descriptionEn: 'Description' }],
    workflowSteps: [{ titleAr: 'خطوة', titleEn: 'Step', descriptionAr: 'x', descriptionEn: 'y' }],
    isActive: true, isFeatured: false, sortOrder: 1,
    images: [6, 1, 5, 3, 2, 4].map((sortOrder) => ({ url: `/${sortOrder}.jpg`, sortOrder })),
  });
  const serialized = serializeBigIntForClient({ requestTotal: 42n, nested: [7n] });

  assert.deepEqual(service.galleryImages, ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg']);
  assert.equal(service.primaryImage, '/1.jpg');
  assert.deepEqual(serialized, { requestTotal: '42', nested: ['7'] });
});

test('caps product images and preserves integer-safe customer request snapshots', () => {
  const product = mapProduct({
    id: 'id', slug: 'slug', sku: 'sku', nameAr: 'أ', nameEn: 'A', descriptionAr: 'ب', descriptionEn: 'B',
    priceUsdCents: 101, stockStatus: 'IN_STOCK', condition: 'NEW', isBestSeller: false,
    isNewArrival: false, isFeatured: false, isActive: true, createdAt: date, updatedAt: date,
    extraSpecs: null, category: { slug: 'audio', parent: null }, brand: { slug: 'brand' },
    useCaseTags: [], laptopSpecs: null, images: [6, 1, 5, 3, 2, 4].map((sortOrder) => ({ url: `/${sortOrder}.jpg`, sortOrder })),
  });
  const request = mapCustomerRequestForAdmin({
    id: 'request', customerName: 'Customer', customerPhone: '+963000000000', note: null, adminNotes: null,
    productId: 'id', productNameArSnapshot: 'أ', productNameEnSnapshot: 'A', productSkuSnapshot: 'sku',
    usdPriceCentsSnapshot: 101, usdRateSnapshot: 7_500, sypPriceSnapshot: 7_575n,
    status: 'IN_PROGRESS', createdAt: date, updatedAt: date,
  });

  assert.deepEqual(product.galleryImages, ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg']);
  assert.equal(convertUsdCentsToSyp(101, 7_500), 7_575n);
  assert.equal(request.sypPriceSnapshot, '7575');
  assert.equal(request.status, 'IN_PROGRESS');
});
