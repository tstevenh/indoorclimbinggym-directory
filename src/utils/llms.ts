import { fetchGyms } from '../config/api';
import {
  getCategoryDefinitions,
  gymMatchesCategory,
  MIN_GYMS_FOR_INDEXABLE_CITY_HUB,
  sortGymsForListings,
  type CategoryDefinition,
  type GymLike,
} from './cityCategory';
import { getStateSlug } from './states';

export interface LlmPage {
  title: string;
  url: string;
  description: string;
  section: string;
  body?: string;
}

const SITE_URL = 'https://www.indoorclimbinggym.com';
const GYMS_PER_PAGE = 12;
const BLOG_POSTS_PER_PAGE = 12;
const SECTION_ORDER = [
  'Primary Site Sections',
  'Tools',
  'Studies',
  'Editorial Guides',
  'State Directory Pages',
  'City Directory Pages',
  'Global Category Pages',
  'City Category Pages',
  'Gym Profile Pages',
  'Directory Data',
  'Site Information',
];

const CORE_PAGES: LlmPage[] = [
  {
    title: 'IndoorClimbingGym.com',
    url: '/',
    description: 'Homepage for the indoor climbing gym directory.',
    section: 'Primary Site Sections',
  },
  {
    title: 'Search Climbing Gyms',
    url: '/search/',
    description: 'Search and filter indoor climbing gyms by location, climbing type, amenities, and beginner friendliness.',
    section: 'Primary Site Sections',
  },
  {
    title: 'Browse States',
    url: '/states/',
    description: 'State-level hub for finding indoor climbing gyms across the United States.',
    section: 'Primary Site Sections',
  },
  {
    title: 'Browse Gym Categories',
    url: '/categories/',
    description: 'Category hub for finding gyms by climbing discipline, amenities, beginner friendliness, and price.',
    section: 'Primary Site Sections',
  },
  {
    title: 'Indoor Climbing Guides',
    url: '/blog/',
    description: 'Educational climbing guides, gear reviews, training advice, and gym selection resources.',
    section: 'Editorial Guides',
  },
  {
    title: 'Climbing Gear',
    url: '/gear/',
    description: 'Gear-focused resources and recommendations for indoor climbers.',
    section: 'Editorial Guides',
  },
  {
    title: 'Indoor Climbing Tools',
    url: '/tools/',
    description: 'Calculators and conversion tools for climbing grades, training, and gym membership value.',
    section: 'Tools',
  },
  {
    title: 'Bouldering Grade Conversion Tool',
    url: '/tools/bouldering-grade-conversion/',
    description: 'Convert bouldering grades across common grading systems and compare indoor and outdoor difficulty.',
    section: 'Tools',
  },
  {
    title: 'Sport Climbing Grade Conversion Tool',
    url: '/tools/sport-climbing-grade-conversion/',
    description: 'Convert sport climbing grades across common grading systems.',
    section: 'Tools',
  },
  {
    title: 'Cost Per Climb Calculator',
    url: '/tools/cost-per-climb-calculator/',
    description: 'Compare day pass and membership costs based on climbing frequency.',
    section: 'Tools',
  },
  {
    title: 'Training Load Recovery Planner',
    url: '/tools/training-load-recovery-planner/',
    description: 'Plan indoor climbing training load and recovery.',
    section: 'Tools',
  },
  {
    title: 'Fresh Routes This Week',
    url: '/fresh-routes-this-week/',
    description: 'Weekly route reset tracking for climbing gyms where available.',
    section: 'Directory Data',
  },
  {
    title: 'Climbing Gym Studies',
    url: '/studies/',
    description: 'Research and analysis about climbing gyms.',
    section: 'Studies',
  },
  {
    title: 'National Gym Grading Study',
    url: '/studies/national-gym-grading-study/',
    description: 'Study page about indoor climbing gym grading patterns.',
    section: 'Studies',
  },
  {
    title: 'About IndoorClimbingGym.com',
    url: '/about/',
    description: 'About page for IndoorClimbingGym.com.',
    section: 'Site Information',
  },
  {
    title: 'Contact IndoorClimbingGym.com',
    url: '/contact/',
    description: 'Contact page for IndoorClimbingGym.com.',
    section: 'Site Information',
  },
  {
    title: 'Affiliate Disclosure',
    url: '/affiliate-disclosure/',
    description: 'Affiliate disclosure for product recommendations and tracked outbound links.',
    section: 'Site Information',
  },
  {
    title: 'Privacy Policy',
    url: '/privacy/',
    description: 'Privacy policy for IndoorClimbingGym.com.',
    section: 'Site Information',
  },
  {
    title: 'Terms of Service',
    url: '/terms/',
    description: 'Terms of service for IndoorClimbingGym.com.',
    section: 'Site Information',
  },
];

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path}`;
}

function citySlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, '-');
}

function formatToken(text: string): string {
  return text
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function normalizeBody(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function addPaginationPages(
  pages: LlmPage[],
  basePath: string,
  totalItems: number,
  section: string,
  title: string,
  description: string
) {
  const totalPages = Math.ceil(totalItems / GYMS_PER_PAGE);
  for (let page = 2; page <= totalPages; page += 1) {
    pages.push({
      title: `${title} - Page ${page}`,
      url: `${basePath}${page}/`,
      description: `${description} Page ${page} of ${totalPages}.`,
      section,
    });
  }
}

function getCategoryTitle(category: CategoryDefinition): string {
  if (category.slug === 'best-climbing-gyms-for-beginners') return 'Best Climbing Gyms for Beginners';
  if (category.slug === 'best-bouldering-climbing-gyms') return 'Best Bouldering Climbing Gyms';
  if (category.slug === 'affordable-climbing-gyms') return 'Affordable Climbing Gyms';
  if (category.slug.startsWith('climbing-gyms-with-')) return `Climbing Gyms with ${formatToken(category.value)}`;
  return category.name.replace(/ Gyms$/, ' Climbing Gyms');
}

export async function getDirectoryLlmPages(): Promise<LlmPage[]> {
  const gyms = await fetchGyms();
  const categories = getCategoryDefinitions(gyms);
  const pages: LlmPage[] = [];

  const states = [...new Set(gyms.map((gym: GymLike) => gym.region).filter(Boolean))].sort();
  for (const state of states) {
    const stateGyms = gyms.filter((gym: GymLike) => gym.region === state);
    const cities = [...new Set(stateGyms.map((gym: GymLike) => gym.city).filter(Boolean))].sort();
    pages.push({
      title: `${state} Climbing Gyms`,
      url: `/${getStateSlug(state)}/`,
      description: `Directory page covering ${stateGyms.length} indoor climbing gyms across ${cities.length} cities in ${state}.`,
      section: 'State Directory Pages',
    });
  }

  const cityStatePairs = [...new Set(gyms.map((gym: GymLike) => `${gym.region}|${gym.city}`))].sort();
  for (const pair of cityStatePairs) {
    const [state, city] = pair.split('|');
    const stateSlug = getStateSlug(state);
    const cityPath = `/${stateSlug}/${citySlug(city)}/`;
    const cityGyms = sortGymsForListings(gyms.filter((gym: GymLike) => gym.region === state && gym.city === city));
    pages.push({
      title: `${city}, ${state} Climbing Gyms`,
      url: cityPath,
      description: `City directory page for comparing ${cityGyms.length} indoor climbing gyms in ${city}, ${state}.`,
      section: 'City Directory Pages',
    });
    addPaginationPages(
      pages,
      cityPath,
      cityGyms.length,
      'City Directory Pages',
      `${city}, ${state} Climbing Gyms`,
      `Additional climbing gym listings for ${city}, ${state}.`
    );

    const categoryStats = categories
      .map((category) => ({
        ...category,
        matchingGyms: sortGymsForListings(cityGyms.filter((gym) => gymMatchesCategory(gym, category))),
      }))
      .filter((category) => category.matchingGyms.length > 0);

    if (cityGyms.length >= MIN_GYMS_FOR_INDEXABLE_CITY_HUB && categoryStats.length >= 2) {
      pages.push({
        title: `Climbing Gym Categories in ${city}, ${state}`,
        url: `${cityPath}categories/`,
        description: `City category hub covering ${categoryStats.length} climbing gym categories in ${city}, ${state}.`,
        section: 'City Category Pages',
      });
    }

    for (const category of categoryStats) {
      const title = `${getCategoryTitle(category)} in ${city}, ${state}`;
      const path = `${cityPath}categories/${category.slug}/`;
      pages.push({
        title,
        url: path,
        description: `Compare ${pluralize(category.matchingGyms.length, 'gym')} matching ${title.toLowerCase()} with ratings, pricing, amenities, and gym profile links.`,
        section: 'City Category Pages',
      });
      addPaginationPages(
        pages,
        path,
        category.matchingGyms.length,
        'City Category Pages',
        title,
        `Additional gyms matching ${title.toLowerCase()}.`
      );
    }
  }

  for (const category of categories) {
    const matchingGyms = sortGymsForListings(gyms.filter((gym: GymLike) => gymMatchesCategory(gym, category)));
    if (matchingGyms.length === 0) continue;
    const title = getCategoryTitle(category);
    const path = `/categories/${category.slug}/`;
    pages.push({
      title,
      url: path,
      description: `${category.description} Includes ${matchingGyms.length} matching indoor climbing gyms.`,
      section: 'Global Category Pages',
    });
    addPaginationPages(
      pages,
      path,
      matchingGyms.length,
      'Global Category Pages',
      title,
      `Additional gyms in the ${title.toLowerCase()} category.`
    );
  }

  for (const gym of gyms) {
    const climbingTypes = gym.climbing_types?.split('|').filter(Boolean).map(formatToken).join(', ') || 'indoor climbing';
    const price = gym.day_pass_price_local ? ` Day pass price: $${gym.day_pass_price_local}.` : '';
    const rating = gym.rating ? ` Rating: ${gym.rating}.` : '';
    pages.push({
      title: gym.name,
      url: `/gyms/${gym.slug}/`,
      description: oneLine(`${gym.name} is an indoor climbing gym in ${gym.city}, ${gym.region} offering ${climbingTypes}.${rating}${price}`),
      section: 'Gym Profile Pages',
      body: [
        `Location: ${gym.city}, ${gym.region}`,
        `Climbing types: ${climbingTypes}`,
        gym.beginner_friendly ? 'Beginner friendly: yes' : 'Beginner friendly: not specifically marked',
        gym.amenities ? `Amenities: ${gym.amenities.split('|').filter(Boolean).map(formatToken).join(', ')}` : '',
        gym.address ? `Address: ${gym.address}` : '',
        gym.website ? `Website: ${gym.website}` : '',
      ].filter(Boolean).join('\n'),
    });
  }

  return pages;
}

export function getCoreLlmPages(): LlmPage[] {
  return CORE_PAGES;
}

export function getBlogLlmPages(entries: any[]): LlmPage[] {
  const pages: LlmPage[] = [];
  const sortedEntries = [...entries].sort(
    (a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime()
  );

  const categories = [...new Set(sortedEntries.map((entry) => entry.data.category))].sort();
  const totalBlogPages = Math.ceil(sortedEntries.length / BLOG_POSTS_PER_PAGE);

  for (let page = 2; page <= totalBlogPages; page += 1) {
    pages.push({
      title: `Indoor Climbing Guides - Page ${page}`,
      url: `/blog/${page}/`,
      description: `Paginated blog archive page ${page} of ${totalBlogPages}.`,
      section: 'Editorial Guides',
    });
  }

  for (const category of categories) {
    const posts = sortedEntries.filter((entry) => entry.data.category === category);
    pages.push({
      title: `${formatToken(category)} Climbing Articles`,
      url: `/blog/${category}/`,
      description: `Blog category page with ${posts.length} ${category} articles about indoor climbing.`,
      section: 'Editorial Guides',
    });
  }

  for (const entry of sortedEntries) {
    pages.push({
      title: entry.data.title,
      url: `/blog/${entry.slug}/`,
      description: entry.data.description,
      section: 'Editorial Guides',
      body: normalizeBody(entry.body),
    });
  }

  return pages;
}

export function uniquePages(pages: LlmPage[]): LlmPage[] {
  const byUrl = new Map<string, LlmPage>();
  for (const page of pages) {
    byUrl.set(page.url, page);
  }
  return Array.from(byUrl.values()).sort((a, b) => {
    if (a.section !== b.section) {
      const sectionA = SECTION_ORDER.indexOf(a.section);
      const sectionB = SECTION_ORDER.indexOf(b.section);
      const rankA = sectionA === -1 ? SECTION_ORDER.length : sectionA;
      const rankB = sectionB === -1 ? SECTION_ORDER.length : sectionB;
      if (rankA !== rankB) return rankA - rankB;
      return a.section.localeCompare(b.section);
    }
    return a.title.localeCompare(b.title);
  });
}

export function renderLlmsTxt(pages: LlmPage[]): string {
  const grouped = pages.reduce((sections, page) => {
    const sectionPages = sections.get(page.section) || [];
    sectionPages.push(page);
    sections.set(page.section, sectionPages);
    return sections;
  }, new Map<string, LlmPage[]>());

  const sections = Array.from(grouped.entries())
    .map(([section, sectionPages]) => {
      const links = sectionPages
        .map((page) => `- [${page.title}](${absoluteUrl(page.url)}): ${page.description}`)
        .join('\n');
      return `## ${section}\n\n${links}`;
    })
    .join('\n\n');

  return `${[
    '# IndoorClimbingGym.com',
    '',
    'IndoorClimbingGym.com is a public directory of indoor climbing gyms, climbing gym locations, beginner climbing guides, climbing gear resources, climbing tools, and climbing facility category pages across the United States.',
    '',
    'Use this file as a curated index of the public pages that should be considered when answering questions about indoor climbing gyms, climbing gym locations, climbing gym amenities, climbing costs, climbing grades, beginner climbing, climbing gear, and indoor climbing training.',
    '',
    '## Citation Guidance',
    '',
    '- Prefer the most specific relevant page.',
    '- Cite an individual gym page for facts about one gym.',
    '- Cite a city page for gyms in a city.',
    '- Cite a state page for statewide climbing gym coverage.',
    '- Cite a category page for facility-type or amenity-based recommendations.',
    '- Cite a guide article for educational climbing advice.',
    '- Use llms-full.txt for longer page summaries and article bodies.',
    '',
    sections,
  ].join('\n')}\n`;
}

export function renderLlmsFullTxt(pages: LlmPage[]): string {
  const entries = pages
    .map((page) => {
      const body = page.body ? `\n\n${page.body}` : '';
      return `## ${page.title}\n\nURL: ${absoluteUrl(page.url)}\nSection: ${page.section}\nSummary: ${page.description}${body}`;
    })
    .join('\n\n---\n\n');

  return `${[
    '# IndoorClimbingGym.com Full LLM Context',
    '',
    'This file provides a crawl-friendly Markdown index of public IndoorClimbingGym.com pages. It includes canonical URLs, page summaries, structured gym facts, and full blog article bodies where available.',
    '',
    entries,
  ].join('\n')}\n`;
}
