/**
 * Movie and Rating interfaces based on OMDB API response format
 * These types provide comprehensive type safety for movie data throughout the application
 */

// Base rating structure from OMDB API
export interface MovieRating {
  readonly Source: string;
  readonly Value: string;
}

// Comprehensive movie interface matching OMDB API detailed response
export interface Movie {
  readonly Title: string;
  readonly Year: string;
  readonly Rated: string;
  readonly Released: string;
  readonly Runtime: string;
  readonly Genre: string;
  readonly Director: string;
  readonly Writer: string;
  readonly Actors: string;
  readonly Plot: string;
  readonly Language: string;
  readonly Country: string;
  readonly Awards: string;
  readonly Poster: string;
  readonly Ratings: MovieRating[];
  readonly Metascore: string;
  readonly imdbRating: string;
  readonly imdbVotes: string;
  readonly imdbID: string;
  readonly Type: 'movie' | 'series' | 'episode';
  readonly DVD?: string;
  readonly BoxOffice?: string;
  readonly Production?: string;
  readonly Website?: string;
  readonly Response: 'True';
}

// Movie search result item (lighter version for search results)
export interface MovieSearchResult {
  readonly Title: string;
  readonly Year: string;
  readonly imdbID: string;
  readonly Type: 'movie' | 'series' | 'episode';
  readonly Poster: string;
}

// OMDB API search response structure
export interface MovieSearchResponse {
  readonly Search: MovieSearchResult[];
  readonly totalResults: string;
  readonly Response: 'True';
}

// OMDB API error response structure
export interface MovieApiError {
  readonly Response: 'False';
  readonly Error: string;
}

// Union type for all possible OMDB API responses
export type MovieApiResponse = Movie | MovieSearchResponse | MovieApiError;

// Type guard functions for runtime type checking
export function isMovie(response: MovieApiResponse): response is Movie {
  return response.Response === 'True' && 'Title' in response && 'Plot' in response;
}

export function isMovieSearchResponse(response: MovieApiResponse): response is MovieSearchResponse {
  return response.Response === 'True' && 'Search' in response;
}

export function isMovieApiError(response: MovieApiResponse): response is MovieApiError {
  return response.Response === 'False';
}

// Processed movie interface for internal application use
export interface ProcessedMovie {
  readonly id: string; // imdbID
  readonly title: string;
  readonly year: number;
  readonly rated: string;
  readonly releaseDate: Date | null;
  readonly runtime: number | null; // in minutes
  readonly genres: string[];
  readonly director: string[];
  readonly writers: string[];
  readonly actors: string[];
  readonly plot: string;
  readonly language: string[];
  readonly country: string[];
  readonly awards: string;
  readonly posterUrl: string;
  readonly ratings: ProcessedRating[];
  readonly metascore: number | null;
  readonly imdbRating: number | null;
  readonly imdbVotes: number | null;
  readonly type: 'movie' | 'series' | 'episode';
  readonly boxOffice: string | null;
  readonly production: string | null;
  readonly website: string | null;
}

// Processed rating interface for internal use
export interface ProcessedRating {
  readonly source: string;
  readonly value: string;
  readonly normalizedValue: number | null; // 0-10 scale
}

// Search parameters for OMDB API
export interface MovieSearchParams {
  readonly s?: string; // search term
  readonly i?: string; // imdb ID
  readonly t?: string; // movie title
  readonly type?: 'movie' | 'series' | 'episode';
  readonly y?: number; // year
  readonly plot?: 'short' | 'full';
  readonly r?: 'json' | 'xml';
  readonly page?: number;
}

// Movie collection/list interfaces
export interface MovieList {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly movies: string[]; // Array of imdbIDs
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface MovieListWithMovies {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly movies: ProcessedMovie[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Movie filter and sort options
export interface MovieFilters {
  readonly genre?: string[];
  readonly year?: {
    readonly min: number;
    readonly max: number;
  };
  readonly rating?: {
    readonly min: number;
    readonly max: number;
  };
  readonly type?: ('movie' | 'series' | 'episode')[];
}

export type MovieSortField = 'title' | 'year' | 'rating' | 'metascore';
export type MovieSortOrder = 'asc' | 'desc';

export interface MovieSort {
  readonly field: MovieSortField;
  readonly order: MovieSortOrder;
}

// Movie API service response wrapper
export interface MovieServiceResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
  readonly statusCode: number;
}

// Common movie-related error types
export class MovieNotFoundError extends Error {
  constructor(query: string) {
    super(`Movie not found: ${query}`);
    this.name = 'MovieNotFoundError';
  }
}

export class MovieApiLimitError extends Error {
  constructor() {
    super('Movie API request limit exceeded');
    this.name = 'MovieApiLimitError';
  }
}

export class MovieApiError extends Error {
  constructor(message: string, public readonly statusCode: number = 500) {
    super(message);
    this.name = 'MovieApiError';
  }
}