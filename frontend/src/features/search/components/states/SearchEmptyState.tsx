import type { ReactNode } from "react";

interface SearchEmptyStateProps {
  title?: string;
  description?: ReactNode;
}

const SearchEmptyState = ({
  title = "No results found",
  description = "Try adjusting your search.",
}: SearchEmptyStateProps) => {
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
      role="status"
      aria-live="polite"
    >
      <strong className="text-sm">{title}</strong>

      {description && (
        <span className="text-xs leading-5 opacity-70">{description}</span>
      )}
    </div>
  );
};

export default SearchEmptyState;
