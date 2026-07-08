import { useQuery } from "@tanstack/react-query";
import { getPortfolios } from "../../../api/portfolioApi";

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: getPortfolios,
    staleTime: 5 * 60 * 1000,
  });
}
