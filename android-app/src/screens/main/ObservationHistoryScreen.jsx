import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { observationService } from '../../services/observationService';
import Loader from '../../components/common/Loader';
import { ADHERENCE_OPTIONS } from '../../utils/constants';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const ObservationHistoryScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [observations, setObservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, compliant, non-compliant

  // Fetch observations
  const fetchObservations = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      if (!user?.id) {
        setObservations([]);
        return;
      }

      const canViewAll = user?.role === 'auditor' || user?.role === 'admin';
      const response = canViewAll
        ? await observationService.getObservations({ limit: 100 })
        : await observationService.getObservationsByUser(user.id, { limit: 100 });
      
      const fetchedObservations = (response.observations || []).map(obs => ({
        id: obs._id,
        department: obs.department,
        designation: obs.designation,
        whoMoment: obs.whoMoment,
        adherence: obs.adherence,
        action: obs.action,
        glove: obs.glove,
        remarks: obs.remarks || '',
        ward: obs.ward,
        createdAt: obs.createdAt,
      }));

      setObservations(fetchedObservations);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load observations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, user?.role]);

  // Filter observations
  const filteredObservations = useMemo(() => {
    return observations.filter(obs => {
      const matchesSearch = 
        obs.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.remarks?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === 'all' ||
        (filterStatus === 'compliant' && (obs.adherence === 'adherence' || obs.adherence === 'hand_rub' || obs.adherence === 'hand_wash')) ||
        (filterStatus === 'non-compliant' && (obs.adherence === 'missed' || obs.adherence === 'gloves_only'));
      
      return matchesSearch && matchesStatus;
    });
  }, [observations, searchTerm, filterStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredObservations.length;
    const adherence = filteredObservations.filter(o => 
      o.adherence === 'adherence' || o.adherence === 'hand_rub' || o.adherence === 'hand_wash'
    ).length;
    const partial = filteredObservations.filter(o => o.adherence === 'gloves_only').length;
    const missed = filteredObservations.filter(o => o.adherence === 'missed').length;
    const complianceRate = total > 0 ? Math.round((adherence / total) * 100) : 0;
    
    return { total, adherence, partial, missed, complianceRate };
  }, [filteredObservations]);

  // Format WHO moment
  const formatWhoMoment = (moment) => {
    if (!moment) return 'N/A';
    if (moment.startsWith('moment_')) {
      return `Moment ${moment.split('_')[1]}`;
    }
    return moment.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get adherence badge color
  const getAdherenceBadge = (adherence) => {
    if (adherence === 'adherence' || adherence === 'hand_rub' || adherence === 'hand_wash') {
      return { ...COLORS.emerald, label: 'Adherence' };
    }
    if (adherence === 'gloves_only') {
      return { ...COLORS.amber, label: 'Gloves Only' };
    }
    return { ...COLORS.rose, label: 'Missed' };
  };

  useEffect(() => {
    if (user?.id) {
      fetchObservations();
    }
  }, [user?.id, fetchObservations]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchObservations(true);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  // Render observation card
  const renderObservationCard = ({ item, index }) => {
    const badge = getAdherenceBadge(item.adherence);
    
    return (
      <View
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#f1f5f9',
          padding: 16,
          marginBottom: 12,
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 4 }}>
              Observation #{index + 1}
            </Text>
            <Text style={{ fontSize: 13, color: '#64748b' }}>
              {item.department || 'N/A'}
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 10,
              backgroundColor: badge.muted,
              borderWidth: 1,
              borderColor: badge.light,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: badge.primary, letterSpacing: 0.5 }}>
              {badge.label.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Details Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flex: 1, minWidth: '45%' }}>
            <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: '600' }}>WHO Moment</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b' }}>
              {formatWhoMoment(item.whoMoment)}
            </Text>
          </View>
          <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flex: 1, minWidth: '45%' }}>
            <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: '600' }}>Action</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', textTransform: 'uppercase' }}>
              {item.action || 'N/A'}
            </Text>
          </View>
          {item.designation && (
            <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flex: 1, minWidth: '45%' }}>
              <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: '600' }}>Designation</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b' }}>
                {item.designation}
              </Text>
            </View>
          )}
          <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flex: 1, minWidth: '45%' }}>
            <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: '600' }}>Glove</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', textTransform: 'uppercase' }}>
              {item.glove || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Remarks */}
        {item.remarks && (
          <View style={{ backgroundColor: COLORS.indigo.muted, borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.indigo.light }}>
            <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: '600' }}>Remarks</Text>
            <Text style={{ fontSize: 13, color: '#475569', fontStyle: 'italic' }}>
              "{item.remarks}"
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={{ borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="time-outline" size={12} color="#94a3b8" />
          <Text style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>
            {new Date(item.createdAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <Loader />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <FlatList
        data={filteredObservations}
        renderItem={renderObservationCard}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.indigo.primary}
          />
        }
        ListHeaderComponent={
          <>
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
                  <Ionicons name="clipboard" size={24} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
                    Observation History
                  </Text>
                  <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                    View past observations
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Stats Cards - Premium */}
            <View style={{ paddingHorizontal: 20, marginTop: -20, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
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
                    <Ionicons name="list" size={18} color={COLORS.indigo.primary} />
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.indigo.primary, letterSpacing: -1 }}>
                    {stats.total}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    Total
                  </Text>
                </View>
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
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.emerald.primary} />
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.emerald.primary, letterSpacing: -1 }}>
                    {stats.adherence}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    Adherence
                  </Text>
                </View>
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
                    <Ionicons name="hand-right" size={18} color={COLORS.amber.primary} />
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.amber.primary, letterSpacing: -1 }}>
                    {stats.partial}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    Gloves Only
                  </Text>
                </View>
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
                      backgroundColor: stats.complianceRate >= 90 ? COLORS.emerald.muted : stats.complianceRate >= 75 ? COLORS.amber.muted : COLORS.rose.muted,
                      borderWidth: 1,
                      borderColor: stats.complianceRate >= 90 ? COLORS.emerald.light : stats.complianceRate >= 75 ? COLORS.amber.light : COLORS.rose.light,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons 
                      name="stats-chart" 
                      size={18} 
                      color={stats.complianceRate >= 90 ? COLORS.emerald.primary : stats.complianceRate >= 75 ? COLORS.amber.primary : COLORS.rose.primary}
                    />
                  </View>
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: '800', 
                    color: stats.complianceRate >= 90 ? COLORS.emerald.primary : stats.complianceRate >= 75 ? COLORS.amber.primary : COLORS.rose.primary,
                    letterSpacing: -1 
                  }}>
                    {stats.complianceRate}%
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    Compliance
                  </Text>
                </View>
              </View>
            </View>

            {/* Search - Premium */}
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  shadowColor: '#0f172a',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 10 }} />
                <TextInput
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  placeholder="Search by department, designation..."
                  placeholderTextColor="#94a3b8"
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: '#1e293b',
                    fontWeight: '500',
                  }}
                />
                {searchTerm ? (
                  <Pressable
                    onPress={() => setSearchTerm('')}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.5 : 1,
                      padding: 4,
                    })}
                  >
                    <Ionicons name="close-circle" size={18} color="#94a3b8" />
                  </Pressable>
                ) : null}
              </View>
            </View>

            {/* Filter Buttons - Premium */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Pressable
                    onPress={() => setFilterStatus('all')}
                    style={({ pressed }) => ({
                      paddingHorizontal: 18,
                      paddingVertical: 10,
                      borderRadius: 14,
                      backgroundColor: filterStatus === 'all' ? COLORS.indigo.primary : '#ffffff',
                      borderWidth: 1,
                      borderColor: filterStatus === 'all' ? COLORS.indigo.primary : '#e2e8f0',
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                      shadowColor: filterStatus === 'all' ? COLORS.indigo.primary : '#0f172a',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: filterStatus === 'all' ? 0.2 : 0.03,
                      shadowRadius: 4,
                      elevation: filterStatus === 'all' ? 3 : 1,
                    })}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: filterStatus === 'all' ? '#ffffff' : '#64748b',
                      }}
                    >
                      All ({observations.length})
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setFilterStatus('compliant')}
                    style={({ pressed }) => ({
                      paddingHorizontal: 18,
                      paddingVertical: 10,
                      borderRadius: 14,
                      backgroundColor: filterStatus === 'compliant' ? COLORS.emerald.primary : '#ffffff',
                      borderWidth: 1,
                      borderColor: filterStatus === 'compliant' ? COLORS.emerald.primary : '#e2e8f0',
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                      shadowColor: filterStatus === 'compliant' ? COLORS.emerald.primary : '#0f172a',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: filterStatus === 'compliant' ? 0.2 : 0.03,
                      shadowRadius: 4,
                      elevation: filterStatus === 'compliant' ? 3 : 1,
                    })}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: filterStatus === 'compliant' ? '#ffffff' : '#64748b',
                      }}
                    >
                      Compliant ({stats.adherence})
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setFilterStatus('non-compliant')}
                    style={({ pressed }) => ({
                      paddingHorizontal: 18,
                      paddingVertical: 10,
                      borderRadius: 14,
                      backgroundColor: filterStatus === 'non-compliant' ? COLORS.rose.primary : '#ffffff',
                      borderWidth: 1,
                      borderColor: filterStatus === 'non-compliant' ? COLORS.rose.primary : '#e2e8f0',
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                      shadowColor: filterStatus === 'non-compliant' ? COLORS.rose.primary : '#0f172a',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: filterStatus === 'non-compliant' ? 0.2 : 0.03,
                      shadowRadius: 4,
                      elevation: filterStatus === 'non-compliant' ? 3 : 1,
                    })}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: filterStatus === 'non-compliant' ? '#ffffff' : '#64748b',
                      }}
                    >
                      Non-Compliant ({stats.missed + stats.partial})
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>

            {/* Clear Filters - Premium */}
            {(searchTerm || filterStatus !== 'all') && (
              <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <Pressable
                  onPress={handleClearFilters}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.rose.muted,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    alignSelf: 'flex-start',
                    borderWidth: 1,
                    borderColor: COLORS.rose.light,
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  })}
                >
                  <Ionicons name="close-circle" size={16} color={COLORS.rose.primary} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.rose.primary }}>
                    Clear Filters
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Results Count - Premium */}
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
              <Text style={{ fontSize: 12, color: '#64748b', fontWeight: '600' }}>
                Showing {filteredObservations.length} of {observations.length} observations
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 24,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                padding: 48,
                alignItems: 'center',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: COLORS.indigo.muted,
                  borderWidth: 1,
                  borderColor: COLORS.indigo.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Ionicons 
                  name={observations.length === 0 ? "clipboard-outline" : "search-outline"} 
                  size={36} 
                  color={COLORS.indigo.primary} 
                />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 8, textAlign: 'center' }}>
                {observations.length === 0 ? 'No Observations Yet' : 'No Results Found'}
              </Text>
              <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
                {observations.length === 0
                  ? 'Start recording observations to see them here'
                  : 'Try adjusting your filters to see more results'}
              </Text>
              {observations.length === 0 ? null : (
                <Pressable
                  onPress={handleClearFilters}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.indigo.primary,
                    borderRadius: 14,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    shadowColor: COLORS.indigo.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  })}
                >
                  <Ionicons name="refresh" size={16} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>
                    Clear Filters
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        }
      />
    </View>
  );
};

export default ObservationHistoryScreen;
