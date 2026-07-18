type MetricCardProps = {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
};

const MetricCard = ({
  label,
  value,
  change,
  positive = true,
}: MetricCardProps) => {
  return (
    <article className="metric-card">
      <p className="metric-label">{label}</p>

      <h2 className="metric-value">{value}</h2>

      {change && (
        <p
          className={
            positive ? "metric-change positive" : "metric-change negative"
          }
        >
          {change}
        </p>
      )}
    </article>
  );
};

export default MetricCard;
