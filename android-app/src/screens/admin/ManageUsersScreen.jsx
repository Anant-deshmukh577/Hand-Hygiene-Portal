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
import { userService } from '../../services/userService';
import { DEPARTMENTS, DESIGNATIONS } from '../../utils/constants';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const ManageUsersScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showDesignationPicker, setShowDesignationPicker] = useState(false);

  // Add user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    designation: '',
    role: 'staff',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({ limit: 100 });
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleAddUser = async () => {
    // Validate
    const errors = {};
    if (!newUser.name.trim()) errors.name = 'Name required';
    if (!newUser.email.trim()) errors.email = 'Email required';
    if (!newUser.password || newUser.password.length < 8) errors.password = 'Password must be 8+ characters';
    if (!newUser.phone.trim()) errors.phone = 'Phone required';
    if (!newUser.department.trim()) errors.department = 'Department required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await userService.createUser(newUser);
      setUsers([response.user, ...users]);
      setShowAddModal(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        designation: '',
        role: 'staff',
      });
      setFormErrors({});
      Alert.alert('Success', 'User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', error.message || 'Failed to add user');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setShowEditModal(false);
      setSelectedUser(null);
      Alert.alert('Success', 'User role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Failed to update role');
    }
  };

  const handleToggleStatus = async (userId) => {
    const user = users.find(u => u._id === userId);
    const action = user.isActive ? 'deactivate' : 'activate';

    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          onPress: async () => {
            try {
              await userService.toggleUserStatus(userId);
              setUsers(users.map(u => u._id === userId ? { ...u, isActive: !u.isActive } : u));
              Alert.alert('Success', `User ${action}d successfully`);
            } catch (error) {
              console.error('Error toggling status:', error);
              Alert.alert('Error', `Failed to ${action} user`);
            }
          },
        },
      ]
    );
  };

  const handleDelete = async (userId) => {
    const user = users.find(u => u._id === userId);

    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteUser(userId);
              setUsers(users.filter(u => u._id !== userId));
              Alert.alert('Success', 'User deleted successfully');
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive !== false).length,
    admins: users.filter(u => u.role === 'admin').length,
    auditors: users.filter(u => u.role === 'auditor').length,
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: COLORS.violet,
      auditor: COLORS.indigo,
      staff: COLORS.cyan,
    };
    return colors[role] || colors.staff;
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: 'shield-checkmark',
      auditor: 'eye',
      staff: 'person',
    };
    return icons[role] || icons.staff;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
          Loading Users...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView
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
                <Ionicons name="people" size={24} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
                  Manage Users
                </Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                  Add, edit, and manage accounts
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
              { label: 'Total Users', value: stats.total, icon: 'people', color: COLORS.indigo },
              { label: 'Active', value: stats.active, icon: 'checkmark-circle', color: COLORS.emerald },
              { label: 'Admins', value: stats.admins, icon: 'shield-checkmark', color: COLORS.violet },
              { label: 'Auditors', value: stats.auditors, icon: 'eye', color: COLORS.amber },
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

        {/* Search & Filter - Premium Design */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
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
            {/* Search */}
            <View
              style={{
                backgroundColor: '#f8fafc',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 14,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                marginBottom: 14,
              }}
            >
              <Ionicons name="search" size={18} color="#94a3b8" />
              <TextInput
                placeholder="Search by name or email..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9ca3af"
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  fontSize: 14,
                  color: '#1e293b',
                }}
              />
            </View>

            {/* Role Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { value: 'all', label: 'All Roles' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'auditor', label: 'Auditor' },
                  { value: 'staff', label: 'Staff' },
                ].map((role) => (
                  <Pressable
                    key={role.value}
                    onPress={() => setFilterRole(role.value)}
                    className="active:scale-95"
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 9999,
                      backgroundColor: filterRole === role.value ? COLORS.indigo.primary : COLORS.indigo.muted,
                      borderWidth: 1,
                      borderColor: filterRole === role.value ? COLORS.indigo.primary : COLORS.indigo.light,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: filterRole === role.value ? '#ffffff' : COLORS.indigo.primary,
                      }}
                    >
                      {role.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Results Count */}
            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 14, fontWeight: '500' }}>
              Showing {filteredUsers.length} of {users.length} users
            </Text>
          </View>
        </View>

        {/* Users List */}
        <View className="px-4 pb-6">
          {filteredUsers.length === 0 ? (
            <View className="bg-white rounded-xl border border-gray-200 p-8 items-center">
              <Text className="text-6xl mb-4">📭</Text>
              <Text className="text-lg font-semibold text-gray-900 mb-2">No users found</Text>
              <Text className="text-gray-500 text-center">
                {searchQuery || filterRole !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No users have been added yet'}
              </Text>
            </View>
          ) : (
            filteredUsers.map((user) => (
              <View
                key={user._id}
                className="bg-white rounded-xl border border-gray-200 p-4 mb-3"
              >
                {/* User Info */}
                <View className="flex-row items-center gap-3 mb-3">
                  {/* Avatar */}
                  <View
                    className={`w-12 h-12 rounded-xl items-center justify-center ${
                      user.role === 'admin'
                        ? 'bg-purple-500'
                        : user.role === 'auditor'
                        ? 'bg-blue-500'
                        : 'bg-teal-500'
                    }`}
                  >
                    <Text className="text-white font-bold text-lg">
                      {getInitials(user.name)}
                    </Text>
                  </View>

                  {/* Name & Email */}
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">{user.name}</Text>
                    <Text className="text-sm text-gray-500">{user.email}</Text>
                  </View>

                  {/* Status Badge */}
                  <View
                    className={`px-2 py-1 rounded-full ${
                      user.isActive !== false ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        user.isActive !== false ? 'text-green-700' : 'text-gray-700'
                      }`}
                    >
                      {user.isActive !== false ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>

                {/* Department & Role */}
                <View className="flex-row items-center gap-2 mb-3">
                  <View className="flex-row items-center gap-1 flex-1">
                    <Ionicons name="business-outline" size={14} color="#64748b" />
                    <Text className="text-gray-700 text-sm">{user.department || 'N/A'}</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: getRoleColor(user.role).muted,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: getRoleColor(user.role).light,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Ionicons name={getRoleIcon(user.role)} size={12} color={getRoleColor(user.role).primary} />
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '700',
                        color: getRoleColor(user.role).primary,
                        textTransform: 'capitalize',
                      }}
                    >
                      {user.role}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                    className="flex-1 bg-blue-50 border border-blue-200 py-2 rounded-lg active:opacity-70"
                  >
                    <Text className="text-blue-600 font-medium text-center text-sm">
                      Edit Role
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleToggleStatus(user._id)}
                    className={`flex-1 border py-2 rounded-lg active:opacity-70 ${
                      user.isActive !== false
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <Text
                      className={`font-medium text-center text-sm ${
                        user.isActive !== false ? 'text-amber-600' : 'text-green-600'
                      }`}
                    >
                      {user.isActive !== false ? 'Deactivate' : 'Activate'}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(user._id)}
                    className="bg-red-50 border border-red-200 px-3 py-2 rounded-lg active:opacity-70"
                  >
                    <Ionicons name="trash-outline" size={16} color="#dc2626" />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">Add New User</Text>
              <Pressable onPress={() => setShowAddModal(false)} className="active:opacity-70">
                <Text className="text-gray-500 text-2xl">×</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Name */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Name *</Text>
                <TextInput
                  placeholder="Full name"
                  value={newUser.name}
                  onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
                {formErrors.name && (
                  <Text className="text-red-600 text-xs mt-1">{formErrors.name}</Text>
                )}
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Email *</Text>
                <TextInput
                  placeholder="email@example.com"
                  value={newUser.email}
                  onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
                {formErrors.email && (
                  <Text className="text-red-600 text-xs mt-1">{formErrors.email}</Text>
                )}
              </View>

              {/* Password */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Password *</Text>
                <TextInput
                  placeholder="Min 8 characters"
                  value={newUser.password}
                  onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                  secureTextEntry
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
                {formErrors.password && (
                  <Text className="text-red-600 text-xs mt-1">{formErrors.password}</Text>
                )}
              </View>

              {/* Phone */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Phone *</Text>
                <TextInput
                  placeholder="10 digit number"
                  value={newUser.phone}
                  onChangeText={(text) => setNewUser({ ...newUser, phone: text })}
                  keyboardType="phone-pad"
                  maxLength={10}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
                {formErrors.phone && (
                  <Text className="text-red-600 text-xs mt-1">{formErrors.phone}</Text>
                )}
              </View>

              {/* Department */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Department *</Text>
                <Pressable
                  onPress={() => setShowDepartmentPicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className={newUser.department ? 'text-gray-900' : 'text-gray-400'}>
                    {newUser.department || 'Select department'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
                {formErrors.department && (
                  <Text className="text-red-600 text-xs mt-1">{formErrors.department}</Text>
                )}
              </View>

              {/* Designation */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Designation</Text>
                <Pressable
                  onPress={() => setShowDesignationPicker(true)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className={newUser.designation ? 'text-gray-900' : 'text-gray-400'}>
                    {newUser.designation || 'Select designation'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
              </View>

              {/* Role */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Role *</Text>
                <View className="flex-row gap-2">
                  {['staff', 'auditor', 'admin'].map((role) => (
                    <Pressable
                      key={role}
                      onPress={() => setNewUser({ ...newUser, role })}
                      className={`flex-1 py-3 rounded-lg border active:opacity-70 ${
                        newUser.role === role
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <Ionicons 
                          name={getRoleIcon(role)} 
                          size={16} 
                          color={newUser.role === role ? '#ffffff' : '#374151'} 
                        />
                        <Text
                          className={`font-medium capitalize ${
                            newUser.role === role ? 'text-white' : 'text-gray-700'
                          }`}
                        >
                          {role}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
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
                  onPress={handleAddUser}
                  className="flex-1 bg-blue-600 py-3 rounded-lg active:opacity-70"
                >
                  <Text className="text-white font-semibold text-center">Add User</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Role Modal */}
      {selectedUser && (
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-gray-900">Change User Role</Text>
                <Pressable onPress={() => setShowEditModal(false)} className="active:opacity-70">
                  <Text className="text-gray-500 text-2xl">×</Text>
                </Pressable>
              </View>

              {/* User Info */}
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="font-semibold text-gray-900 mb-1">{selectedUser.name}</Text>
                <Text className="text-sm text-gray-500">{selectedUser.email}</Text>
                <View className="mt-2">
                  <Text className="text-xs text-gray-500">
                    Current Role: <Text className="font-semibold">{selectedUser.role}</Text>
                  </Text>
                </View>
              </View>

              {/* Role Selection */}
              <Text className="text-sm font-semibold text-gray-700 mb-3">Select New Role</Text>
              <View className="gap-3 mb-6">
                {['staff', 'auditor', 'admin'].map((role) => (
                  <Pressable
                    key={role}
                    onPress={() => handleUpdateRole(selectedUser._id, role)}
                    className={`p-4 rounded-xl border active:opacity-70 ${
                      selectedUser.role === role
                        ? 'bg-gray-100 border-gray-300'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            backgroundColor: getRoleColor(role).muted,
                            borderWidth: 1,
                            borderColor: getRoleColor(role).light,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons name={getRoleIcon(role)} size={16} color={getRoleColor(role).primary} />
                        </View>
                        <View>
                          <Text className="font-semibold text-gray-900 capitalize mb-1">
                            {role}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {role === 'admin' && 'Full system access'}
                            {role === 'auditor' && 'Record observations'}
                            {role === 'staff' && 'View personal stats'}
                          </Text>
                        </View>
                      </View>
                      {selectedUser.role === role && (
                        <Ionicons name="checkmark-circle" size={20} color={getRoleColor(role).primary} />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={() => setShowEditModal(false)}
                className="bg-gray-100 py-3 rounded-lg active:opacity-70"
              >
                <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* Department Picker Modal */}
      <Modal
        visible={showDepartmentPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDepartmentPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[70%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">Select Department</Text>
              <Pressable onPress={() => setShowDepartmentPicker(false)} className="active:opacity-70">
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {DEPARTMENTS.map((dept) => (
                <Pressable
                  key={dept}
                  onPress={() => {
                    setNewUser({ ...newUser, department: dept });
                    setShowDepartmentPicker(false);
                  }}
                  className="py-4 border-b border-gray-100 active:bg-gray-50"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-900 font-medium">{dept}</Text>
                    {newUser.department === dept && (
                      <Ionicons name="checkmark-circle" size={20} color="#6366f1" />
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Designation Picker Modal */}
      <Modal
        visible={showDesignationPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDesignationPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[70%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">Select Designation</Text>
              <Pressable onPress={() => setShowDesignationPicker(false)} className="active:opacity-70">
                <Ionicons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {DESIGNATIONS.map((desig) => (
                <Pressable
                  key={desig}
                  onPress={() => {
                    setNewUser({ ...newUser, designation: desig });
                    setShowDesignationPicker(false);
                  }}
                  className="py-4 border-b border-gray-100 active:bg-gray-50"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-900 font-medium">{desig}</Text>
                    {newUser.designation === desig && (
                      <Ionicons name="checkmark-circle" size={20} color="#6366f1" />
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageUsersScreen;
