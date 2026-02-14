import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

// Weekly Performance Line Chart
export const WeeklyPerformanceChart = ({ data = [], width = screenWidth - 80 }) => {
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

  const lineData = {
    labels: chartData.map(d => d.day),
    datasets: [
      {
        data: chartData.map(d => d.observations),
        color: (opacity = 1) => COLORS.cyan.primary,
        strokeWidth: 3,
      },
      {
        data: chartData.map(d => d.compliance),
        color: (opacity = 1) => COLORS.emerald.primary,
        strokeWidth: 3,
      },
    ],
    legend: ['Observations', 'Compliance %'],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(6, 182, 212, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#ffffff',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#f1f5f9',
      strokeWidth: 1,
    },
  };

  return (
    <View>
      <LineChart
        data={lineData}
        width={width}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
      />
    </View>
  );
};

// WHO 5 Moments Bar Chart
export const WHOMomentsBarChart = ({ data = [], width = screenWidth - 80 }) => {
  const defaultData = [
    { name: 'Before Patient', adherence: 12, partial: 3, missed: 2 },
    { name: 'Before Aseptic', adherence: 10, partial: 4, missed: 3 },
    { name: 'After Body Fluid', adherence: 15, partial: 2, missed: 1 },
    { name: 'After Patient', adherence: 14, partial: 3, missed: 2 },
    { name: 'After Surroundings', adherence: 11, partial: 4, missed: 3 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  // Calculate totals for each moment
  const totals = chartData.map(d => d.adherence + d.partial + d.missed);
  const maxTotal = Math.max(...totals, 1);

  const barData = {
    labels: chartData.map(d => {
      const words = d.name.split(' ');
      return words.length > 1 ? words[0] : d.name.substring(0, 6);
    }),
    datasets: [
      {
        data: totals,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#f1f5f9',
      strokeWidth: 1,
    },
  };

  return (
    <View>
      <BarChart
        data={barData}
        width={width}
        height={220}
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withInnerLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
        showValuesOnTopOfBars={true}
      />
      
      {/* Legend */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.emerald.primary, marginRight: 6 }} />
          <Text style={{ fontSize: 11, color: '#64748b' }}>Adherence</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.amber.primary, marginRight: 6 }} />
          <Text style={{ fontSize: 11, color: '#64748b' }}>Partial</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.rose.primary, marginRight: 6 }} />
          <Text style={{ fontSize: 11, color: '#64748b' }}>Missed</Text>
        </View>
      </View>
    </View>
  );
};

// Department Distribution Pie Chart
export const DepartmentPieChart = ({ data = [], width = screenWidth - 80 }) => {
  const defaultData = [
    { name: 'Emergency', value: 25, color: COLORS.cyan.primary },
    { name: 'ICU', value: 20, color: COLORS.indigo.primary },
    { name: 'Surgery', value: 18, color: COLORS.amber.primary },
    { name: 'Pediatrics', value: 15, color: COLORS.rose.primary },
    { name: 'Medicine', value: 12, color: COLORS.violet.primary },
    { name: 'Others', value: 10, color: '#6b7280' },
  ];

  const chartData = data.length > 0 ? data.map((d, index) => ({
    name: d.name,
    population: d.value,
    color: [COLORS.cyan.primary, COLORS.indigo.primary, COLORS.amber.primary, COLORS.rose.primary, COLORS.violet.primary, '#6b7280'][index % 6],
    legendFontColor: '#64748b',
    legendFontSize: 12,
  })) : defaultData.map(d => ({
    name: d.name,
    population: d.value,
    color: d.color,
    legendFontColor: '#64748b',
    legendFontSize: 12,
  }));

  const chartConfig = {
    color: (opacity = 1) => `rgba(6, 182, 212, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
  };

  return (
    <View>
      <PieChart
        data={chartData}
        width={width}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

// Compliance Rate Progress Chart (Horizontal Bar)
export const ComplianceProgressChart = ({ adherenceRate = 0, partialRate = 0, missedRate = 0 }) => {
  return (
    <View style={{ marginVertical: 8 }}>
      {/* Adherence */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b' }}>Adherence</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.emerald.primary }}>{adherenceRate}%</Text>
        </View>
        <View style={{ height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ width: `${adherenceRate}%`, height: '100%', backgroundColor: COLORS.emerald.primary, borderRadius: 4 }} />
        </View>
      </View>

      {/* Partial */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b' }}>Partial Adherence</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.amber.primary }}>{partialRate}%</Text>
        </View>
        <View style={{ height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ width: `${partialRate}%`, height: '100%', backgroundColor: COLORS.amber.primary, borderRadius: 4 }} />
        </View>
      </View>

      {/* Missed */}
      <View style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b' }}>Missed</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.rose.primary }}>{missedRate}%</Text>
        </View>
        <View style={{ height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ width: `${missedRate}%`, height: '100%', backgroundColor: COLORS.rose.primary, borderRadius: 4 }} />
        </View>
      </View>
    </View>
  );
};

export default {
  WeeklyPerformanceChart,
  WHOMomentsBarChart,
  DepartmentPieChart,
  ComplianceProgressChart,
};
