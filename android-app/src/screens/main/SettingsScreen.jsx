import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../context/AuthContext';
import { downloadMyData } from '../../utils/downloadMyData';
import { userService } from '../../services/userService';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const SETTINGS_STORAGE_KEY = 'aiims_user_settings';

const DEFAULT_NOTIFICATION_SETTINGS = {
  emailNotifications: true,
  badgeAlerts: true,
  leaderboardUpdates: false,
  weeklyReports: true,
};

const SettingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [fetchingSettings, setFetchingSettings] = useState(true);

  // Load settings from backend on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setFetchingSettings(true);
      const response = await userService.getNotificationPreferences();
      if (response.notificationPreferences) {
        setNotificationSettings(response.notificationPreferences);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      // Fallback to local storage
      try {
        const savedSettings = await SecureStore.getItemAsync(SETTINGS_STORAGE_KEY);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed.notificationSettings) {
            setNotificationSettings(parsed.notificationSettings);
          }
        }
      } catch (err) {
        console.error('Failed to load local settings:', err);
      }
    } finally {
      setFetchingSettings(false);
    }
  };

  const handleNotificationChange = async (name) => {
    const newValue = !notificationSettings[name];
    
    // Optimistically update UI
    setNotificationSettings(prev => ({
      ...prev,
      [name]: newValue,
    }));

    try {
      // Send update to backend
      await userService.updateNotificationPreferences({
        [name]: newValue,
      });
      
      // Also save to local storage as backup
      const settingsToSave = {
        notificationSettings: {
          ...notificationSettings,
          [name]: newValue,
        },
      };
      await SecureStore.setItemAsync(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      // Revert on error
      setNotificationSettings(prev => ({
        ...prev,
        [name]: !newValue,
      }));
      Alert.alert('Error', 'Failed to update notification settings. Please try again.');
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Save to backend
      await userService.updateNotificationPreferences(notificationSettings);
      
      // Also save to local storage as backup
      const settingsToSave = {
        notificationSettings,
      };
      await SecureStore.setItemAsync(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
      
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
            await SecureStore.deleteItemAsync(SETTINGS_STORAGE_KEY);
            Alert.alert('Success', 'Settings reset to defaults');
          },
        },
      ]
    );
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await SecureStore.deleteItemAsync(SETTINGS_STORAGE_KEY);
              setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
              Alert.alert('Success', 'Cache cleared successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleOpenHelp = () => {
    Alert.alert(
      'Help & Support',
      'For assistance, please contact:\n\nEmail: support@aiims.edu\nPhone: +91-11-26588500',
      [{ text: 'OK' }]
    );
  };

  const handleDownloadMyData = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User information not available');
      return;
    }

    Alert.alert(
      'Download My Data',
      'This will download all your observation data as a CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: async () => {
            setLoading(true);
            try {
              await downloadMyData(user.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to download data');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const getMemberSinceDate = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString('en-IN', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return 'Not available';
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
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
            <Ionicons name="settings" size={24} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
              Settings
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              Manage your preferences
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={{ paddingHorizontal: 20, marginTop: -20 }}>
          
          {/* Account Settings - Premium Card */}
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              padding: 20,
              marginBottom: 20,
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
                <Ionicons name="person" size={20} color={COLORS.indigo.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                Account Settings
              </Text>
            </View>
            
            <View>
              <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: '600' }}>Account Type</Text>
                <View
                  style={{
                    backgroundColor: COLORS.cyan.muted,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    alignSelf: 'flex-start',
                    borderWidth: 1,
                    borderColor: COLORS.cyan.light,
                  }}
                >
                  <Text style={{ color: COLORS.cyan.primary, fontWeight: '700', fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    {user?.role || 'STAFF'}
                  </Text>
                </View>
              </View>
              
              <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: '600' }}>Email Address</Text>
                <Text style={{ fontSize: 15, color: '#1e293b', fontWeight: '600' }}>
                  {user?.email}
                </Text>
              </View>
              
              <View style={{ paddingVertical: 12 }}>
                <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: '600' }}>Member Since</Text>
                <Text style={{ fontSize: 15, color: '#1e293b', fontWeight: '600' }}>
                  {getMemberSinceDate()}
                </Text>
              </View>
            </View>
          </View>

          {/* Notification Settings - Premium Card */}
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              padding: 20,
              marginBottom: 20,
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
                <Ionicons name="notifications" size={20} color={COLORS.violet.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                Notifications
              </Text>
            </View>
            
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                <View style={{ flex: 1, marginRight: 16 }}>
                  <Text style={{ fontSize: 15, color: '#1e293b', fontWeight: '600', marginBottom: 4 }}>
                    Email Notifications
                  </Text>
                  <Text style={{ fontSize: 13, color: '#64748b' }}>
                    Receive updates via email
                  </Text>
                </View>
                <Switch
                  value={notificationSettings.emailNotifications}
                  onValueChange={() => handleNotificationChange('emailNotifications')}
                  trackColor={{ false: '#d1d5db', true: COLORS.emerald.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                <View style={{ flex: 1, marginRight: 16 }}>
                  <Text style={{ fontSize: 15, color: '#1e293b', fontWeight: '600', marginBottom: 4 }}>
                    Badge Achievement Alerts
                  </Text>
                  <Text style={{ fontSize: 13, color: '#64748b' }}>
                    Get notified when you earn badges
                  </Text>
                </View>
                <Switch
                  value={notificationSettings.badgeAlerts}
                  onValueChange={() => handleNotificationChange('badgeAlerts')}
                  trackColor={{ false: '#d1d5db', true: COLORS.emerald.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                <View style={{ flex: 1, marginRight: 16 }}>
                  <Text style={{ fontSize: 15, color: '#1e293b', fontWeight: '600', marginBottom: 4 }}>
                    Leaderboard Updates
                  </Text>
                  <Text style={{ fontSize: 13, color: '#64748b' }}>
                    Rank changes and updates
                  </Text>
                </View>
                <Switch
                  value={notificationSettings.leaderboardUpdates}
                  onValueChange={() => handleNotificationChange('leaderboardUpdates')}
                  trackColor={{ false: '#d1d5db', true: COLORS.emerald.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                <View style={{ flex: 1, marginRight: 16 }}>
                  <Text style={{ fontSize: 15, color: '#1e293b', fontWeight: '600', marginBottom: 4 }}>
                    Weekly Compliance Reports
                  </Text>
                  <Text style={{ fontSize: 13, color: '#64748b' }}>
                    Receive weekly summaries
                  </Text>
                </View>
                <Switch
                  value={notificationSettings.weeklyReports}
                  onValueChange={() => handleNotificationChange('weeklyReports')}
                  trackColor={{ false: '#d1d5db', true: COLORS.emerald.primary }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* Data & Privacy - Premium Card */}
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              padding: 20,
              marginBottom: 20,
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
                <Ionicons name="shield-checkmark" size={20} color={COLORS.emerald.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                Data & Privacy
              </Text>
            </View>
            
            <View style={{ gap: 12 }}>
              <Pressable
                onPress={handleClearCache}
                disabled={loading}
                className="active:opacity-70"
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color={COLORS.rose.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>
                      Clear Cache
                    </Text>
                    <Text style={{ fontSize: 13, color: '#64748b' }}>
                      Free up space by clearing cached data
                    </Text>
                  </View>
                </View>
              </Pressable>

              <Pressable
                onPress={handleDownloadMyData}
                disabled={loading}
                className="active:opacity-70"
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                }}
              >
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
                    <Ionicons name="download-outline" size={20} color={COLORS.indigo.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>
                      Download My Data
                    </Text>
                    <Text style={{ fontSize: 13, color: '#64748b' }}>
                      Export your observation data
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Actions - Premium Card */}
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              padding: 20,
              marginBottom: 20,
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
                  backgroundColor: COLORS.amber.muted,
                  borderWidth: 1,
                  borderColor: COLORS.amber.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="flash" size={20} color={COLORS.amber.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                Quick Actions
              </Text>
            </View>
            
            <View style={{ gap: 12 }}>
              <Pressable
                onPress={handleSaveSettings}
                disabled={loading}
                className="active:scale-95"
              >
                <LinearGradient
                  colors={COLORS.cyan.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 14,
                    paddingVertical: 14,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Ionicons name="save" size={18} color="white" />
                  <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 15 }}>
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={handleResetToDefaults}
                className="active:opacity-70"
                style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                }}
              >
                <Ionicons name="refresh" size={18} color="#64748b" />
                <Text style={{ color: '#475569', fontWeight: '700', fontSize: 15 }}>
                  Reset to Defaults
                </Text>
              </Pressable>

              <Pressable
                onPress={handleOpenHelp}
                className="active:opacity-70"
                style={{
                  backgroundColor: COLORS.indigo.muted,
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: COLORS.indigo.light,
                }}
              >
                <Ionicons name="help-circle" size={18} color={COLORS.indigo.primary} />
                <Text style={{ color: COLORS.indigo.primary, fontWeight: '700', fontSize: 15 }}>
                  Help & Support
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Privacy Notice - Premium Alert */}
          <View
            style={{
              backgroundColor: COLORS.amber.light,
              borderWidth: 1,
              borderColor: COLORS.amber.ring,
              borderRadius: 20,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: 'rgba(245,158,11,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="warning" size={20} color={COLORS.amber.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#92400e', marginBottom: 6 }}>
                  Privacy Notice
                </Text>
                <Text style={{ fontSize: 13, color: '#78350f', lineHeight: 18 }}>
                  Your settings are stored locally on your device and are not shared with third parties.
                </Text>
              </View>
            </View>
          </View>

          {/* App Info - Premium Card */}
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              padding: 20,
              marginBottom: 24,
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
                  backgroundColor: COLORS.cyan.muted,
                  borderWidth: 1,
                  borderColor: COLORS.cyan.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="information-circle" size={20} color={COLORS.cyan.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                App Information
              </Text>
            </View>
            
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text style={{ fontSize: 14, color: '#64748b', fontWeight: '600' }}>Version</Text>
                <Text style={{ fontSize: 14, color: '#1e293b', fontWeight: '700' }}>1.0.0</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text style={{ fontSize: 14, color: '#64748b', fontWeight: '600' }}>Build</Text>
                <Text style={{ fontSize: 14, color: '#1e293b', fontWeight: '700' }}>2024.02</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text style={{ fontSize: 14, color: '#64748b', fontWeight: '600' }}>Platform</Text>
                <Text style={{ fontSize: 14, color: '#1e293b', fontWeight: '700' }}>React Native</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>
  );
};

export default SettingsScreen;
