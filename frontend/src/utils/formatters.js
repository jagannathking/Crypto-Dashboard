// src/utils/formatters.js

/**
 * Formats a number as USD currency.
 * @param {number | null | undefined} value - The numeric value.
 * @returns {string} Formatted currency string or 'N/A'.
 */
export const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: value < 1 ? 6 : 2, // Show more digits for small values
    }).format(value);
};

/**
 * Formats a number as a percentage string.
 * @param {number | null | undefined} value - The numeric value.
 * @returns {string} Formatted percentage string or 'N/A'.
 */
export const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
};

/**
 * Formats a timestamp for the chart's X-axis tick.
 * @param {number} timestamp - The Unix timestamp in milliseconds.
 * @returns {string} Formatted date string (e.g., "Apr 17").
 */
export const formatDateTick = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Formats a large number (currency/volume) with abbreviations (K, M, B).
 * @param {number | null | undefined} value - The numeric value.
 * @returns {string} Formatted string with abbreviation or the number itself.
 */
export const formatLargeValue = (value) => {
    if (value === null || value === undefined) return '';
    if (Math.abs(value) > 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (Math.abs(value) > 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (Math.abs(value) > 1e3) return `${(value / 1e3).toFixed(2)}K`;
    // Show more precision for very small price values if needed
    if (Math.abs(value) > 0 && Math.abs(value) < 0.01) return value.toFixed(6);
    return value?.toFixed(2);
};