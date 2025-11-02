/**
 * API configuration constants
 */

export const API_CONFIG = {
  OMDB_BASE_URL: 'https://www.omdbapi.com/',
  OMDB_API_KEY: import.meta.env.VITE_OMDB_API_KEY || '',
  REQUEST_TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

// Validate API configuration
if (!API_CONFIG.OMDB_API_KEY && import.meta.env.MODE !== 'test') {
  console.warn('OMDB API key not found. Please set VITE_OMDB_API_KEY environment variable.');
}

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS_PER_MINUTE: 1000,
  BURST_LIMIT: 10,
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  SEARCH_TTL: 2 * 60 * 1000, // 2 minutes for search results
  MOVIE_DETAILS_TTL: 10 * 60 * 1000, // 10 minutes for movie details
} as const;