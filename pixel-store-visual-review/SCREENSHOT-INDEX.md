# Pixel Store — Visual Review Screenshot Index

- **Package Directory**: `pixel-store-visual-review/`
- **Total Captured Screenshots**: **97 PNG files** across 11 organized folders
- **Active Theme**: **Pixel Contrast** (`contrast` / تباين بيكسل — locked default)
- **Active Typography**: **Cairo** (`cairo` — locked default for Arabic) / **Space Grotesk & Inter** (Latin/English)
- **Browser Engine**: Chromium (Playwright automated full-page and element-level captures with animations stabilized)
- **Responsive Viewports Used**:
  - Wide Desktop: `1600×900`
  - Regular Desktop: `1280×800`
  - Tablet: `768×1024`
  - Mobile: `390×844`
  - Narrow Mobile: `350×760`

---

## Coverage Notes & Non-Separate Screens

- **Missing Public Storefront Pages**: **None (`0`)** — all 19 requested storefront views, sections, and interactive dialogs/menus exist and were captured.
- **Admin Promotional Banner Management Note**: In the current Pixel Store prototype (`src/components/admin/AdminDashboard.tsx`), hero slides are defined in storefront configuration while promotional campaigns and time-limited flash offers are managed inside the **Promotional Offers (`العروض الترويجية`)** tab (`10-admin/admin-offers-management-1600-full.png` and `10-admin/admin-offers-management-390-full.png`). There is no separate standalone "Banner Upload" tab in the prototype.
- **Design Playground**: Intentionally absent as locked to **Pixel Contrast** + **Cairo** per client selection.

---

## 01. Homepage (`01-homepage/`) — 14 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 1 | `01-homepage/desktop-1600-full.png` | Complete Homepage (Hero, Category Bento, Exclusive Offers, Best Sellers, Use-Case Matrix, New Arrivals, Footer) | `1600×900` (Full Page) | Arabic (`RTL`) | Wide desktop reference layout |
| 2 | `01-homepage/desktop-1280-full.png` | Complete Homepage | `1280×800` (Full Page) | Arabic (`RTL`) | Regular desktop layout |
| 3 | `01-homepage/tablet-768-full.png` | Complete Homepage | `768×1024` (Full Page) | Arabic (`RTL`) | Tablet breakpoint layout |
| 4 | `01-homepage/mobile-390-full.png` | Complete Homepage | `390×844` (Full Page) | Arabic (`RTL`) | Standard smartphone layout |
| 5 | `01-homepage/mobile-350-full.png` | Complete Homepage | `350×760` (Full Page) | Arabic (`RTL`) | Narrow mobile stress-test layout |
| 6 | `01-homepage/hero-slides/slide-01.png` | Hero Carousel — Slide 1: Custom Gaming PCs & RTX 50 Series | `1600×900` (Element) | Arabic (`RTL`) | Flagship gaming build promotion |
| 7 | `01-homepage/hero-slides/slide-02.png` | Hero Carousel — Slide 2: Gaming & Creator Laptops | `1600×900` (Element) | Arabic (`RTL`) | ASUS ROG / Lenovo Legion / MSI showcase |
| 8 | `01-homepage/hero-slides/slide-03.png` | Hero Carousel — Slide 3: Certified Used Laptops | `1600×900` (Element) | Arabic (`RTL`) | Inspected pre-owned laptops with warranty |
| 9 | `01-homepage/hero-slides/slide-04.png` | Hero Carousel — Slide 4: Custom Liquid & Air Cooling Solutions | `1600×900` (Element) | Arabic (`RTL`) | Thermal & AIO cooling spotlight |
| 10 | `01-homepage/hero-slides/slide-05.png` | Hero Carousel — Slide 5: Pro Gaming Peripherals & Monitors | `1600×900` (Element) | Arabic (`RTL`) | Esports mice, mechanical keyboards & OLED displays |
| 11 | `01-homepage/section-category-shortcuts-1600.png` | Category Discovery Bento (2 Spotlight Tiles + 6 Category Tiles) | `1600×900` (Element) | Arabic (`RTL`) | Asymmetric 10-column Pixel Contrast bento |
| 12 | `01-homepage/section-best-sellers-1600.png` | Best Sellers Section (`الأكثر مبيعاً`) | `1600×900` (Element) | Arabic (`RTL`) | 5-column product card grid on 1600px |
| 13 | `01-homepage/section-use-case-matrix-1600.png` | Shop by Use Case Bento Grid (`تسوق حسب طبيعة استخدامك`) | `1600×900` (Element) | Arabic (`RTL`) | Gaming, Engineering/3D, Content Creation, Office, Student |
| 14 | `01-homepage/section-new-arrivals-1600.png` | New Arrivals Section (`وصل حديثاً`) | `1600×900` (Element) | Arabic (`RTL`) | Latest hardware arrivals in dual USD/SYP pricing |

---

## 02. Header & Navigation (`02-header-navigation/`) — 8 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 15 | `02-header-navigation/header-desktop-1600.png` | Complete Storefront Header (Top Utility Bar, Main Search Bar, Structured Two-Group Category Bar) | `1600×900` (Element) | Arabic (`RTL`) | Shows grouped navigation & quick actions |
| 16 | `02-header-navigation/header-desktop-1280.png` | Complete Storefront Header at Regular Desktop Width | `1280×800` (Element) | Arabic (`RTL`) | Verifies zero wrapping/crowding at 1280px |
| 17 | `02-header-navigation/header-utility-more-menu-open-1600.png` | Top Utility Bar with Social/Contact Overflow Menu (`المزيد`) Open | `1600×900` (Clip) | Arabic (`RTL`) | Displays Instagram, Facebook & Secondary Phone line |
| 18 | `02-header-navigation/header-tablet-768.png` | Storefront Header at Tablet Breakpoint | `768×1024` (Element) | Arabic (`RTL`) | Responsive search & mobile menu trigger |
| 19 | `02-header-navigation/header-mobile-390-closed.png` | Storefront Header on Mobile (Drawer Closed) | `390×844` (Element) | Arabic (`RTL`) | Compact mobile bar + search input |
| 20 | `02-header-navigation/header-mobile-350-closed.png` | Storefront Header on Narrow Mobile (Drawer Closed) | `350×760` (Element) | Arabic (`RTL`) | Verifies narrow 350px header alignment |
| 21 | `02-header-navigation/header-mobile-390-drawer-open.png` | Mobile Navigation Drawer Open (`390px`) | `390×844` (Viewport) | Arabic (`RTL`) | Two-group mobile navigation menu open |
| 22 | `02-header-navigation/header-mobile-350-drawer-open.png` | Mobile Navigation Drawer Open (`350px` Narrow Mobile) | `350×760` (Viewport) | Arabic (`RTL`) | Verifies drawer fit on narrow 350×760 screen |

---

## 03. Exclusive Offers (`03-exclusive-offers/`) — 11 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 23 | `03-exclusive-offers/home-offers-section-1600.png` | Homepage Exclusive Offers Section (`العروض الحصرية والتخفيضات الفورية`) | `1600×900` (Element) | Arabic (`RTL`) | Featured 5-col Deal + 7-col `2×2` Compact Grid |
| 24 | `03-exclusive-offers/home-offers-section-1280.png` | Homepage Exclusive Offers Section | `1280×800` (Element) | Arabic (`RTL`) | Non-stretching `items-start` grid alignment |
| 25 | `03-exclusive-offers/home-offers-section-768.png` | Homepage Exclusive Offers Section | `768×1024` (Element) | Arabic (`RTL`) | Tablet stacked featured + 2-column grid |
| 26 | `03-exclusive-offers/home-offers-section-390.png` | Homepage Exclusive Offers Section | `390×844` (Element) | Arabic (`RTL`) | Mobile stacked layout |
| 27 | `03-exclusive-offers/home-offers-section-350.png` | Homepage Exclusive Offers Section | `350×760` (Element) | Arabic (`RTL`) | Narrow mobile layout |
| 28 | `03-exclusive-offers/offers-page-1600-full.png` | Dedicated Exclusive Offers Page (`OffersPage`) | `1600×900` (Full Page) | Arabic (`RTL`) | Complete promotional listing with live countdowns |
| 29 | `03-exclusive-offers/offers-page-1280-full.png` | Dedicated Exclusive Offers Page | `1280×800` (Full Page) | Arabic (`RTL`) | Regular desktop viewport |
| 30 | `03-exclusive-offers/offers-page-768-full.png` | Dedicated Exclusive Offers Page | `768×1024` (Full Page) | Arabic (`RTL`) | Tablet viewport |
| 31 | `03-exclusive-offers/offers-page-390-full.png` | Dedicated Exclusive Offers Page | `390×844` (Full Page) | Arabic (`RTL`) | Mobile viewport |
| 32 | `03-exclusive-offers/offers-page-350-full.png` | Dedicated Exclusive Offers Page | `350×760` (Full Page) | Arabic (`RTL`) | Narrow mobile viewport |
| 33 | `03-exclusive-offers/offers-page-expired-simulation-1600.png` | Dedicated Exclusive Offers Page — Expired Offer Simulation Mode Active | `1600×900` (Full Page) | Arabic (`RTL`) | Demonstrates automatic hiding/reversion of expired offers |

---

## 04. Catalog & Categories (`04-catalog-categories/`) — 12 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 34 | `04-catalog-categories/all-products-1600-full.png` | All Products Catalog (`جميع المنتجات والعتاد التقني`) | `1600×900` (Full Page) | Arabic (`RTL`) | Sidebar filters + 5-column product grid |
| 35 | `04-catalog-categories/all-products-1280-full.png` | All Products Catalog | `1280×800` (Full Page) | Arabic (`RTL`) | Sidebar filters + 4-column product grid |
| 36 | `04-catalog-categories/all-products-768-full.png` | All Products Catalog | `768×1024` (Full Page) | Arabic (`RTL`) | Tablet 3-column product grid |
| 37 | `04-catalog-categories/all-products-390-full.png` | All Products Catalog | `390×844` (Full Page) | Arabic (`RTL`) | Mobile 2-column dense product grid |
| 38 | `04-catalog-categories/all-products-350-full.png` | All Products Catalog | `350×760` (Full Page) | Arabic (`RTL`) | Narrow 350×760 2-column grid |
| 39 | `04-catalog-categories/category-laptops-1600-full.png` | Category Page: Laptops (`اللابتوبات`) | `1600×900` (Full Page) | Arabic (`RTL`) | Shows contextual Subcategory & Use-Case filters in sidebar |
| 40 | `04-catalog-categories/category-laptops-390-full.png` | Category Page: Laptops (`اللابتوبات`) on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile category view |
| 41 | `04-catalog-categories/subcategory-used-laptops-1600-full.png` | Subcategory Page: Certified Used Laptops (`لابتوبات مستعملة`) | `1600×900` (Full Page) | Arabic (`RTL`) | Shows `مستعمل` condition badges and warranty tags |
| 42 | `04-catalog-categories/subcategory-used-laptops-390-full.png` | Subcategory Page: Certified Used Laptops on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile subcategory view |
| 43 | `04-catalog-categories/subcategory-keyboards-usecase-1600-full.png` | Subcategory Page: Keyboards (`لوحات المفاتيح`) with Use-Case Filter | `1600×900` (Full Page) | Arabic (`RTL`) | Shows contextual sidebar Use-Case filter |
| 44 | `04-catalog-categories/subcategory-keyboards-usecase-390-full.png` | Subcategory Page: Keyboards on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile subcategory view |
| 45 | `04-catalog-categories/product-card-hover-state-1600.png` | Product Card Interactive Hover State | `1600×900` (Element) | Arabic (`RTL`) | Highlighted border & CTA state on hover |

---

## 05. Product Details (`05-product-details/`) — 9 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 46 | `05-product-details/pdp-new-product-1600-full.png` | Product Details — NEW Product (`ASUS ROG Strix G16`) | `1600×900` (Full Page) | Arabic (`RTL`) | Includes live offer countdown, specs, WhatsApp CTA & related items |
| 47 | `05-product-details/pdp-new-product-1280-full.png` | Product Details — NEW Product | `1280×800` (Full Page) | Arabic (`RTL`) | Regular desktop viewport |
| 48 | `05-product-details/pdp-new-product-768-full.png` | Product Details — NEW Product | `768×1024` (Full Page) | Arabic (`RTL`) | Tablet stacked gallery + details |
| 49 | `05-product-details/pdp-new-product-390-full.png` | Product Details — NEW Product | `390×844` (Full Page) | Arabic (`RTL`) | Mobile layout |
| 50 | `05-product-details/pdp-new-product-350-full.png` | Product Details — NEW Product | `350×760` (Full Page) | Arabic (`RTL`) | Narrow mobile `350×760` layout |
| 51 | `05-product-details/pdp-used-product-1600-full.png` | Product Details — USED Product (`Lenovo Legion 5 Pro — مستعمل`) | `1600×900` (Full Page) | Arabic (`RTL`) | Shows amber Used Condition Card (`الحالة الفنية والضمان`) |
| 52 | `05-product-details/pdp-used-product-390-full.png` | Product Details — USED Product on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile view of Used Condition inspection details |
| 53 | `05-product-details/pdp-gallery-secondary-angle-1600.png` | Product Image Gallery — Secondary Angle Thumbnail Selected | `1600×900` (Viewport) | Arabic (`RTL`) | Interactive multi-angle SVG hardware preview |
| 54 | `05-product-details/pdp-gallery-hover-zoom-active-1600.png` | Product Image Gallery — Desktop Hover Zoom Lens & Magnified Overlay Active | `1600×900` (Viewport) | Arabic (`RTL`) | Demonstrates interactive hover zoom inspection |

---

## 06. Search, Filtering & Sorting (`06-search-filters/`) — 4 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 55 | `06-search-filters/search-results-rtx-1600-full.png` | Global Search Results for `"RTX"` | `1600×900` (Full Page) | Arabic (`RTL`) | Filtered catalog matching RTX GPUs, laptops & builds |
| 56 | `06-search-filters/search-results-rtx-390-full.png` | Global Search Results for `"RTX"` on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile 2-column search results |
| 57 | `06-search-filters/filters-and-sorting-active-1600.png` | Active Sidebar Filters (`جديد` Condition + `عروض خاصة فقط`) & Price Sorting (`price-asc`) | `1600×900` (Full Page) | Arabic (`RTL`) | Shows active filter chips & sorted results |
| 58 | `06-search-filters/mobile-filters-drawer-open-390.png` | Mobile Slide-Over Filters Drawer Open | `390×844` (Viewport) | Arabic (`RTL`) | Shows Category, Subcategory, Use-Case, Condition & Price filters |

---

## 07. Product Request Dialog (`07-product-request/`) — 3 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 59 | `07-product-request/request-dialog-open-1600.png` | "Request Unavailable Product" (`اطلب منتج غير متوفر`) Modal Open | `1600×900` (Viewport) | Arabic (`RTL`) | Desktop modal dialog |
| 60 | `07-product-request/request-dialog-open-390.png` | "Request Unavailable Product" Modal Open on Mobile | `390×844` (Viewport) | Arabic (`RTL`) | Responsive modal fit on mobile |
| 61 | `07-product-request/request-dialog-submitted-1600.png` | Product Request Dialog — Populated & Submitted Confirmation State | `1600×900` (Viewport) | Arabic (`RTL`) | Shows green confirmation state & WhatsApp follow-up option |

---

## 08. Services, Cooling Solutions & Contact (`08-services-contact/`) — 6 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 62 | `08-services-contact/services-overview-1600-full.png` | Technical Services & Maintenance Page (`خدمات الصيانة والتجميع الاحترافي`) | `1600×900` (Full Page) | Arabic (`RTL`) | Service cards with turnaround time, warranty & WhatsApp booking |
| 63 | `08-services-contact/services-overview-390-full.png` | Technical Services & Maintenance Page on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Stacked service cards on mobile |
| 64 | `08-services-contact/cooling-solutions-1600-full.png` | Cooling & Thermal Engineering Page (`حلول التبريد الاحترافية`) | `1600×900` (Full Page) | Arabic (`RTL`) | Custom thermal tiers + cooling hardware catalog |
| 65 | `08-services-contact/cooling-solutions-390-full.png` | Cooling & Thermal Engineering Page on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile view |
| 66 | `08-services-contact/contact-page-1600-full.png` | Contact & Damascus Showroom Page (`تواصل مع فريق بيكسل ستور`) | `1600×900` (Full Page) | Arabic (`RTL`) | Phone, WhatsApp, Showroom hours, location & social channels |
| 67 | `08-services-contact/contact-page-390-full.png` | Contact & Damascus Showroom Page on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile view |

---

## 09. Footer (`09-footer/`) — 5 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 68 | `09-footer/footer-1600.png` | Storefront Footer (`1600px` Wide Desktop) | `1600×900` (Element) | Arabic (`RTL`) | Compact 12-column layout, single social icon bar, compact copyright bar |
| 69 | `09-footer/footer-1280.png` | Storefront Footer (`1280px` Regular Desktop) | `1280×800` (Element) | Arabic (`RTL`) | Balanced 4-section desktop footer |
| 70 | `09-footer/footer-768.png` | Storefront Footer (`768px` Tablet) | `768×1024` (Element) | Arabic (`RTL`) | 2-column responsive tablet grid |
| 71 | `09-footer/footer-390.png` | Storefront Footer (`390px` Mobile) | `390×844` (Element) | Arabic (`RTL`) | Compact mobile footer with 2-column link lists |
| 72 | `09-footer/footer-350.png` | Storefront Footer (`350px` Narrow Mobile) | `350×760` (Element) | Arabic (`RTL`) | Zero overflow on narrow `350×760` screen |

---

## 10. Admin Interface (`10-admin/`) — 20 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 73 | `10-admin/admin-login-1600.png` | Admin Authentication Gate (`تسجيل الدخول للوحة الإدارة`) | `1600×900` (Full Page) | Arabic (`RTL`) | Password login screen before entering Admin |
| 74 | `10-admin/admin-login-390.png` | Admin Authentication Gate on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile login card |
| 75 | `10-admin/admin-dashboard-overview-1600-full.png` | Admin Dashboard — Executive Overview (`نظرة عامة`) | `1600×900` (Full Page) | Arabic (`RTL`) | KPI cards, quick exchange-rate adjuster, recent requests & inventory summary |
| 76 | `10-admin/admin-dashboard-overview-390-full.png` | Admin Dashboard — Executive Overview on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Responsive Admin header & stacked KPIs |
| 77 | `10-admin/admin-products-list-1600-full.png` | Admin — Products Catalog Management (`إدارة المنتجات`) | `1600×900` (Full Page) | Arabic (`RTL`) | Searchable product table with condition, USD/SYP pricing & best-seller toggles |
| 78 | `10-admin/admin-products-list-768-full.png` | Admin — Products Catalog Management on Tablet | `768×1024` (Full Page) | Arabic (`RTL`) | Tablet view of products table |
| 79 | `10-admin/admin-products-list-390-full.png` | Admin — Products Catalog Management on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile view (see Visual QA Report Issue #2) |
| 80 | `10-admin/admin-product-editor-form-1600-full.png` | Admin — Product Create/Edit Modal Form (`تعديل المنتج`) | `1600×900` (Viewport) | Arabic (`RTL`) | Bilingual titles, category/subcategory, condition, USD price & promotional offer settings |
| 81 | `10-admin/admin-product-editor-form-768-full.png` | Admin — Product Create/Edit Modal Form on Tablet | `768×1024` (Viewport) | Arabic (`RTL`) | Tablet modal layout |
| 82 | `10-admin/admin-services-management-1600-full.png` | Admin — Technical Services & Cooling Tier Management (`الخدمات والتبريد`) | `1600×900` (Full Page) | Arabic (`RTL`) | Manage service packages, pricing, turnaround & active status |
| 83 | `10-admin/admin-offers-management-1600-full.png` | Admin — Promotional Offers & Campaigns (`العروض الترويجية`) | `1600×900` (Full Page) | Arabic (`RTL`) | Promotional campaign creation + active offer countdown cards |
| 84 | `10-admin/admin-offers-management-390-full.png` | Admin — Promotional Offers Management on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile view |
| 85 | `10-admin/admin-customer-requests-1600-full.png` | Admin — Customer Special Product Requests (`طلبات العملاء الخاصة`) | `1600×900` (Full Page) | Arabic (`RTL`) | Shows customer requests & status workflow |
| 86 | `10-admin/admin-customer-requests-390-full.png` | Admin — Customer Special Product Requests on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile view |
| 87 | `10-admin/admin-categories-management-1600-full.png` | Admin — Categories & Subcategories Tree (`الأقسام والفئات الفرعية`) | `1600×900` (Full Page) | Arabic (`RTL`) | Main categories and nested subcategories CRUD |
| 88 | `10-admin/admin-usecases-management-1600-full.png` | Admin — Use Cases Management (`فئات الاستخدام`) | `1600×900` (Full Page) | Arabic (`RTL`) | Bilingual use-case taxonomy management |
| 89 | `10-admin/admin-brands-management-1600-full.png` | Admin — Authorized Brands Management (`العلامات التجارية`) | `1600×900` (Full Page) | Arabic (`RTL`) | Hardware manufacturer roster & product counts |
| 90 | `10-admin/admin-analytics-1600-full.png` | Admin — Storefront Analytics & Category Distribution (`الإحصائيات والتقارير`) | `1600×900` (Full Page) | Arabic (`RTL`) | Inventory breakdown, brand distribution & condition metrics |
| 91 | `10-admin/admin-store-settings-currency-1600-full.png` | Admin — Store Settings & Live USD/SYP Exchange Rate Control (`الإعدادات وسعر الصرف`) | `1600×900` (Full Page) | Arabic (`RTL`) | Global exchange rate control, showroom info & data reset |
| 92 | `10-admin/admin-store-settings-currency-390-full.png` | Admin — Store Settings & Currency Control on Mobile | `390×844` (Full Page) | Arabic (`RTL`) | Mobile view |

---

## 11. English (`LTR`) Verification (`11-english-ltr/`) — 5 Screenshots

| # | Relative File Path | Page / UI State Represented | Viewport | Language | Notes |
|---|---|---|---|---|---|
| 93 | `11-english-ltr/ltr-homepage-1600-full.png` | Complete Homepage in English (`dir="ltr"`) | `1600×900` (Full Page) | English (`LTR`) | Verifies LTR directional flip, typography & spacing |
| 94 | `11-english-ltr/ltr-homepage-390-full.png` | Complete Homepage in English on Mobile (`dir="ltr"`) | `390×844` (Full Page) | English (`LTR`) | Mobile LTR verification |
| 95 | `11-english-ltr/ltr-header-navigation-1600.png` | Storefront Header & Navigation in English (`dir="ltr"`) | `1600×900` (Element) | English (`LTR`) | Left-aligned logo, search bar & category navigation |
| 96 | `11-english-ltr/ltr-catalog-1600-full.png` | All Products Catalog & Sidebar Filters in English (`dir="ltr"`) | `1600×900` (Full Page) | English (`LTR`) | Left sidebar filters + 5-column product grid |
| 97 | `11-english-ltr/ltr-product-details-1600-full.png` | Product Details Page in English (`dir="ltr"`) | `1600×900` (Full Page) | English (`LTR`) | Left product gallery + right specification & pricing panel |
