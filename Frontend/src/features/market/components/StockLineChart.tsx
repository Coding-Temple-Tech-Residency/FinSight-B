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

  return (
    <div className="w-full h-80 rounded-xl border border-(--border-primary) bg-(--bg-secondary) p-4">
      <h2 className="mb-4 text-lg font-semibold">Price History</h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis domain={["auto", "auto"]} />

          <Tooltip />

          <Line type="monotone" dataKey="close" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockLineChart;
