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
  assert.deepEqual(product.galleryImages, ['/first.jpg', '/second.jpg']);
  assert.equal(product.laptopSpecs?.memory, '');
  assert.deepEqual(product.specs[0]?.label, { ar: 'المعالج', en: 'CPU' });
});

test('preserves an empty product image state and category slugs for UI filtering', () => {
  const product = mapProduct({
    id: 'id', slug: 'slug', sku: 'sku', nameAr: 'أ', nameEn: 'A', descriptionAr: 'ب', descriptionEn: 'B',
    priceUsdCents: 0, stockStatus: 'ON_REQUEST', condition: 'USED', isBestSeller: false,
    isNewArrival: false, isFeatured: false, isActive: true, createdAt: date, updatedAt: date,
    extraSpecs: null, category: { slug: 'audio', parent: null }, brand: { slug: 'brand' },
    useCaseTags: [], laptopSpecs: null, images: [],
  });
  const category = mapCategory({
    slug: 'audio', nameAr: 'صوت', nameEn: 'Audio', descriptionAr: null, descriptionEn: null,
    sortOrder: 10, isActive: true, parent: null, useCaseTags: [],
  });

  assert.equal(product.primaryImage, '');
  assert.deepEqual(product.galleryImages, []);
  assert.equal(category.id, 'audio');
  assert.equal(category.parentId, undefined);
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
