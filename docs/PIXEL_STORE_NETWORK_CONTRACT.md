# Pixel Store Storefront JSON Contract

The storefront remains an App Router application. Its first HTML render and the
root server initialization use server-only Prisma queries. Those database calls
do not appear as individual browser requests. React Flight/RSC requests remain
normal Next.js routing internals and are not replaced by these APIs.

## `GET /api/catalog`

This is the readable public catalog contract used after an interactive catalog
filter or page change. It has no credentials and returns only active public
product DTOs.

Supported query parameters are `page`, `limit`, `q`, `category`,
`subcategory`, `useCase`, repeated `brand`, repeated `condition`, repeated
`availability`, `minPriceUsd`, `maxPriceUsd`, `bestSeller=1`,
`newArrival=1`, and `sort` (`featured`, `price-asc`, `price-desc`, or
`newest`). Values are normalized server-side.

```json
{
  "requestId": "uuid",
  "data": {
    "items": [{ "id": "uuid", "sku": "PXL-…", "priceUsd": 1490 }],
    "pagination": { "page": 1, "limit": 20, "total": 24, "totalPages": 2 }
  }
}
```

Failures return a request ID and a stable error envelope, for example:

```json
{
  "requestId": "uuid",
  "error": { "code": "CATALOG_UNAVAILABLE", "message": "Catalog data is temporarily unavailable." }
}
```

The same request ID is also sent in `x-request-id`.

## `POST /api/customer-interest`

The request modal sends this JSON body:

```json
{
  "productId": "uuid",
  "customerName": "Customer name",
  "customerPhone": "+963…",
  "note": "Optional note"
}
```

The server validates the input, reads the active product, active offer, and
current exchange rate, and writes only the authoritative customer-request
snapshots. Browser-provided price values are never accepted.

Successful submission returns HTTP `201`:

```json
{ "requestId": "uuid", "data": { "status": "success" } }
```

Expected errors are `400 VALIDATION_ERROR`, `404 PRODUCT_UNAVAILABLE`, `409
DUPLICATE_REQUEST`, and `503 REQUEST_UNAVAILABLE`. Responses never echo the
submitted phone, note, or stored customer record.

## UI behavior

The initial catalog is part of the SSR payload. No fetch is made merely to
create a Network entry. On real-data mode, changing a catalog filter or page
uses `GET /api/catalog`; the request is visible as Fetch/XHR. Filter state is
written to the catalog URL with the native History API, which Next.js supports
without an unnecessary RSC navigation for filter-only changes.

Product detail pages continue to use the existing server-rendered data flow;
there is intentionally no redundant public product-detail API yet.

Before deployment, verify Vercel's generated function count from the actual
build output. Route source-file count is not the same as bundled Vercel Hobby
function count.
