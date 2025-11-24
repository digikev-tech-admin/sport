
"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";

interface StatusBreakdown {
  active: number;
  inactive: number;
}

interface UserPieChartProps {
  userLastLogin?: string[];
  statusBreakdown?: StatusBreakdown;
}

const ACTIVE_SLICE = { name: "Active", color: "#742193" };
const INACTIVE_SLICE = { name: "Inactive", color: "#F4B400" };

const processUserActivity = (lastLoginDates?: string[]) => {
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  let activeUsers = 0;
  let inactiveUsers = 0;

  const datesArray = Array.isArray(lastLoginDates) ? lastLoginDates : [];

  datesArray.forEach((loginDate: string) => {
    if (loginDate) {
      const userLastLogin = new Date(loginDate);
      if (userLastLogin >= oneMonthAgo) {
        activeUsers++;
      } else {
        inactiveUsers++;
      }
    }
  });

  return [
    { ...ACTIVE_SLICE, name: "Active Users", value: activeUsers },
    { ...INACTIVE_SLICE, name: "Inactive Users", value: inactiveUsers },
  ];
};

const buildChartFromBreakdown = (breakdown: StatusBreakdown) => [
  { ...ACTIVE_SLICE, name: "Active", value: breakdown.active },
  { ...INACTIVE_SLICE, name: "Inactive", value: breakdown.inactive },
];

const UserPieChart = ({
  userLastLogin,
  statusBreakdown,
}: UserPieChartProps) => {
  const chartData = useMemo(() => {
    if (statusBreakdown) {
      return buildChartFromBreakdown(statusBreakdown);
    }

    return processUserActivity(userLastLogin);
  }, [statusBreakdown, userLastLogin]);

  return (
    <div className="flex p-2">
      <PieChart width={400} height={320}>
        <Pie
          dataKey="value"
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: any) => [
            <div key="tooltip" className="text-xs">
              <div>
                <strong>{name}</strong>
              </div>
              <div>{value} entries</div>
            </div>,
            `${value}`,
          ]}
          labelStyle={{ fontWeight: "bold", fontSize: "12px" }}
        />

        <Legend />
      </PieChart>
    </div>
  );
};

export default UserPieChart;
