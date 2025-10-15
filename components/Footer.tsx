import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-gray-800 mt-16 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6 md:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {currentYear} AI Medical Report Analyzer. All Rights Reserved.</p>
        <p className="mt-1">
          This tool is for informational purposes only and is not a substitute for professional medical advice.
        </p>
      </div>
    </footer>
  );
};