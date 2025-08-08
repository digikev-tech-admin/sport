import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

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

const TopSportsChart = ({userData}: {userData: any}) => {
  console.log({userData})
  
  // Process user data to get sports distribution
  const processSportsData = (users: any[]) => {
    const sportsData: { [key: string]: number } = {};
    
    // Helper function to normalize sport names
    const normalizeSportName = (sport: string): string => {
      // Convert to lowercase and replace hyphens with spaces
      const normalized = sport.toLowerCase().replace(/-/g, ' ');
      
      // Handle specific mappings
      const sportMappings: { [key: string]: string } = {
        'racket ball': 'Racket Ball',
        'table tennis': 'Table Tennis',
        'martial arts': 'Martial Arts',
        'racket-ball': 'Racket Ball',
        'table-tennis': 'Table Tennis',
        'martial-arts': 'Martial Arts'
      };
      
      if (sportMappings[normalized]) {
        return sportMappings[normalized];
      }
      
      // Capitalize first letter of each word
      return normalized.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    };
    
    users.forEach(user => {
      // Check if user exists and has sports property
      if (user && user.sports && Array.isArray(user.sports)) {
        user.sports.forEach((sport: string) => {
          if (sport) { // Check if sport is not null/undefined
            const normalizedSport = normalizeSportName(sport);
            sportsData[normalizedSport] = (sportsData[normalizedSport] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(sportsData)
      .map(([sport, count]) => ({
        sport,
        count,
        color: sportsColors[sport as keyof typeof sportsColors] || sportsColors.default
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 sports
  };
  
  const chartData = processSportsData(
    userData 
      ? (Array.isArray(userData) ? userData : [userData])
      : []
  );
  
  return (
    <div className=" ">
      <h2 className="text-xl font-bold mb-4">Top Sports</h2>

      <ResponsiveContainer width="100%" height={350} className="mt-10 ">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 10, left: 40, bottom: 0}}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="sport" />
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
          <Bar dataKey="count" radius={[0, 10, 10, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSportsChart;
