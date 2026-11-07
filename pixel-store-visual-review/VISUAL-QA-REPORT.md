# Pixel Store — Visual QA & UI/UX Review Report

- **Target Application**: Pixel Store (`بِكسل ستور`) Interactive Prototype
- **Locked Visual Configuration**: Theme `Pixel Contrast` (`contrast`) + Font `Cairo` (`cairo`)
- **Review Method**: Automated Chromium Playwright full-page and element-level screenshot capture (`97` screenshots total) across `1600×900`, `1280×800`, `768×1024`, `390×844`, and `350×760` in both Arabic (`RTL`) and English (`LTR`), followed by direct visual inspection of rendered PNGs.
- **Code Modification Status**: **No application source files were modified during this review.**

---

## 1. Executive Summary & Verified Strengths

Before detailing the visual QA issues found during inspection, the following core areas were verified across the captured screenshots and passed cleanly:

1. **Zero Horizontal Page Overflow**: Across all 5 tested viewports (`1600×900`, `1280×800`, `768×1024`, `390×844`, `350×760`) in both Arabic (`RTL`) and English (`LTR`), the page body maintains clean horizontal containment without unintended horizontal page scrollbars.
2. **Refined Storefront Header & Navigation (`02-header-navigation/`)**:
   - The top utility bar cleanly separates store hours/location from the primary phone link, 3 inline contact icons (WhatsApp, Telegram, Map), and the compact Social/Contact Overflow Menu (`المزيد` in `header-utility-more-menu-open-1600.png`).
   - The main header bar balances the brand mark, central search input, and primary CTAs (`الخدمات`, `العروض الحصرية`) without crowding at `1600px` or `1280px`.
   - The desktop category bar (`navbar-group-1` + separator + `navbar-group-2` + `ms-auto` promotional links) keeps all items on a single clean row (`header-desktop-1600.png`, `header-desktop-1280.png`).
3. **Homepage Exclusive Offers Grid (`03-exclusive-offers/home-offers-section-*.png`)**:
   - The 12-column split (5-column Featured Deal card + 7-column `2×2` horizontal offer card grid) uses `items-start`, preventing the right-hand cards from stretching into tall, empty boxes.
4. **Compact Retail Footer (`09-footer/footer-*.png`)**:
   - The footer is compact across desktop (`footer-1600.png`, `footer-1280.png`), tablet (`footer-768.png`), and mobile (`footer-390.png`, `footer-350.png`), with a single social media icon row and no exchange-rate clutter.
5. **Bilingual RTL / LTR Mirroring (`11-english-ltr/`)**:
   - Switching to English (`dir="ltr"`) properly mirrors the header, hero carousel, catalog sidebar, product cards, and Product Detail Page (`ltr-homepage-1600-full.png`, `ltr-catalog-1600-full.png`, `ltr-product-details-1600-full.png`).

---

## 2. Visual QA Findings & Issues List

### Summary by Severity
- **Critical**: `0`
- **Major**: `2`
- **Minor**: `5`

---

### Issue #1 — Desktop PDP Hover Zoom Overlay Obscures Product Title, Countdown & Price Panel
- **Severity**: **Major**
- **Page / Component**: Product Detail Page (`src/components/storefront/ProductDetailPage.tsx` — `pdp-zoom-overlay`)
- **Viewport Size**: `1600×900` and `1280×800` (Desktop `>=1024px`)
- **Screenshot Filename**: `05-product-details/pdp-gallery-hover-zoom-active-1600.png`
- **Description**:
  When the user hovers over the main product image on desktop, the floating magnified preview window (`w-[460px] h-[460px] xl:w-[520px] xl:h-[520px]`) renders directly over the adjacent product summary column (`end-auto start-[calc(100%+1.5rem)]`). While hovering, the overlay completely covers the product title (`ASUS ROG Strix G16 (2025) - RTX 4070`), the active flash-offer countdown banner, and the primary USD/SYP pricing block. Although it has `pointer-events-none` and closes when the cursor leaves the gallery image, its placement and solid border/background visually block the primary product details while inspecting the image.

---

### Issue #2 — Admin Products Table Column Compression, Truncation & Action Button Clipping on Mobile
- **Severity**: **Major**
- **Page / Component**: Admin Dashboard — Products Catalog Tab (`src/components/admin/AdminDashboard.tsx`)
- **Viewport Size**: `390×844` (and `350×760` Mobile)
- **Screenshot Filename**: `10-admin/admin-products-list-390-full.png`
- **Description**:
  On a `390px` mobile viewport, the Admin Products table attempts to render all 5 columns (`المنتج`, `الحالة`, `السعر (USD / SYP)`, `الأكثر مبيعاً`, and `إجراءات`) inside the narrow viewport width without switching to a mobile card list or providing a visible horizontal scroll cue:
  - Product titles truncate to only 1–2 words (`لابتوب ألعا...`, `لوحة مفاتي...`, `بطاقة رسوم...`), making it difficult to distinguish similar models on mobile.
  - The column header `الأكثر مبيعاً` clips mid-word to `الأكـ مبيعـ`.
  - The Edit/Delete action buttons on the far left (`RTL` end) are pushed outside the visible container boundary.

---

### Issue #3 — Catalog Sidebar Scrollable Filter Lists Clip the Bottom Item Mid-Line Without a Scroll Indicator
- **Severity**: **Minor**
- **Page / Component**: Catalog Sidebar & Mobile Filter Drawer (`src/components/storefront/CatalogPage.tsx`)
- **Viewport Size**: `390×844` (Mobile Drawer) and `1600×900` (Desktop Sidebar)
- **Screenshot Filenames**:
  - `06-search-filters/mobile-filters-drawer-open-390.png`
  - `11-english-ltr/ltr-catalog-1600-full.png`
  - `04-catalog-categories/all-products-1600-full.png`
- **Description**:
  The Subcategories list (`max-h-52 overflow-y-auto`) and Brands list (`max-h-40 overflow-y-auto`) use fixed maximum heights that cut directly through the middle of a list item at the bottom boundary:
  - In `mobile-filters-drawer-open-390.png` and `ltr-catalog-1600-full.png`, the 6th subcategory pill (`سماعات الألعاب` / `Gaming Headsets`) is sliced horizontally in half at the bottom of the Subcategory box.
  - In `ltr-catalog-1600-full.png`, the 7th brand checkbox (`Kingston`) is sliced horizontally at the bottom of the Brand box.
  Adjusting the `max-h` to align with full row multiples or adding a subtle bottom scroll fade/scrollbar styling would make it clear that more options exist below.

---

### Issue #4 — 5-Column Catalog Grid Leaves 3 Empty Column Slots on the Final Row at `1600px` (`itemsPerPage = 12`)
- **Severity**: **Minor**
- **Page / Component**: Catalog Product Grid (`src/components/storefront/CatalogPage.tsx` — `catalog-product-grid`)
- **Viewport Size**: `1600×900` (`2xl` breakpoint)
- **Screenshot Filenames**:
  - `04-catalog-categories/all-products-1600-full.png`
  - `11-english-ltr/ltr-catalog-1600-full.png`
- **Description**:
  At `1600px` (`2xl:grid-cols-5`), the catalog displays 5 cards per row, while `itemsPerPage` is hardcoded to `12` (which divides evenly into 2, 3, and 4 columns, but not 5). As a result, Page 1 of All Products displays two full rows of 5 cards followed by a 3rd row containing only 2 cards and 3 empty column slots (`60%` empty row width) right above the pagination bar. Using `15` or `20` items per page (or keeping a 4-column catalog grid alongside the sidebar) would keep the grid visually balanced on wide desktop monitors.

---

### Issue #5 — Dedicated Exclusive Offers Page Cards Have Disproportionately Tall Vector Art Boxes Compared to Homepage Offer Cards
- **Severity**: **Minor**
- **Page / Component**: Dedicated Exclusive Offers Page (`src/components/storefront/OffersPage.tsx`)
- **Viewport Size**: `1600×900` and `1280×800`
- **Screenshot Filenames**:
  - `03-exclusive-offers/offers-page-1600-full.png`
  - `03-exclusive-offers/offers-page-1280-full.png`
- **Description**:
  While the Homepage Exclusive Offers section (`03-exclusive-offers/home-offers-section-1600.png`) was refined into a compact, high-density layout, the standalone Offers page (`OffersPage.tsx`) still renders a 3-column grid (`lg:grid-cols-3`) where each card has a large `aspect-[4/3]` vector illustration container (`~500×375px` at `1600px`) above a relatively short 3-line text block. Using a wider aspect ratio (`aspect-[16/9]` or `aspect-[16/10]`) or a 4-column grid on desktop would improve visual density and reduce vertical scrolling.

---

### Issue #6 — Header Search Input Retains Stale Query Text After Navigating to Other Pages
- **Severity**: **Minor**
- **Page / Component**: Storefront Header Search Bar (`src/components/storefront/StoreHeader.tsx` — `localSearch` state)
- **Viewport Size**: All viewports (`1600×900` shown)
- **Screenshot Filenames**:
  - `08-services-contact/cooling-solutions-1600-full.png`
  - `11-english-ltr/ltr-header-navigation-1600.png`
  - `11-english-ltr/ltr-catalog-1600-full.png`
- **Description**:
  `StoreHeader` only syncs `localSearch` from `filters.searchQuery` when `filters.searchQuery` is non-empty (`if (filters.searchQuery !== undefined && filters.searchQuery !== '')`). When a user searches for `"RTX"` and then clicks a category or top-level navigation item (which resets `filters.searchQuery` to `''`), the input field `#header-search-input` continues displaying `"RTX"` even though the catalog is no longer filtering by `"RTX"`.

---

### Issue #7 — Duplicate "تصفية النتائج" Heading Inside Mobile Filter Drawer
- **Severity**: **Minor**
- **Page / Component**: Catalog Mobile Filter Drawer (`src/components/storefront/CatalogPage.tsx`)
- **Viewport Size**: `390×844` and `350×760`
- **Screenshot Filename**: `06-search-filters/mobile-filters-drawer-open-390.png`
- **Description**:
  When opening the mobile filter drawer on `390px`, the drawer container renders a sticky top header bar titled `تصفية النتائج` with an `X` close button, and immediately below it `renderFiltersPanel()` renders its own desktop card header also titled `تصفية النتائج` (with `إعادة ضبط`). Consolidating these into a single header row inside the mobile drawer (and adding an explicit `aria-label` to the drawer's `X` close button) would save vertical space and remove the redundant title.
