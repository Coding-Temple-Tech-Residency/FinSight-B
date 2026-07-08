import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const previewData = [
  { date: "Week 1", value: 24500 },
  { date: "Week 2", value: 25200 },
  { date: "Week 3", value: 24900 },
  { date: "Week 4", value: 26300 },
  { date: "Week 5", value: 27100 },
  { date: "Week 6", value: 28560 },
];

const HomePreviewChart = () => {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={previewData}>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={["dataMin - 500", "dataMax + 500"]} />
          <Tooltip
            formatter={(value) => [
              `$${Number(value).toLocaleString()}`,
              "Value",
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--accent-primary)"
            fill="var(--accent-primary)"
            fillOpacity={0.2}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HomePreviewChart;
