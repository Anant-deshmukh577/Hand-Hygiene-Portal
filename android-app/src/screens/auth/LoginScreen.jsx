import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../../context/AuthContext';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

// Modern Google Logo SVG Component
const GoogleLogo = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <Path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <Path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <Path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </Svg>
);

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      // Navigation handled automatically by AppNavigator
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Premium Header with Gradient */}
        <LinearGradient
          colors={COLORS.cyan.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 40,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          {/* Back Button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
            className="active:opacity-70"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </Pressable>

          {/* Header Text */}
          <View>
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#ffffff', letterSpacing: -1, marginBottom: 8 }}>
              Welcome Back
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 20 }}>
              Sign in to continue to your account
            </Text>
          </View>
        </LinearGradient>

        {/* Form Container */}
        <View style={{ paddingHorizontal: 20, marginTop: -20 }}>
          {/* Main Card */}
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            {/* Email Input */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                Email Address
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                }}
              >
                <Ionicons name="mail-outline" size={20} color="#64748b" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 15, color: '#0f172a' }}
                  placeholder="Enter your email"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                Password
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                }}
              >
                <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 15, color: '#0f172a' }}
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="active:opacity-70"
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748b"
                  />
                </Pressable>
              </View>
            </View>

            {/* Forgot Password */}
            <Pressable
              onPress={() => navigation.navigate('ForgotPassword')}
              style={{ alignSelf: 'flex-end', marginBottom: 24 }}
              className="active:opacity-70"
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.cyan.primary }}>
                Forgot Password?
              </Text>
            </Pressable>

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className="active:scale-98"
              style={{ marginBottom: 20 }}
            >
              <LinearGradient
                colors={loading ? ['#94a3b8', '#94a3b8'] : COLORS.cyan.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  shadowColor: COLORS.cyan.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 }}>
                    Sign In
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
              <Text style={{ marginHorizontal: 16, fontSize: 12, color: '#94a3b8', fontWeight: '600' }}>
                OR CONTINUE WITH
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
            </View>

            {/* Google Sign-In Button - Coming Soon */}
            <Pressable
              disabled={true}
              className="active:opacity-80"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                borderWidth: 2,
                borderColor: '#e2e8f0',
                borderRadius: 14,
                paddingVertical: 14,
                marginBottom: 24,
                opacity: 0.6,
              }}
            >
              <View style={{ marginRight: 12 }}>
                <GoogleLogo size={20} />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#64748b' }}>
                Sign in with Google
              </Text>
              <View
                style={{
                  marginLeft: 8,
                  backgroundColor: COLORS.amber.muted,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: COLORS.amber.light,
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: '700', color: COLORS.amber.primary, letterSpacing: 0.5 }}>
                  COMING SOON
                </Text>
              </View>
            </Pressable>

            {/* Register Link */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#64748b' }}>Don't have an account? </Text>
              <Pressable
                onPress={() => navigation.navigate('Register')}
                className="active:opacity-70"
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.cyan.primary }}>
                  Register
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Info Card */}
          <View
            style={{
              backgroundColor: COLORS.cyan.light,
              borderRadius: 20,
              padding: 20,
              marginTop: 20,
              borderWidth: 1,
              borderColor: COLORS.cyan.ring,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.cyan.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="information-circle" size={20} color={COLORS.cyan.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0e7490', marginBottom: 4 }}>
                  Staff & Auditor Login
                </Text>
                <Text style={{ fontSize: 12, color: '#155e75', lineHeight: 18 }}>
                  This login is for healthcare staff and auditors. Admins should use the Admin Login page.
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
