# Pixel Store — Post-Fix Visual Verification Screenshot Index

- **Application**: Pixel Store (`بِكسل ستور`) Interactive Storefront & Admin Prototype
- **Theme & Typography**: Locked `Pixel Contrast` (`pixel-contrast`) theme + `Cairo` (`cairo`) Arabic font
- **Primary Direction**: Arabic (`dir="rtl"`)
- **Total Screenshots Captured**: 21 PNG files across 6 verification folders

---

## 1. `01-product-zoom/` — Product Details Contained In-Image Zoom Fix

| # | Filename | Viewport | Mode | Description |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `01-pdp-desktop-1600-normal.png` | `1600×1000` | Full Page | Normal Product Details page (`ASUS ROG Strix G16 (2026) — RTX 4070`) showing the 5-column image gallery on the right (RTL) and 7-column product specifications, countdown timer, dual USD/SYP pricing, and Request CTA on the left. |
| 2 | `02-pdp-desktop-1600-zoom-active.png` | `1600×1000` | Viewport | Active in-image zoom (`ZOOM ×2.15`) inside `pdp-main-image-container`. Confirms the zoomed visual stays 100% clipped inside the main image frame without overflowing into or obscuring the adjacent product title, countdown, price, or Request button. |
| 3 | `03-pdp-tablet-768-zoom-active.png` | `768×1024` | Viewport | Tablet product image zoom state (`ZOOM ×2.15`) contained cleanly inside the image frame above the product details section. |
| 4 | `04-pdp-mobile-390-zoom-controls.png` | `390×844` | Full Page | Mobile Product Details page showing the touch/keyboard accessible zoom toggle control (`تكبير الصورة` / `إغلاق التكبير`) and active zoom indicator badge (`ZOOM ×2.15`). |

---

## 2. `02-catalog-grid/` — Catalog Grid Density & Balance

| # | Filename | Viewport | Mode | Description |
| :--- | :--- | :--- | :--- | :--- |
| 5 | `01-catalog-desktop-1600-4col-full.png` | `1600×1000` | Full Page | Full `All Products` catalog view at `1600px` displaying `xl:grid-cols-4` (`12` products per page arranged in **3 complete rows of 4 cards**), eliminating the previous 5-column `5 + 5 + 2` orphan row. |
| 6 | `02-catalog-desktop-1280-full.png` | `1280×900` | Full Page | Full `All Products` catalog view at `1280px` displaying 3 complete rows of 4 cards alongside the right-hand filter sidebar. |
| 7 | `03-catalog-mobile-390-grid-full.png` | `390×844` | Full Page | Full mobile `All Products` catalog view at `390px` displaying 6 complete rows of 2 cards (`grid-cols-2`) with readable Arabic titles, condition badges, dual USD/SYP pricing, and Request buttons. |

---

## 3. `03-offers-page/` — Standalone Exclusive Offers Page

| # | Filename | Viewport | Mode | Description |
| :--- | :--- | :--- | :--- | :--- |
| 8 | `01-offers-desktop-1600-full.png` | `1600×1000` | Full Page | Standalone Exclusive Offers page at `1600px` featuring the compact offer card proportions (`h-36 sm:h-40` image area, compact countdown badge, dual USD/SYP pricing, and Request Deal CTA) plus the Expired-Offer Simulator control. |
| 9 | `02-offers-tablet-768-full.png` | `768×1024` | Full Page | Standalone Exclusive Offers page at `768px` arranged in a balanced 2-column tablet grid (`sm:grid-cols-2`). |
| 10 | `03-offers-mobile-390-full.png` | `390×844` | Full Page | Standalone Exclusive Offers page at `390px` stacked cleanly in a single mobile column with zero horizontal overflow. |

---

## 4. `04-admin-mobile/` — Admin Products Mobile Cards & Desktop Comparison

| # | Filename | Viewport | Mode | Description |
| :--- | :--- | :--- | :--- | :--- |
| 11 | `01-admin-products-mobile-390-full.png` | `390×844` | Full Page | Admin Products view at `390px` showing the dedicated mobile product cards (`admin-mobile-products-list`) with full 2-line product titles, `NEW`/`USED` badges, SKU, USD & SYP prices, Best Seller toggle, Edit button, and two-step Delete button. |
| 12 | `02-admin-products-mobile-350-full.png` | `350×800` | Full Page | Narrow mobile (`350px`) Admin Products view confirming zero horizontal clipping or character-level vertical wrapping on product titles and action controls. |
| 13 | `03-admin-products-desktop-1600-table-full.png` | `1600×1000` | Full Page | Desktop (`1600px`) Admin Products management table (`hidden md:block`) preserved for wide viewports. |

---

## 5. `05-mobile-filters/` — Mobile Filter Drawer

| # | Filename | Viewport | Mode | Description |
| :--- | :--- | :--- | :--- | :--- |
| 14 | `01-mobile-filters-390-top.png` | `390×844` | Viewport | Mobile filter drawer opened at `390px` (top scroll position), showing the single sticky `تصفية النتائج` header (duplicate inner heading removed), `إعادة ضبط` button, Main Categories, and full unclipped Subcategories list. |
| 15 | `02-mobile-filters-390-bottom.png` | `390×844` | Viewport | Mobile filter drawer at `390px` scrolled to the bottom, showing Use-Case tags, Condition (`NEW`/`USED`), Price Range inputs & presets, full unclipped Brands list, Availability checkboxes, and the sticky bottom `عرض النتائج (24)` CTA bar. |
| 16 | `03-mobile-filters-350-top.png` | `350×800` | Viewport | Narrow mobile (`350px`) filter drawer opened at top scroll position. |
| 17 | `04-mobile-filters-350-bottom.png` | `350×800` | Viewport | Narrow mobile (`350px`) filter drawer scrolled to bottom showing all lower filter controls and sticky bottom CTA button. |

---

## 6. `06-contact-cooling/` — Contact & Cooling Solutions Credibility

| # | Filename | Viewport | Mode | Description |
| :--- | :--- | :--- | :--- | :--- |
| 18 | `01-contact-desktop-1600-full.png` | `1600×1000` | Full Page | Contact page at `1600px` showing clearly labeled demo phone placeholder (`+963 9XX XXX XXX`), configurable demo working hours (`أوقات العمل: تُحدد من إعدادات المتجر (بيانات تجريبية)`), and generic map link with zero unverified city/location claims. |
| 19 | `02-cooling-solutions-desktop-1600-full.png` | `1600×1000` | Full Page | Cooling Solutions page at `1600px` showing qualitative service workflow stages, demo turnaround notice (`المدة التقديرية: تُحدد بعد معاينة الجهاز (بيانات تجريبية)`), and illustrative Before/After thermal servicing overview with zero fabricated °C/GHz/dB numbers. |
| 20 | `03-contact-mobile-390-full.png` | `390×844` | Full Page | Contact page at `390px` mobile viewport. |
| 21 | `04-cooling-solutions-mobile-390-full.png` | `390×844` | Full Page | Cooling Solutions page at `390px` mobile viewport. |
