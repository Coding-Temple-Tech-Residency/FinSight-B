interface SearchLoadingStateProps {
  message?: string;
}

const SearchLoadingState = ({
  message = "Searching...",
}: SearchLoadingStateProps) => {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        px-4
        py-5
        text-sm
        text-(--text-primary)
      "
      role="status"
      aria-live="polite"
    >
      <span
        className="
          h-4
          w-4
          shrink-0
          animate-spin
          rounded-full
          border-2
          border-current
          border-r-transparent
          opacity-70
        "
        aria-hidden="true"
      />

      <span>{message}</span>
    </div>
  );
};

export default SearchLoadingState;
