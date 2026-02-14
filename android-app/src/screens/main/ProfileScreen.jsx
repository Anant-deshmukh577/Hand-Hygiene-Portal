import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import Loader from '../../components/common/Loader';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const isOAuthUser = user?.googleId || user?.facebookId;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    designation: user?.designation || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load profile image on mount
  useEffect(() => {
    loadProfileImage();
  }, [user]);

  const loadProfileImage = () => {
    // Check if user has a profile picture
    if (user?.avatar) {
      setProfileImage(user.avatar);
    } else if (user?.profilePicture) {
      setProfileImage(user.profilePicture);
    }
  };

  // Get user initials
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get compliance color
  const getComplianceColor = (rate) => {
    if (rate >= 90) return COLORS.emerald;
    if (rate >= 75) return COLORS.amber;
    return COLORS.rose;
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Refresh user data
      const response = await userService.getProfile();
      if (response.user) {
        updateUser(response.user);
      }
      loadProfileImage();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [updateUser]);

  const handlePickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to change your profile picture.'
        );
        return;
      }

      // Pick image using latest Expo SDK format
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Use array format instead of MediaType.Images
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        
        // Upload to server
        await uploadProfileImage(imageUri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadProfileImage = async (imageUri) => {
    try {
      setLoading(true);
      
      console.log('[ProfileScreen] ========== DIRECT CLOUDINARY UPLOAD START ==========');
      console.log('[ProfileScreen] Platform:', Platform.OS);
      console.log('[ProfileScreen] Image URI:', imageUri);
      
      // Get file info from URI
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const fileExtension = match ? match[1].toLowerCase() : 'jpg';
      
      // Determine MIME type
      let mimeType = 'image/jpeg';
      if (fileExtension === 'png') mimeType = 'image/png';
      else if (fileExtension === 'gif') mimeType = 'image/gif';
      else if (fileExtension === 'webp') mimeType = 'image/webp';

      console.log('[ProfileScreen] File info:', {
        filename: filename || 'profile.jpg',
        extension: fileExtension,
        mimeType: mimeType,
      });

      // STEP 1: Upload directly to Cloudinary (bypasses backend multipart issue)
      console.log('[ProfileScreen] Uploading to Cloudinary...');
      
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: filename || 'avatar.jpg',
        type: mimeType,
      });
      formData.append('upload_preset', 'ml_default'); // Cloudinary unsigned preset
      formData.append('folder', 'aiims-avatars');

      // Direct upload to Cloudinary
      const cloudinaryResponse = await fetch(
        'https://api.cloudinary.com/v1_1/dymcklg2j/image/upload',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        console.error('[ProfileScreen] Cloudinary upload failed:', errorData);
        throw new Error(errorData.error?.message || 'Cloudinary upload failed');
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;
      
      console.log('[ProfileScreen] Cloudinary upload successful:', imageUrl);

      // STEP 2: Update backend with image URL (simple JSON request, no multipart)
      console.log('[ProfileScreen] Updating backend with image URL...');
      
      const userId = user?.id || user?._id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await userService.updateAvatarUrl(userId, imageUrl);
      
      console.log('[ProfileScreen] Backend update successful:', response.success);
      
      if (response.success && response.user) {
        // Update user context with new avatar
        console.log('[ProfileScreen] Updating AuthContext with new user data');
        console.log('[ProfileScreen] New avatar URL:', response.user.avatar);
        updateUser(response.user);
        
        // Update local state with Cloudinary URL
        setProfileImage(response.user.avatar);
        console.log('[ProfileScreen] Avatar updated successfully:', response.user.avatar);
        console.log('[ProfileScreen] User context should now have avatar:', response.user.avatar);
        
        Alert.alert('Success', 'Profile picture updated successfully');
      } else {
        throw new Error(response.message || 'Backend update failed');
      }
      
      console.log('[ProfileScreen] ========== UPLOAD SUCCESS ==========');
    } catch (error) {
      console.error('[ProfileScreen] ========== UPLOAD ERROR ==========');
      console.error('[ProfileScreen] Error type:', error.constructor.name);
      console.error('[ProfileScreen] Error message:', error.message);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to upload profile picture. Please try again.';
      
      if (error.message.includes('Cloudinary')) {
        errorMessage = 'Failed to upload image to cloud storage. Please check your internet connection.';
      } else if (error.message.includes('Backend')) {
        errorMessage = 'Image uploaded but failed to update profile. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Upload Failed', errorMessage);
      
      // Revert to previous image
      loadProfileImage();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const userId = user?.id || user?._id;
      const updated = await userService.updateProfile(userId, formData);
      if (updated.user) {
        updateUser(updated.user);
        Alert.alert('Success', 'Profile updated successfully');
        setEditMode(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // For OAuth users, current password is not required
    if (!isOAuthUser && !passwordData.currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    
    if (!passwordData.newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    
    // Validate password requirements
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
    const hasNumber = /\d/.test(passwordData.newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      Alert.alert(
        'Invalid Password',
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
      return;
    }

    setLoading(true);
    try {
      // For OAuth users, don't send currentPassword
      const payload = isOAuthUser 
        ? { newPassword: passwordData.newPassword }
        : { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword };
      
      await userService.changePassword(payload);
      
      const successMessage = isOAuthUser 
        ? 'Password set successfully! You can now use email/password login.'
        : 'Password changed successfully';
      
      Alert.alert('Success', successMessage);
      setPasswordModalVisible(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPassword({ currentPassword: false, newPassword: false, confirmPassword: false });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (loading && !editMode && !passwordModalVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Loader />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.cyan.primary}
          />
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
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
              <Ionicons name="person" size={24} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
                Profile
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                Your account details
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            {/* Avatar with Premium Design */}
            <View style={{ position: 'relative', marginBottom: 16 }}>
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 24,
                  backgroundColor: '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 16,
                  elevation: 8,
                  borderWidth: 4,
                  borderColor: 'rgba(255,255,255,0.3)',
                  overflow: 'hidden',
                }}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={{ color: COLORS.cyan.primary, fontSize: 36, fontWeight: '800' }}>
                    {getInitials(user?.name)}
                  </Text>
                )}
              </View>
              
              {/* Edit Profile Picture Button */}
              <Pressable
                onPress={handlePickImage}
                className="active:scale-90"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: COLORS.cyan.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: '#ffffff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Ionicons name="camera" size={16} color="#ffffff" />
              </Pressable>
            </View>
            
            {/* Name */}
            <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '800', marginBottom: 6, textAlign: 'center', letterSpacing: -0.5 }}>
              {user?.name}
            </Text>
            
            {/* Email */}
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>
              {user?.email}
            </Text>
            
            {/* Role Badge */}
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 9999,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700', textTransform: 'capitalize', letterSpacing: 0.5 }}>
                {user?.role || 'Staff'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={{ paddingHorizontal: 20, marginTop: -20 }}>
          
          {/* Stats Cards - Premium Design */}
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 20,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {/* Points */}
              <View style={{ alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: COLORS.amber.muted,
                    borderWidth: 1,
                    borderColor: COLORS.amber.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name="star" size={22} color={COLORS.amber.primary} />
                </View>
                <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.amber.primary, marginBottom: 4, letterSpacing: -1 }}>
                  {user?.totalPoints || 0}
                </Text>
                <Text style={{ fontSize: 11, color: '#64748b' }}>
                  Points
                </Text>
              </View>
              
              {/* Compliance */}
              <View style={{ alignItems: 'center', flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#f1f5f9' }}>
                {(() => {
                  const complianceColor = getComplianceColor(user?.complianceRate || 0);
                  return (
                    <>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 14,
                          backgroundColor: complianceColor.muted,
                          borderWidth: 1,
                          borderColor: complianceColor.light,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 10,
                        }}
                      >
                        <Ionicons name="checkmark-circle" size={22} color={complianceColor.primary} />
                      </View>
                      <Text style={{ fontSize: 26, fontWeight: '800', color: complianceColor.primary, marginBottom: 4, letterSpacing: -1 }}>
                        {user?.complianceRate || 0}%
                      </Text>
                    </>
                  );
                })()}
                <Text style={{ fontSize: 11, color: '#64748b' }}>
                  Compliance
                </Text>
              </View>
              
              {/* Rank */}
              <View style={{ alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: COLORS.violet.muted,
                    borderWidth: 1,
                    borderColor: COLORS.violet.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name="trophy" size={22} color={COLORS.violet.primary} />
                </View>
                <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.violet.primary, marginBottom: 4, letterSpacing: -1 }}>
                  #{user?.rank || '-'}
                </Text>
                <Text style={{ fontSize: 11, color: '#64748b' }}>
                  Rank
                </Text>
              </View>
            </View>
          </View>

          {/* Profile Information - Premium Design */}
          {!editMode ? (
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                padding: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                  Profile Information
                </Text>
                <Pressable
                  onPress={() => setEditMode(true)}
                  className="active:scale-95"
                >
                  <LinearGradient
                    colors={COLORS.cyan.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12 }}>
                      Edit
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
              
              <View style={{ gap: 16 }}>
                {[
                  { label: 'Full Name', value: user?.name, icon: 'person' },
                  { label: 'Email', value: user?.email, icon: 'mail' },
                  { label: 'Phone', value: user?.phone, icon: 'call' },
                  { label: 'Department', value: user?.department, icon: 'business' },
                  { label: 'Designation', value: user?.designation, icon: 'briefcase' },
                  ...(user?.ward ? [{ label: 'Ward', value: user.ward, icon: 'medical' }] : []),
                ].map((item, index) => (
                  <View key={index}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          backgroundColor: COLORS.indigo.muted,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 10,
                        }}
                      >
                        <Ionicons name={item.icon} size={14} color={COLORS.indigo.primary} />
                      </View>
                      <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' }}>
                        {item.label}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#1e293b', fontWeight: '600', paddingLeft: 38 }}>
                      {item.value || 'Not specified'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            // Edit Mode - Premium Design
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                padding: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 20, letterSpacing: -0.3 }}>
                Edit Profile
              </Text>
              
              <View style={{ gap: 16 }}>
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'Enter your name', icon: 'person' },
                  { label: 'Phone', key: 'phone', placeholder: 'Enter your phone', icon: 'call', keyboardType: 'phone-pad' },
                  { label: 'Department', key: 'department', placeholder: 'Enter your department', icon: 'business' },
                  { label: 'Designation', key: 'designation', placeholder: 'Enter your designation', icon: 'briefcase' },
                ].map((field, index) => (
                  <View key={index}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          backgroundColor: COLORS.cyan.muted,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 8,
                        }}
                      >
                        <Ionicons name={field.icon} size={12} color={COLORS.cyan.primary} />
                      </View>
                      <Text style={{ fontSize: 12, color: '#475569', fontWeight: '600' }}>
                        {field.label}
                      </Text>
                    </View>
                    <TextInput
                      value={formData[field.key]}
                      onChangeText={(text) => setFormData({ ...formData, [field.key]: text })}
                      placeholder={field.placeholder}
                      placeholderTextColor="#9ca3af"
                      keyboardType={field.keyboardType || 'default'}
                      autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                      style={{
                        backgroundColor: '#f8fafc',
                        borderWidth: 1,
                        borderColor: '#e2e8f0',
                        borderRadius: 14,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        fontSize: 14,
                        color: '#1e293b',
                      }}
                    />
                  </View>
                ))}
              </View>
              
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                <Pressable
                  onPress={() => {
                    setEditMode(false);
                    setFormData({
                      name: user?.name || '',
                      phone: user?.phone || '',
                      department: user?.department || '',
                      designation: user?.designation || '',
                    });
                  }}
                  className="active:scale-98"
                  style={{
                    flex: 1,
                    backgroundColor: '#f1f5f9',
                    borderRadius: 14,
                    paddingVertical: 14,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#475569', fontWeight: '700', fontSize: 14 }}>
                    Cancel
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={handleSaveProfile}
                  disabled={loading}
                  className="active:scale-98"
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={COLORS.cyan.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 14,
                      paddingVertical: 14,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          )}

          {/* Actions - Premium Design */}
          <View style={{ gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Change Password', icon: 'lock-closed', color: COLORS.indigo, action: () => setPasswordModalVisible(true) },
              { label: 'Settings', icon: 'settings', color: COLORS.violet, action: () => navigation.navigate('Settings') },
              { label: 'Logout', icon: 'log-out', color: COLORS.rose, action: handleLogout, isDestructive: true },
            ].map((item, index) => (
              <Pressable
                key={index}
                onPress={item.action}
                className="active:scale-98"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#f1f5f9',
                  shadowColor: '#0f172a',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.02,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: item.color.muted,
                    borderWidth: 1,
                    borderColor: item.color.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <Ionicons name={item.icon} size={20} color={item.color.primary} />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: '600',
                    color: item.isDestructive ? item.color.primary : '#1e293b',
                  }}
                >
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Change Password Modal - Premium Design */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 24,
              maxHeight: '85%',
            }}
          >
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                  <Ionicons name="lock-closed" size={20} color={COLORS.indigo.primary} />
                </View>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 }}>
                  {isOAuthUser ? 'Set Password' : 'Change Password'}
                </Text>
              </View>
              <Pressable
                onPress={() => setPasswordModalVisible(false)}
                className="active:scale-90"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#f1f5f9',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={20} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ gap: 16 }}>
                {/* OAuth User Info Banner */}
                {isOAuthUser && (
                  <View
                    style={{
                      backgroundColor: '#dbeafe',
                      borderRadius: 14,
                      padding: 14,
                      borderWidth: 1,
                      borderColor: '#bfdbfe',
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Ionicons name="information-circle" size={16} color="#2563eb" style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#1e40af' }}>
                        Google Account Detected
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: '#1e3a8a', lineHeight: 16 }}>
                      You signed in with Google. Set a password below to enable email/password login as an alternative.
                    </Text>
                  </View>
                )}

                {[
                  ...(!isOAuthUser ? [{ label: 'Current Password', key: 'currentPassword', placeholder: 'Enter current password' }] : []),
                  { label: 'New Password', key: 'newPassword', placeholder: 'Enter new password' },
                  { label: 'Confirm New Password', key: 'confirmPassword', placeholder: 'Confirm new password' },
                ].map((field, index) => (
                  <View key={index}>
                    <Text style={{ fontSize: 12, color: '#475569', fontWeight: '600', marginBottom: 8 }}>
                      {field.label}
                    </Text>
                    <View
                      style={{
                        backgroundColor: '#f8fafc',
                        borderWidth: 1,
                        borderColor: '#e2e8f0',
                        borderRadius: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                      }}
                    >
                      <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={{ marginRight: 10 }} />
                      <TextInput
                        value={passwordData[field.key]}
                        onChangeText={(text) =>
                          setPasswordData({ ...passwordData, [field.key]: text })
                        }
                        placeholder={field.placeholder}
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={!showPassword[field.key]}
                        style={{
                          flex: 1,
                          paddingVertical: 12,
                          fontSize: 14,
                          color: '#1e293b',
                        }}
                      />
                      <Pressable
                        onPress={() => setShowPassword({ ...showPassword, [field.key]: !showPassword[field.key] })}
                        className="active:scale-90"
                        style={{ padding: 4 }}
                      >
                        <Ionicons 
                          name={showPassword[field.key] ? 'eye-off-outline' : 'eye-outline'} 
                          size={20} 
                          color="#94a3b8" 
                        />
                      </Pressable>
                    </View>
                  </View>
                ))}

                {/* Password Requirements */}
                <View
                  style={{
                    backgroundColor: COLORS.amber.muted,
                    borderRadius: 14,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: COLORS.amber.light,
                    marginTop: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="information-circle" size={16} color={COLORS.amber.primary} style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.amber.primary, letterSpacing: 0.3, textTransform: 'uppercase' }}>
                      Password Requirements
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: '#78350f', lineHeight: 18 }}>
                    • At least 8 characters{'\n'}
                    • Contains uppercase and lowercase letters{'\n'}
                    • Contains at least one number
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                <Pressable
                  onPress={() => {
                    setPasswordModalVisible(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  className="active:scale-98"
                  style={{
                    flex: 1,
                    backgroundColor: '#f1f5f9',
                    borderRadius: 14,
                    paddingVertical: 14,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#475569', fontWeight: '700', fontSize: 14 }}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleChangePassword}
                  disabled={loading}
                  className="active:scale-98"
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={COLORS.indigo.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 14,
                      paddingVertical: 14,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
                      {loading ? (isOAuthUser ? 'Setting...' : 'Updating...') : (isOAuthUser ? 'Set Password' : 'Update Password')}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
