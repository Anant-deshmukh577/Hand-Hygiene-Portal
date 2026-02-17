import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { reportService } from '../../services/reportService';
import { userService } from '../../services/userService';
import { wardService } from '../../services/wardService';
import { observationService } from '../../services/observationService';
import { WeeklyPerformanceChart, WHOMomentsBarChart, DepartmentPieChart } from '../../components/charts/Charts';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalObservations: 0,
    averageCompliance: 0,
    activeWards: 0,
  });
  const [whoMomentsData, setWhoMomentsData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsResponse = await reportService.getDashboardStats();
      const dashboardStats = statsResponse.stats || {};

      // Fetch users count
      let totalUsers = 0;
      try {
        const usersResponse = await userService.getAllUsers({ limit: 1 });
        totalUsers = usersResponse.total || 0;
      } catch {
        totalUsers = 0;
      }

      // Fetch wards count
      let activeWards = 0;
      try {
        const wardsResponse = await wardService.getWards();
        activeWards = (wardsResponse.wards || []).length;
      } catch {
        activeWards = 0;
      }

      setStats({
        totalUsers,
        totalObservations: dashboardStats.totalObservations || 0,
        averageCompliance: Math.round(dashboardStats.complianceRate || 0),
        activeWards,
      });

      // Fetch WHO Moments data for chart
      try {
        const complianceResponse = await reportService.getComplianceReport({});
        const whoMoments = complianceResponse.report?.whoMoments || [];
        const formattedMoments = whoMoments.map(m => ({
          name: m.moment.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          adherence: m.adherence || 0,
          partial: m.partial || 0,
          missed: m.missed || 0,
        }));
        setWhoMomentsData(formattedMoments);
      } catch (error) {
        console.error('Error fetching WHO moments data:', error);
      }

      // Fetch department distribution data
      try {
        const obsResponse = await observationService.getObservations({ limit: 1000 });
        const observations = obsResponse.observations || [];
        
        const deptCounts = {};
        observations.forEach(obs => {
          const dept = obs.department;
          if (dept) {
            deptCounts[dept] = (deptCounts[dept] || 0) + 1;
          }
        });
        
        const deptData = Object.entries(deptCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6);
        
        setDepartmentData(deptData);
      } catch (error) {
        console.error('Error fetching department data:', error);
      }

      // Fetch recent activities from all users (admin view)
      try {
        const usersResponse = await userService.getAllUsers({ limit: 10 });
        const allUsers = usersResponse.users || [];
        
        const allActivities = [];
        for (const user of allUsers) {
          try {
            const activityResponse = await userService.getUserActivity(user._id || user.id);
            const userActivities = (activityResponse.activities || []).map(activity => ({
              ...activity,
              userName: user.name,
            }));
            allActivities.push(...userActivities);
          } catch (error) {
            continue;
          }
        }
        
        allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentActivities(allActivities.slice(0, 10));
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        setRecentActivities([]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Quick Actions with premium styling
  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Add, edit, or remove users',
      icon: 'people',
      screen: 'ManageUsers',
      color: COLORS.indigo,
    },
    {
      title: 'Manage Wards',
      description: 'Configure hospital wards',
      icon: 'business',
      screen: 'ManageWards',
      color: COLORS.cyan,
    },
    {
      title: 'Manage Rewards',
      description: 'Set up rewards',
      icon: 'gift',
      screen: 'ManageRewards',
      color: COLORS.amber,
    },
    {
      title: 'View Reports',
      description: 'Analytics and insights',
      icon: 'bar-chart',
      screen: 'Reports',
      color: COLORS.rose,
    },
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: COLORS.violet.muted,
            borderWidth: 2,
            borderColor: COLORS.violet.ring,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.violet.primary} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748b', letterSpacing: 0.3 }}>
          Loading Dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.violet.primary} />
      }
    >
      {/* Premium Header with Gradient */}
      <LinearGradient
        colors={COLORS.violet.gradient}
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
        {/* Header Title */}
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
            <Ionicons name="shield-checkmark" size={24} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
              Admin Portal
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              System Control Center
            </Text>
          </View>
        </View>

        {/* Admin Badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#ffffff', letterSpacing: 0.5 }}>
              🛡️ ADMINISTRATOR
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Grid - Premium Cards */}
      <View style={{ paddingHorizontal: 20, marginTop: -20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {/* Total Users Card */}
          <View
            style={{
              flex: 1,
              minWidth: '45%',
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
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: COLORS.indigo.muted,
                borderWidth: 1,
                borderColor: COLORS.indigo.light,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons name="people" size={20} color={COLORS.indigo.primary} />
            </View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#1e293b', letterSpacing: -1 }}>
              {stats.totalUsers}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2, marginBottom: 8 }}>
              Total Users
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.emerald.muted,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                alignSelf: 'flex-start',
              }}
            >
              <Ionicons name="trending-up" size={10} color={COLORS.emerald.primary} />
              <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.emerald.primary, marginLeft: 4 }}>
                +12 this month
              </Text>
            </View>
          </View>

          {/* Total Observations Card */}
          <View
            style={{
              flex: 1,
              minWidth: '45%',
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
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: COLORS.cyan.muted,
                borderWidth: 1,
                borderColor: COLORS.cyan.light,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons name="clipboard" size={20} color={COLORS.cyan.primary} />
            </View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#1e293b', letterSpacing: -1 }}>
              {stats.totalObservations}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2, marginBottom: 8 }}>
              Observations
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.emerald.muted,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                alignSelf: 'flex-start',
              }}
            >
              <Ionicons name="trending-up" size={10} color={COLORS.emerald.primary} />
              <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.emerald.primary, marginLeft: 4 }}>
                +324 this week
              </Text>
            </View>
          </View>

          {/* Average Compliance Card */}
          <View
            style={{
              flex: 1,
              minWidth: '45%',
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
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: stats.averageCompliance >= 90 ? COLORS.emerald.muted : COLORS.amber.muted,
                borderWidth: 1,
                borderColor: stats.averageCompliance >= 90 ? COLORS.emerald.light : COLORS.amber.light,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={stats.averageCompliance >= 90 ? COLORS.emerald.primary : COLORS.amber.primary} 
              />
            </View>
            <Text 
              style={{ 
                fontSize: 26, 
                fontWeight: '800', 
                color: stats.averageCompliance >= 90 ? COLORS.emerald.primary : COLORS.amber.primary, 
                letterSpacing: -1 
              }}
            >
              {stats.averageCompliance}%
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2, marginBottom: 8 }}>
              Avg Compliance
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: stats.averageCompliance >= 90 ? COLORS.emerald.muted : COLORS.amber.muted,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                alignSelf: 'flex-start',
              }}
            >
              <Text 
                style={{ 
                  fontSize: 10, 
                  fontWeight: '600', 
                  color: stats.averageCompliance >= 90 ? COLORS.emerald.primary : COLORS.amber.primary 
                }}
              >
                {stats.averageCompliance >= 90 ? '✓ Excellent!' : '+3% from last week'}
              </Text>
            </View>
          </View>

          {/* Active Wards Card */}
          <View
            style={{
              flex: 1,
              minWidth: '45%',
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
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: COLORS.rose.muted,
                borderWidth: 1,
                borderColor: COLORS.rose.light,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons name="business" size={20} color={COLORS.rose.primary} />
            </View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#1e293b', letterSpacing: -1 }}>
              {stats.activeWards}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2, marginBottom: 8 }}>
              Active Wards
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.emerald.muted,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                alignSelf: 'flex-start',
              }}
            >
              <Ionicons name="checkmark" size={10} color={COLORS.emerald.primary} />
              <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.emerald.primary, marginLeft: 4 }}>
                All operational
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* System Status - Premium Design */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12, letterSpacing: -0.3 }}>
          System Status
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
          {[
            { label: 'API Server', status: 'online', icon: 'server-outline', color: COLORS.emerald },
            { label: 'Database', status: 'online', icon: 'server-outline', color: COLORS.indigo },
            { label: 'Authentication', status: 'online', icon: 'lock-closed-outline', color: COLORS.violet },
            { label: 'File Storage', status: 'online', icon: 'cloud-outline', color: COLORS.cyan },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: index < 3 ? 1 : 0,
                borderBottomColor: '#f1f5f9',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: item.color.muted,
                    borderWidth: 1,
                    borderColor: item.color.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons name={item.icon} size={16} color={item.color.primary} />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#334155' }}>
                  {item.label}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: item.status === 'online' ? COLORS.emerald.muted : COLORS.rose.muted,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: item.status === 'online' ? COLORS.emerald.light : COLORS.rose.light,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: item.status === 'online' ? COLORS.emerald.primary : COLORS.rose.primary,
                    letterSpacing: 0.5,
                  }}
                >
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}

          {/* All Systems Operational Banner */}
          <LinearGradient
            colors={[COLORS.emerald.light, '#d1fae5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingHorizontal: 16, paddingVertical: 14 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  shadowColor: COLORS.emerald.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons name="checkmark-circle" size={18} color={COLORS.emerald.primary} />
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.emerald.primary, flex: 1 }}>
                All systems operational
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Quick Actions - Premium Cards */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 12, letterSpacing: -0.3 }}>
          Quick Actions
        </Text>
        <View style={{ gap: 12 }}>
          {quickActions.map((action, index) => (
            <Pressable
              key={index}
              onPress={() => navigation.navigate(action.screen)}
              className="active:scale-98"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 18,
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
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                {/* Icon with gradient background */}
                <LinearGradient
                  colors={action.color.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                    shadowColor: action.color.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <Ionicons name={action.icon} size={24} color="white" />
                </LinearGradient>

                {/* Content */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 2, letterSpacing: -0.2 }}>
                    {action.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#64748b' }}>
                    {action.description}
                  </Text>
                </View>

                {/* Arrow */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: action.color.muted,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="chevron-forward" size={16} color={action.color.primary} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Recent Activity - Premium Design */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
            Recent Activity
          </Text>
          <Pressable 
            onPress={() => navigation.navigate('Profile')}
            className="active:opacity-60"
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.violet.primary, marginRight: 4 }}>
                View All
              </Text>
              <Ionicons name="chevron-forward" size={12} color={COLORS.violet.primary} />
            </View>
          </Pressable>
        </View>

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
          {recentActivities.length > 0 ? (
            recentActivities.slice(0, 4).map((activity, index) => {
              const getActivityIcon = () => {
                if (activity.type === 'earned' || activity.source === 'observation') return 'checkmark-circle';
                if (activity.type === 'spent' || activity.source === 'reward') return 'gift';
                if (activity.source === 'badge') return 'star';
                return 'clipboard';
              };
              
              const getActivityColor = () => {
                if (activity.type === 'earned' || activity.source === 'observation') return COLORS.emerald;
                if (activity.type === 'spent' || activity.source === 'reward') return COLORS.amber;
                if (activity.source === 'badge') return COLORS.violet;
                return COLORS.indigo;
              };
              
              const color = getActivityColor();
              
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: index < recentActivities.slice(0, 4).length - 1 ? 1 : 0,
                    borderBottomColor: '#f1f5f9',
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: color.muted,
                      borderWidth: 1,
                      borderColor: color.light,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name={getActivityIcon()} size={18} color={color.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b', marginBottom: 2 }} numberOfLines={1}>
                      {activity.description}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                      {activity.points > 0 ? `+${activity.points}` : activity.points} points
                    </Text>
                  </View>
                  <Text style={{ fontSize: 10, color: '#cbd5e1', fontWeight: '500' }}>
                    {new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={{ paddingVertical: 32, paddingHorizontal: 16, alignItems: 'center' }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: '#f1f5f9',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons name="clipboard-outline" size={24} color="#94a3b8" />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 4 }}>
                No recent activity
              </Text>
              <Text style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
                Activity will appear here as users interact with the system
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Analytics Charts Section */}
      <View style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 16, letterSpacing: -0.3 }}>
          📊 Analytics Overview
        </Text>

        {/* WHO 5 Moments Chart */}
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
            marginBottom: 16,
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

        {/* Department Distribution Chart */}
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

      {/* System Alerts - Premium Design */}
      <View style={{ paddingHorizontal: 20, marginTop: 24, paddingBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
            System Alerts
          </Text>
          <View
            style={{
              backgroundColor: COLORS.emerald.muted,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: COLORS.emerald.light,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.emerald.primary, letterSpacing: 0.5 }}>
              ALL CLEAR
            </Text>
          </View>
        </View>

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
            padding: 24,
          }}
        >
          {/* Success Icon */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <LinearGradient
              colors={[COLORS.emerald.light, '#d1fae5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: COLORS.emerald.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <Ionicons name="checkmark-circle" size={36} color={COLORS.emerald.primary} />
            </LinearGradient>
          </View>

          {/* Message */}
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b', textAlign: 'center', marginBottom: 8 }}>
            No Active Alerts
          </Text>
          <Text style={{ fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 18 }}>
            All systems are running smoothly. No issues detected.
          </Text>

          {/* Pro Tip */}
          <View
            style={{
              marginTop: 20,
              backgroundColor: COLORS.indigo.muted,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: COLORS.indigo.light,
              padding: 14,
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
                <Ionicons name="bulb" size={16} color={COLORS.indigo.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.indigo.primary, marginBottom: 4 }}>
                  Pro Tip
                </Text>
                <Text style={{ fontSize: 11, color: '#475569', lineHeight: 16 }}>
                  Set up email notifications to receive alerts instantly.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminDashboardScreen;
