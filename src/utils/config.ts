import type { AppConfig } from '../types';

export const appConfig: AppConfig = {
  name: 'Youcode App',
  version: '1.0.0',
  environment: import.meta.env.MODE as AppConfig['environment'] || 'development',
} as const;

export const isDevelopment = (): boolean => {
  return appConfig.environment === 'development';
};

export const isProduction = (): boolean => {
  return appConfig.environment === 'production';
};
