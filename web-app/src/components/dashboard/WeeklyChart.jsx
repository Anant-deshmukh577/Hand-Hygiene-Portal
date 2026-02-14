import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

/* --- SVG Icons --- */
const ChartLineIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ChartAreaIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ExpandIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const WeeklyChart = ({ 
  data = [],
  title = 'Weekly Performance',
  subtitle = 'Observations and compliance trends',
  chartType = 'line', // 'line' | 'area' | 'bar'
  showChartTypeToggle = true,
  showDownload = false,
  showExpand = false,
  onDownload,
  onExpand,
  height = 320,
  className = '',
}) => {

  const [activeChartType, setActiveChartType] = useState(chartType);
  const [activeDataKeys, setActiveDataKeys] = useState(['observations', 'compliance']);

  // Default data if none provided
  const defaultData = [
    { day: 'Mon', observations: 4, compliance: 75 },
    { day: 'Tue', observations: 6, compliance: 83 },
    { day: 'Wed', observations: 5, compliance: 80 },
    { day: 'Thu', observations: 7, compliance: 86 },
    { day: 'Fri', observations: 8, compliance: 88 },
    { day: 'Sat', observations: 3, compliance: 67 },
    { day: 'Sun', observations: 2, compliance: 100 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  // Theme colors (matching your teal theme)
  const colors = {
    observations: {
      stroke: '#0d9488', // teal-600
      fill: '#ccfbf1', // teal-100
      gradient: ['#14b8a6', '#0d9488'], // teal-500 to teal-600
    },
    compliance: {
      stroke: '#16a34a', // green-600
      fill: '#dcfce7', // green-100
      gradient: ['#22c55e', '#16a34a'], // green-500 to green-600
    },
    grid: '#f3f4f6', // gray-100
    axis: '#9ca3af', // gray-400
    tooltip: {
      bg: '#ffffff',
      border: '#e5e7eb', // gray-200
    },
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 min-w-[160px]">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600 capitalize">
                    {entry.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {entry.value}{entry.name === 'compliance' ? '%' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend = ({ payload }) => (
    <div className="flex items-center justify-center gap-6 mt-4">
      {payload.map((entry, index) => (
        <button
          key={index}
          onClick={() => {
            if (activeDataKeys.includes(entry.dataKey)) {
              if (activeDataKeys.length > 1) {
                setActiveDataKeys(activeDataKeys.filter(k => k !== entry.dataKey));
              }
            } else {
              setActiveDataKeys([...activeDataKeys, entry.dataKey]);
            }
          }}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
            transition-all duration-200
            ${activeDataKeys.includes(entry.dataKey)
              ? 'bg-gray-100 text-gray-900'
              : 'bg-gray-50 text-gray-400'
            }
            hover:bg-gray-100
          `}
        >
          <div 
            className={`w-3 h-3 rounded-full transition-opacity ${
              activeDataKeys.includes(entry.dataKey) ? 'opacity-100' : 'opacity-40'
            }`}
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize">{entry.value}</span>
        </button>
      ))}
    </div>
  );

  // Chart Type Toggle Buttons
  const ChartTypeToggle = () => (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setActiveChartType('line')}
        className={`
          p-2 rounded-md transition-all duration-200
          ${activeChartType === 'line' 
            ? 'bg-white text-teal-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
        title="Line Chart"
      >
        <ChartLineIcon />
      </button>
      <button
        onClick={() => setActiveChartType('area')}
        className={`
          p-2 rounded-md transition-all duration-200
          ${activeChartType === 'area' 
            ? 'bg-white text-teal-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
        title="Area Chart"
      >
        <ChartAreaIcon />
      </button>
      <button
        onClick={() => setActiveChartType('bar')}
        className={`
          p-2 rounded-md transition-all duration-200
          ${activeChartType === 'bar' 
            ? 'bg-white text-teal-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
        title="Bar Chart"
      >
        <ChartBarIcon />
      </button>
    </div>
  );

  // Render Chart based on type
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: -10, bottom: 0 },
    };

    const commonAxisProps = {
      xAxis: {
        dataKey: "day",
        axisLine: false,
        tickLine: false,
        tick: { fill: colors.axis, fontSize: 12 },
        dy: 10,
      },
      yAxis: {
        axisLine: false,
        tickLine: false,
        tick: { fill: colors.axis, fontSize: 12 },
        dx: -10,
      },
      cartesianGrid: {
        strokeDasharray: "3 3",
        stroke: colors.grid,
        vertical: false,
      },
    };

    if (activeChartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="colorObservations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.observations.stroke} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colors.observations.stroke} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.compliance.stroke} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colors.compliance.stroke} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid {...commonAxisProps.cartesianGrid} />
          <XAxis {...commonAxisProps.xAxis} />
          <YAxis {...commonAxisProps.yAxis} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          {activeDataKeys.includes('observations') && (
            <Area 
              type="monotone" 
              dataKey="observations" 
              stroke={colors.observations.stroke}
              fill="url(#colorObservations)"
              strokeWidth={2}
              name="Observations"
              dot={{ fill: colors.observations.stroke, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          )}
          {activeDataKeys.includes('compliance') && (
            <Area 
              type="monotone" 
              dataKey="compliance" 
              stroke={colors.compliance.stroke}
              fill="url(#colorCompliance)"
              strokeWidth={2}
              name="Compliance %"
              dot={{ fill: colors.compliance.stroke, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          )}
        </AreaChart>
      );
    }

    if (activeChartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid {...commonAxisProps.cartesianGrid} />
          <XAxis {...commonAxisProps.xAxis} />
          <YAxis {...commonAxisProps.yAxis} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          {activeDataKeys.includes('observations') && (
            <Bar 
              dataKey="observations" 
              fill={colors.observations.stroke}
              name="Observations"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          )}
          {activeDataKeys.includes('compliance') && (
            <Bar 
              dataKey="compliance" 
              fill={colors.compliance.stroke}
              name="Compliance %"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          )}
        </BarChart>
      );
    }

    // Default: Line Chart
    return (
      <LineChart {...commonProps}>
        <CartesianGrid {...commonAxisProps.cartesianGrid} />
        <XAxis {...commonAxisProps.xAxis} />
        <YAxis {...commonAxisProps.yAxis} />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        {activeDataKeys.includes('observations') && (
          <Line 
            type="monotone" 
            dataKey="observations" 
            stroke={colors.observations.stroke}
            strokeWidth={3}
            name="Observations"
            dot={{ fill: '#fff', stroke: colors.observations.stroke, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0, fill: colors.observations.stroke }}
          />
        )}
        {activeDataKeys.includes('compliance') && (
          <Line 
            type="monotone" 
            dataKey="compliance" 
            stroke={colors.compliance.stroke}
            strokeWidth={3}
            name="Compliance %"
            dot={{ fill: '#fff', stroke: colors.compliance.stroke, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0, fill: colors.compliance.stroke }}
          />
        )}
      </LineChart>
    );
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <ChartLineIcon className="text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showChartTypeToggle && <ChartTypeToggle />}
            
            {showDownload && (
              <button
                onClick={onDownload}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <DownloadIcon />
              </button>
            )}
            
            {showExpand && (
              <button
                onClick={onExpand}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Expand"
              >
                <ExpandIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Total Observations</p>
            <p className="text-lg font-bold text-gray-900">
              {chartData.reduce((sum, d) => sum + (d.observations || 0), 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Avg Compliance</p>
            <p className="text-lg font-bold text-teal-600">
              {chartData.length > 0
                ? `${Math.round(chartData.reduce((sum, d) => sum + (d.compliance || 0), 0) / chartData.length)}%`
                : '0%'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Best Day</p>
            <p className="text-lg font-bold text-green-600">
              {chartData.length > 0
                ? chartData.reduce((best, d) => (d.compliance || 0) > (best.compliance || 0) ? d : best, chartData[0]).day
                : '—'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Trend</p>
            <p className="text-lg font-bold text-green-600 flex items-center justify-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +5%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Sparkline Chart
export const SparklineChart = ({
  data = [],
  dataKey = 'value',
  color = 'teal',
  height = 40,
  width = 120,
  showDot = true,
  className = '',
}) => {
  const colors = {
    teal: '#0d9488',
    green: '#16a34a',
    blue: '#2563eb',
    amber: '#d97706',
    red: '#dc2626',
  };

  const strokeColor = colors[color] || colors.teal;

  return (
    <div className={className}>
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey={dataKey}
            stroke={strokeColor}
            strokeWidth={2}
            dot={showDot ? { fill: strokeColor, r: 2 } : false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Mini Chart Card (Chart with stats)
export const MiniChartCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  data = [],
  dataKey = 'value',
  color = 'teal',
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-4 shadow-sm ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {change && (
          <span className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
            ${changeType === 'positive' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
          `}>
            {changeType === 'positive' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <SparklineChart 
        data={data} 
        dataKey={dataKey} 
        color={color}
        width="100%"
        height={50}
      />
    </div>
  );
};

export default WeeklyChart;