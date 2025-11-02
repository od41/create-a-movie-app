import React from 'react';
import type { ProcessedRating } from '../types/movie';

interface MovieRatingsProps {
  ratings: ProcessedRating[];
  className?: string;
  showLabels?: boolean;
  variant?: 'compact' | 'detailed';
}

interface RatingSourceConfig {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  maxValue: number;
}

const RATING_SOURCE_CONFIG: Record<string, RatingSourceConfig> = {
  'Internet Movie Database': {
    name: 'IMDb',
    icon: '🎬',
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    maxValue: 10,
  },
  'Rotten Tomatoes': {
    name: 'Rotten Tomatoes',
    icon: '🍅',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    maxValue: 100,
  },
  'Metacritic': {
    name: 'Metacritic',
    icon: '📊',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    maxValue: 100,
  },
  'default': {
    name: 'Rating',
    icon: '⭐',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    maxValue: 10,
  },
} as const;

const MovieRatings: React.FC<MovieRatingsProps> = ({
  ratings,
  className = '',
  showLabels = true,
  variant = 'detailed',
}): JSX.Element => {
  const getSourceConfig = (source: string): RatingSourceConfig => {
    return RATING_SOURCE_CONFIG[source] || RATING_SOURCE_CONFIG.default;
  };

  const parseRatingValue = (value: string): { numeric: number; display: string } => {
    // Handle percentage values (e.g., "85%")
    if (value.includes('%')) {
      const numeric = parseFloat(value.replace('%', ''));
      return { numeric: isNaN(numeric) ? 0 : numeric, display: value };
    }
    
    // Handle fraction values (e.g., "8.5/10")
    if (value.includes('/')) {
      const [numerator, denominator] = value.split('/');
      const numeric = (parseFloat(numerator) / parseFloat(denominator)) * 100;
      return { numeric: isNaN(numeric) ? 0 : numeric, display: value };
    }
    
    // Handle decimal values (e.g., "8.5")
    const numeric = parseFloat(value);
    if (!isNaN(numeric)) {
      // Assume it's out of 10 if less than or equal to 10
      const normalized = numeric <= 10 ? numeric * 10 : numeric;
      return { numeric: normalized, display: value };
    }
    
    return { numeric: 0, display: value };
  };

  const getProgressPercentage = (value: string): number => {
    const { numeric } = parseRatingValue(value);
    return Math.min(Math.max(numeric, 0), 100);
  };

  const getRatingQuality = (percentage: number): string => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Average';
    if (percentage >= 40) return 'Below Average';
    return 'Poor';
  };

  if (ratings.length === 0) {
    return (
      <div className={`text-gray-500 text-center py-4 ${className}`}>
        <span className="text-2xl">📊</span>
        <p className="mt-2">No ratings available</p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {ratings.map((rating, index) => {
          const config = getSourceConfig(rating.source);
          const percentage = getProgressPercentage(rating.value);
          
          return (
            <div
              key={index}
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${config.bgColor} ${config.textColor}`}
              title={`${config.name}: ${rating.value}`}
            >
              <span className="text-sm">{config.icon}</span>
              <span className="text-xs font-medium">{rating.value}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showLabels && (
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Ratings & Reviews
        </h3>
      )}
      
      <div className="grid gap-3 md:grid-cols-1">
        {ratings.map((rating, index) => {
          const config = getSourceConfig(rating.source);
          const percentage = getProgressPercentage(rating.value);
          const quality = getRatingQuality(percentage);
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${config.bgColor} border-gray-200 hover:shadow-md transition-shadow duration-200`}
              role="region"
              aria-label={`${config.name} rating: ${rating.value}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label={config.name}>
                    {config.icon}
                  </span>
                  <span className={`font-medium ${config.textColor}`}>
                    {config.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${config.textColor}`}>
                    {rating.value}
                  </div>
                  <div className="text-xs text-gray-600">
                    {quality}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${config.color} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Rating progress: ${percentage}%`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{config.maxValue}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {ratings.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-blue-500">ℹ️</span>
            <span>
              Ratings are aggregated from multiple sources and may use different scales.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieRatings;