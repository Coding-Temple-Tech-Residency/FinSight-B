// import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// const allocationData = [
//   { name: "Technology", value: 45 },
//   { name: "Healthcare", value: 20 },
//   { name: "Finance", value: 15 },
//   { name: "Energy", value: 10 },
//   { name: "Cash", value: 10 },
// ];

// const colors = [
//   "var(--accent-primary)",
//   "var(--accent-secondary)",
//   "#4f7cff",
//   "#ef4444",
//   "#6b7280",
// ];

const HoldingsAllocation = () => {
  return (
    <article className="hold-card">
      <div className="card-header">
        <h2>Holdings Allocation</h2>
      </div>

      <div className="dashboard-unavailable-state">
        <h3>Allocation unavailable</h3>

        <p>
          Holdings allocation will appear once the portfolio holdings API is
          available.
        </p>
      </div>
    </article>
  );
};

export default HoldingsAllocation;
