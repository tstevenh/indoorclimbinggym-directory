/**
 * Shared helpers so missing / zero data is never rendered as a fact.
 * Rules: in prose, FAQ, meta and JSON-LD omit the clause when a value is
 * missing (helpers return null); in visible tables use NOT_LISTED.
 */

export const NOT_LISTED = 'Not listed';

/** True for a finite number > 0 (0 / null / NaN / '' mean "not provided"). */
export function hasValue(n: unknown): n is number {
  const v = typeof n === 'string' ? Number(n) : n;
  return typeof v === 'number' && Number.isFinite(v) && v > 0;
}

/** "$25" (currency defaults to USD symbol), or null when missing. */
export function formatPrice(n: unknown, symbol = '$'): string | null {
  if (!hasValue(n)) return null;
  const v = Number(n);
  return `${symbol}${Number.isInteger(v) ? v : v.toFixed(2)}`;
}

export interface PriceStats {
  min: number;
  max: number;
  avg: number;
  count: number;
}

/**
 * min/max/avg over gyms with a real (>0) price only.
 * Returns null when fewer than `minCount` gyms have a price (default 2,
 * i.e. a "range"/"average" needs at least two data points; pass 1 for
 * single-value statements such as "cheapest day pass is $X").
 */
export function priceStats(
  gyms: Array<{ day_pass_price_local?: unknown }>,
  minCount = 2,
  field: 'day_pass_price_local' | 'membership_from_local' = 'day_pass_price_local'
): PriceStats | null {
  const prices = gyms
    .map((g) => Number((g as any)[field]))
    .filter((p) => hasValue(p));
  if (prices.length < Math.max(1, minCount)) return null;
  const sum = prices.reduce((a, b) => a + b, 0);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: Math.round(sum / prices.length),
    count: prices.length,
  };
}

/** Joins non-empty items ("a, b"), or null for an empty list. */
export function joinList(items: Array<string | null | undefined> | null | undefined, sep = ', '): string | null {
  const clean = (items || []).map((i) => (i ?? '').toString().trim()).filter(Boolean);
  return clean.length ? clean.join(sep) : null;
}

/** Rating formatted to 1 decimal, or null when 0/missing ("not rated"). */
export function formatRating(n: unknown): string | null {
  // Round half up with an epsilon so 4.55 -> "4.6" everywhere (toFixed gives 4.5/4.6 inconsistently).
  return hasValue(n) ? (Math.round(Number(n) * 10 + 1e-9) / 10).toFixed(1) : null;
}

export interface DisplayRating {
  text: string;
  value: number;
  source: 'editorial' | 'google';
}

/**
 * The one rating a listing shows for a gym: our editorial rating
 * (`rating_editorial`, from rating_overall / the 5 category ratings) when present,
 * otherwise the third-party Google rating (`google_rating`), flagged so the UI can label it.
 * Falls back to legacy `rating` (unlabelled-source data) as editorial if the new fields are absent.
 */
export function displayRating(gym: any): DisplayRating | null {
  const ed = formatRating(gym?.rating_editorial);
  if (ed) return { text: ed, value: Number(ed), source: 'editorial' };
  if (gym && gym.rating_editorial === undefined) {
    const legacy = formatRating(gym.rating);
    return legacy ? { text: legacy, value: Number(legacy), source: 'editorial' } : null;
  }
  const g = formatRating(gym?.google_rating);
  return g ? { text: g, value: Number(g), source: 'google' } : null;
}

/**
 * Removes sentences from DB-authored copy that state a star rating
 * (e.g. "With a perfect 5.0-star Google rating, ..."), since they can
 * contradict the single rating shown on the page.
 */
export function stripRatingClaims(text: unknown): string {
  if (typeof text !== 'string' || !text) return '';
  const claim = /(\d(\.\d+)?\s*[-\s]?(out of 5\s*)?(stars?|★)|\b(rated|rating of|rating)\s*(of\s*)?\d(\.\d)?|\d(\.\d)?\s*(\/\s*5|rating)|\b(star|google|community|average|user)\s+rating)/i;
  // Split before each sentence start, keeping the whitespace/newlines with the following sentence.
  return text
    .split(/(?<=[.!?])(?=\s+[A-Z"'])/)
    .filter((sentence) => !claim.test(sentence))
    .join('')
    .trim();
}
