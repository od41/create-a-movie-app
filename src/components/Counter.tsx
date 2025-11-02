import React, { useState, useCallback } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({ 
  initialValue = 0, 
  step = 1,
  onCountChange 
}): JSX.Element => {
  const [count, setCount] = useState<number>(initialValue);

  const increment = useCallback((): void => {
    const newCount = count + step;
    setCount(newCount);
    onCountChange?.(newCount);
  }, [count, step, onCountChange]);

  const decrement = useCallback((): void => {
    const newCount = count - step;
    setCount(newCount);
    onCountChange?.(newCount);
  }, [count, step, onCountChange]);

  const reset = useCallback((): void => {
    setCount(initialValue);
    onCountChange?.(initialValue);
  }, [initialValue, onCountChange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Interactive Counter
      </h3>
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={decrement}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          type="button"
        >
          -
        </button>
        <span className="text-2xl font-bold text-gray-800 min-w-[4rem] text-center">
          {count}
        </span>
        <button
          onClick={increment}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          type="button"
        >
          +
        </button>
      </div>
      <button
        onClick={reset}
        className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        type="button"
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;
