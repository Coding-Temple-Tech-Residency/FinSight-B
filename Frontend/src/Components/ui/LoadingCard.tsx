type LoadingCardProps = {
  title?: string;
};

const LoadingCard = ({ title = "Loading..." }: LoadingCardProps) => {
  return (
    <article className="metric-card animate-pulse">
      <p className="metric-label">{title}</p>

      <div className="h-8 w-32 mt-3 rounded bg-white/10" />

      <div className="h-4 w-20 mt-3 rounded bg-white/10" />
    </article>
  );
};

export default LoadingCard;
