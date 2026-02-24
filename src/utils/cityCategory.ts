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

export const MIN_GYMS_FOR_INDEXABLE_COMBO = 2;
export const MIN_GYMS_FOR_INDEXABLE_CITY_HUB = 2;
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
      name: 'Best for Beginners',
      description: 'Welcoming gyms with intro classes and supportive settings.',
      color: '#00e676',
    },
    {
      slug: 'best-bouldering-climbing-gyms',
      type: 'special',
      value: 'bouldering',
      name: 'Best Bouldering Gyms',
      description: 'Top facilities focused on bouldering programs and terrain.',
      color: '#ff2d7a',
    },
    {
      slug: 'climbing-gyms-with-sauna',
      type: 'special',
      value: 'sauna',
      name: 'Gyms with Sauna',
      description: 'Recovery-focused gyms that include sauna amenities.',
      color: '#2979ff',
    },
    {
      slug: 'climbing-gyms-with-kids-zone',
      type: 'special',
      value: 'kids_zone',
      name: 'Gyms with Kids Zone',
      description: 'Family-friendly gyms with dedicated kids areas.',
      color: '#ffea00',
    },
    {
      slug: 'affordable-climbing-gyms',
      type: 'special',
      value: 'affordable',
      name: 'Affordable Gyms',
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
      name: `Gyms with ${formatToken(amenity)}`,
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
      name: `Best ${formatToken(climbingType)} Gyms`,
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
