import type { ReactNode } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";

interface SearchResultItemProps {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  image?: string | null;
  imageAlt?: string;
  fallbackIcon?: ReactNode;
  trailing?: ReactNode;
  selected?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
}

const SearchResultItem = ({
  id,
  title,
  subtitle,
  badge,
  image,
  imageAlt = "",
  fallbackIcon,
  trailing,
  selected = false,
  onClick,
  onMouseEnter,
}: SearchResultItemProps) => {
  return (
    <button
      id={id}
      type="button"
      role="option"
      aria-selected={selected}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-left
        text-(--text-primary)
        transition
        duration-150
        ${selected ? "bg-(--bg-secondary)" : "hover:bg-(--bg-secondary)"}
      `}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          bg-(--bg-secondary)
        "
      >
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          (fallbackIcon ?? (
            <FontAwesomeIcon
              icon={faBuilding}
              aria-hidden="true"
              className="opacity-60"
            />
          ))
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <strong className="min-w-0 truncate text-sm">{title}</strong>

          {badge && (
            <span
              className="
                shrink-0
                rounded-full
                bg-(--bg-secondary)
                px-2
                py-0.5
                text-[0.65rem]
                font-bold
                uppercase
                opacity-70
              "
            >
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <span
            className="
              mt-0.5
              block
              truncate
              text-xs
              opacity-65
            "
          >
            {subtitle}
          </span>
        )}
      </div>

      {trailing && (
        <div
          className="
            shrink-0
            text-right
            text-xs
            font-semibold
            opacity-80
          "
        >
          {trailing}
        </div>
      )}
    </button>
  );
};

export default SearchResultItem;
