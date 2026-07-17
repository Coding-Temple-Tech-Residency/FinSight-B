import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MarketHistory } from "../types/market";
import { formatChartData } from "../utils/chartData";

type StockLineChartProps = {
  data: MarketHistory[];
};

const StockLineChart = ({ data }: StockLineChartProps) => {
  const chartData = formatChartData(data);

  if (chartData.length === 0) {
    return (
      <div className="chart-empty-state">
        <p>No price history is available.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 rounded-xl border border-(--border-primary) bg-(--bg-secondary) p-4">
      <h2 className="mb-4 text-lg font-semibold">Price History</h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" minTickGap={24} />

          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
          />

          <Tooltip
            formatter={(value) => [
              Number(value).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }),
              "Close",
            ]}
          />

          <Line
            type="monotone"
            dataKey="close"
            stroke="var(--accent-primary)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockLineChart;
