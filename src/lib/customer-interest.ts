import 'server-only';

import { z } from 'zod';

import { convertUsdCentsToSyp } from '@/lib/data/money';

const DUPLICATE_WINDOW_MS = 45_000;

export const customerInterestInputSchema = z.object({
  productId: z.uuid(),
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z
    .string()
    .trim()
    .min(7)
    .max(32)
    .regex(/^[0-9+\s().-]+$/u)
    .refine((value) => {
      const digits = value.replace(/\D/g, '');
      const plusCount = (value.match(/\+/gu) ?? []).length;
      return digits.length >= 7 && /[1-9]/u.test(digits) && plusCount <= 1 &&
        (plusCount === 0 || value.startsWith('+'));
    })
    .transform((value) => {
      const digits = value.replace(/\D/g, '');
      return value.startsWith('+') ? `+${digits}` : digits;
    }),
  note: z.string().trim().max(1000).transform((value) => value || undefined),
});

export type CustomerInterestInput = z.input<typeof customerInterestInputSchema>;
export type CustomerInterestResult =
  | { status: 'success' }
  | { status: 'validation-error' }
  | { status: 'unavailable' }
  | { status: 'duplicate' }
  | { status: 'error' };

export async function submitCustomerInterest(input: CustomerInterestInput): Promise<CustomerInterestResult> {
  const parsed = customerInterestInputSchema.safeParse(input);
  if (!parsed.success) return { status: 'validation-error' };

  try {
    const { prisma } = await import('@/lib/prisma');
    const result = await prisma.$transaction(async (transaction) => {
      const product = await transaction.product.findFirst({
        where: { id: parsed.data.productId, isActive: true },
        select: { id: true, sku: true, nameAr: true, nameEn: true, priceUsdCents: true },
      });
      if (!product) return { kind: 'unavailable' as const };

      const settings = await transaction.siteSettings.findFirst({
        orderBy: { createdAt: 'asc' },
        select: { usdToSypRate: true },
      });
      if (!settings || product.priceUsdCents < 0 || settings.usdToSypRate <= 0) {
        return { kind: 'error' as const };
      }

      const duplicate = await transaction.customerRequest.findFirst({
        where: {
          productId: product.id,
          customerPhone: parsed.data.customerPhone,
          createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
        },
        select: { id: true },
      });
      if (duplicate) return { kind: 'duplicate' as const };

      const activeOffer = await transaction.offer.findFirst({
        where: {
          productId: product.id,
          isEnabled: true,
          startsAt: { lte: new Date() },
          endsAt: { gt: new Date() },
          priceUsdCents: { lt: product.priceUsdCents },
        },
        orderBy: [{ priceUsdCents: 'asc' }, { startsAt: 'desc' }],
        select: { priceUsdCents: true },
      });
      const usdPriceCents = activeOffer?.priceUsdCents ?? product.priceUsdCents;

      await transaction.customerRequest.create({
        data: {
          customerName: parsed.data.customerName,
          customerPhone: parsed.data.customerPhone,
          note: parsed.data.note,
          productId: product.id,
          productNameArSnapshot: product.nameAr,
          productNameEnSnapshot: product.nameEn,
          productSkuSnapshot: product.sku,
          usdPriceCentsSnapshot: usdPriceCents,
          usdRateSnapshot: settings.usdToSypRate,
          sypPriceSnapshot: convertUsdCentsToSyp(usdPriceCents, settings.usdToSypRate),
          status: 'NEW',
        },
      });
      return { kind: 'success' as const };
    });

    return result.kind === 'success' ? { status: 'success' } : { status: result.kind };
  } catch {
    return { status: 'error' };
  }
}
