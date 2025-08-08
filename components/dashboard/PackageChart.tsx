import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const PackageChart = ({packages}:{packages:any} ) => {
  
  // Process packages data to show coach count and creation date
  const processPackagesData = (packagesData: any[]) => {
    if (!packagesData || !Array.isArray(packagesData)) return [];
    
    return packagesData.map(pkg => {
      // Format creation date
      const createdAt = new Date(pkg.createdAt);
      const formattedDate = createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Get coach name
      const coachName = pkg.coachId?.name || 'Unknown Coach';
      
      // Count coach's sports (number of sports they coach)
      const coachSportsCount = pkg.coachId?.sports?.length || 0;
      
      return {
        packageName: pkg.title || pkg.sport,
        sport: pkg.sport,
        coachName: coachName,
        coachSportsCount: coachSportsCount,
        createdAt: formattedDate,
        enrolledCount: pkg.enrolledCount || 0,
        seatsCount: pkg.seatsCount || 0,
        basePrice: pkg.price?.base || 0
      };
    });
  };
  
  const chartData = processPackagesData(packages || []);
  
  // Calculate summary statistics
  const totalPackages = chartData.length;
  const totalCoaches = new Set(chartData.map(item => item.coachName)).size;
  const totalEnrolled = chartData.reduce((sum, item) => sum + item.enrolledCount, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + (item.basePrice * item.enrolledCount), 0);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Package Analytics</h2>
          <p className="text-gray-600 text-sm">Overview of package performance and enrollment</p>
        </div>
        {/* <div className="flex space-x-3">
          <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all">
            <option>All Packages</option>
            <option>By Sport</option>
            <option>By Coach</option>
          </select>
          <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all">
            <option>Enrollment</option>
            <option>Revenue</option>
            <option>Coach Count</option>
          </select>
        </div> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Packages</p>
              <p className="text-2xl font-bold">{totalPackages}</p>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Coaches</p>
              <p className="text-2xl font-bold">{totalCoaches}</p>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Enrolled</p>
              <p className="text-2xl font-bold">{totalEnrolled}</p>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue}</p>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="packageName" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any, name: any, props: any) => [
                <div key="tooltip" className="text-sm p-2">
                  <div className="font-bold text-gray-800 mb-2">{props.payload.packageName}</div>
                  <div className="space-y-1 text-gray-600">
                    <div>Coach: <span className="font-medium">{props.payload.coachName}</span></div>
                    <div>Sports: <span className="font-medium">{props.payload.coachSportsCount}</span></div>
                    <div>Created: <span className="font-medium">{props.payload.createdAt}</span></div>
                    <div>Enrolled: <span className="font-medium">{props.payload.enrolledCount}/{props.payload.seatsCount}</span></div>
                    <div>Price: <span className="font-medium">${props.payload.basePrice}</span></div>
                  </div>
                </div>,
                value
              ]}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value, entry) => (
                <span style={{ color: '#6b7280', fontSize: '14px' }}>{value}</span>
              )}
            />
            <Bar 
              dataKey="enrolledCount" 
              fill="#8b5cf6" 
              name="Enrolled"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="coachSportsCount" 
              fill="#f59e0b" 
              name="Coach Sports"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PackageChart;
