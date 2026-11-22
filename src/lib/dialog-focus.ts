export function shouldCloseDialogForKey(key: string): boolean {
  return key === 'Escape';
}

/**
 * Returns the next focusable index only when Tab would leave a dialog.
 * A null result means the browser can continue its normal in-dialog tabbing.
 */
export function getDialogTabTargetIndex(
  focusableCount: number,
  activeIndex: number,
  shiftKey: boolean,
): number | null {
  if (focusableCount === 0) return null;
  if (shiftKey) return activeIndex <= 0 ? focusableCount - 1 : null;
  return activeIndex < 0 || activeIndex === focusableCount - 1 ? 0 : null;
}
