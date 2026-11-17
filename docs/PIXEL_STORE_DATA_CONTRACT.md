# Pixel Store data contract

## Boundary

`src/lib/data/*-queries.ts` is server-only and is not imported by any route,
component, or `StoreContext`. `design-adapters.ts` is pure and converts query
records to the existing types in `src/types/store.ts`; it is safe to unit test
without Prisma or a database.

Phase 2 does not replace mock data. In the eventual read integration,
server-rendered route data should be passed to a narrowly scoped `StoreContext`
initialization boundary. Its current localStorage hydration remains the fallback
until each entity has an explicit migration plan.

## Query modules

- `catalog-queries.ts`: bounded, active product lists/detail; category hierarchy;
  brands; use-case tags. Product lists support normalized search, pagination,
  sorting, category/subcategory, brand, tag, stock, condition, and feature flags.
- `content-queries.ts`: bounded offers, banners, services/details, and the
  singleton site-settings read. Offer status filtering is calculated from the
  supplied server time and stored window/enabled fields.
- `query-inputs.ts`: shared allowlists, identifier cleanup, and pagination
  bounds (maximum 100 records per page).

Customer requests are intentionally absent from storefront query modules. Future
Admin reads must stay behind authenticated server-only authorization.

## Prisma-to-UI mapping

| Prisma model | Existing UI contract | Mapping |
| --- | --- | --- |
| Product | `Product` | cents become display USD; category parent/subcategory is derived; tags and image order are preserved. No image records produces an empty gallery and empty image strings. |
| Category / Brand / UseCaseTag | taxonomy contracts | Stable UI identifiers use database slugs, preserving current category filtering. |
| Offer | `Offer` | temporal state is derived: active, scheduled, disabled, or expired. No status is persisted. |
| HomepageBanner | `HeroSlide` / `PromoBanner` | split by `kind`; real image URL and destination labels are retained. Empty records remain empty arrays. |
| StoreService | `StoreService` | ordered image URLs are limited to five; structured highlights/workflow titles are validated defensively. |
| SiteSettings | `StoreSettings` | bilingual contact fields and integer exchange rate are mapped without deriving prices. |

## Explicit gaps

The design includes presentation-only fields not in the schema: category icons and
visual keys, brand country/featured state, tag accent/visual metadata, banner
kickers/theme/accent, and service badges/icons/turnaround guarantees. Adapters
use empty or documented neutral UI values rather than fabricate database facts.
A later approved presentation configuration may supply these separately.

The schema has a single `HomepageBanner` shape and no distinct offer badge field;
the adapter uses the verified offer title as the UI badge label. Unknown banner
destinations safely map to the home view because the current UI contract cannot
represent arbitrary external URLs.

`CustomerRequest.sypPriceSnapshot` is a `BigInt`; `serializeBigIntForClient`
must be used before any future server-to-client transfer.

## Empty states

The approved seed has no `ProductImage`, `Offer`, or `HomepageBanner` records.
Empty arrays are valid database output and are never replaced with mock offers,
fake records, or Cloudinary values. Services retain valid stored local image paths
when present.
