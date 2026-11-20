function assertSafeInteger(value: number, label: string) {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${label} must be a safe integer.`);
  }
}

/**
 * Converts authoritative USD cents with an integer SYP rate, rounding half up
 * without passing a monetary value through JavaScript floating point.
 */
export function convertUsdCentsToSyp(
  priceUsdCents: number,
  usdToSypRate: number,
) {
  assertSafeInteger(priceUsdCents, 'USD cents');
  assertSafeInteger(usdToSypRate, 'USD to SYP rate');
  if (priceUsdCents < 0 || usdToSypRate < 0) {
    throw new Error('Currency values cannot be negative.');
  }

  const numerator = BigInt(priceUsdCents) * BigInt(usdToSypRate);
  return (numerator + 50n) / 100n;
}

export function usdCentsToDisplay(priceUsdCents: number) {
  assertSafeInteger(priceUsdCents, 'USD cents');
  return priceUsdCents / 100;
}
