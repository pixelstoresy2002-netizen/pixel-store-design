# Pixel Store (`بِكسل ستور`) — Data Model, Schema & API Contract Specification

> **Purpose:** Authoritative technical blueprint bridging the completed Next.js 16 Storefront & Admin Dashboard (`src/types/store.ts`, `src/utils/adminQueryContract.ts`, `src/context/StoreContext.tsx`) with the upcoming PostgreSQL + Prisma production backend.

---

## Section A — Entity Inventory

| # | Entity | TypeScript Type | Purpose | Primary Storefront Surfaces | Primary Admin Surfaces |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Product** | `Product` | Core hardware catalog item with USD authoritative price, condition (`NEW` / `USED`), availability, 5-image gallery, 4-field laptop specs, and bilingual generic specs. | Homepage shelves, Catalog (`/catalog`), Category/Subcategory pages, Product Detail (`/product/[id]`), Search results, Request Modal | `/admin?tab=products` (Table, Filter Engine, 6-Section Product Editor) |
| 2 | **ProductImage** *(Normalized from `Product.galleryImages`)* | `string[]` (`galleryImages`, `primaryImage`, `secondaryImage`) | Ordered up-to-5 visual keys or image URLs per product powering the hover crossfade gallery and detail zoom gallery. | `ProductCard` 5-image hover cycling, `ProductDetailsPage` thumbnail strip & zoom viewer | Product Editor — Section 3 (5-Image Gallery Manager with reorder & primary selection) |
| 3 | **LaptopSpecification** *(1:1 with `Product`)* | `LaptopSpecFields` | Structured 4-field hardware summary (`processor`, `memory`, `storage`, `display`) displayed on laptop cards and detail headers. | `ProductCard` spec pills, `ProductDetailsPage` 4-card hardware summary | Product Editor — Section 5 (4-Field Laptop Specs) |
| 4 | **ProductSpecification** *(1:N with `Product`)* | `ProductSpecItem[]` | Dynamic bilingual key/value technical attributes (e.g., GPU, Refresh Rate, Ports, Warranty, Battery Health). | `ProductDetailsPage` technical specification table | Product Editor — Section 5 (Dynamic Bilingual Specs) |
| 5 | **Category** *(Self-Referencing Hierarchy)* | `Category` | Top-level hardware categories (`parentId = null`) and child subcategories (`parentId != null`). | Header category bar, Mega-menu, Homepage category grid, `/category/[categoryId]` | `/admin?tab=categories` (`AdminCategoriesPanel`) |
| 6 | **Brand** | `Brand` | Hardware manufacturer (`ASUS`, `Lenovo`, `MSI`, `Apple`, `HP`, `Dell`, `Razer`, `Logitech`, `HyperX`, `Moondrop`, etc.). | Catalog sidebar filter, Product cards, Homepage brand strip | `/admin?tab=brands` (`AdminBrandsPanel`) |
| 7 | **UseCaseTag** | `UseCaseTag` | Cross-cutting workflow classification (`gaming`, `engineering`, `study`, `office`, `content-creation`, `competitive-esports`) independent of categories. | Homepage & Category Use-Case Selector tiles, Catalog filters, Product detail badges | `/admin?tab=usecases` (`AdminUseCasesPanel`) |
| 8 | **Offer** | `Offer` | Time-limited promotional discount tied to a `Product`, with `offerPriceUsd`, `startTime`, `endTime`, bilingual title/badge, and `isExclusive`. | Homepage Flash Offers, `/offers` Exclusive Offers page, Product cards, `CountdownBadge` | `/admin?tab=offers` (Offer Creator/Editor, Status Filter, Live Countdown Preview) |
| 9 | **HeroSlide** | `HeroSlide` | 5-slide homepage hero showcase carousel with bilingual headline/subtitle/kicker/CTA, visual key, target view/category, and `sortOrder`. | Homepage 5-slide Hero Carousel (`HomePage.tsx`) | `/admin?tab=banners` (`AdminBannersManager` — Hero Slides) |
| 10 | **PromoBanner** | `PromoBanner` | Secondary promotional side banners displayed alongside the hero carousel on the homepage. | Homepage side promotional cards (`HomePage.tsx`) | `/admin?tab=banners` (`AdminBannersManager` — Promo Banners) |
| 11 | **StoreService** | `StoreService` | Technical & workshop services (e.g., Cooling Solutions, Thermal Paste/Liquid Metal, Custom PC Assembly, Pre-Owned Inspection). | `/services` page, Top Navbar "Cooling Solutions" tab, Homepage service highlights | `/admin?tab=services` (Service Editor & Visibility Toggle) |
| 12 | **CustomerRequest** | `CustomerRequest` | No-checkout customer purchase/inquiry request capturing customer name, Syrian phone number, snapshot USD & SYP price at request time, customer note, status, and internal `adminNote`. | Storefront "Request Now" (`اطلب الآن`) modal + WhatsApp pre-filled handoff | `/admin?tab=requests` & `/admin?tab=overview` |
| 13 | **StoreSettings** | `StoreSettings` | Global singleton store configuration: `usdToSypRate`, verified contact phone numbers, WhatsApp number, map URL, social channels, working hours, and bilingual store identity. | Header, Footer, Contact Page (`/contact`), Currency conversion across all pages | `/admin?tab=settings` |

---

## Section B — Field-by-Field Definitions

### 1. `Product`
| Field | Type | Required | Validation / Business Rule |
| :--- | :--- | :--- | :--- |
| `id` | `string` (UUID / Slug ID) | Yes | Primary key |
| `sku` | `string` | Yes | Unique catalog code (e.g. `PXL-LAP-001`), indexed for fast search |
| `slug` | `string` | Optional | URL-safe slug |
| `name` | `LocalizedText` (`{ ar, en }`) | Yes | Non-empty Arabic and English titles |
| `description` | `LocalizedText` (`{ ar, en }`) | Yes | Detailed bilingual marketing & condition description |
| `categoryId` | `string` | Yes | Foreign key to root `Category.id` |
| `subcategoryId` | `string` | Optional | Foreign key to child `Category.id` where `parentId = categoryId` |
| `brandId` | `string` | Yes | Foreign key to `Brand.id` |
| `useCaseIds` | `string[]` | Yes | M:N relation to `UseCaseTag.id` |
| `priceUsd` | `number` | Yes | Authoritative base price in USD (`> 0`). SYP is **never** stored on `Product`; it is derived via `Math.round((priceUsd * usdToSypRate) / 1000) * 1000`. |
| `condition` | `'NEW' \| 'USED'` | Yes | Strictly binary (`NEW` or `USED`). No refurbishment grading tiers. |
| `availability` | `'IN_STOCK' \| 'OUT_OF_STOCK' \| 'ON_REQUEST'` | Yes | Controls storefront CTA state and stock badge |
| `primaryImage` | `string` | Yes | Always synchronized with `galleryImages[0]` |
| `secondaryImage` | `string` | Optional | Synchronized with `galleryImages[1] ?? galleryImages[0]` |
| `galleryImages` | `string[]` | Yes | 1 to 5 ordered image keys/URLs (`maxLength = 5`) |
| `isBestSeller` | `boolean` | Yes | Manual merchandising flag controlled by Admin |
| `isNewArrival` | `boolean` | Yes | Merchandising flag for "New Arrivals" shelf |
| `isFeatured` | `boolean` | Yes | Merchandising flag for featured placement |
| `isActive` | `boolean` | Optional | Defaults to `true`; when `false`, hidden from public storefront queries |
| `laptopSpecs` | `LaptopSpecFields` | Optional | `{ processor, memory, storage, display }` — populated for laptops |
| `specs` | `ProductSpecItem[]` | Yes | Array of `{ label: { ar, en }, value: { ar, en } }` |
| `createdAt` | `string` (ISO-8601) | Yes | Creation timestamp |
| `updatedAt` | `string` (ISO-8601) | Optional | Last modification timestamp |

### 2. `Offer`
| Field | Type | Required | Validation / Business Rule |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Primary key |
| `productId` | `string` | Yes | Foreign key to `Product.id` |
| `title` | `LocalizedText` | Yes | Bilingual campaign headline |
| `badgeText` | `LocalizedText` | Yes | Bilingual badge pill text |
| `offerPriceUsd` | `number` | Yes | Must satisfy `0 < offerPriceUsd < product.priceUsd` |
| `startTime` | `string` (ISO-8601) | Yes | Campaign start timestamp |
| `endTime` | `string` (ISO-8601) | Yes | Campaign expiration timestamp (`endTime > startTime`). Once `nowMs >= Date.parse(endTime)`, `isOfferActive()` returns `false` and the product automatically reverts to `product.priceUsd`. |
| `isExclusive` | `boolean` | Yes | Featured on `/offers` and homepage exclusive block |
| `isActive` | `boolean` | Optional | Manual kill-switch (`default: true`) |

### 3. `HeroSlide` & `PromoBanner`
| Field | Type | Required | Validation / Business Rule |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Primary key |
| `kicker` / `badge` | `LocalizedText` | Yes | Top badge text |
| `title` | `LocalizedText` | Yes | Bilingual headline |
| `subtitle` | `LocalizedText` | Yes | Bilingual subheadline |
| `ctaLabel` | `LocalizedText` | Yes | Bilingual button text |
| `visualKey` | `string` | Yes | Hardware visual key rendered by `ProductVisual` |
| `targetView` | `BannerDestinationView` | Yes | `'catalog' \| 'category' \| 'offers' \| 'services' \| 'contact'` |
| `targetCategoryId` | `string` | Optional | Required when `targetView === 'category'` |
| `sortOrder` | `number` | Yes | Integer ordering (`1..5` for HeroSlides, `1..2` for PromoBanners) |
| `isActive` | `boolean` | Yes | Only `isActive: true` slides/banners appear on the Homepage |

### 4. `StoreService`
| Field | Type | Required | Validation / Business Rule |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Primary key (e.g., `service-cooling`, `service-maintenance`, `service-cameras`) |
| `slug` | `string` | Yes | Unique URL-safe slug |
| `title` | `LocalizedText` | Yes | Bilingual service title |
| `badge` | `LocalizedText` | Yes | Bilingual category/service badge |
| `summary` | `LocalizedText` | Optional | Short card & detail summary (`falls back to subtitle`) |
| `subtitle` | `LocalizedText` | Yes | Bilingual subtitle |
| `description` | `LocalizedText` | Yes | Detailed service scope and technical overview |
| `primaryImage` | `string` | Yes | Cover image key or URL displayed on Service Listing Cards and synchronized with `galleryImages[0]` |
| `galleryImages` | `string[]` | Yes | Up to 5 ordered image keys or URLs (`maxLength = 5`) powering the 5-Image Service Detail Gallery |
| `highlights` | `{ title: LocalizedText, description: LocalizedText }[]` | Yes | 3-step technical stages |
| `checklist` | `LocalizedText[]` | Yes | Service Quality Guarantee bullet points |
| `turnaroundNote` | `LocalizedText` | Yes | Estimated turnaround note |
| `iconKey` | `'cooling' \| 'maintenance' \| 'cameras' \| 'custom'` | Yes | Service icon family |
| `isActive` | `boolean` | Yes | Controls storefront visibility |
| `isFeatured` | `boolean` | Yes | Featured service flag |
| `showInNavbarShortcut` | `boolean` | Optional | Links to top navigation bar shortcut |

---

## Section C — Entity Relationships

```
Category (Root, parentId = null)
  ├── 1:N ──> Category (Subcategory, parentId = Root.id)
  ├── 1:N ──> Product (categoryId)
  └── M:N <─> UseCaseTag (CategoryUseCaseTag)

Brand
  └── 1:N ──> Product (brandId) [RESTRICT delete if products > 0]

Product
  ├── 1:1 ──> LaptopSpecification
  ├── 1:N ──> ProductImage (ordered 1..5 by sortOrder)
  ├── 1:N ──> ProductSpecification (ordered by sortOrder)
  ├── M:N <─> UseCaseTag (ProductUseCaseTag)
  ├── 1:N ──> Offer (productId) [CASCADE delete]
  └── 1:N ──> CustomerRequest (productId) [SET NULL / keep snapshot fields]
```

---

## Section D — Audit: Existing vs. Newly Completed Capabilities

| Area | Pre-Audit State | Post-Alignment State (Completed) |
| :--- | :--- | :--- |
| **Product Editor** | Basic form missing description fields, use-case selector, 5-image gallery manager, and generic bilingual specs. | Complete 6-section `AdminProductEditor` supporting bilingual descriptions, use-case tags, 5-image gallery reordering/primary selection/custom URLs, 4-field laptop specs, dynamic bilingual specs, and visibility flags. |
| **Products Table** | Unfiltered list with no search, sorting, or pagination. | Full query engine (`queryAdminProducts`) with search (`q`), 9 filters (`categoryId`, `subcategoryId`, `brandId`, `condition`, `availability`, `useCaseId`, `bestSeller`, `newArrival`, `hasOffer`), 5 sort modes, pagination, and URL query-parameter sync. |
| **Categories, Brands & Use-Case Tags** | Create-only quick forms; `StoreContext` appended duplicates on save and had no delete protection. | Fixed `StoreContext` upsert logic + safe delete handlers; built `AdminCategoriesPanel`, `AdminBrandsPanel`, and `AdminUseCasesPanel` with search, hierarchy filters, full edit forms, and dependency-checked safe deletion. |
| **Homepage Hero & Promo Banners** | Hardcoded inside `HomePage.tsx`; not manageable from Admin. | Extracted `INITIAL_HERO_SLIDES` and `INITIAL_PROMO_BANNERS` into `StoreContext`, wired live to `HomePage.tsx`, and built `AdminBannersManager` (`/admin?tab=banners`). |
| **Timed Offers** | Create and delete only; could not edit existing offers or filter by temporal status. | Full Create + Edit offer workflow, explicit `startTime`/`endTime` datetime pickers + duration presets, discount % preview, and `ACTIVE`/`SCHEDULED`/`EXPIRED` filtering. |
| **Customer Requests** | Flat list with raw `wa.me` links even on placeholder numbers. | Search, status filter, internal `adminNote` editor, safe delete, and `isPhoneLinkVerified()` check preventing broken WhatsApp links on demo numbers. |
| **Store Settings** | Basic inputs without channel verification feedback. | Full identity + contact editor with live `Verified Active` vs. `Hidden Until Verified` badges and a "Reset Demo Data" action. |

---

## Section E — Future Prisma Schema Mapping (`schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum ProductCondition {
  NEW
  USED
}

enum AvailabilityStatus {
  IN_STOCK
  OUT_OF_STOCK
  ON_REQUEST
}

enum CustomerRequestStatus {
  NEW
  CONTACTED
  COMPLETED
}

model Category {
  id            String     @id @default(cuid())
  slug          String     @unique
  nameAr        String
  nameEn        String
  descriptionAr String     @default("")
  descriptionEn String     @default("")
  iconKey       String     @default("Laptop")
  visualKey     String?
  parentId      String?
  parent        Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: Restrict)
  subcategories Category[] @relation("CategoryHierarchy")
  sortOrder     Int        @default(0)
  isActive      Boolean    @default(true)
  products      Product[]  @relation("ProductCategory")
  subProducts   Product[]  @relation("ProductSubcategory")
  useCaseTags   UseCaseTag[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([parentId, sortOrder])
}

model Brand {
  id        String    @id @default(cuid())
  slug      String    @unique
  name      String
  countryAr String
  countryEn String
  featured  Boolean   @default(false)
  sortOrder Int       @default(0)
  isActive  Boolean   @default(true)
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model UseCaseTag {
  id            String     @id @default(cuid())
  slug          String     @unique
  nameAr        String
  nameEn        String
  subtitleAr    String     @default("")
  subtitleEn    String     @default("")
  accentColor   String     @default("#8E4DEB")
  visualKey     String?
  sortOrder     Int        @default(0)
  isActive      Boolean    @default(true)
  categories    Category[]
  products      Product[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Product {
  id            String                 @id @default(cuid())
  sku           String                 @unique
  slug          String                 @unique
  nameAr        String
  nameEn        String
  descriptionAr String
  descriptionEn String
  categoryId    String
  category      Category               @relation("ProductCategory", fields: [categoryId], references: [id], onDelete: Restrict)
  subcategoryId String?
  subcategory   Category?              @relation("ProductSubcategory", fields: [subcategoryId], references: [id], onDelete: SetNull)
  brandId       String
  brand         Brand                  @relation(fields: [brandId], references: [id], onDelete: Restrict)
  priceUsd      Decimal                @db.Decimal(10, 2)
  condition     ProductCondition       @default(NEW)
  availability  AvailabilityStatus     @default(IN_STOCK)
  primaryImage  String
  secondaryImage String?
  isBestSeller  Boolean                @default(false)
  isNewArrival  Boolean                @default(false)
  isFeatured    Boolean                @default(false)
  isActive      Boolean                @default(true)
  images        ProductImage[]
  laptopSpec    LaptopSpecification?
  specs         ProductSpecification[]
  useCaseTags   UseCaseTag[]
  offers        Offer[]
  requests      CustomerRequest[]
  createdAt     DateTime               @default(now())
  updatedAt     DateTime               @updatedAt

  @@index([categoryId, subcategoryId])
  @@index([brandId])
  @@index([condition, availability])
  @@index([priceUsd])
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  urlOrKey  String
  sortOrder Int     @default(0)
  isPrimary Boolean @default(false)

  @@index([productId, sortOrder])
}

model LaptopSpecification {
  id        String  @id @default(cuid())
  productId String  @unique
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  processor String
  memory    String
  storage   String
  display   String
}

model ProductSpecification {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  labelAr   String
  labelEn   String
  valueAr   String
  valueEn   String
  sortOrder Int     @default(0)

  @@index([productId, sortOrder])
}

model Offer {
  id            String   @id @default(cuid())
  productId     String
  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  titleAr       String
  titleEn       String
  badgeTextAr   String
  badgeTextEn   String
  offerPriceUsd Decimal  @db.Decimal(10, 2)
  startTime     DateTime
  endTime       DateTime
  isExclusive   Boolean  @default(false)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([productId, startTime, endTime])
}

model CustomerRequest {
  id                String                @id @default(cuid())
  productId         String?
  product           Product?              @relation(fields: [productId], references: [id], onDelete: SetNull)
  productNameAr     String
  productNameEn     String
  productSku        String
  priceUsdAtRequest Decimal               @db.Decimal(10, 2)
  priceSypAtRequest BigInt
  customerName      String
  phoneNumber       String
  note              String?
  adminNote         String?
  status            CustomerRequestStatus @default(NEW)
  createdAt         DateTime              @default(now())
  updatedAt         DateTime              @updatedAt

  @@index([status, createdAt])
}

model StoreSettings {
  id                String   @id @default("singleton")
  usdToSypRate      Int      @default(13500)
  storeNameAr       String
  storeNameEn       String
  taglineAr         String
  taglineEn         String
  phone             String
  secondaryPhone    String?
  whatsappNumber    String
  mapLocationUrl    String?
  telegramChannel   String
  instagramHandle   String
  facebookPage      String
  addressAr         String
  addressEn         String
  workingHoursAr    String
  workingHoursEn    String
  topPromoBannerAr  String
  topPromoBannerEn  String
  topPromoActive    Boolean  @default(true)
  updatedAt         DateTime @updatedAt
}
```

---

## Section F — Future REST API Contracts & Query Conventions

All Admin and Storefront collection endpoints follow the shared `PaginatedResult<T>` contract implemented in `src/utils/adminQueryContract.ts`:

### Shared Pagination Envelope
```json
{
  "items": [],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

### 1. Products API (`/api/admin/products`)
- **`GET /api/admin/products`**
  - Query Parameters:
    - `q` (`string`): Matches `nameAr`, `nameEn`, `sku`, `brand.name`, `laptopSpec.*`, `specs.*`
    - `categoryId` (`string | 'ALL'`)
    - `subcategoryId` (`string | 'ALL'`)
    - `brandId` (`string | 'ALL'`)
    - `condition` (`'ALL' | 'NEW' | 'USED'`)
    - `availability` (`'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_REQUEST'`)
    - `useCaseId` (`string | 'ALL'`)
    - `bestSeller` (`'true' | 'false' | 'ALL'`)
    - `newArrival` (`'true' | 'false' | 'ALL'`)
    - `hasOffer` (`'true' | 'false' | 'ALL'`)
    - `sort` (`'updatedAt' | 'createdAt' | 'priceUsd' | 'name' | 'sku'`)
    - `order` (`'asc' | 'desc'`)
    - `page` (`number`, default `1`)
    - `limit` (`number`, default `10`)
- **`POST /api/admin/products`** — Create product + gallery + specs in a single Prisma transaction.
- **`PUT /api/admin/products/:id`** — Update product + replace gallery/specs atomically.
- **`DELETE /api/admin/products/:id`** — Delete product.

### 2. Offers API (`/api/admin/offers`)
- **`GET /api/admin/offers?q=&status=ALL|ACTIVE|SCHEDULED|EXPIRED&exclusive=ALL|true|false&sort=endTime|offerPriceUsd|discountPct&order=asc|desc&page=1&limit=10`**
- **`POST /api/admin/offers`** / **`PUT /api/admin/offers/:id`** / **`DELETE /api/admin/offers/:id`**

### 3. Customer Requests API (`/api/admin/requests` & `/api/requests`)
- **`POST /api/requests`** (Public Storefront) — Snapshots current active `priceUsd` and `priceSyp` at request submission time.
- **`GET /api/admin/requests?q=&status=ALL|NEW|CONTACTED|COMPLETED&productId=ALL&sort=createdAt|priceUsdAtRequest&order=desc&page=1&limit=10`**
- **`PATCH /api/admin/requests/:id`** — Update `status` and `adminNote`.

### 4. Taxonomy, Banners, Services & Settings APIs
- **`GET/POST/PUT/DELETE /api/admin/categories`** (Returns `409 Conflict` on `DELETE` if child subcategories or products exist)
- **`GET/POST/PUT/DELETE /api/admin/brands`** (Returns `409 Conflict` on `DELETE` if assigned products exist)
- **`GET/POST/PUT/DELETE /api/admin/use-cases`**
- **`GET/POST/PUT/DELETE /api/admin/banners/hero`** & **`/api/admin/banners/promo`**
- **`GET/POST/PUT/DELETE /api/admin/services`**
- **`GET/PUT /api/admin/settings`**

---

## Section G — Known Production Backend Gaps (Intentional Prototype Boundaries)

1. **Authentication & RBAC:** `/admin` is currently open for local client preview and includes a prominent demo notice banner. Before production deployment, protect `/admin` and `/api/admin/*` with NextAuth / session-based admin authentication.
2. **Binary Image Upload Storage:** The 5-image gallery currently stores preset visual keys or external image URLs in `localStorage`. In production, wire an S3 / Cloudflare R2 / UploadThing presigned upload endpoint that returns CDN URLs stored in `ProductImage`.
3. **Database Persistence:** State currently persists in browser `localStorage` (`pixel_store_*_v2`) with instant fallback to `mockStoreData.ts`. Replacing `StoreContext` mutations with `fetch('/api/admin/...')` calls will require zero UI restructuring because all forms and tables already adhere to the contracts above.
