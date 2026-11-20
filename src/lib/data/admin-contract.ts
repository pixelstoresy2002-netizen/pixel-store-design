/**
 * This contract deliberately has no query function. Future callers must obtain
 * records through an authenticated, server-only Admin boundary before mapping.
 */
export type BackendCustomerRequestStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CustomerRequestRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  note: string | null;
  adminNotes: string | null;
  productId: string | null;
  productNameArSnapshot: string;
  productNameEnSnapshot: string;
  productSkuSnapshot: string;
  usdPriceCentsSnapshot: number;
  usdRateSnapshot: number;
  sypPriceSnapshot: bigint;
  status: BackendCustomerRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

/** Serializable, lossless request data for a future authenticated Admin view. */
export interface AdminCustomerRequestDTO {
  id: string;
  customerName: string;
  customerPhone: string;
  note: string | null;
  adminNotes: string | null;
  productId: string | null;
  productName: { ar: string; en: string };
  productSku: string;
  usdPriceCentsSnapshot: number;
  usdRateSnapshot: number;
  sypPriceSnapshot: string;
  status: BackendCustomerRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export function mapCustomerRequestForAdmin(
  record: CustomerRequestRecord,
): AdminCustomerRequestDTO {
  return {
    id: record.id,
    customerName: record.customerName,
    customerPhone: record.customerPhone,
    note: record.note,
    adminNotes: record.adminNotes,
    productId: record.productId,
    productName: {
      ar: record.productNameArSnapshot,
      en: record.productNameEnSnapshot,
    },
    productSku: record.productSkuSnapshot,
    usdPriceCentsSnapshot: record.usdPriceCentsSnapshot,
    usdRateSnapshot: record.usdRateSnapshot,
    sypPriceSnapshot: record.sypPriceSnapshot.toString(),
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
