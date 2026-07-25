import type { ReactNode } from "react";

interface SearchErrorStateProps {
  title?: string;
  message?: ReactNode;
  fallbackMessage?: ReactNode;
}

const SearchErrorState = ({
  title = "Search is unavailable",
  message = "The search service could not be reached.",
  fallbackMessage,
}: SearchErrorStateProps) => {
  return (
    <div
      className="
        flex
        flex-col
        gap-2
        px-4
        py-5
        text-(--text-primary)
      "
      role="alert"
    >
      <strong className="negative text-sm">{title}</strong>

      {message && (
        <span className="text-xs leading-5 opacity-70">{message}</span>
      )}

      {fallbackMessage && (
        <span className="text-xs leading-5 opacity-70">{fallbackMessage}</span>
      )}
    </div>
  );
};

export default SearchErrorState;
