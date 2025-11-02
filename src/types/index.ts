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
