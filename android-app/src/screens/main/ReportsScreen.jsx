import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { reportService } from '../../services/reportService';
import { wardService } from '../../services/wardService';
import { observationService } from '../../services/observationService';
import { WHOMomentsBarChart, DepartmentPieChart, ComplianceProgressChart } from '../../components/charts/Charts';
import { exportToPDF, exportToCSV, exportToExcel, prepareWHOMomentsData } from '../../utils/exportUtils';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const ReportsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [complianceReport, setComplianceReport] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [wards, setWards] = useState([]);
  
  // Chart data
  const [whoMomentsData, setWhoMomentsData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  
  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      loadReportData();
    }
  }, [selectedPeriod, selectedDepartment, selectedWard]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load departments and wards
      const [deptResponse, wardResponse] = await Promise.all([
        wardService.getDepartments(),
        wardService.getWards(),
      ]);

      if (deptResponse.success) {
        setDepartments(deptResponse.departments || []);
      }
      if (wardResponse.success) {
        setWards(wardResponse.wards || []);
      }

      // Load report data
      await loadReportData();
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const loadReportData = async () => {
    try {
      const filters = getDateFilters();
      if (selectedDepartment) filters.department = selectedDepartment;
      if (selectedWard) filters.ward = selectedWard;

      const [statsResponse, complianceResponse] = await Promise.all([
        reportService.getDashboardStats(filters),
        reportService.getComplianceReport(filters),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }
      if (complianceResponse.success) {
        setComplianceReport(complianceResponse.report);
        
        // Format WHO Moments data for chart
        const whoMoments = complianceResponse.report?.whoMoments || [];
        const formattedMoments = whoMoments.map(m => ({
          name: m.moment.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          adherence: m.adherence || 0,
          partial: m.partial || 0,
          missed: m.missed || 0,
        }));
        setWhoMomentsData(formattedMoments);
      }

      // Fetch observations for department distribution
      try {
        const obsResponse = await observationService.getObservations({ ...filters, limit: 1000 });
        const observations = obsResponse.observations || [];
        
        // Count observations by department
        const deptCounts = {};
        observations.forEach(obs => {
          const dept = obs.department;
          if (dept) {
            deptCounts[dept] = (deptCounts[dept] || 0) + 1;
          }
        });
        
        // Convert to array and sort
        const deptData = Object.entries(deptCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6); // Top 6 departments
        
        setDepartmentData(deptData);
      } catch (error) {
        console.error('Error fetching department data:', error);
        setDepartmentData([]);
      }
    } catch (error) {
      console.error('Error loading report data:', error);
      Alert.alert('Error', 'Failed to load report data');
    }
  };

  const getDateFilters = () => {
    const now = new Date();
    const filters = {};

    switch (selectedPeriod) {
      case 'today':
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);
        filters.startDate = todayStart.toISOString();
        filters.endDate = todayEnd.toISOString();
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filters.startDate = weekAgo.toISOString();
        filters.endDate = now.toISOString();
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filters.startDate = monthAgo.toISOString();
        filters.endDate = now.toISOString();
        break;
      case 'all':
      default:
        // No date filters
        break;
    }

    return filters;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReportData();
    setRefreshing(false);
  };

  const handleExport = async (format) => {
    try {
      // Show loading state
      Alert.alert('Exporting...', 'Please wait while we prepare your report');

      const filters = getDateFilters();
      if (selectedDepartment) filters.department = selectedDepartment;
      if (selectedWard) filters.ward = selectedWard;

      let success = false;

      if (format === 'pdf') {
        // Prepare data for PDF export
        const reportData = {
          stats: stats || {},
          complianceReport: complianceReport || {},
          filters: {
            period: selectedPeriod,
            department: selectedDepartment,
            ward: selectedWard,
          },
          timestamp: new Date(),
        };
        success = await exportToPDF(reportData, 'hand_hygiene_report');
      } else if (format === 'csv' || format === 'excel') {
        // Prepare WHO moments data for CSV/Excel
        const whoMomentsExportData = prepareWHOMomentsData(complianceReport?.whoMoments || []);
        
        if (whoMomentsExportData.length === 0) {
          Alert.alert('No Data', 'There is no data to export');
          return;
        }

        if (format === 'csv') {
          success = await exportToCSV(whoMomentsExportData, 'hand_hygiene_report');
        } else {
          success = await exportToExcel(whoMomentsExportData, 'hand_hygiene_report');
        }
      }

      if (success) {
        // Success message is handled by the export functions
        console.log(`${format.toUpperCase()} export successful`);
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', error.message || 'Failed to export report');
    }
  };

  const clearFilters = () => {
    setSelectedPeriod('week');
    setSelectedDepartment('');
    setSelectedWard('');
  };

  const getComplianceColor = (rate) => {
    if (rate >= 90) return COLORS.emerald;
    if (rate >= 75) return COLORS.amber;
    return COLORS.rose;
  };

  const formatWHOMoment = (moment) => {
    const labels = {
      before_patient: 'Before Patient',
      before_aseptic: 'Before Aseptic',
      after_body_fluid: 'After Body Fluid',
      after_patient: 'After Patient',
      after_surroundings: 'After Surroundings',
    };
    return labels[moment] || moment;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: COLORS.indigo.muted,
            borderWidth: 2,
            borderColor: COLORS.indigo.ring,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.indigo.primary} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748b', letterSpacing: 0.3 }}>
          Loading Reports...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.indigo.primary} />
      }
    >
      {/* Premium Header with Gradient */}
      <LinearGradient
        colors={COLORS.indigo.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 32,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name="bar-chart" size={24} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
              Reports & Analytics
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              Compliance insights & trends
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Period Filter - Premium Pills */}
      <View style={{ paddingHorizontal: 20, marginTop: -20, marginBottom: 20 }}>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: '#f1f5f9',
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Time Period
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[
                { value: 'today', label: 'Today', icon: 'today' },
                { value: 'week', label: 'Week', icon: 'calendar' },
                { value: 'month', label: 'Month', icon: 'calendar-outline' },
                { value: 'all', label: 'All Time', icon: 'infinite' },
              ].map((period) => (
                <Pressable
                  key={period.value}
                  onPress={() => setSelectedPeriod(period.value)}
                  className="active:scale-95"
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 9999,
                    backgroundColor: selectedPeriod === period.value ? COLORS.indigo.primary : COLORS.indigo.muted,
                    borderWidth: 1,
                    borderColor: selectedPeriod === period.value ? COLORS.indigo.primary : COLORS.indigo.light,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Ionicons 
                    name={period.icon} 
                    size={14} 
                    color={selectedPeriod === period.value ? '#ffffff' : COLORS.indigo.primary} 
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: selectedPeriod === period.value ? '#ffffff' : COLORS.indigo.primary,
                    }}
                  >
                    {period.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Department Filter */}
      {departments.length > 0 && (
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Department
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={() => setSelectedDepartment('')}
                  className="active:scale-95"
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 9999,
                    backgroundColor: selectedDepartment === '' ? COLORS.cyan.primary : COLORS.cyan.muted,
                    borderWidth: 1,
                    borderColor: selectedDepartment === '' ? COLORS.cyan.primary : COLORS.cyan.light,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: selectedDepartment === '' ? '#ffffff' : COLORS.cyan.primary,
                    }}
                  >
                    All
                  </Text>
                </Pressable>
                {departments.map((dept) => (
                  <Pressable
                    key={dept._id}
                    onPress={() => setSelectedDepartment(dept.name)}
                    className="active:scale-95"
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 9999,
                      backgroundColor: selectedDepartment === dept.name ? COLORS.cyan.primary : COLORS.cyan.muted,
                      borderWidth: 1,
                      borderColor: selectedDepartment === dept.name ? COLORS.cyan.primary : COLORS.cyan.light,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: selectedDepartment === dept.name ? '#ffffff' : COLORS.cyan.primary,
                      }}
                    >
                      {dept.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Ward Filter */}
      {wards.length > 0 && (
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Ward
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={() => setSelectedWard('')}
                  className="active:scale-95"
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 9999,
                    backgroundColor: selectedWard === '' ? COLORS.violet.primary : COLORS.violet.muted,
                    borderWidth: 1,
                    borderColor: selectedWard === '' ? COLORS.violet.primary : COLORS.violet.light,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: selectedWard === '' ? '#ffffff' : COLORS.violet.primary,
                    }}
                  >
                    All
                  </Text>
                </Pressable>
                {wards.map((ward) => (
                  <Pressable
                    key={ward._id}
                    onPress={() => setSelectedWard(ward.name)}
                    className="active:scale-95"
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 9999,
                      backgroundColor: selectedWard === ward.name ? COLORS.violet.primary : COLORS.violet.muted,
                      borderWidth: 1,
                      borderColor: selectedWard === ward.name ? COLORS.violet.primary : COLORS.violet.light,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: selectedWard === ward.name ? '#ffffff' : COLORS.violet.primary,
                      }}
                    >
                      {ward.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Clear Filters Button */}
      {(selectedDepartment || selectedWard || selectedPeriod !== 'week') && (
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Pressable
            onPress={clearFilters}
            className="active:scale-98"
            style={{
              backgroundColor: COLORS.rose.muted,
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: COLORS.rose.light,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Ionicons name="close-circle" size={16} color={COLORS.rose.primary} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.rose.primary }}>
              Clear All Filters
            </Text>
          </Pressable>
        </View>
      )}

      {/* Summary Stats - Premium Cards */}
      {stats && (
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12, letterSpacing: -0.3 }}>
            Summary
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {/* Total Observations */}
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.indigo.muted,
                  borderWidth: 1,
                  borderColor: COLORS.indigo.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="document-text" size={18} color={COLORS.indigo.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#1e293b', letterSpacing: -1 }}>
                {stats.totalObservations}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Total Observations
              </Text>
            </View>

            {/* Compliance Rate */}
            {(() => {
              const complianceColor = getComplianceColor(stats.complianceRate);
              return (
                <View
                  style={{
                    flex: 1,
                    minWidth: '45%',
                    backgroundColor: '#ffffff',
                    borderRadius: 18,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#f1f5f9',
                    shadowColor: '#0f172a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: complianceColor.muted,
                      borderWidth: 1,
                      borderColor: complianceColor.light,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons name="checkmark-circle" size={18} color={complianceColor.primary} />
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: complianceColor.primary, letterSpacing: -1 }}>
                    {stats.complianceRate}%
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    Compliance Rate
                  </Text>
                </View>
              );
            })()}

            {/* Adherence */}
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.emerald.muted,
                  borderWidth: 1,
                  borderColor: COLORS.emerald.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="checkmark-done" size={18} color={COLORS.emerald.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.emerald.primary, letterSpacing: -1 }}>
                {stats.breakdown?.adherence || 0}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Adherence
              </Text>
            </View>

            {/* Partial */}
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.amber.muted,
                  borderWidth: 1,
                  borderColor: COLORS.amber.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="remove-circle" size={18} color={COLORS.amber.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.amber.primary, letterSpacing: -1 }}>
                {stats.breakdown?.partial || 0}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Partial
              </Text>
            </View>

            {/* Missed */}
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.rose.muted,
                  borderWidth: 1,
                  borderColor: COLORS.rose.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="close-circle" size={18} color={COLORS.rose.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.rose.primary, letterSpacing: -1 }}>
                {stats.breakdown?.missed || 0}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Missed
              </Text>
            </View>

            {/* Total Users */}
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.violet.muted,
                  borderWidth: 1,
                  borderColor: COLORS.violet.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="people" size={18} color={COLORS.violet.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#1e293b', letterSpacing: -1 }}>
                {stats.totalUsers || 0}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Active Users
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Compliance Progress Chart */}
      {stats && (
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.emerald.muted,
                  borderWidth: 1,
                  borderColor: COLORS.emerald.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="bar-chart" size={20} color={COLORS.emerald.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                  Compliance Breakdown
                </Text>
                <Text style={{ fontSize: 12, color: '#64748b' }}>
                  Overall adherence rates
                </Text>
              </View>
            </View>
            
            <ComplianceProgressChart
              adherenceRate={stats.breakdown?.adherence ? Math.round((stats.breakdown.adherence / stats.totalObservations) * 100) : 0}
              partialRate={stats.breakdown?.partial ? Math.round((stats.breakdown.partial / stats.totalObservations) * 100) : 0}
              missedRate={stats.breakdown?.missed ? Math.round((stats.breakdown.missed / stats.totalObservations) * 100) : 0}
            />
          </View>
        </View>
      )}

      {/* WHO 5 Moments Bar Chart */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: '#f1f5f9',
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: COLORS.indigo.muted,
                borderWidth: 1,
                borderColor: COLORS.indigo.light,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="hand-left" size={20} color={COLORS.indigo.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                WHO 5 Moments
              </Text>
              <Text style={{ fontSize: 12, color: '#64748b' }}>
                Compliance by moment type
              </Text>
            </View>
          </View>
          
          <WHOMomentsBarChart data={whoMomentsData} />
        </View>
      </View>

      {/* Department Distribution Pie Chart */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: '#f1f5f9',
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: COLORS.violet.muted,
                borderWidth: 1,
                borderColor: COLORS.violet.light,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="pie-chart" size={20} color={COLORS.violet.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                Department Distribution
              </Text>
              <Text style={{ fontSize: 12, color: '#64748b' }}>
                Observations by department
              </Text>
            </View>
          </View>
          
          <DepartmentPieChart data={departmentData} />
        </View>
      </View>

      {/* WHO 5 Moments Breakdown - Premium Design */}
      {complianceReport && complianceReport.whoMoments && (
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12, letterSpacing: -0.3 }}>
            WHO 5 Moments Breakdown
          </Text>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
              overflow: 'hidden',
            }}
          >
            {complianceReport.whoMoments.map((moment, index) => {
              const rate = parseFloat(moment.complianceRate) || 0;
              const color = getComplianceColor(rate);
              return (
                <View
                  key={moment.moment}
                  style={{
                    padding: 16,
                    borderBottomWidth: index < complianceReport.whoMoments.length - 1 ? 1 : 0,
                    borderBottomColor: '#f1f5f9',
                  }}
                >
                  {/* Header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', flex: 1 }}>
                      {formatWHOMoment(moment.moment)}
                    </Text>
                    <View
                      style={{
                        backgroundColor: color.muted,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 9999,
                        borderWidth: 1,
                        borderColor: color.light,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '800', color: color.primary }}>
                        {rate.toFixed(1)}%
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View
                    style={{
                      height: 8,
                      backgroundColor: '#f1f5f9',
                      borderRadius: 9999,
                      overflow: 'hidden',
                      marginBottom: 12,
                    }}
                  >
                    <LinearGradient
                      colors={color.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        height: '100%',
                        width: `${rate}%`,
                        borderRadius: 9999,
                      }}
                    />
                  </View>

                  {/* Breakdown Stats */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#94a3b8',
                        }}
                      />
                      <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '500' }}>
                        Total: {moment.total}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="checkmark-circle" size={12} color={COLORS.emerald.primary} />
                      <Text style={{ fontSize: 10, color: COLORS.emerald.primary, fontWeight: '600' }}>
                        {moment.adherence}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="remove-circle" size={12} color={COLORS.amber.primary} />
                      <Text style={{ fontSize: 10, color: COLORS.amber.primary, fontWeight: '600' }}>
                        {moment.partial}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="close-circle" size={12} color={COLORS.rose.primary} />
                      <Text style={{ fontSize: 10, color: COLORS.rose.primary, fontWeight: '600' }}>
                        {moment.missed}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Export Options - Premium Buttons */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12, letterSpacing: -0.3 }}>
          Export Report
        </Text>
        <View style={{ gap: 10 }}>
          {[
            { format: 'pdf', label: 'Export as PDF', icon: 'document-text', color: COLORS.rose },
            { format: 'excel', label: 'Export as Excel', icon: 'grid', color: COLORS.emerald },
            { format: 'csv', label: 'Export as CSV', icon: 'list', color: COLORS.indigo },
          ].map((option) => (
            <Pressable
              key={option.format}
              onPress={() => handleExport(option.format)}
              className="active:scale-98"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
                overflow: 'hidden',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
                <LinearGradient
                  colors={option.color.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <Ionicons name={option.icon} size={20} color="white" />
                </LinearGradient>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e293b', flex: 1 }}>
                  {option.label}
                </Text>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: option.color.muted,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="download" size={14} color={option.color.primary} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Footer Info */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <View
          style={{
            backgroundColor: COLORS.indigo.muted,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.indigo.light,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="information-circle" size={18} color={COLORS.indigo.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.indigo.primary, marginBottom: 4 }}>
                Real-Time Data
              </Text>
              <Text style={{ fontSize: 11, color: '#475569', lineHeight: 16 }}>
                Reports are generated in real-time based on your selected filters and current data.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ReportsScreen;
