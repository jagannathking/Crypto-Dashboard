// src/components/DataCard/DataCardSkeleton.jsx
import React from 'react';

const DataCardSkeleton = ({ title }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-gray-300 dark:border-gray-600 animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div> {/* Title Placeholder */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div> {/* Image Placeholder */}
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div> {/* Name Placeholder */}
        </div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div> {/* Price Placeholder */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div> {/* Percentage Placeholder */}
      </div>
    </div>
  );
};

export default DataCardSkeleton;