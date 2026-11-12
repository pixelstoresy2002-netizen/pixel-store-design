import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertUsdToSyp,
  formatUsd,
  formatSyp,
  isOfferActive,
  resolveProductPricing,
  getRemainingTimeParts,
  validateCustomerRequest,
  filterAndSortProducts,
  DEFAULT_THEME_ID,
  DEFAULT_ARABIC_FONT_ID,
  HERO_AUTOPLAY_INTERVAL_MS,
  GALLERY_HOVER_INTERVAL_MS,
  MAX_PRODUCT_GALLERY_IMAGES,
  OFFICIAL_PRIMARY_PHONE_DISPLAY,
  OFFICIAL_PRIMARY_PHONE_TEL,
  formatPhoneTelHref,
  getProductGalleryImages,
  getNextGalleryImageIndex,
  getNextHeroSlideIndex,
  isPhoneLinkVerified,
  isWhatsappLinkVerified,
  isExternalChannelVerified,
  normalizeChannelUrl,
  getOfferTemporalStatus,
  getServiceGalleryImages,
} from './storeLogic.ts';
import {
  DEFAULT_ADMIN_PRODUCTS_QUERY,
  DEFAULT_ADMIN_OFFERS_QUERY,
  DEFAULT_ADMIN_REQUESTS_QUERY,
  parseAdminProductsQuery,
  serializeAdminProductsQuery,
  queryAdminProducts,
  queryAdminOffers,
  queryAdminRequests,
} from './adminQueryContract.ts';
import type { CustomerRequest, FilterState, Offer, Product } from '../types/store.ts';

const sampleProduct: Product = {
  id: 'prod-1',
  sku: 'PXL-KB-001',
  name: {
    ar: 'لوحة مفاتيح ميكانيكية للألعاب Redragon K617 Fizz',
    en: 'Redragon K617 Fizz 60% Mechanical Gaming Keyboard',
  },
  description: {
    ar: 'لوحة مفاتيح مدمجة بمفاتيح حمراء سريعة الاستجابة.',
    en: 'Compact 60% mechanical keyboard with linear red switches.',
  },
  categoryId: 'accessories',
  subcategoryId: 'keyboards',
  brandId: 'redragon',
  useCaseIds: ['gaming'],
  priceUsd: 40,
  condition: 'NEW',
  availability: 'IN_STOCK',
  primaryImage: 'kb-gaming-1',
  secondaryImage: 'kb-gaming-2',
  isBestSeller: true,
  isNewArrival: false,
  isFeatured: true,
  specs: [],
  createdAt: '2026-10-01T10:00:00Z',
};

const sampleOffer: Offer = {
  id: 'offer-1',
  productId: 'prod-1',
  title: { ar: 'خصم حصري لنهاية الأسبوع', en: 'Weekend Exclusive Deal' },
  badgeText: { ar: 'عرض حصري', en: 'Exclusive Offer' },
  offerPriceUsd: 30,
  startTime: '2026-10-25T00:00:00Z',
  endTime: '2026-10-30T00:00:00Z',
  isExclusive: true,
};

test('convertUsdToSyp converts USD using global exchange rate accurately', () => {
  assert.equal(convertUsdToSyp(100, 12500), 1250000);
  assert.equal(convertUsdToSyp(40, 12500), 500000);
  assert.equal(convertUsdToSyp(0, 12500), 0);
  assert.equal(formatUsd(1250), '$1,250');
  assert.equal(formatSyp(500000, 'ar'), '500,000 ل.س');
  assert.equal(formatSyp(500000, 'en'), '500,000 SYP');
});

test('active vs expired offer pricing behavior', () => {
  const activeNow = new Date('2026-10-27T12:00:00Z').getTime();
  const expiredNow = new Date('2026-10-31T12:00:00Z').getTime();

  assert.equal(isOfferActive(sampleOffer, activeNow), true);
  assert.equal(isOfferActive(sampleOffer, expiredNow), false);

  const activePricing = resolveProductPricing(
    sampleProduct,
    [sampleOffer],
    12500,
    activeNow
  );
  assert.equal(activePricing.hasActiveOffer, true);
  assert.equal(activePricing.effectiveUsd, 30);
  assert.equal(activePricing.originalUsd, 40);
  assert.equal(activePricing.effectiveSyp, 375000);
  assert.equal(activePricing.discountPercent, 25);

  // When offer expires, product automatically reverts to regular USD base price
  const expiredPricing = resolveProductPricing(
    sampleProduct,
    [sampleOffer],
    12500,
    expiredNow
  );
  assert.equal(expiredPricing.hasActiveOffer, false);
  assert.equal(expiredPricing.effectiveUsd, 40);
  assert.equal(expiredPricing.effectiveSyp, 500000);
  assert.equal(expiredPricing.discountPercent, 0);
  assert.equal(expiredPricing.activeOffer, undefined);
});

test('countdown remaining time calculation handles active and expired states', () => {
  const nowMs = new Date('2026-10-27T00:00:00Z').getTime();
  const parts = getRemainingTimeParts('2026-10-28T02:30:15Z', nowMs);
  assert.equal(parts.expired, false);
  assert.equal(parts.days, 1);
  assert.equal(parts.hours, 2);
  assert.equal(parts.minutes, 30);
  assert.equal(parts.seconds, 15);

  const expiredParts = getRemainingTimeParts('2026-10-26T00:00:00Z', nowMs);
  assert.equal(expiredParts.expired, true);
  assert.equal(expiredParts.days, 0);
});

test('validateCustomerRequest rejects empty name or invalid phone number', () => {
  assert.equal(
    validateCustomerRequest({ customerName: 'A', phoneNumber: '0991234567' }).valid,
    false
  );
  assert.equal(
    validateCustomerRequest({ customerName: 'Ahmad', phoneNumber: '123' }).valid,
    false
  );
  assert.equal(
    validateCustomerRequest({ customerName: 'Ahmad Al-Masri', phoneNumber: '+963 944 123 456' }).valid,
    true
  );
});

test('filterAndSortProducts respects use-case tags and expired offer removal from offers view', () => {
  const officeKeyboard: Product = {
    ...sampleProduct,
    id: 'prod-2',
    sku: 'PXL-KB-002',
    useCaseIds: ['office'],
    priceUsd: 55,
  };
  const products = [sampleProduct, officeKeyboard];
  const baseFilters: FilterState = {
    searchQuery: '',
    categoryId: 'ALL',
    subcategoryId: 'ALL',
    useCaseId: 'gaming',
    brandIds: [],
    minPriceUsd: 0,
    maxPriceUsd: 5000,
    conditions: [],
    availabilities: [],
    sortBy: 'featured',
  };

  const activeNow = new Date('2026-10-27T12:00:00Z').getTime();
  const expiredNow = new Date('2026-10-31T12:00:00Z').getTime();

  const gamingMatches = filterAndSortProducts(
    products,
    [sampleOffer],
    12500,
    baseFilters,
    activeNow
  );
  assert.equal(gamingMatches.length, 1);
  assert.equal(gamingMatches[0].id, 'prod-1');

  // When filtering for active offers only, expired offer disappears from offers view
  const activeOfferMatches = filterAndSortProducts(
    products,
    [sampleOffer],
    12500,
    { ...baseFilters, useCaseId: 'ALL', onlyOffers: true },
    activeNow
  );
  assert.equal(activeOfferMatches.length, 1);

  const expiredOfferMatches = filterAndSortProducts(
    products,
    [sampleOffer],
    12500,
    { ...baseFilters, useCaseId: 'ALL', onlyOffers: true },
    expiredNow
  );
  assert.equal(expiredOfferMatches.length, 0);

  // Yet the product remains discoverable in normal catalog after offer expires
  const normalCatalogAfterExpiry = filterAndSortProducts(
    products,
    [sampleOffer],
    12500,
    { ...baseFilters, useCaseId: 'ALL', onlyOffers: false },
    expiredNow
  );
  assert.equal(normalCatalogAfterExpiry.length, 2);
});

test('locked default theme, font, and 5-slide hero carousel cycling match specification', () => {
  assert.equal(DEFAULT_THEME_ID, 'contrast');
  assert.equal(DEFAULT_ARABIC_FONT_ID, 'cairo');
  assert.equal(HERO_AUTOPLAY_INTERVAL_MS, 5500);

  // 5-slide forward wrap-around (0 -> 1 -> 2 -> 3 -> 4 -> 0)
  assert.equal(getNextHeroSlideIndex(0, 5, 'next'), 1);
  assert.equal(getNextHeroSlideIndex(3, 5, 'next'), 4);
  assert.equal(getNextHeroSlideIndex(4, 5, 'next'), 0);

  // 5-slide backward wrap-around (0 -> 4 -> 3)
  assert.equal(getNextHeroSlideIndex(0, 5, 'prev'), 4);
  assert.equal(getNextHeroSlideIndex(4, 5, 'prev'), 3);
});

test('contact channel verification disables placeholder details and activates valid configured details', () => {

  // Placeholder / unverified phones
  assert.equal(isPhoneLinkVerified('+963 9XX XXX XXX'), false);
  assert.equal(isPhoneLinkVerified(''), false);
  assert.equal(isPhoneLinkVerified('+963 900 000 000'), false);

  // Valid configured phones
  assert.equal(isPhoneLinkVerified('+963 933 123 456'), true);
  assert.equal(isPhoneLinkVerified('0944556677'), true);

  // Placeholder / unverified WhatsApp numbers
  assert.equal(isWhatsappLinkVerified('963900000000'), false);
  assert.equal(isWhatsappLinkVerified('+963 9XX XXX XXX'), false);
  assert.equal(isWhatsappLinkVerified(''), false);

  // Valid configured WhatsApp numbers
  assert.equal(isWhatsappLinkVerified('963933123456'), true);
  assert.equal(isWhatsappLinkVerified('+963 944 556 677'), true);

  // Placeholder / generic social & map URLs
  assert.equal(isExternalChannelVerified('https://maps.google.com'), false);
  assert.equal(isExternalChannelVerified('https://t.me'), false);
  assert.equal(isExternalChannelVerified('https://instagram.com'), false);
  assert.equal(isExternalChannelVerified('https://facebook.com'), false);
  assert.equal(isExternalChannelVerified(''), false);

  // Valid configured social handles & specific destination URLs
  assert.equal(isExternalChannelVerified('@pixelstore_official'), true);
  assert.equal(
    normalizeChannelUrl('@pixelstore_official', 'https://t.me/'),
    'https://t.me/pixelstore_official'
  );
  assert.equal(isExternalChannelVerified('https://t.me/pixelstore_sy'), true);
  assert.equal(isExternalChannelVerified('https://instagram.com/pixelstore.sy'), true);
  assert.equal(isExternalChannelVerified('https://facebook.com/pixelstore.sy'), true);
  assert.equal(isExternalChannelVerified('https://maps.google.com/?q=Pixel+Store+Showroom'), true);

  // Official client primary phone verification
  assert.equal(OFFICIAL_PRIMARY_PHONE_DISPLAY, '+963 933 811 106');
  assert.equal(OFFICIAL_PRIMARY_PHONE_TEL, 'tel:+963933811106');
  assert.equal(isPhoneLinkVerified(OFFICIAL_PRIMARY_PHONE_DISPLAY), true);
  assert.equal(formatPhoneTelHref(OFFICIAL_PRIMARY_PHONE_DISPLAY), OFFICIAL_PRIMARY_PHONE_TEL);
});

test('5-image product gallery deduplication and hover cycling sequence (1->2->3->4->5->1)', () => {
  assert.equal(GALLERY_HOVER_INTERVAL_MS, 1000);
  assert.equal(MAX_PRODUCT_GALLERY_IMAGES, 5);

  // Single image product -> returns 1 image and does not advance index
  const singleImg = getProductGalleryImages({
    primaryImage: 'laptop-rog-front',
    secondaryImage: 'laptop-rog-front',
  });
  assert.deepEqual(singleImg, ['laptop-rog-front']);
  assert.equal(getNextGalleryImageIndex(0, singleImg.length), 0);

  // 5 distinct gallery images -> preserves primaryImage first, caps at 5, deduplicates
  const fiveImgs = getProductGalleryImages({
    primaryImage: 'laptop-rog-front',
    secondaryImage: 'laptop-rog-side',
    galleryImages: [
      'laptop-rog-front',
      'laptop-rog-side',
      'laptop-rog-ports',
      'laptop-rog-cooling',
      'laptop-rog-kit',
      'laptop-rog-extra-6th',
    ],
  });
  assert.deepEqual(fiveImgs, [
    'laptop-rog-front',
    'laptop-rog-side',
    'laptop-rog-ports',
    'laptop-rog-cooling',
    'laptop-rog-kit',
  ]);

  // Sequence: 0 (Image 1) -> 1 (Image 2) -> 2 (Image 3) -> 3 (Image 4) -> 4 (Image 5) -> 0 (Image 1)
  assert.equal(getNextGalleryImageIndex(0, 5), 1);
  assert.equal(getNextGalleryImageIndex(1, 5), 2);
  assert.equal(getNextGalleryImageIndex(2, 5), 3);
  assert.equal(getNextGalleryImageIndex(3, 5), 4);
  assert.equal(getNextGalleryImageIndex(4, 5), 0);
});

test('getOfferTemporalStatus classifies SCHEDULED, ACTIVE, and EXPIRED offers accurately', () => {
  const beforeStart = new Date('2026-10-20T00:00:00Z').getTime();
  const duringActive = new Date('2026-10-27T12:00:00Z').getTime();
  const afterEnd = new Date('2026-10-31T00:00:00Z').getTime();

  assert.equal(getOfferTemporalStatus(sampleOffer, beforeStart), 'SCHEDULED');
  assert.equal(getOfferTemporalStatus(sampleOffer, duringActive), 'ACTIVE');
  assert.equal(getOfferTemporalStatus(sampleOffer, afterEnd), 'EXPIRED');
  assert.equal(
    getOfferTemporalStatus({ ...sampleOffer, isActive: false }, duringActive),
    'EXPIRED'
  );
});

test('Admin query contract serializes, parses, filters, sorts, and paginates products, offers, and customer requests', () => {
  const customQuery = {
    ...DEFAULT_ADMIN_PRODUCTS_QUERY,
    q: 'RTX',
    categoryId: 'laptops',
    condition: 'USED' as const,
    bestSeller: 'true' as const,
    page: 2,
    limit: 20,
    sort: 'priceUsd' as const,
    order: 'asc' as const,
  };

  const serializedStr = serializeAdminProductsQuery(customQuery);
  const serialized = new URLSearchParams(serializedStr);
  assert.equal(serialized.get('q'), 'RTX');
  assert.equal(serialized.get('categoryId'), 'laptops');
  assert.equal(serialized.get('condition'), 'USED');
  assert.equal(serialized.get('bestSeller'), 'true');
  assert.equal(serialized.get('page'), '2');
  assert.equal(serialized.get('limit'), '20');
  assert.equal(serialized.get('sort'), 'priceUsd');
  assert.equal(serialized.get('order'), 'asc');

  const roundTrip = parseAdminProductsQuery(serialized);
  assert.deepEqual(roundTrip, customQuery);

  const usedLaptop: Product = {
    ...sampleProduct,
    id: 'prod-2',
    sku: 'PXL-LAP-002',
    name: { ar: 'لابتوب مستعمل Lenovo Legion', en: 'Lenovo Legion 5 Pro Used' },
    categoryId: 'laptops',
    brandId: 'lenovo',
    condition: 'USED',
    priceUsd: 920,
    isBestSeller: false,
    laptopSpecs: {
      processor: 'Ryzen 7 6800H',
      memory: '16GB DDR5',
      storage: '1TB SSD',
      display: '16" QHD 165Hz',
    },
  };

  const nowMs = new Date('2026-10-27T12:00:00Z').getTime();

  // Filter by condition = USED
  const usedRes = queryAdminProducts(
    [sampleProduct, usedLaptop],
    [sampleOffer],
    { ...DEFAULT_ADMIN_PRODUCTS_QUERY, condition: 'USED' },
    nowMs
  );
  assert.equal(usedRes.total, 1);
  assert.equal(usedRes.items[0].id, 'prod-2');

  // Filter by active offer
  const offerProdRes = queryAdminProducts(
    [sampleProduct, usedLaptop],
    [sampleOffer],
    { ...DEFAULT_ADMIN_PRODUCTS_QUERY, hasOffer: 'true' },
    nowMs
  );
  assert.equal(offerProdRes.total, 1);
  assert.equal(offerProdRes.items[0].id, 'prod-1');

  // Query offers by status
  const activeOffersRes = queryAdminOffers(
    [sampleOffer],
    [sampleProduct, usedLaptop],
    { ...DEFAULT_ADMIN_OFFERS_QUERY, status: 'ACTIVE' },
    nowMs
  );
  assert.equal(activeOffersRes.total, 1);

  // Query customer requests
  const reqs: CustomerRequest[] = [
    {
      id: 'req-1',
      productId: 'prod-1',
      productName: sampleProduct.name,
      productSku: sampleProduct.sku,
      priceUsdAtRequest: 30,
      priceSypAtRequest: 375000,
      customerName: 'Samer',
      phoneNumber: '+963 933 811 106',
      note: 'Interested in keyboard',
      status: 'NEW',
      createdAt: '2026-10-27T10:00:00Z',
    },
    {
      id: 'req-2',
      productId: 'prod-2',
      productName: usedLaptop.name,
      productSku: usedLaptop.sku,
      priceUsdAtRequest: 920,
      priceSypAtRequest: 11500000,
      customerName: 'Rami',
      phoneNumber: '+963 944 111 222',
      note: 'Call afternoon',
      status: 'COMPLETED',
      createdAt: '2026-10-26T10:00:00Z',
    },
  ];

  const newReqs = queryAdminRequests(reqs, {
    ...DEFAULT_ADMIN_REQUESTS_QUERY,
    status: 'NEW',
  });
  assert.equal(newReqs.total, 1);
  assert.equal(newReqs.items[0].customerName, 'Samer');
});

test('getServiceGalleryImages returns local /assets/services/*.svg images and supports 1..5 gallery items', () => {
  // Default fallback when galleryImages is omitted
  const coolingDefault = getServiceGalleryImages({
    iconKey: 'cooling',
  });
  assert.deepEqual(coolingDefault, [
    '/assets/services/cooling-1.svg',
    '/assets/services/cooling-2.svg',
    '/assets/services/cooling-3.svg',
    '/assets/services/cooling-4.svg',
    '/assets/services/cooling-5.svg',
  ]);

  // Custom primaryImage + galleryImages deduplication up to 5 items
  const customCameras = getServiceGalleryImages({
    iconKey: 'cameras',
    primaryImage: '/assets/services/cameras-3.svg',
    galleryImages: [
      '/assets/services/cameras-3.svg',
      '/assets/services/cameras-1.svg',
      '/assets/services/cameras-2.svg',
      '/assets/services/cameras-4.svg',
      '/assets/services/cameras-5.svg',
      '/assets/services/cameras-extra-6.svg',
    ],
  });
  assert.equal(customCameras.length, 5);
  assert.equal(customCameras[0], '/assets/services/cameras-3.svg');
  assert.equal(customCameras[4], '/assets/services/cameras-5.svg');

  // Supports fewer than 5 images when Admin removes gallery items
  const reducedGallery = getServiceGalleryImages({
    iconKey: 'maintenance',
    primaryImage: '/assets/services/maintenance-2.svg',
    galleryImages: [
      '/assets/services/maintenance-2.svg',
      '/assets/services/maintenance-1.svg',
      '/assets/services/maintenance-4.svg',
    ],
  });
  assert.deepEqual(reducedGallery, [
    '/assets/services/maintenance-2.svg',
    '/assets/services/maintenance-1.svg',
    '/assets/services/maintenance-4.svg',
  ]);
});
