import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Daily data (3-hour intervals, 00 to 21) - data only up to 15:00, but x-axis shows all ticks
const dailyData = [
  { time: '00', value: 28000 },
  { time: '03', value: 30000 },
  { time: '06', value: 32000 },
  { time: '09', value: 35000 },
  { time: '12', value: 38000 },
  { time: '15', value: 40689 },
  { time: '18', value: null }, // No data yet
  { time: '21', value: null }, // No data yet
];

// Weekly data (daily) - ends on Sunday (Jan 4, 2026)
const weeklyData = [
  { time: 'Mon', value: 35000 },
  { time: 'Tue', value: 37000 },
  { time: 'Wed', value: 36000 },
  { time: 'Thu', value: 39000 },
  { time: 'Fri', value: 42000 },
  { time: 'Sat', value: 41000 },
  { time: 'Sun', value: 40689 },
];

// Yearly data (months) - ends on January (Jan 2026)
const yearlyData = [
  { time: 'Feb', value: 28000 },
  { time: 'Mar', value: 30000 },
  { time: 'Apr', value: 32000 },
  { time: 'May', value: 33000 },
  { time: 'Jun', value: 35000 },
  { time: 'Jul', value: 37000 },
  { time: 'Aug', value: 38000 },
  { time: 'Sep', value: 36000 },
  { time: 'Oct', value: 39000 },
  { time: 'Nov', value: 41000 },
  { time: 'Dec', value: 40000 },
  { time: 'Jan', value: 40689 },
];

type TimeRange = 'daily' | 'weekly' | 'yearly';

export function SalesChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const getChartData = () => {
    switch (timeRange) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'yearly':
        return yearlyData;
      default:
        return dailyData;
    }
  };

  // Get all x-axis ticks for each range
  const getAllXAxisTicks = () => {
    switch (timeRange) {
      case 'daily':
        return ['00', '03', '06', '09', '12', '15', '18', '21'];
      case 'weekly':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'yearly':
        return ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
      default:
        return [];
    }
  };

  // Get the last data point time (with actual data, not null)
  const getLastDataTime = () => {
    const data = getChartData();
    // Find the last entry with non-null value
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].value !== null) {
        return data[i].time;
      }
    }
    return data[data.length - 1]?.time;
  };

  // Format Y-axis ticks
  const formatYAxis = (value: number) => {
    return `${(value / 1000).toFixed(0)}K`;
  };

  // Format tooltip value
  const formatTooltipValue = (value: number) => {
    return value.toLocaleString();
  };

  // Custom tick component to highlight the last data point
  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    const lastDataTime = getLastDataTime();
    const isLastDataPoint = payload.value === lastDataTime;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill={isLastDataPoint ? '#2F6FE4' : '#9ca3af'}
          style={{
            fontSize: '12px',
            fontWeight: isLastDataPoint ? 'bold' : 'normal',
          }}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white p-6 shadow-sm h-full flex flex-col rounded-[15px]">
      <div className="flex items-center justify-between mb-6">
        <h3>Sales Overview</h3>
        
        {/* Time Range Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-[15px]">
          <button
            onClick={() => setTimeRange('daily')}
            className={`px-4 py-1.5 text-sm transition-colors rounded-[12px] ${
              timeRange === 'daily'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-4 py-1.5 text-sm transition-colors rounded-[12px] ${
              timeRange === 'weekly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange('yearly')}
            className={`px-4 py-1.5 text-sm transition-colors rounded-[12px] ${
              timeRange === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={getChartData()} margin={{ left: -25, right: 30 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2F6FE4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2F6FE4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              ticks={getAllXAxisTicks()}
              tick={<CustomTick />}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={formatYAxis}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '0',
                fontSize: '14px'
              }}
              formatter={formatTooltipValue}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2F6FE4"
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={{ fill: '#2F6FE4', r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
