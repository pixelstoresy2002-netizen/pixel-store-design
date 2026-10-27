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
} from './storeLogic';
import { FilterState, Offer, Product } from '../types/store';

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

test('design playground options and summary formatter match specification', async () => {
  const {
    DEFAULT_THEME_ID,
    DEFAULT_ARABIC_FONT_ID,
    ARABIC_FONT_OPTIONS,
    DESIGN_THEME_OPTIONS,
    formatDesignSelectionSummary,
  } = await import('./storeLogic');

  assert.equal(DEFAULT_THEME_ID, 'hybrid');
  assert.equal(DEFAULT_ARABIC_FONT_ID, 'tajawal');
  assert.equal(ARABIC_FONT_OPTIONS.length, 6);
  assert.equal(DESIGN_THEME_OPTIONS.length, 3);
  assert.equal(
    formatDesignSelectionSummary('contrast', 'tajawal'),
    'Theme: Pixel Contrast | Font: Tajawal'
  );
  assert.equal(
    formatDesignSelectionSummary('retail', 'cairo'),
    'Theme: Retail Focus | Font: Cairo'
  );
});

