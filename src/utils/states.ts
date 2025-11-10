/**
 * Comprehensive US State Utilities
 * Handles state name/code mappings and URL slug generation
 */

// Complete US State Mapping (50 states + DC)
export const US_STATES: Record<string, string> = {
  // Full name (lowercase) to state code
  'alabama': 'AL',
  'alaska': 'AK',
  'arizona': 'AZ',
  'arkansas': 'AR',
  'california': 'CA',
  'colorado': 'CO',
  'connecticut': 'CT',
  'delaware': 'DE',
  'florida': 'FL',
  'georgia': 'GA',
  'hawaii': 'HI',
  'idaho': 'ID',
  'illinois': 'IL',
  'indiana': 'IN',
  'iowa': 'IA',
  'kansas': 'KS',
  'kentucky': 'KY',
  'louisiana': 'LA',
  'maine': 'ME',
  'maryland': 'MD',
  'massachusetts': 'MA',
  'michigan': 'MI',
  'minnesota': 'MN',
  'mississippi': 'MS',
  'missouri': 'MO',
  'montana': 'MT',
  'nebraska': 'NE',
  'nevada': 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  'ohio': 'OH',
  'oklahoma': 'OK',
  'oregon': 'OR',
  'pennsylvania': 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  'tennessee': 'TN',
  'texas': 'TX',
  'utah': 'UT',
  'vermont': 'VT',
  'virginia': 'VA',
  'washington': 'WA',
  'west virginia': 'WV',
  'wisconsin': 'WI',
  'wyoming': 'WY',
  'district of columbia': 'DC'
};

// Reverse mapping: State code to full name
export const STATE_NAMES: Record<string, string> = Object.entries(US_STATES).reduce(
  (acc, [fullName, code]) => {
    acc[code] = fullName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    acc[code.toLowerCase()] = fullName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Convert state name (any format) to 2-letter uppercase code
 * @param state State name or code in any format
 * @returns 2-letter uppercase state code (e.g., "TN", "NY")
 */
export function getStateCode(state: string): string {
  if (!state) return '';

  const normalized = state.toLowerCase().trim();

  // If it's already a valid code (2 letters)
  if (normalized.length === 2 && US_STATES[STATE_NAMES[normalized.toUpperCase()]?.toLowerCase()]) {
    return normalized.toUpperCase();
  }

  // Look up full name to get code
  const code = US_STATES[normalized];
  if (code) return code;

  // Fallback: return first 2 characters uppercase
  return normalized.substring(0, 2).toUpperCase();
}

/**
 * Convert state name or code to URL slug
 * @param state State name or code
 * @returns URL-friendly slug (e.g., "new-jersey", "tennessee")
 */
export function getStateSlug(state: string): string {
  if (!state) return '';

  const normalized = state.toLowerCase().trim();

  // If it's a 2-letter code, convert to full name first
  if (normalized.length === 2) {
    const fullName = STATE_NAMES[normalized.toUpperCase()];
    if (fullName) {
      return fullName.toLowerCase().replace(/\s+/g, '-');
    }
  }

  // Convert full name to slug
  return normalized.replace(/\s+/g, '-');
}

/**
 * Convert state name or code to proper title case
 * @param state State name or code
 * @returns Proper title case name (e.g., "New Jersey", "Tennessee")
 */
export function getStateName(state: string): string {
  if (!state) return '';

  const normalized = state.toLowerCase().trim();

  // If it's a code, get full name
  if (normalized.length === 2) {
    const fullName = STATE_NAMES[normalized.toUpperCase()];
    if (fullName) return fullName;
  }

  // If it's a full name, title case it
  const code = US_STATES[normalized];
  if (code) {
    return STATE_NAMES[code];
  }

  // Fallback: title case the input
  return normalized.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
