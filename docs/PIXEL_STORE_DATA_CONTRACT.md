# Pixel Store data contract

## Boundary

`src/lib/data/*-queries.ts` is server-only and is not imported by any route,
component, or `StoreContext`. Its pure adapters are testable without Prisma or a
database. Customer requests have no query module: a future authenticated Admin
boundary must fetch them before calling `mapCustomerRequestForAdmin`.

No Phase 2/LAP-62 code replaces mock data. A later server-rendered route may
pass a serializable snapshot to a deliberately opt-in `StoreContext`
initialization boundary; localStorage remains the fallback until each entity is
explicitly adopted.

## Read-query contract

- `catalog-queries.ts`: active products/detail, category hierarchy, brands, and
  use-case tags. Lists have normalized search, bounded pagination (maximum 100),
  allowlisted sorting, category/subcategory, brand, use-case, stock, condition,
  and feature-flag filters. Product image reads are ordered and capped at five.
- `content-queries.ts`: bounded offers, banners, services/details, and site
  settings. Offer status is derived from server time plus enabled/start/end fields.
- `query-inputs.ts`: shared normalization and allowlists.
- `money.ts`: integer-safe USD-cent to SYP conversion. No rate default is
  invented; callers must provide the verified stored integer rate.

## Contract reconciliation matrix

| Gap | Classification | Resolution / rationale |
| --- | --- | --- |
| Product image URLs and gallery order | A + B | `ProductImage` already stores URL/public ID/order. Query and adapter now cap ordered galleries at five. Empty image rows stay empty; no visual fallback is fabricated. |
| Product visual keys | C | Existing visual-key sprites are frontend presentation. A real `ProductImage.url` is passed through; sprite keys require a frontend-owned presentation mapping. |
| Category image | A + B | `Category.imageUrl` now maps to existing `visualKey` when present. `iconKey` remains frontend presentation. |
| Category icon/visual metadata | C | No database fields are justified for decorative keys. |
| Brand origin and featured state | D | `description*` is unstructured marketing copy and must not be parsed as country. If managed origin/filtering and an editorial featured flag are needed, add typed bilingual origin fields plus `isFeatured` in a new approved migration. |
| Use-case category applicability | A | The Prisma many-to-many relation maps to `applicableCategories`. |
| Use-case accent/visual metadata | C | These are design tokens; the adapter's neutral fallback is not business data. |
| Typed product filter attributes | D | `extraSpecs` is validated display JSON, not an indexed typed filter model. Add attribute definition/value relations only when approved filters require them; do not query arbitrary JSON as a production filter API. |
| Offer badge and status | B | Badge uses the verified bilingual offer title because no distinct badge is stored. ACTIVE/SCHEDULED/DISABLED/EXPIRED is server-derived and never persisted. |
| HERO/PROMO presentation | A + B + C | `HomepageBanner.kind`, text, image URL, ordering, visibility, and known internal destination mapping are supported. Kicker, accent, and theme are presentation-only. Unknown destinations safely map to home because the current UI type cannot represent arbitrary URLs. |
| Service descriptions/highlights/workflow/images | A + B | Structured JSON is validated defensively; images are ordered and limited to five. Workflow titles map to the present checklist-only UI. |
| Service badge/icon/turnaround/benchmark claims | C / D | Icons and badges are presentation. Persisted turnaround, starting-price, or benchmark claims require approved business fields and validation; do not infer them. |
| Customer request statuses | B + frontend dependency | Prisma correctly supports NEW, CONTACTED, IN_PROGRESS, COMPLETED, CANCELLED. The existing UI type only has three states; the new Admin-only DTO preserves all five until that contract is coordinated. |
| USD cents, SYP snapshots, BigInt | A + B | USD cents and rate remain authoritative integers; conversion is BigInt half-up. Request snapshots serialize BigInt as strings only at a future authenticated client boundary. |

## Schema extensions requiring approval

Do not modify the applied baseline migration. If approved, create a new migration
for the following only:

1. **Managed brand data** — `countryAr`, `countryEn`, `isFeatured`. Needed only
   if country and featured branding become editable/filterable business data.
2. **Typed product attributes** — `ProductAttributeDefinition` and
   `ProductAttributeValue` with category applicability, typed value constraints,
   sort order, and indexes. Needed only for approved faceted attribute filters.
3. **Service operational claims** — bilingual turnaround/starting-price fields
   and validated benchmark structures, only after business approval of those
   claims.

## Valid empty states

The approved seed intentionally has no `ProductImage`, `Offer`, or
`HomepageBanner` records. Empty arrays are valid database output; adapters never
replace them with mock offers, synthetic assets, or invented promotional content.

## Frontend coordination

| Suggested Linear task | Affected frontend area | Required contract | Blocks read integration? |
| --- | --- | --- | --- |
| **LAP: Add server snapshot boundary for catalog** | `src/app/*`, `StoreContext.tsx`, catalog/storefront consumers | Accept an optional, serializable product/taxonomy/settings snapshot while retaining mock/localStorage fallback. | Yes, for live storefront reads. |
| **LAP: Define image/presentation fallback policy** | `ProductVisual`, product/category cards, Admin image fields | Decide how empty DB image arrays and frontend sprite keys coexist; do not treat mock assets as authoritative DB media. | Yes, for media-backed catalog display. |
| **LAP: Align Admin customer-request statuses** | `src/types/store.ts`, `AdminDashboard`, `adminQueryContract.ts` | Support all five backend statuses and string SYP snapshots in authenticated Admin views. | No, until Admin request reads are enabled. |
| **LAP: Decide managed brand and attribute requirements** | Admin taxonomy/product editors, filters | Approve or reject the proposed schema extensions before any editable country/featured/attribute filter work. | No, for basic catalog reads. |
| **LAP: Define banner and service presentation ownership** | Banner manager, services UI | Keep decorative fields frontend-owned or approve specific business fields before persistence. | No, until banner/service management is enabled. |
