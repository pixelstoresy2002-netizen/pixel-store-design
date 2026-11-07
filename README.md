# Pixel Store (بِكسل ستور) — Next.js 16 Storefront & Demo Admin Prototype

Bilingual (Arabic RTL default / English LTR) electronics, custom PC builds, laptops, gaming peripherals, and thermal cooling services storefront and administration prototype built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

This project runs 100% locally with zero external cloud services, API keys, or third-party credentials required.

---

## 1. System Requirements (Windows 11 / macOS / Linux)

- **Operating System:** Windows 11 (64-bit), macOS, or Linux
- **Node.js:** **v22.x LTS** (Recommended) or **v20.9.0+**
  *(Note: Running `npm test` uses Node's built-in TypeScript test runner `--experimental-strip-types`, which requires Node.js `v22.6.0+`.)*
- **npm:** `v10.0.0` or newer (installed automatically with Node.js)

Verify your installed versions in **PowerShell** or **Command Prompt**:

```powershell
node -v
npm -v
```

---

## 2. Clean Installation on Windows 11

1. Extract `pixel-store-nextjs-local-final.zip` to a local folder (for example, `C:\Projects\pixel-store-nextjs`).
2. Open **Windows Terminal** or **PowerShell** in the project directory:

```powershell
cd C:\Projects\pixel-store-nextjs
```

3. Install dependencies deterministically from `package-lock.json` using `npm ci`:

```powershell
npm ci
```

*(No `--force` or `--legacy-peer-deps` flags are required. You can also use `npm install`.)*

---

## 3. Starting Development & Opening the Application

Start the local Next.js development server:

```powershell
npm run dev
```

Once started, open your browser to:

- **Public Storefront:** [http://localhost:3000](http://localhost:3000)
- **Demo Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 4. Verification, Testing & Production Build Commands

Run any of the following verification scripts from the project root:

```powershell
# 1. Static TypeScript verification
npm run typecheck

# 2. ESLint code quality check
npm run lint

# 3. Unit test suite (pricing, USD/SYP conversion, timed offers, request validation, contact channel verification)
npm test

# 4. Production build
npm run build

# 5. Start the compiled production server on http://localhost:3000
npm run start
```

---

## 5. Application Routes (Next.js App Router)

| Route | Description |
| :--- | :--- |
| `/` | Homepage (5-slide crossfade hero carousel, visual category shortcuts, spotlight timed offers, best sellers, new arrivals, services preview) |
| `/catalog` | Full product catalog with 5-column desktop grid, search, sorting, pagination, and multi-facet filtering |
| `/category/[categoryId]` | Category view (`laptops`, `pc-builds`, `pc-components`, `accessories`, `audio`) |
| `/category/[categoryId]/[subcategoryId]` | Subcategory view (`new-laptops`, `used-laptops`, `graphics-cards`, `keyboards`, `mice`, etc.) |
| `/products/[productId]` | Product details page (`NEW` and `USED` hardware, interactive image gallery & zoom, and product inquiry modal) |
| `/offers` | Exclusive timed offers listing with live countdown badges |
| `/services` | Technical maintenance & specialized thermal cooling solutions (`/services?service=service-cooling`) |
| `/contact` | Store contact channels, working hours, and showroom location |
| `/admin` | Direct-URL Demo Admin Dashboard (Overview, Products CRUD, Categories, Use-Case Tags, Timed Offers, Services, Customer Requests, Store Settings & USD/SYP exchange rate) |

---

## 6. Admin Prototype & Demo Data Safety Notice

- **Demo-Only Administration (`/admin`):** Public links to `/admin` have been removed from the storefront UI so customers only see retail pages, while developers and reviewers can open `http://localhost:3000/admin` directly.
- **No Production Authentication:** Hiding navigation links is **not** security or authentication. The `/admin` route in this prototype is intentionally unauthenticated for local inspection and client preview.
- **Before Production Deployment:** Before deploying to a public production server, `/admin` and all mutation actions must be protected behind real server-side authentication, session management, role-based access control (RBAC), and a persistent database backend.
- **Separation of Mock Data & Future Backend:** All initial catalog items, offers, services, and placeholder contact settings live in `src/data/mockStoreData.ts`, and interactive edits or customer product inquiries made during preview are persisted locally in browser `localStorage` via `src/context/StoreContext.tsx`. Unverified placeholder contact details (`+963 9XX XXX XXX`, sample social handles) are rendered in a disabled, non-clickable state until replaced with real values in **Admin → Store Settings**.

---

## 7. Windows 11 Troubleshooting Guide

### Port 3000 is Already in Use (`EADDRINUSE`)
If another process is using port `3000`, either run Next.js on a different port:
```powershell
npx next dev -p 3001
```
Or find and stop the process using port `3000` in PowerShell:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### PowerShell Script Execution Policy (`npm.ps1 cannot be loaded`)
If Windows PowerShell blocks `npm` scripts on a fresh machine, run this once in PowerShell:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Stale Build or Browser Cache
If you want to reset build caches or clear demo edits saved in the browser:
1. Delete the `.next` folder and rebuild:
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run build
   ```
2. To reset browser `localStorage` edits back to the initial mock dataset, open Browser DevTools (`F12`) → **Application** → **Local Storage** → `http://localhost:3000` → **Clear All**, then refresh the page.
