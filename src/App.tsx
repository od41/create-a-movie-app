import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import FeatureCard from './components/FeatureCard';
import Counter from './components/Counter';
import { appConfig } from './utils/config';
import type { Theme } from './types';
import './App.css';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const App: React.FC = (): JSX.Element => {
  const [theme, setTheme] = useState<Theme>('light');
  const [counterValue, setCounterValue] = useState<number>(0);

  const features: Feature[] = [
    {
      id: '1',
      title: 'Modern React',
      description: 'Built with the latest React 19 and TypeScript for type safety and performance.',
      icon: '⚛️',
      color: 'blue',
    },
    {
      id: '2', 
      title: 'Tailwind CSS',
      description: 'Utility-first CSS framework for rapid and responsive UI development.',
      icon: '🎨',
      color: 'green',
    },
    {
      id: '3',
      title: 'TypeScript',
      description: 'Full TypeScript support with strict mode for better code quality.',
      icon: '📝',
      color: 'purple',
    },
    {
      id: '4',
      title: 'Vite Build',
      description: 'Lightning fast build tool with hot module replacement and optimizations.',
      icon: '⚡',
      color: 'orange',
    },
  ];

  const handleCounterChange = useCallback((count: number): void => {
    setCounterValue(count);
  }, []);

  const toggleTheme = useCallback((): void => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 ${theme === 'dark' ? 'dark' : ''}`}>
      <Header 
        title={appConfig.name}
        subtitle="Modern React + TypeScript + Tailwind CSS Template"
      />
      
      <main className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Features & Technologies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  color={feature.color}
                />
              ))}
            </div>
          </section>

          {/* Interactive Demo Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Interactive Demo
            </h2>
            <div className="flex flex-col items-center gap-6">
              <Counter 
                initialValue={0}
                step={1}
                onCountChange={handleCounterChange}
              />
              <p className="text-gray-600 text-center">
                Current counter value: <span className="font-semibold text-blue-600">{counterValue}</span>
              </p>
            </div>
          </section>

          {/* Settings Section */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              App Settings
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Theme:</span>
                <button
                  onClick={toggleTheme}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  type="button"
                >
                  {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                </button>
              </div>
              <div className="text-sm text-gray-500">
                <p>Version: {appConfig.version}</p>
                <p>Environment: {appConfig.environment}</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-300">
            Built with ❤️ using React, TypeScript, and Tailwind CSS
          </p>
          <p className="text-sm text-gray-400 mt-2">
            © 2024 {appConfig.name}. Ready for your next project.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
