import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const allocationData = [
  { name: "Technology", value: 45 },
  { name: "Healthcare", value: 20 },
  { name: "Finance", value: 15 },
  { name: "Energy", value: 10 },
  { name: "Cash", value: 10 },
];

const colors = [
  "var(--accent-primary)",
  "var(--accent-secondary)",
  "#4f7cff",
  "#ef4444",
  "#6b7280",
];

const HoldingsAllocation = () => {
  return (
    <article className="hold-card">
      <div className="card-header">
        <h2>Holdings Allocation</h2>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocationData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {allocationData.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="allocation-legend">
        {allocationData.map((item, index) => (
          <div key={item.name} className="allocation-legend-item">
            <span
              className="allocation-dot"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span>{item.name}</span>
            <strong>{item.value}%</strong>
          </div>
        ))}
      </div>
    </article>
  );
};

export default HoldingsAllocation;
