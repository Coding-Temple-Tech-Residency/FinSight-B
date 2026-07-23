import type { ReactNode } from "react";

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const highlightMatch = (value: string, query: string): ReactNode => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return value;
  }

  const expression = new RegExp(`(${escapeRegExp(normalizedQuery)})`, "gi");

  const parts = value.split(expression);

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === normalizedQuery.toLowerCase();

    if (!isMatch) {
      return part;
    }

    return (
      <mark
        key={`${part}-${index}`}
        className="
          rounded
          bg-transparent
          font-bold
          text-(--accent-primary)
        "
      >
        {part}
      </mark>
    );
  });
};
