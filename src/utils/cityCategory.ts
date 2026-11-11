import cityCategoryKeep from '../data/cityCategoryKeep.json';
import { buildTitle, trimDescription, cityStateLabel, dedupeWords } from './seo';

export interface GymLike {
  id: string | number;
  name: string;
  slug: string;
  city: string;
  region: string;
  featured?: boolean;
  rating?: number;
  day_pass_price_local?: number | null;
  beginner_friendly?: boolean | null;
  amenities?: string | null;
  climbing_types?: string | null;
  [key: string]: any;
}

export type CategoryType = 'special' | 'amenity' | 'climbing_type';

export interface CategoryDefinition {
  slug: string;
  type: CategoryType;
  value: string;
  name: string;
  description: string;
  color: string;
}

const SKIP_DYNAMIC_AMENITIES = new Set(['sauna', 'kids_zone']);
const SKIP_DYNAMIC_CLIMBING_TYPES = new Set(['bouldering']);

/** Min matching gyms for a city x category page to be indexable (must also differ from the city page). */
export const MIN_GYMS_FOR_INDEXABLE_COMBO = 3;
/** Min matching gyms for a click-earning (keep-list) city x category page. */
export const MIN_GYMS_FOR_KEEPLIST_COMBO = 2;
/** Min indexable category pages a city needs for its categories hub to be indexable. */
export const MIN_INDEXABLE_CATEGORIES_FOR_HUB = 2;
export const MIN_GYMS_FOR_INDEXABLE_CITY_HUB = 2; // hub generation floor (indexability: MIN_INDEXABLE_CATEGORIES_FOR_HUB)
export const MIN_GYMS_FOR_PAGE_GENERATION = 1;

function normalizePipeValues(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasToken(value: string | null | undefined, token: string): boolean {
  return normalizePipeValues(value).includes(token);
}

function slugifyToken(text: string): string | null {
  if (!text || !text.trim()) return null;
  return text
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatToken(text: string): string {
  return text
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getCategoryDefinitions(allGyms: GymLike[]): CategoryDefinition[] {
  const staticCategories: CategoryDefinition[] = [
    {
      slug: 'best-climbing-gyms-for-beginners',
      type: 'special',
      value: 'beginners',
      name: 'Best Climbing Gyms for Beginners',
      description: 'Welcoming gyms with intro classes and supportive settings.',
      color: '#00e676',
    },
    {
      slug: 'best-bouldering-climbing-gyms',
      type: 'special',
      value: 'bouldering',
      name: 'Best Bouldering Climbing Gyms',
      description: 'Top facilities focused on bouldering programs and terrain.',
      color: '#ff2d7a',
    },
    {
      slug: 'climbing-gyms-with-sauna',
      type: 'special',
      value: 'sauna',
      name: 'Climbing Gyms with Sauna',
      description: 'Recovery-focused gyms that include sauna amenities.',
      color: '#2979ff',
    },
    {
      slug: 'climbing-gyms-with-kids-zone',
      type: 'special',
      value: 'kids_zone',
      name: 'Climbing Gyms with Kids Zone',
      description: 'Family-friendly gyms with dedicated kids areas.',
      color: '#ffea00',
    },
    {
      slug: 'affordable-climbing-gyms',
      type: 'special',
      value: 'affordable',
      name: 'Affordable Climbing Gyms',
      description: 'Budget-friendly day pass options for regular sessions.',
      color: '#ff9100',
    },
  ];

  const amenities = new Set<string>();
  const climbingTypes = new Set<string>();

  for (const gym of allGyms) {
    for (const amenity of normalizePipeValues(gym.amenities)) amenities.add(amenity);
    for (const type of normalizePipeValues(gym.climbing_types)) climbingTypes.add(type);
  }

  const dynamicCategories: CategoryDefinition[] = [];

  for (const amenity of amenities) {
    if (SKIP_DYNAMIC_AMENITIES.has(amenity)) continue;
    const globalCount = allGyms.filter((gym) => hasToken(gym.amenities, amenity)).length;
    if (globalCount < 3) continue;

    const amenitySlug = slugifyToken(amenity);
    if (!amenitySlug) continue;

    dynamicCategories.push({
      slug: `climbing-gyms-with-${amenitySlug}`,
      type: 'amenity',
      value: amenity,
      name: `Climbing Gyms with ${formatToken(amenity)}`,
      description: `Facilities offering ${formatToken(amenity).toLowerCase()} amenities.`,
      color: '#2979ff',
    });
  }

  for (const climbingType of climbingTypes) {
    if (SKIP_DYNAMIC_CLIMBING_TYPES.has(climbingType)) continue;
    const globalCount = allGyms.filter((gym) => hasToken(gym.climbing_types, climbingType)).length;
    if (globalCount < 3) continue;

    const typeSlug = slugifyToken(climbingType);
    if (!typeSlug) continue;

    dynamicCategories.push({
      slug: `best-${typeSlug}-climbing-gyms`,
      type: 'climbing_type',
      value: climbingType,
      name: `Best ${formatToken(climbingType)} Climbing Gyms`,
      description: `Top gyms for ${formatToken(climbingType).toLowerCase()} climbers.`,
      color: '#00e676',
    });
  }

  const uniqueBySlug = new Map<string, CategoryDefinition>();
  for (const category of [...staticCategories, ...dynamicCategories]) {
    uniqueBySlug.set(category.slug, category);
  }

  return Array.from(uniqueBySlug.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function gymMatchesCategory(gym: GymLike, category: CategoryDefinition): boolean {
  if (category.slug === 'best-bouldering-climbing-gyms') {
    return hasToken(gym.climbing_types, 'bouldering');
  }
  if (category.slug === 'best-climbing-gyms-for-beginners') {
    return gym.beginner_friendly === true;
  }
  if (category.slug === 'affordable-climbing-gyms') {
    const price = Number(gym.day_pass_price_local) || 0;
    return price > 0 && price <= 20;
  }
  if (category.slug === 'climbing-gyms-with-sauna') {
    return hasToken(gym.amenities, 'sauna');
  }
  if (category.slug === 'climbing-gyms-with-kids-zone') {
    return hasToken(gym.amenities, 'kids_zone');
  }

  if (category.type === 'amenity') {
    return hasToken(gym.amenities, category.value);
  }
  if (category.type === 'climbing_type') {
    return hasToken(gym.climbing_types, category.value);
  }

  return false;
}

export function sortGymsForListings(gyms: GymLike[]): GymLike[] {
  return [...gyms].sort((a, b) => {
    if (a.featured !== b.featured) return b.featured ? 1 : -1;
    const ratingA = Number(a.rating) || 0;
    const ratingB = Number(b.rating) || 0;
    if (ratingA !== ratingB) return ratingB - ratingA;
    return (a.name || '').localeCompare(b.name || '');
  });
}

const CITY_CATEGORY_KEEP = new Set<string>(cityCategoryKeep as string[]);

export function isKeepListed(path: string): boolean {
  return CITY_CATEGORY_KEEP.has(path);
}

/**
 * Single source of truth for city x category index gating.
 * `url` is the page path, e.g. /colorado/denver/categories/climbing-gyms-with-sauna/
 * Indexable if the matching set is a strict subset of the city set (differs from the city page) AND
 *  - >= 3 matching gyms, or
 *  - >= 2 matching gyms and the URL is on the click-earning keep-list.
 */
export function isIndexableCityCategory(cityGyms: GymLike[], matchingGyms: GymLike[], url: string): boolean {
  const cityIds = new Set(cityGyms.map((g) => String(g.id)));
  const strictSubset = matchingGyms.every((g) => cityIds.has(String(g.id))) && matchingGyms.length < cityIds.size;
  if (!strictSubset) return false;
  if (matchingGyms.length >= MIN_GYMS_FOR_INDEXABLE_COMBO) return true;
  return matchingGyms.length >= MIN_GYMS_FOR_KEEPLIST_COMBO && isKeepListed(url);
}

export function cityCategoryPath(stateSlug: string, citySlug: string, categorySlug: string): string {
  return `/${stateSlug}/${citySlug}/categories/${categorySlug}/`;
}

export function cityHubIndexable(indexableCategoryCount: number): boolean {
  return indexableCategoryCount >= MIN_INDEXABLE_CATEGORIES_FOR_HUB;
}

export interface CityCategoryIndexEntry {
  category: CategoryDefinition;
  path: string;
  matchingGyms: GymLike[];
  indexable: boolean;
  keepListed: boolean;
}

export interface CityIndexInfo {
  region: string;
  city: string;
  stateSlug: string;
  citySlug: string;
  cityGyms: GymLike[];
  entries: CityCategoryIndexEntry[]; // categories with >= 1 matching gym
  indexableCount: number;
  hubIndexable: boolean;
}

/** Computes index gating for every city x category page (page generation keeps all with >= 1 gym). */
export function computeCityCategoryIndex(
  gyms: GymLike[],
  categories: CategoryDefinition[],
  getStateSlug: (region: string) => string
): CityIndexInfo[] {
  const pairs = [...new Set(gyms.map((gym) => `${gym.region}|${gym.city}`))];
  return pairs.map((pair) => {
    const [region, city] = pair.split('|');
    const cityGyms = gyms.filter((gym) => gym.region === region && gym.city === city);
    const stateSlug = getStateSlug(region);
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    const entries: CityCategoryIndexEntry[] = [];
    for (const category of categories) {
      const matchingGyms = sortGymsForListings(cityGyms.filter((gym) => gymMatchesCategory(gym, category)));
      if (matchingGyms.length < MIN_GYMS_FOR_PAGE_GENERATION) continue;
      const path = cityCategoryPath(stateSlug, citySlug, category.slug);
      entries.push({
        category,
        path,
        matchingGyms,
        indexable: isIndexableCityCategory(cityGyms, matchingGyms, path),
        keepListed: isKeepListed(path),
      });
    }
    const indexableCount = entries.filter((e) => e.indexable).length;
    return { region, city, stateSlug, citySlug, cityGyms, entries, indexableCount, hubIndexable: cityHubIndexable(indexableCount) };
  });
}

/**
 * Noun phrase for a category, singular or plural, with no superlative:
 * "Climbing Gyms with Sauna" / "Climbing Gym with Sauna", "Bouldering Gyms", "Lead Climbing Gyms", ...
 */
export function categoryPhrase(category: CategoryDefinition, count = 2): string {
  const gym = count === 1 ? 'Gym' : 'Gyms';
  if (category.slug === 'best-climbing-gyms-for-beginners') return `Climbing ${gym} for Beginners`;
  if (category.slug === 'best-bouldering-climbing-gyms') return `Bouldering ${gym}`;
  if (category.slug === 'affordable-climbing-gyms') return `Affordable Climbing ${gym}`;
  if (category.type === 'amenity') return `Climbing ${gym} with ${formatToken(category.value)}`;
  if (category.type === 'climbing_type') return `${formatToken(category.value)} Climbing ${gym}`;
  return dedupeWords(category.name.replace(/^best\s+/i, ''));
}

export interface CityCategoryCopy {
  /** <title> text */
  title: string;
  /** H1 first line (uppercased by the template) */
  h1: string;
  /** H1 second line, e.g. "in Denver" */
  h1Sub: string;
  description: string;
  intro: string;
}

/** Count-aware title / H1 / description for a city x category page (n >= 1; n = 0 pages are not generated). */
export function cityCategoryCopy(category: CategoryDefinition, count: number, city: string, region: string, page = 1): CityCategoryCopy {
  const place = cityStateLabel(city, region);
  const phrase = categoryPhrase(category, count);
  const pageSuffix = page > 1 ? ` - Page ${page}` : '';
  const heading = count >= 2 ? `${count} Best ${phrase}` : phrase;
  const title = buildTitle([
    `${heading} in ${place}${pageSuffix}`,
    `${phrase} in ${place}${pageSuffix}`,
    `${phrase} in ${city}${pageSuffix}`,
  ]);
  let description: string;
  if (page > 1) {
    description = `Page ${page} of ${phrase.toLowerCase()} listings in ${place}.`;
  } else if (count === 1) {
    description = `The only ${phrase.toLowerCase()} option in ${place}. See ratings, pricing, amenities, and directions on its gym page.`;
  } else {
    description = `Compare ${count} ${phrase.toLowerCase()} in ${place}. Ratings, pricing, amenities, and direct gym pages in one place.`;
  }
  const intro = count === 1
    ? `Ratings, pricing, and amenities for the climbing gym in ${city} that matches.`
    : `Compare ratings, pricing, and amenities across ${count} matching gyms in ${city}.`;
  return {
    title,
    h1: count >= 2 ? `${count} Best ${phrase}` : phrase,
    h1Sub: `in ${city}${page > 1 ? ` (Page ${page})` : ''}`,
    description: trimDescription(description),
    intro,
  };
}
