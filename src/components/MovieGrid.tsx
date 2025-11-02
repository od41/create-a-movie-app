import React, { useMemo } from 'react';
import MovieCard from './MovieCard';
import type { ProcessedMovie } from '../types/movie';

interface MovieGridProps {
  readonly movies: ProcessedMovie[];
  readonly isLoading?: boolean;
  readonly error?: string | null;
  readonly onMovieClick?: (movie: ProcessedMovie) => void;
  readonly onRetry?: () => void;
  readonly className?: string;
  readonly variant?: 'default' | 'compact' | 'detailed';
  readonly showRating?: boolean;
  readonly showGenres?: boolean;
  readonly emptyMessage?: string;
  readonly loadingCount?: number;
  readonly gridCols?: {
    readonly sm?: number;
    readonly md?: number;
    readonly lg?: number;
    readonly xl?: number;
  };
}

interface GridLayoutConfig {
  readonly gridCols: string;
  readonly gap: string;
  readonly minCardWidth: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading = false,
  error = null,
  onMovieClick,
  onRetry,
  className = '',
  variant = 'default',
  showRating = true,
  showGenres = false,
  emptyMessage = 'No movies found',
  loadingCount = 8,
  gridCols = { sm: 2, md: 3, lg: 4, xl: 5 },
}): JSX.Element => {
  const layoutConfig: GridLayoutConfig = useMemo(() => {
    const { sm = 2, md = 3, lg = 4, xl = 5 } = gridCols;
    
    return {
      gridCols: `grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl}`,
      gap: variant === 'compact' ? 'gap-4' : 'gap-6',
      minCardWidth: variant === 'compact' ? 'min-w-[200px]' : 'min-w-[250px]',
    };
  }, [gridCols, variant]);

  const gridClasses = `
    grid auto-rows-fr
    ${layoutConfig.gridCols}
    ${layoutConfig.gap}
    ${className}
  `.trim();

  // Loading skeleton component
  const LoadingSkeleton: React.FC = (): JSX.Element => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Poster skeleton */}
      <div className="aspect-[2/3] bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        {variant === 'detailed' && (
          <>
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </>
        )}
        {showGenres && (
          <div className="flex gap-2 mt-2">
            <div className="h-5 bg-gray-200 rounded-full w-12" />
            <div className="h-5 bg-gray-200 rounded-full w-16" />
          </div>
        )}
      </div>
    </div>
  );

  // Error state component
  const ErrorState: React.FC = (): JSX.Element => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4" role="img" aria-label="Error">
          🎬💥
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">
          {error || 'Failed to load movies. Please try again.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="
              bg-blue-600 hover:bg-blue-700 text-white font-medium
              px-6 py-3 rounded-lg transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            "
            type="button"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );

  // Empty state component
  const EmptyState: React.FC = (): JSX.Element => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4" role="img" aria-label="No movies">
          🎭🔍
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Movies Found
        </h3>
        <p className="text-gray-600">
          {emptyMessage}
        </p>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={gridClasses}
        role="status"
        aria-label="Loading movies"
      >
        {Array.from({ length: loadingCount }, (_, index) => (
          <LoadingSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={gridClasses}>
        <ErrorState />
      </div>
    );
  }

  // Empty state
  if (movies.length === 0) {
    return (
      <div className={gridClasses}>
        <EmptyState />
      </div>
    );
  }

  // Movies grid
  return (
    <div 
      className={gridClasses}
      role="grid"
      aria-label={`Movie grid containing ${movies.length} movies`}
    >
      {movies.map((movie) => (
        <div
          key={movie.id}
          role="gridcell"
          className="flex justify-center"
        >
          <MovieCard
            movie={movie}
            onClick={onMovieClick}
            variant={variant}
            showRating={showRating}
            showGenres={showGenres}
            className={`w-full ${layoutConfig.minCardWidth}`}
          />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;