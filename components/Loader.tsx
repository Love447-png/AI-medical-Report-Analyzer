
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">AI is analyzing your report...</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">This might take a moment.</p>
    </div>
  );
};
