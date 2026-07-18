import { useEffect, useState } from "react";

export type UseBreakpointProps = {
  isDesktop: boolean;
};

export function useBreakpoint(breakpoint = 1024): UseBreakpointProps {
  const getMatches = () => {
    if (typeof window === "undefined") return false;

    return window.matchMedia(`(min-width: ${breakpoint}px)`).matches;
  };

  const [isDesktop, setIsDesktop] = useState<boolean>(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [breakpoint]);

  return { isDesktop };
}
