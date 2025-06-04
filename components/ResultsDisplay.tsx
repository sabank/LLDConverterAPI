
import React from 'react';
import { Coordinates } from '../types';

interface ResultsDisplayProps {
  coordinates: Coordinates | null;
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ coordinates, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-6 p-4 md:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg text-center">
        <p className="text-gray-700 dark:text-gray-300">Calculating coordinates...</p>
      </div>
    );
  }
  
  if (!coordinates) {
    return null; // Don't render anything if no coordinates and not loading
  }

  return (
    <div className="mt-6 p-4 md:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Approximate Coordinates (Centroid):</h3>
      <div className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Latitude:</span> {coordinates.latitude.toFixed(5)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Longitude:</span> {coordinates.longitude.toFixed(5)}
        </p>
      </div>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Note: These coordinates represent the approximate center of the specified Quarter Section. Actual boundaries may vary.</p>
        <p>For precise location, consult official survey plans or a professional land surveyor.</p>
      </div>
    </div>
  );
};

export default ResultsDisplay;
    