"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getRevenueData } from "@/api/services";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

const DATE_FILTERS = [
  { label: "All time", value: "all" },
  { label: "Today", value: "today" },
  { label: "This week", value: "thisWeek" },
  { label: "This month", value: "thisMonth" },
  { label: "This year", value: "thisYear" },
  { label: "Custom", value: "custom" },
];

interface RevenueTotals {
  revenue: number;
  orders: number;
  paymentMethods: Record<string, number>;
}

interface RevenueBreakdownEntry {
  moduleType: string;
  moduleTitle: string;
  moduleId: string;
  totalRevenue: number;
  totalOrders: number;
  paymentMethods: Record<string, number>;
}

const RevenueChart = () => {
  const [totals, setTotals] = useState<RevenueTotals | null>(null);
  const [breakdown, setBreakdown] = useState<RevenueBreakdownEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [moduleTypeFilter, setModuleTypeFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [breakdownSearch, setBreakdownSearch] = useState("");

  const fetchRevenue = React.useCallback(
    async (filters?: Record<string, string>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRevenueData(filters);
        console.log({ response });
        setTotals(response?.totals ?? null);
        setBreakdown(
          Array.isArray(response?.breakdown) ? response.breakdown : []
        );
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError("Unable to load revenue data.");
        setTotals(null);
        setBreakdown([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  const aggregatedByModuleType = useMemo(() => {
    if (!breakdown.length) {
      return [
        { moduleType: "event", revenue: 0 },
        { moduleType: "package", revenue: 0 },
      ];
    }

    const aggregates = breakdown.reduce(
      (acc: Record<string, number>, entry) => {
        acc[entry.moduleType] =
          (acc[entry.moduleType] || 0) + (entry.totalRevenue || 0);
        return acc;
      },
      {}
    );

    return Object.entries(aggregates).map(([moduleType, revenue]) => ({
      moduleType,
      revenue,
    }));
  }, [breakdown]);

  const paymentMethodCards = useMemo(() => {
    if (!totals?.paymentMethods) {
      return [];
    }
    return Object.entries(totals.paymentMethods).map(([method, amount]) => ({
      method,
      amount,
    }));
  }, [totals]);

  const formatCurrency = (value: number | undefined) =>
    `$${(value ?? 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getPresetDateRange = (preset: string) => {
    const now = new Date();

    switch (preset) {
      case "today":
        return {
          start: startOfDay(now).toISOString(),
          end: endOfDay(now).toISOString(),
        };
      case "thisWeek":
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }).toISOString(),
          end: endOfWeek(now, { weekStartsOn: 1 }).toISOString(),
        };
      case "thisMonth":
        return {
          start: startOfMonth(now).toISOString(),
          end: endOfMonth(now).toISOString(),
        };
      case "thisYear":
        return {
          start: startOfYear(now).toISOString(),
          end: endOfYear(now).toISOString(),
        };
      default:
        return null;
    }
  };

  const prospectiveFilters = useMemo(() => {
    const payload: Record<string, string> = {};

    if (dateFilter !== "all") {
      if (dateFilter === "custom") {
        if (customRange.start) payload.startDate = customRange.start;
        if (customRange.end) payload.endDate = customRange.end;
      } else {
        const presetRange = getPresetDateRange(dateFilter);
        if (presetRange) {
          payload.startDate = presetRange.start;
          payload.endDate = presetRange.end;
        }
      }
    }

    if (moduleTypeFilter !== "all") {
      payload.moduleType = moduleTypeFilter;
    }

    if (paymentMethodFilter !== "all") {
      payload.method = paymentMethodFilter;
    }

    return payload;
  }, [
    customRange.end,
    customRange.start,
    dateFilter,
    moduleTypeFilter,
    paymentMethodFilter,
  ]);

  const fetchRevenueWithFilters = React.useCallback(() => {
    const payload =
      Object.keys(prospectiveFilters).length > 0 ? prospectiveFilters : undefined;
    fetchRevenue(payload);
  }, [fetchRevenue, prospectiveFilters]);

  const resetFilters = React.useCallback(() => {
    setDateFilter("all");
    setCustomRange({ start: "", end: "" });
    setModuleTypeFilter("all");
    setPaymentMethodFilter("all");
    fetchRevenue();
  }, [fetchRevenue]);

  const filtersApplied =
    dateFilter !== "all" ||
    moduleTypeFilter !== "all" ||
    paymentMethodFilter !== "all" ||
    Boolean(customRange.start) ||
    Boolean(customRange.end);

  const filteredBreakdown = useMemo(() => {
    if (!breakdownSearch.trim()) {
      return breakdown;
    }
    const term = breakdownSearch.toLowerCase();
    return breakdown.filter((entry) =>
      (entry.moduleTitle || entry.moduleId || "")
        .toString()
        .toLowerCase()
        .includes(term)
    );
  }, [breakdown, breakdownSearch]);

  return (
    <div className="space-y-6 p-4">
      <div className="rounded-2xl border bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Filters</p>
            <p className="text-xs text-gray-500">
              These values will become query params for the revenue API.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {DATE_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDateFilter(option.value)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  dateFilter === option.value
                    ? "border-[#742193] bg-[#742193] text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {dateFilter === "custom" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="revenue-start-date"
                className="text-xs font-semibold uppercase text-gray-500"
              >
                Start Date
              </label>
              <input
                id="revenue-start-date"
                type="date"
                value={customRange.start}
                onChange={(event) =>
                  setCustomRange((prev) => ({ ...prev, start: event.target.value }))
                }
                className="rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#742193]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="revenue-end-date"
                className="text-xs font-semibold uppercase text-gray-500"
              >
                End Date
              </label>
              <input
                id="revenue-end-date"
                type="date"
                value={customRange.end}
                onChange={(event) =>
                  setCustomRange((prev) => ({ ...prev, end: event.target.value }))
                }
                className="rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#742193]"
              />
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase text-gray-500">
              Module Type
            </label>
            <select
              value={moduleTypeFilter}
              onChange={(event) => setModuleTypeFilter(event.target.value)}
              className="rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#742193]"
            >
              <option value="all">All modules</option>
              <option value="event">Events</option>
              <option value="package">Packages</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase text-gray-500">
              Payment Method
            </label>
            <select
              value={paymentMethodFilter}
              onChange={(event) => setPaymentMethodFilter(event.target.value)}
              className="rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#742193]"
            >
              <option value="all">All methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mandate">Mandate</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-dashed bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Query Preview
          </p>
          <pre className="mt-2 overflow-x-auto text-xs text-gray-700">
            {Object.keys(prospectiveFilters).length
              ? JSON.stringify(prospectiveFilters, null, 2)
              : "// No filters selected – request will use default parameters"}
          </pre>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            {filtersApplied && (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-400"
              >
                Remove Filters
              </button>
            )}
            <button
              type="button"
              onClick={fetchRevenueWithFilters}
              className="rounded-full bg-[#742193] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#5c196e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#742193]"
            >
              Click to Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Revenue</h2>
          <p className="text-sm text-gray-500">
            Total revenue recorded: {formatCurrency(totals?.revenue)}
          </p>
          <p className="text-xs text-gray-400">
            Total orders: {totals?.orders ?? 0}
          </p>
        </div>
        {loading && (
          <span className="text-xs font-medium text-gray-500">Loading…</span>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totals?.revenue)}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">
            {totals?.orders ?? 0}
          </p>
        </div>
        {paymentMethodCards.slice(0, 2).map((card) => (
          <div
            key={card.method}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <p className="text-xs uppercase text-gray-500">
              {card.method} Revenue
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(card.amount)}
            </p>
          </div>
        ))}
      </div>

      {paymentMethodCards.length > 2 && (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {paymentMethodCards.slice(2).map((card) => (
            <div
              key={card.method}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <p className="text-xs uppercase text-gray-500">
                {card.method} Revenue
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(card.amount)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Revenue by Module Type
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={aggregatedByModuleType}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="moduleType"
              tick={{ fill: "#4b5563", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "#4b5563", fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number) => [
                formatCurrency(value),
                "Revenue",
              ]}
              labelFormatter={(label: string) => `Module: ${label}`}
            />
            <Bar dataKey="revenue" fill="#742193" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-start gap-3">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 w-[25%] ">
            Revenue Breakdown
          </h3>
          <div className="mb-4 flex items-center justify-between gap-3 w-[75%]">
          <input
            type="text"
            value={breakdownSearch}
            onChange={(event) => setBreakdownSearch(event.target.value)}
            placeholder="Search by Package or Event title..."
            className="w-full rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-[#742193]"
          />
          {breakdownSearch && (
            <button
              type="button"
              onClick={() => setBreakdownSearch("")}
              className="text-xs font-semibold text-[#742193]"
            >
              Clear
            </button>
          )}
        </div>
        </div>
       
        
        {filteredBreakdown.length === 0 ? (
          <p className="text-sm text-gray-500">No revenue data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">
                    Module Type
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-600">
                    Module Title
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-600">
                    Revenue
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-600">
                    Orders
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-600">
                    Cash
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-600">
                    Card
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-600">
                    Mandate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredBreakdown.map((entry) => (
                  <tr key={`${entry.moduleType}-${entry.moduleId}`}>
                    <td className="px-3 py-2 capitalize">{entry.moduleType}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-500">
                      {entry?.moduleTitle ? entry?.moduleTitle : "-"}
                      
                    </td>
                    <td className="px-3 py-2 text-right font-semibold">
                      {formatCurrency(entry.totalRevenue)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {entry.totalOrders ?? 0}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {formatCurrency(entry.paymentMethods?.cash)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {formatCurrency(entry.paymentMethods?.card)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {formatCurrency(entry.paymentMethods?.mandate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
