import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { wardService } from '../../services/wardService';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const ManageWardsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wards, setWards] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);

  // Add ward form state
  const [newWard, setNewWard] = useState({
    name: '',
    capacity: '',
    floor: '',
    building: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadWards();
  }, []);

  const loadWards = async () => {
    try {
      setLoading(true);
      const response = await wardService.getWards();
      setWards(response.wards || []);
    } catch (error) {
      console.error('Error loading wards:', error);
      Alert.alert('Error', 'Failed to load wards');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWards();
    setRefreshing(false);
  };

  const handleAddWard = async () => {
    // Validate
    const errors = {};
    if (!newWard.name.trim()) errors.name = 'Ward name required';
    if (!newWard.capacity || parseInt(newWard.capacity) <= 0) errors.capacity = 'Valid capacity required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await wardService.createWard({
        ...newWard,
        capacity: parseInt(newWard.capacity),
      });
      setWards([response.ward, ...wards]);
      setShowAddModal(false);
      setNewWard({
        name: '',
        capacity: '',
        floor: '',
        building: '',
        description: '',
      });
      setFormErrors({});
      Alert.alert('Success', 'Ward added successfully');
    } catch (error) {
      console.error('Error adding ward:', error);
      Alert.alert('Error', error.message || 'Failed to add ward');
    }
  };

  const handleUpdateWard = async () => {
    if (!selectedWard) return;

    // Validate
    const errors = {};
    if (!selectedWard.name.trim()) errors.name = 'Ward name required';
    if (!selectedWard.capacity || parseInt(selectedWard.capacity) <= 0) errors.capacity = 'Valid capacity required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await wardService.updateWard(selectedWard._id, {
        name: selectedWard.name,
        capacity: parseInt(selectedWard.capacity),
        floor: selectedWard.floor,
        building: selectedWard.building,
        description: selectedWard.description,
      });
      setWards(wards.map(w => w._id === selectedWard._id ? response.ward : w));
      setShowEditModal(false);
      setSelectedWard(null);
      setFormErrors({});
      Alert.alert('Success', 'Ward updated successfully');
    } catch (error) {
      console.error('Error updating ward:', error);
      Alert.alert('Error', 'Failed to update ward');
    }
  };

  const handleDelete = async (wardId) => {
    const ward = wards.find(w => w._id === wardId);

    Alert.alert(
      'Delete Ward',
      `Are you sure you want to delete ${ward.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await wardService.deleteWard(wardId);
              setWards(wards.filter(w => w._id !== wardId));
              Alert.alert('Success', 'Ward deleted successfully');
            } catch (error) {
              console.error('Error deleting ward:', error);
              Alert.alert('Error', error.message || 'Failed to delete ward');
            }
          },
        },
      ]
    );
  };

  // Stats
  const stats = {
    total: wards.length,
    totalBeds: wards.reduce((sum, w) => sum + (w.capacity || 0), 0),
    totalObservations: wards.reduce((sum, w) => sum + (w.totalObservations || 0), 0),
    activeWards: wards.filter(w => w.isActive !== false).length,
  };

  // Ward colors
  const getWardColor = (index) => {
    const colors = [
      COLORS.cyan,
      COLORS.indigo,
      COLORS.violet,
      COLORS.amber,
      COLORS.rose,
      COLORS.emerald,
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: COLORS.cyan.muted,
            borderWidth: 2,
            borderColor: COLORS.cyan.ring,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.cyan.primary} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748b', letterSpacing: 0.3 }}>
          Loading Wards...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.cyan.primary} />
        }
      >
        {/* Premium Header with Gradient */}
        <LinearGradient
          colors={COLORS.cyan.gradient}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
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
                <Ionicons name="business" size={24} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
                  Manage Wards
                </Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                  Configure hospital wards
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => setShowAddModal(true)}
              className="active:scale-95"
            >
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Ionicons name="add-circle" size={16} color="white" />
                <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12 }}>
                  Add
                </Text>
              </View>
            </Pressable>
          </View>
        </LinearGradient>

        {/* Stats - Premium Cards */}
        <View style={{ paddingHorizontal: 20, marginTop: -20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {[
              { label: 'Total Wards', value: stats.total, icon: 'business', color: COLORS.cyan },
              { label: 'Total Beds', value: stats.totalBeds, icon: 'bed', color: COLORS.indigo },
              { label: 'Observations', value: stats.totalObservations, icon: 'clipboard', color: COLORS.violet },
              { label: 'Active Wards', value: stats.activeWards, icon: 'checkmark-circle', color: COLORS.emerald },
            ].map((stat, index) => (
              <View
                key={index}
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
                    backgroundColor: stat.color.muted,
                    borderWidth: 1,
                    borderColor: stat.color.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name={stat.icon} size={18} color={stat.color.primary} />
                </View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: stat.color.primary, letterSpacing: -1 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Wards List - Premium Design */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          {wards.length === 0 ? (
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                padding: 32,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: COLORS.cyan.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Ionicons name="business" size={40} color={COLORS.cyan.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 8 }}>
                No wards available
              </Text>
              <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 20 }}>
                Start by adding your first ward
              </Text>
              <Pressable
                onPress={() => setShowAddModal(true)}
                className="active:scale-95"
              >
                <LinearGradient
                  colors={COLORS.cyan.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 14,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Ionicons name="add-circle" size={18} color="white" />
                  <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
                    Create First Ward
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          ) : (
            wards.map((ward, index) => {
              const colors = getWardColor(index);
              return (
                <View
                  key={ward._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#f1f5f9',
                    marginBottom: 16,
                    overflow: 'hidden',
                    shadowColor: '#0f172a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  {/* Color Bar */}
                  <LinearGradient
                    colors={colors.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 4 }}
                  />

                  {/* Ward Content */}
                  <View style={{ padding: 16 }}>
                    {/* Header */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                      <LinearGradient
                        colors={colors.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons name="business" size={28} color="white" />
                      </LinearGradient>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 6 }}>
                          {ward.name}
                        </Text>
                        <View
                          style={{
                            backgroundColor: ward.isActive !== false ? COLORS.emerald.muted : '#f1f5f9',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 9999,
                            alignSelf: 'flex-start',
                            borderWidth: 1,
                            borderColor: ward.isActive !== false ? COLORS.emerald.light : '#e2e8f0',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: '700',
                              color: ward.isActive !== false ? COLORS.emerald.primary : '#64748b',
                            }}
                          >
                            {ward.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Stats Grid */}
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                      <View
                        style={{
                          flex: 1,
                          padding: 12,
                          borderRadius: 14,
                          backgroundColor: colors.muted,
                          borderWidth: 1,
                          borderColor: colors.light,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                          <Ionicons name="bed" size={14} color={colors.primary} />
                          <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748b', marginLeft: 6, letterSpacing: 0.5 }}>
                            BEDS
                          </Text>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.primary }}>
                          {ward.capacity}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          padding: 12,
                          borderRadius: 14,
                          backgroundColor: '#f8fafc',
                          borderWidth: 1,
                          borderColor: '#e2e8f0',
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                          <Ionicons name="clipboard" size={14} color="#64748b" />
                          <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748b', marginLeft: 6, letterSpacing: 0.5 }}>
                            OBS.
                          </Text>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: '800', color: '#475569' }}>
                          {ward.totalObservations || 0}
                        </Text>
                      </View>
                    </View>

                    {/* Additional Info */}
                    {(ward.floor || ward.building) && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        {ward.floor && (
                          <View
                            style={{
                              backgroundColor: '#f1f5f9',
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 8,
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Ionicons name="layers" size={12} color="#64748b" />
                            <Text style={{ fontSize: 11, color: '#475569', fontWeight: '600' }}>
                              {ward.floor}
                            </Text>
                          </View>
                        )}
                        {ward.building && (
                          <View
                            style={{
                              backgroundColor: '#f1f5f9',
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 8,
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Ionicons name="location" size={12} color="#64748b" />
                            <Text style={{ fontSize: 11, color: '#475569', fontWeight: '600' }}>
                              {ward.building}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Description */}
                    {ward.description && (
                      <Text
                        style={{ fontSize: 12, color: '#64748b', marginBottom: 12, lineHeight: 18 }}
                        numberOfLines={2}
                      >
                        {ward.description}
                      </Text>
                    )}

                    {/* Actions */}
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <Pressable
                        onPress={() => {
                          setSelectedWard(ward);
                          setShowEditModal(true);
                        }}
                        className="active:opacity-70"
                        style={{
                          flex: 1,
                          backgroundColor: COLORS.indigo.muted,
                          borderWidth: 1,
                          borderColor: COLORS.indigo.light,
                          paddingVertical: 10,
                          borderRadius: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <Ionicons name="create" size={16} color={COLORS.indigo.primary} />
                        <Text style={{ color: COLORS.indigo.primary, fontWeight: '700', fontSize: 13 }}>
                          Edit
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleDelete(ward._id)}
                        className="active:opacity-70"
                        style={{
                          backgroundColor: COLORS.rose.muted,
                          borderWidth: 1,
                          borderColor: COLORS.rose.light,
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                          borderRadius: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons name="trash-outline" size={16} color={COLORS.rose.primary} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Add Ward Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">Add New Ward</Text>
              <Pressable onPress={() => setShowAddModal(false)} className="active:opacity-70">
                <Text className="text-gray-500 text-2xl">×</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Ward Name */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Ward Name *</Text>
                <TextInput
                  placeholder="e.g., ICU, General Ward A"
                  value={newWard.name}
                  onChangeText={(text) => setNewWard({ ...newWard, name: text })}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
                {formErrors.name && (
                  <Text className="text-red-600 text-xs mt-1">{formErrors.name}</Text>
                )}
              </View>

              {/* Capacity */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Bed Capacity *</Text>
                <TextInput
                  placeholder="e.g., 20"
                  value={newWard.capacity}
                  onChangeText={(text) => setNewWard({ ...newWard, capacity: text })}
                  keyboardType="number-pad"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
                {formErrors.capacity && (
                  <Text className="text-red-600 text-xs mt-1">{formErrors.capacity}</Text>
                )}
              </View>

              {/* Floor */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Floor (Optional)</Text>
                <TextInput
                  placeholder="e.g., 3rd Floor"
                  value={newWard.floor}
                  onChangeText={(text) => setNewWard({ ...newWard, floor: text })}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
              </View>

              {/* Building */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Building (Optional)</Text>
                <TextInput
                  placeholder="e.g., Main Building"
                  value={newWard.building}
                  onChangeText={(text) => setNewWard({ ...newWard, building: text })}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
              </View>

              {/* Description */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Description (Optional)</Text>
                <TextInput
                  placeholder="Add any additional notes..."
                  value={newWard.description}
                  onChangeText={(text) => setNewWard({ ...newWard, description: text })}
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                  style={{ textAlignVertical: 'top' }}
                />
              </View>

              {/* Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 py-3 rounded-lg active:opacity-70"
                >
                  <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleAddWard}
                  className="flex-1 bg-teal-600 py-3 rounded-lg active:opacity-70"
                >
                  <Text className="text-white font-semibold text-center">Add Ward</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Ward Modal */}
      {selectedWard && (
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-gray-900">Edit Ward</Text>
                <Pressable onPress={() => setShowEditModal(false)} className="active:opacity-70">
                  <Text className="text-gray-500 text-2xl">×</Text>
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Ward Name */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Ward Name *</Text>
                  <TextInput
                    placeholder="e.g., ICU, General Ward A"
                    value={selectedWard.name}
                    onChangeText={(text) => setSelectedWard({ ...selectedWard, name: text })}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                  />
                  {formErrors.name && (
                    <Text className="text-red-600 text-xs mt-1">{formErrors.name}</Text>
                  )}
                </View>

                {/* Capacity */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Bed Capacity *</Text>
                  <TextInput
                    placeholder="e.g., 20"
                    value={String(selectedWard.capacity)}
                    onChangeText={(text) => setSelectedWard({ ...selectedWard, capacity: text })}
                    keyboardType="number-pad"
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                  />
                  {formErrors.capacity && (
                    <Text className="text-red-600 text-xs mt-1">{formErrors.capacity}</Text>
                  )}
                </View>

                {/* Floor */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Floor (Optional)</Text>
                  <TextInput
                    placeholder="e.g., 3rd Floor"
                    value={selectedWard.floor || ''}
                    onChangeText={(text) => setSelectedWard({ ...selectedWard, floor: text })}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                  />
                </View>

                {/* Building */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Building (Optional)</Text>
                  <TextInput
                    placeholder="e.g., Main Building"
                    value={selectedWard.building || ''}
                    onChangeText={(text) => setSelectedWard({ ...selectedWard, building: text })}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                  />
                </View>

                {/* Description */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Description (Optional)</Text>
                  <TextInput
                    placeholder="Add any additional notes..."
                    value={selectedWard.description || ''}
                    onChangeText={(text) => setSelectedWard({ ...selectedWard, description: text })}
                    multiline
                    numberOfLines={3}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>

                {/* Buttons */}
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 py-3 rounded-lg active:opacity-70"
                  >
                    <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleUpdateWard}
                    className="flex-1 bg-teal-600 py-3 rounded-lg active:opacity-70"
                  >
                    <Text className="text-white font-semibold text-center">Update Ward</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ManageWardsScreen;
