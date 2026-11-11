/**
 * Redirect resolution for city x category URLs that are no longer generated.
 * Only runs from the SSR catch-all (src/pages/[state]/[city]/categories/[...rest].astro); on Vercel the
 * filesystem (prerendered pages) is matched before the render function, so built pages never reach this.
 * Pure and synchronous: no network calls.
 */
import { US_STATES } from './states';

export const VANISHED_RE = /^\/([a-z0-9-]+)\/([a-z0-9-]+)\/categories\/(?:[a-z0-9-]+\/)?$/;

const STATE_SLUGS = new Set(Object.keys(US_STATES).map((name) => name.replace(/\s+/g, '-')));

/** Returns the 301 target (/<state>/<city>/), or null (-> 404) for invalid state, bad shape or extra segments. */
export function resolveVanishedRedirect(pathname: string): string | null {
  const m = VANISHED_RE.exec(pathname);
  if (!m) return null;
  const [, state, city] = m;
  if (!STATE_SLUGS.has(state)) return null;
  return `/${state}/${city}/`;
}
