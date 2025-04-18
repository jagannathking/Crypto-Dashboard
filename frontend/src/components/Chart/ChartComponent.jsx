// src/components/Chart/ChartComponent.jsx
import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
// Import formatters
import {
  formatDateTick,
  formatLargeValue,
  formatCurrency,
} from "../../utils/formatters";

const ChartComponent = ({ chartData, isLoading, error }) => {
  // ... (rest of the component setup is the same) ...
  if (isLoading) {
    /* ... */
  }
  if (error) {
    /* ... */
  }
  if (!chartData || chartData.length === 0) {
    /* ... */
  }

  return (
    <div className="h-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />{" "}
          {/* gray-700 */}
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDateTick} // Use imported formatter
            tick={{ fill: "#A0AEC0" }} // gray-500
          />
          {/* Price Axis */}
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#4299E1" // blue-500
            // Use imported formatters
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fill: "#A0AEC0" }} // gray-500
            domain={["auto", "auto"]}
            width={80} // Give YAxis more space for labels
          />
          {/* Volume Axis */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#ED8936" // orange-500
            tickFormatter={formatLargeValue} // Use imported formatter
            tick={{ fill: "#A0AEC0" }} // gray-500
            domain={["auto", "auto"]}
            width={80} // Give YAxis more space for labels
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2D3748",
              border: "none",
              borderRadius: "4px",
            }} // gray-800
            labelStyle={{ color: "#E2E8F0" }} // gray-300
            itemStyle={{ color: "#E2E8F0" }}
            // Use imported formatters in tooltip
            formatter={(value, name) => {
              if (name === "Price") return [formatCurrency(value), name];
              if (name === "Volume") return [formatLargeValue(value), name];
              return [value, name];
            }}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })
            }
          />
          <Legend wrapperStyle={{ color: "#A0AEC0" }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="price"
            name="Price"
            stroke="#4299E1" // blue-500
            strokeWidth={2}
            dot={false}
          />
          <Bar
            yAxisId="right"
            dataKey="volume"
            name="Volume"
            fill="#ED8936" // orange-500
            opacity={0.6}
            barSize={10}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
