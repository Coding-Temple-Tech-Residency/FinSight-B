import { useContext, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { convertCurrency } from "../../../api/currencyApi";

import { CurrencyContext } from "../context/CurrencyContext";

import type {
  ConvertibleCurrencyTotal,
  ConvertedCurrencyTotal,
  SupportedCurrency,
} from "../types/currency";

export const currencyKeys = {
  all: ["currency"] as const,

  conversions: () => [...currencyKeys.all, "conversion"] as const,

  conversion: (
    amount: number,
    fromCurrency: SupportedCurrency,
    toCurrency: SupportedCurrency,
  ) =>
    [...currencyKeys.conversions(), amount, fromCurrency, toCurrency] as const,
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider.");
  }

  return context;
};

export const useCurrencyConversions = (
  totals: ConvertibleCurrencyTotal[],
  targetCurrency: SupportedCurrency,
  enabled = true,
) => {
  const normalizedTotals = useMemo(
    () =>
      totals
        .map((total) => ({
          currency: total.currency,
          amount: Number(total.amount),
        }))
        .filter((total) => Number.isFinite(total.amount) && total.amount !== 0),
    [totals],
  );

  const conversionQueries = useQueries({
    queries: normalizedTotals.map((total) => {
      const shouldConvert = total.currency !== targetCurrency;

      return {
        queryKey: currencyKeys.conversion(
          total.amount,
          total.currency,
          targetCurrency,
        ),

        queryFn: () =>
          convertCurrency({
            amount: Math.abs(total.amount),
            from_currency: total.currency,
            to_currency: targetCurrency,
          }),

        enabled: enabled && shouldConvert,

        staleTime: 30 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
      };
    }),
  });

  const conversions = useMemo<ConvertedCurrencyTotal[]>(() => {
    return normalizedTotals
      .map((total, index) => {
        if (total.currency === targetCurrency) {
          return {
            sourceCurrency: total.currency,
            targetCurrency,
            originalAmount: total.amount,
            convertedAmount: total.amount,
            exchangeRate: 1,
          };
        }

        const conversion = conversionQueries[index]?.data;

        if (!conversion) {
          return null;
        }

        const direction = total.amount < 0 ? -1 : 1;

        return {
          sourceCurrency: conversion.fromCurrency,
          targetCurrency: conversion.toCurrency,
          originalAmount: total.amount,
          convertedAmount: conversion.convertedAmount * direction,
          exchangeRate: conversion.exchangeRate,
        };
      })
      .filter(
        (conversion): conversion is ConvertedCurrencyTotal =>
          conversion !== null,
      );
  }, [conversionQueries, normalizedTotals, targetCurrency]);

  const total = useMemo(
    () =>
      conversions.reduce(
        (sum, conversion) => sum + conversion.convertedAmount,
        0,
      ),
    [conversions],
  );

  const hasConversions =
    normalizedTotals.length > 0 &&
    conversions.length === normalizedTotals.length;

  const isLoading = conversionQueries.some(
    (query, index) =>
      normalizedTotals[index]?.currency !== targetCurrency && query.isLoading,
  );

  const isFetching = conversionQueries.some(
    (query, index) =>
      normalizedTotals[index]?.currency !== targetCurrency && query.isFetching,
  );

  const isError = conversionQueries.some((query) => query.isError);

  const errors = conversionQueries
    .map((query) => query.error)
    .filter((error): error is Error => error instanceof Error);

  return {
    conversions,
    total,
    hasConversions,
    isLoading,
    isFetching,
    isError,
    errors,
  };
};
