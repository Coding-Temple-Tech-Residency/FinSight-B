import "./ErrorCard.css";

type ErrorCardProps = {
  message?: string;
};

const ErrorCard = ({ message = "Something went wrong." }: ErrorCardProps) => {
  return (
    <article className="metric-card">
      <h3 className="text-red-500 font-bold">Unable to load data</h3>

      <p className="opacity-70 mt-2">{message}</p>
    </article>
  );
};

export default ErrorCard;
