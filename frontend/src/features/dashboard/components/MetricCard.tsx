type MetricBreakdownItem = {
  id: string;
  label: string;
  value: string;
  positive?: boolean;
};

type MetricCardProps = {
  label: string;
  value: string;
  valueCaption?: string;
  change?: string;
  positive?: boolean;
  breakdownLabel?: string;
  breakdown?: MetricBreakdownItem[];
};

const MetricCard = ({
  label,
  value,
  valueCaption,
  change,
  positive = true,
  breakdownLabel,
  breakdown = [],
}: MetricCardProps) => {
  const hasBreakdown = breakdown.length > 0;

  return (
    <article className="metric-card">
      <p className="metric-label">{label}</p>

      <h2 className="metric-value">{value}</h2>

      {valueCaption && (
        <p className="mt-1 text-xs text-(--text-secondary) opacity-70">
          {valueCaption}
        </p>
      )}

      {change && (
        <p
          className={
            positive ? "metric-change positive" : "metric-change negative"
          }
        >
          {change}
        </p>
      )}

      {hasBreakdown && (
        <div
          className="
            mt-4
            border-t
            border-black/10
            pt-3
            dark:border-white/10
          "
        >
          {breakdownLabel && (
            <p
              className="
                mb-2
                text-xs
                font-bold
                tracking-wide
                text-(--text-secondary)
                uppercase
                opacity-70
              "
            >
              {breakdownLabel}
            </p>
          )}

          <dl className="grid gap-2">
            {breakdown.map((item) => {
              const valueClassName =
                item.positive === undefined
                  ? "text-(--text-primary)"
                  : item.positive
                    ? "positive"
                    : "negative";

              return (
                <div
                  key={item.id}
                  className="
                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-3
                    text-sm
                  "
                >
                  <dt
                    className="
                      min-w-0
                      truncate
                      font-semibold
                      text-(--text-secondary)
                    "
                  >
                    {item.label}
                  </dt>

                  <dd
                    className={`
                      m-0
                      shrink-0
                      font-bold
                      ${valueClassName}
                    `}
                  >
                    {item.value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
    </article>
  );
};

export default MetricCard;
