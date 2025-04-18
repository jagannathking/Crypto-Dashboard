// src/components/DataCard/DataCard.jsx
import React from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
// Import formatters
import { formatCurrency, formatPercent } from "../../utils/formatters";

const DataCard = ({ title, data, isLoading, error }) => {
  // ... (rest of the component setup is the same) ...
  const isPositive = data?.price_change_percentage_24h >= 0;
  const colorClass = isPositive
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
  const borderClass = isPositive ? "border-green-500" : "border-red-500";

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 ${
        isLoading || error || !data
          ? "border-gray-300 dark:border-gray-600"
          : borderClass
      }`}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      {isLoading && (
        <div className="flex justify-center items-center h-24">
          <LoadingSpinner />
        </div>
      )}
      {error && !isLoading && (
        <ErrorMessage message={error.message || "Failed to load data"} />
      )}
      {!isLoading && !error && data && (
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <img
              src={data.image}
              alt={data.name}
              className="w-8 h-8 rounded-full"
            />{" "}
            {/* Added rounded-full */}
            <span className="text-lg font-medium">
              {data.name} ({data.symbol?.toUpperCase()})
            </span>
          </div>
          {/* Use imported formatters */}
          <p className="text-2xl font-bold">
            {formatCurrency(data.current_price)}
          </p>
          <p className={`text-lg font-semibold ${colorClass}`}>
            {isPositive ? "▲" : "▼"}{" "}
            {formatPercent(data.price_change_percentage_24h)} (24h)
          </p>
        </div>
      )}
      {!isLoading && !error && !data && (
        <p className="text-gray-500 dark:text-gray-400 text-center h-24 flex items-center justify-center">
          No data available.
        </p>
      )}
    </div>
  );
};

export default DataCard;
