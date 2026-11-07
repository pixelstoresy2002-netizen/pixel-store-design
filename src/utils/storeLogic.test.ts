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
} from './storeLogic.ts';
import type { FilterState, Offer, Product } from '../types/store.ts';

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

