
"use client";

import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";

const UserPieChart = ({userLastLogin}: {userLastLogin: any }) => {
  console.log({userLastLogin})
  
  // Process user last login data to categorize as active/non-active
  const processUserActivity = (lastLoginDates: any) => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
    
    let activeUsers = 0;
    let nonActiveUsers = 0;
    
    // Ensure we have an array to work with
    const datesArray = Array.isArray(lastLoginDates) ? lastLoginDates : [];
    
    datesArray.forEach((loginDate: string) => {
      if (loginDate) {
        const userLastLogin = new Date(loginDate);
        if (userLastLogin >= oneMonthAgo) {
          activeUsers++;
        } else {
          nonActiveUsers++;
        }
      }
    });
    
    return [
      { name: "Active Users", value: activeUsers, color: "#742193" }, // Purple
      { name: "Non Active", value: nonActiveUsers, color: "#F4B400" }, // Yellow
    ];
  };
  
  const chartData = processUserActivity(userLastLogin);
  
  return (
      <div className=" flex  p-2 ">
      <PieChart width={400} height={280}>
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
              <div><strong>{name}</strong></div>
              <div>{value} users</div>
            </div>,
            `${value} users`
          ]}
          labelStyle={{ fontWeight: 'bold', fontSize: '12px' }}
        />
        
        <Legend />
        
      </PieChart>
      
      </div>
  );
};

export default UserPieChart;
