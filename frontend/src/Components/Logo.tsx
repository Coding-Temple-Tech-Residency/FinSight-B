import { useBreakpoint } from "../hooks/useBreakingPoint";

const Logo = () => {
  const { isDesktop } = useBreakpoint();
  return (
    <h1 className="logo-text px-3 z-60">{isDesktop ? "FinSight" : "FS"} </h1>
  );
};

export default Logo;
