// src/App.jsx
import React from 'react';
import TopMoversPanel from './features/TopMoversPanel/TopMoversPanel';
import DetailedAnalysisPanel from './features/DetailedAnalysisPanel/DetailedAnalysisPanel';

function App() {
  // The background is now handled by the body style in index.css
  return (
    // Main container with responsive padding
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header Section */}
      <header className="mb-10 pb-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center text-gray-800 dark:text-gray-100 tracking-tight">
          Crypto Dashboard
        </h1>
        {/* Optional: Add a subtle subtitle if desired */}
        {/* <p className="text-center text-gray-500 dark:text-gray-400 mt-1">Real-time market insights</p> */}
      </header>

      {/* Main Content Area */}
      <main className="space-y-12"> {/* Increased vertical spacing between panels */}
        {/* Top Movers Panel */}
        <TopMoversPanel />

        {/* Detailed Analysis Panel */}
        <DetailedAnalysisPanel />
      </main>

      {/* Footer Section */}
      <footer className="mt-16 pt-6 border-t border-gray-300 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} C4Scale Assignment Demo.</p>
        <p>Cryptocurrency data provided by <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">CoinGecko</a>.</p>
      </footer>
    </div>
  );
}

export default App;