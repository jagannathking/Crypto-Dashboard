// src/features/DetailedAnalysisPanel/DetailedAnalysisPanel.jsx
import React, { useState, useEffect, useMemo } from "react";
import CoinSelector from "../../components/CoinSelector/CoinSelector";
import ChartComponent from "../../components/Chart/ChartComponent";
import { fetchCoinList, fetchMarketChart } from "../../services/apiClient";

const timeFrames = [
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
];

const DetailedAnalysisPanel = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoinId, setSelectedCoinId] = useState(""); // e.g., 'bitcoin'
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(
    timeFrames[0].value
  ); // Default to 7 days
  const [chartRawData, setChartRawData] = useState(null); // Store raw API response {prices, volumes}

  const [coinListLoading, setCoinListLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [coinListError, setCoinListError] = useState(null);
  const [chartError, setChartError] = useState(null);

  // Fetch coin list on initial mount
  useEffect(() => {
    const loadCoinList = async () => {
      setCoinListLoading(true);
      setCoinListError(null);
      try {
        const data = await fetchCoinList();
        setCoins(data || []);
        // Optionally select a default coin like Bitcoin if available
        const defaultCoin = data?.find((c) => c.coinId === "bitcoin");
        if (defaultCoin) {
          setSelectedCoinId(defaultCoin.coinId);
        } else if (data?.length > 0) {
          setSelectedCoinId(data[0].coinId); // Select first coin if bitcoin not found
        }
      } catch (err) {
        setCoinListError(err);
      } finally {
        setCoinListLoading(false);
      }
    };
    loadCoinList();
  }, []); // Runs once on mount

  // Fetch chart data when selected coin or time frame changes
  useEffect(() => {
    if (!selectedCoinId) return; // Don't fetch if no coin is selected

    const loadChartData = async () => {
      setChartLoading(true);
      setChartError(null);
      setChartRawData(null); // Clear previous data
      try {
        const data = await fetchMarketChart(selectedCoinId, selectedTimeFrame);
        setChartRawData(data);
      } catch (err) {
        setChartError(err);
      } finally {
        setChartLoading(false);
      }
    };
    loadChartData();
  }, [selectedCoinId, selectedTimeFrame]); // Re-run when these change

  // Process raw data into a format suitable for Recharts
  const formattedChartData = useMemo(() => {
    if (!chartRawData || !chartRawData.prices || !chartRawData.total_volumes) {
      return [];
    }

    const { prices, total_volumes } = chartRawData;

    // Assuming prices and volumes arrays have corresponding timestamps
    // Create a map for efficient volume lookup by timestamp
    const volumeMap = new Map(
      total_volumes.map(([timestamp, volume]) => [timestamp, volume])
    );

    return prices.map(([timestamp, price]) => ({
      timestamp: timestamp,
      price: price,
      volume: volumeMap.get(timestamp) || 0, // Get corresponding volume, default to 0 if not found
    }));
  }, [chartRawData]);

  const handleCoinChange = (coinId) => {
    setSelectedCoinId(coinId);
  };

  const handleTimeFrameChange = (days) => {
    setSelectedTimeFrame(Number(days));
  };

  return (
    <section aria-labelledby="detailed-analysis-title">
      <h2 id="detailed-analysis-title" className="text-2xl font-semibold mb-4">
        Detailed Analysis
      </h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <CoinSelector
            coins={coins}
            selectedCoinId={selectedCoinId}
            onCoinChange={handleCoinChange}
            isLoading={coinListLoading}
            error={coinListError}
          />
          <div>
            <label
              htmlFor="timeframe-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Select Time Frame:
            </label>
            <select
              id="timeframe-select"
              value={selectedTimeFrame}
              onChange={(e) => handleTimeFrameChange(e.target.value)}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {timeFrames.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart Display */}
        <ChartComponent
          chartData={formattedChartData}
          isLoading={chartLoading}
          error={chartError}
        />
      </div>
    </section>
  );
};

export default DetailedAnalysisPanel;
