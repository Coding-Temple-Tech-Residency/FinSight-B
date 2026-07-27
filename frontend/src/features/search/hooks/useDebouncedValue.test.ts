import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("Apple"));

    expect(result.current).toBe("Apple");
  });

  it("updates the value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      {
        initialProps: {
          value: "Apple",
        },
      },
    );

    rerender({
      value: "Tesla",
    });

    expect(result.current).toBe("Apple");

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current).toBe("Tesla");
  });

  it("uses a custom delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: {
          value: "Apple",
          delay: 500,
        },
      },
    );

    rerender({
      value: "Tesla",
      delay: 500,
    });

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current).toBe("Apple");

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe("Tesla");
  });

  it("clears the previous timeout when value changes quickly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      {
        initialProps: {
          value: "Apple",
        },
      },
    );

    rerender({
      value: "Tesla",
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({
      value: "Microsoft",
    });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current).toBe("Microsoft");
  });
});
