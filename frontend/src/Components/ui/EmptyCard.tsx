import type { ReactNode } from "react";

type EmptyCardProps = {
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
};

const EmptyCard = ({
  title = "No data available",
  message = "There is currently nothing to display.",
  action,
  className = "",
}: EmptyCardProps) => {
  return (
    <article className={`empty-card ${className}`}>
      <div className="empty-card-content">
        <h3>{title}</h3>
        <p>{message}</p>

        {action && <div className="empty-card-action">{action}</div>}
      </div>
    </article>
  );
};

export default EmptyCard;
