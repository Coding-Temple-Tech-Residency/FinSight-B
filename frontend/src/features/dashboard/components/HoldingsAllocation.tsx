import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  useCurrency,
  useCurrencyConversions,
} from "../../currency/hooks/useCurrency";

import {
  SUPPORTED_CURRENCIES,
  type ConvertibleCurrencyTotal,
  type SupportedCurrency,
} from "../../currency/types/currency";

import { useHoldings } from "../../portfolio/hooks/useHoldings";

import {
  formatCurrency,
  normalizeCurrencyCode,
  toFiniteNumber,
} from "../../portfolio/utils/currencyFormatting";

type HoldingsAllocationProps = {
  portfolioId?: number;
  portfolioLoading?: boolean;
  portfolioError?: boolean;
};

type NativeAllocationItem = {
  id: number;
  name: string;
  symbol: string;
  nativeCurrency: SupportedCurrency;
  nativeValue: number;
};

type AllocationItem = NativeAllocationItem & {
  convertedValue: number;
  displayCurrency: SupportedCurrency;
  percentage: number;
};

const colors = [
  "var(--accent-primary)",
  "var(--accent-secondary)",
  "#4f7cff",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#6b7280",
];

const isSupportedCurrency = (
  currency: string,
): currency is SupportedCurrency => {
  return SUPPORTED_CURRENCIES.some(
    (supportedCurrency) => supportedCurrency === currency,
  );
};

const HoldingsAllocation = ({
  portfolioId,
  portfolioLoading = false,
  portfolioError = false,
}: HoldingsAllocationProps) => {
  const { preferredCurrency } = useCurrency();

  const {
    data: holdings = [],
    isLoading: holdingsLoading,
    isError: holdingsError,
    error: holdingsErrorData,
  } = useHoldings(portfolioId);

  const nativeAllocationData = useMemo<NativeAllocationItem[]>(() => {
    return holdings.flatMap((holding) => {
      const shares = toFiniteNumber(holding.shares);
      const latestPrice = toFiniteNumber(holding.latest_price);

      const normalizedCurrency = normalizeCurrencyCode(holding.native_currency);

      if (
        shares === null ||
        shares <= 0 ||
        latestPrice === null ||
        latestPrice <= 0 ||
        !isSupportedCurrency(normalizedCurrency)
      ) {
        return [];
      }

      return [
        {
          id: holding.id,
          name: holding.company_name?.trim() || holding.symbol,
          symbol: holding.symbol,
          nativeCurrency: normalizedCurrency,
          nativeValue: shares * latestPrice,
        },
      ];
    });
  }, [holdings]);

  const conversionTotals = useMemo<ConvertibleCurrencyTotal[]>(
    () =>
      nativeAllocationData.map((item) => ({
        currency: item.nativeCurrency,
        amount: item.nativeValue,
      })),
    [nativeAllocationData],
  );

  const conversionsEnabled =
    Boolean(portfolioId) &&
    !portfolioLoading &&
    !portfolioError &&
    !holdingsLoading &&
    !holdingsError &&
    conversionTotals.length > 0;

  const {
    conversions,
    hasConversions,
    isLoading: conversionLoading,
    isFetching: conversionFetching,
    isError: conversionError,
    errors: conversionErrors,
  } = useCurrencyConversions(
    conversionTotals,
    preferredCurrency,
    conversionsEnabled,
  );

  const allocationData = useMemo<AllocationItem[]>(() => {
    if (!hasConversions) {
      return [];
    }

    const convertedItems = nativeAllocationData.flatMap((item, index) => {
      const conversion = conversions[index];

      if (
        !conversion ||
        !Number.isFinite(conversion.convertedAmount) ||
        conversion.convertedAmount <= 0
      ) {
        return [];
      }

      return [
        {
          ...item,
          convertedValue: conversion.convertedAmount,
          displayCurrency: preferredCurrency,
          percentage: 0,
        },
      ];
    });

    const totalConvertedValue = convertedItems.reduce(
      (total, item) => total + item.convertedValue,
      0,
    );

    if (totalConvertedValue <= 0) {
      return [];
    }

    return convertedItems.map((item) => ({
      ...item,
      percentage: (item.convertedValue / totalConvertedValue) * 100,
    }));
  }, [conversions, hasConversions, nativeAllocationData, preferredCurrency]);

  const totalConvertedValue = useMemo(
    () =>
      allocationData.reduce((total, item) => total + item.convertedValue, 0),
    [allocationData],
  );

  const isLoading =
    portfolioLoading ||
    holdingsLoading ||
    conversionLoading ||
    conversionFetching;

  const isError = portfolioError || holdingsError || conversionError;

  const conversionErrorMessage =
    conversionErrors[0]?.message ||
    "Currency conversion is currently unavailable.";

  return (
    <article className="hold-card">
      <div className="card-header">
        <div>
          <h2>Holdings Allocation</h2>

          {!isLoading && holdings.length > 0 && (
            <p className="metric-label">
              {holdings.length} {holdings.length === 1 ? "holding" : "holdings"}
            </p>
          )}
        </div>

        {!isLoading && totalConvertedValue > 0 && (
          <span className="metric-label">
            {formatCurrency(totalConvertedValue, preferredCurrency)}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="dashboard-unavailable-state" role="status">
          <p>Loading holdings allocation...</p>
        </div>
      )}

      {!isLoading && isError && (
        <div className="dashboard-unavailable-state">
          <h3>Unable to load allocation</h3>

          <p>
            {holdingsErrorData instanceof Error
              ? holdingsErrorData.message
              : conversionErrorMessage}
          </p>
        </div>
      )}

      {!isLoading && !isError && !portfolioId && (
        <div className="dashboard-unavailable-state">
          <h3>No portfolio available</h3>

          <p>Create a portfolio to view its holdings allocation.</p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        Boolean(portfolioId) &&
        holdings.length === 0 && (
          <div className="dashboard-unavailable-state">
            <h3>No holdings yet</h3>

            <p>Add holdings to this portfolio to see its allocation.</p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        holdings.length > 0 &&
        nativeAllocationData.length === 0 && (
          <div className="dashboard-unavailable-state">
            <h3>Allocation unavailable</h3>

            <p>
              Latest prices or supported currency information are missing for
              the holdings in this portfolio.
            </p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        nativeAllocationData.length > 0 &&
        !hasConversions && (
          <div className="dashboard-unavailable-state">
            <h3>Allocation unavailable</h3>

            <p>
              The holdings could not be converted into your preferred currency.
            </p>
          </div>
        )}

      {!isLoading && !isError && allocationData.length > 0 && (
        <>
          <div className="holdings-allocation-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  dataKey="convertedValue"
                  nameKey="symbol"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {allocationData.map((item, index) => (
                    <Cell key={item.id} fill={colors[index % colors.length]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, _name, context) => {
                    const payload = context.payload as AllocationItem;

                    const rawValue = Array.isArray(value) ? value[0] : value;

                    const numericValue =
                      typeof rawValue === "number" ||
                      typeof rawValue === "string"
                        ? toFiniteNumber(rawValue)
                        : null;

                    return [
                      numericValue === null
                        ? "Unavailable"
                        : `${formatCurrency(
                            numericValue,
                            payload.displayCurrency,
                          )} (${payload.percentage.toFixed(1)}%)`,
                      `${payload.name} (${payload.symbol})`,
                    ];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="metric-label">
            Allocation converted to {preferredCurrency}
          </p>

          <div className="allocation-legend">
            {allocationData.map((item, index) => (
              <div key={item.id} className="allocation-legend-item">
                <span
                  className="allocation-dot"
                  style={{
                    backgroundColor: colors[index % colors.length],
                  }}
                />

                <div className="allocation-legend-label">
                  <strong>{item.name}</strong>

                  <span>{item.symbol}</span>
                </div>

                <div className="allocation-legend-value">
                  <strong>{item.percentage.toFixed(1)}%</strong>

                  <span>
                    {formatCurrency(item.convertedValue, preferredCurrency)}
                  </span>

                  {item.nativeCurrency !== preferredCurrency && (
                    <span className="metric-label">
                      {formatCurrency(item.nativeValue, item.nativeCurrency)}{" "}
                      native
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
};

export default HoldingsAllocation;
