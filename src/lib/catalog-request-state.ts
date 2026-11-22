/**
 * A catalog response is only safe to render when it still belongs to the most
 * recent request and its request has not been cancelled. Keeping this small
 * rule outside the component makes overlapping-request behaviour testable.
 */
export function canApplyCatalogResponse(
  requestSequence: number,
  activeSequence: number,
  aborted: boolean,
): boolean {
  return !aborted && requestSequence === activeSequence;
}
