// Core application types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppConfig {
  readonly name: string;
  readonly version: string;
  readonly environment: 'development' | 'production' | 'test';
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppState {
  user: User | null;
  theme: Theme;
  isLoading: boolean;
}

// Re-export movie types for easy access
export * from './movie';

// API Response wrapper type for consistent API responses
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
  readonly timestamp: string;
}

// Pagination interface
export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
}

export interface PaginatedResponse<T> {
  readonly items: T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

// Loading state management
export interface LoadingState {
  readonly isLoading: boolean;
  readonly error: string | null;
}

// Form validation types
export interface ValidationError {
  readonly field: string;
  readonly message: string;
}

export interface FormState<T> {
  readonly data: T;
  readonly errors: ValidationError[];
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
}