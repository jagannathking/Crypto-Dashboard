// src/components/CoinSelector/CoinSelector.jsx
import React from "react";
import LoadingSpinner from "../common/LoadingSpinner";

const CoinSelector = ({
  coins,
  selectedCoinId,
  onCoinChange,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <LoadingSpinner size="h-5 w-5" />
        <span>Loading coins...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error loading coins: {error.message}</p>;
  }

  return (
    <div className="mb-4">
      <label
        htmlFor="coin-select"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Select Cryptocurrency:
      </label>
      <select
        id="coin-select"
        value={selectedCoinId}
        onChange={(e) => onCoinChange(e.target.value)}
        className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option value="" disabled>
          -- Select a Coin --
        </option>
        {coins.map((coin) => (
          <option key={coin.coinId} value={coin.coinId}>
            {coin.name} ({coin.symbol?.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CoinSelector;
