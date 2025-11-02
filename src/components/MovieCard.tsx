import React, { useState, useCallback } from 'react';
import type { ProcessedMovie, ProcessedRating } from '../types/movie';

interface MovieCardProps {
  readonly movie: ProcessedMovie;
  readonly onClick?: (movie: ProcessedMovie) => void;
  readonly className?: string;
  readonly variant?: 'default' | 'compact' | 'detailed';
  readonly showRating?: boolean;
  readonly showGenres?: boolean;
}

interface ImageState {
  readonly isLoading: boolean;
  readonly hasError: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onClick,
  className = '',
  variant = 'default',
  showRating = true,
  showGenres = false,
}): JSX.Element => {
  const [imageState, setImageState] = useState<ImageState>({
    isLoading: true,
    hasError: false,
  });

  const handleImageLoad = useCallback((): void => {
    setImageState({ isLoading: false, hasError: false });
  }, []);

  const handleImageError = useCallback((): void => {
    setImageState({ isLoading: false, hasError: true });
  }, []);

  const handleClick = useCallback((): void => {
    onClick?.(movie);
  }, [movie, onClick]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const getPrimaryRating = (): ProcessedRating | null => {
    if (!movie.ratings || movie.ratings.length === 0) return null;
    
    // Prioritize IMDb rating, then Rotten Tomatoes, then others
    const imdbRating = movie.ratings.find(r => r.source.toLowerCase().includes('imdb'));
    if (imdbRating) return imdbRating;
    
    const rtRating = movie.ratings.find(r => r.source.toLowerCase().includes('rotten'));
    if (rtRating) return rtRating;
    
    return movie.ratings[0];
  };

  const formatRating = (rating: ProcessedRating): string => {
    const source = rating.source.toLowerCase();
    if (source.includes('imdb')) {
      return `⭐ ${rating.value}`;
    }
    if (source.includes('rotten')) {
      return `🍅 ${rating.value}`;
    }
    if (source.includes('metacritic')) {
      return `📊 ${rating.value}`;
    }
    return `⭐ ${rating.value}`;
  };

  const getRatingColor = (rating: ProcessedRating): string => {
    const normalizedValue = rating.normalizedValue;
    if (normalizedValue === null) return 'text-gray-600';
    
    if (normalizedValue >= 8) return 'text-green-600';
    if (normalizedValue >= 6) return 'text-yellow-600';
    if (normalizedValue >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const primaryRating = getPrimaryRating();
  const isClickable = Boolean(onClick);
  
  const cardClasses = `
    group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300
    ${isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''}
    ${variant === 'compact' ? 'max-w-xs' : variant === 'detailed' ? 'max-w-sm' : 'max-w-xs'}
    ${className}
  `.trim();

  const Component = isClickable ? 'button' : 'div';
  
  return (
    <Component
      className={cardClasses}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyPress : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `View details for ${movie.title}` : undefined}
    >
      {/* Poster Section */}
      <div className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
        {imageState.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-2xl text-gray-500">🎬</span>
              </div>
            </div>
          </div>
        )}
        
        {imageState.hasError || !movie.posterUrl || movie.posterUrl === 'N/A' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
            <span className="text-4xl mb-2">🎭</span>
            <p className="text-sm text-center px-2 font-medium">{movie.title}</p>
            <p className="text-xs text-gray-500 mt-1">No poster available</p>
          </div>
        ) : (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageState.isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        {/* Rating Overlay */}
        {showRating && primaryRating && (
          <div className="absolute top-2 right-2">
            <div className={`px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs font-medium text-white`}>
              {formatRating(primaryRating)}
            </div>
          </div>
        )}
        
        {/* Year Badge */}
        <div className="absolute top-2 left-2">
          <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs font-medium text-white">
            {movie.year}
          </div>
        </div>
        
        {/* Hover Overlay */}
        {isClickable && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                <span className="text-2xl">▶️</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-left mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span className="capitalize">{movie.type}</span>
          {movie.rated && movie.rated !== 'N/A' && (
            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
              {movie.rated}
            </span>
          )}
        </div>
        
        {variant === 'detailed' && movie.plot && (
          <p className="text-sm text-gray-600 text-left mb-3 line-clamp-3">
            {movie.plot}
          </p>
        )}
        
        {showGenres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
              >
                {genre}
              </span>
            ))}
            {movie.genres.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                +{movie.genres.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Additional Details */}
        {variant === 'detailed' && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              {movie.runtime && (
                <span>{movie.runtime} min</span>
              )}
              {primaryRating && (
                <span className={getRatingColor(primaryRating)}>
                  {formatRating(primaryRating)}
                </span>
              )}
            </div>
            
            {movie.director.length > 0 && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                Dir: {movie.director.slice(0, 2).join(', ')}
                {movie.director.length > 2 && ` +${movie.director.length - 2}`}
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Focus Ring for Accessibility */}
      {isClickable && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-focus:ring-blue-500 group-focus:ring-offset-2 pointer-events-none" />
      )}
    </Component>
  );
};

export default MovieCard;