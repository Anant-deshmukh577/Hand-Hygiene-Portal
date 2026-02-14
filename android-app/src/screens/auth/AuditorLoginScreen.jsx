import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const COLORS = {
  blue: { primary: '#3b82f6', light: '#eff6ff', muted: 'rgba(59,130,246,0.08)', ring: '#bfdbfe', gradient: ['#3b82f6', '#2563eb'] },
};

const AuditorLoginScreen = ({ navigation }) => {
  const { auditorLogin } = useAuth();
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
      await auditorLogin({ email, password });
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid auditor credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <LinearGradient
          colors={COLORS.blue.gradient}
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
          <View>
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#ffffff', letterSpacing: -1, marginBottom: 8 }}>
              Auditor Login
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 20 }}>
              Access for authorized auditors
            </Text>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20, marginTop: -20 }}>
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
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                Auditor Email
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
                  placeholder="Enter auditor email"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
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
                  placeholder="Enter password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} className="active:opacity-70">
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748b" />
                </Pressable>
              </View>
            </View>

            <Pressable onPress={handleLogin} disabled={loading} className="active:opacity-80">
              <LinearGradient
                colors={COLORS.blue.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  shadowColor: COLORS.blue.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 }}>
                    Auditor Sign In
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuditorLoginScreen;
