
"use client";

import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";

// Color palette for different sports
const sportsColors = {
  "Baseball": "#742193",    // Purple
  "Volleyball": "#F4B400",  // Yellow
  "Basketball": "#FF6B35",  // Orange
  "Football": "#2E86AB",    // Blue
  "Tennis": "#A23B72",      // Pink
  "Soccer": "#F18F01",      // Orange
  "Swimming": "#C73E1D",    // Red
  "Racket Ball": "#8B4513", // Brown
  "Squash": "#32CD32",      // Lime Green
  "Badminton": "#FF69B4",   // Hot Pink
  "Yoga": "#9370DB",        // Medium Purple
  "Pilates": "#20B2AA",     // Light Sea Green
  "Cricket": "#228B22",     // Forest Green
  "Aerobics": "#FF1493",    // Deep Pink
  "Hockey": "#000080",      // Navy
  "Golf": "#228B22",        // Forest Green
  "Rugby": "#8B0000",       // Dark Red
  "Table Tennis": "#FFD700", // Gold
  "Running": "#FF4500",     // Orange Red
  "Cycling": "#4169E1",     // Royal Blue
  "Walking": "#2F4F4F",     // Dark Slate Gray
  "Gymnastics": "#FF69B4",  // Hot Pink
  "Martial Arts": "#8B008B", // Dark Magenta
  "Chess": "#696969",       // Dim Gray
  "default": "#6C757D"      // Gray for unknown sports
};

const AdminPieChart = ({ data }: { data: any }) => {
  // Process coach data to get sports distribution with coach names
  const processSportsData = (coaches: any[]) => {
    const sportsData: { [key: string]: { count: number, coaches: string[] } } = {};
    
    coaches.forEach(coach => {
      coach.sports.forEach((sport: string) => {
        if (!sportsData[sport]) {
          sportsData[sport] = { count: 0, coaches: [] };
        }
        sportsData[sport].count += 1;
        sportsData[sport].coaches.push(coach.name);
      });
    });

    return Object.entries(sportsData).map(([sport, data]) => ({
      name: sport,
      value: data.count,
      coaches: data.coaches,
      color: sportsColors[sport as keyof typeof sportsColors] || sportsColors.default
    }));
  };

  const chartData = processSportsData(data);

  console.log({ data, chartData });

  return (
    <div className="pt-7">
      <PieChart width={480} height={330}>
        <Pie
          dataKey="value"
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          label={({ name, value }) => `${name} (${value})`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
          <Tooltip 
           formatter={(value: any, name: any, props: any) => {
             const coaches = props.payload.coaches;
             return [
               <div key="tooltip" className="text-xs">
                 <div><strong>{name}</strong></div>
                 <div>{coaches.join(', ')}</div>
               </div>,
               `${value} coaches`
             ];
           }}
           labelStyle={{ fontWeight: 'bold', fontSize: '12px' }}
         />
        <Legend />
      </PieChart>
    </div>
  );
};

export default AdminPieChart;
