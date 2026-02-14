import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS, DESIGNATIONS } from '../../utils/constants';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
};

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showDesignationPicker, setShowDesignationPicker] = useState(false);

  const handleRegister = async () => {
    const { name, email, phone, department, designation, password, confirmPassword } = formData;

    // Validation
    if (!name || !email || !phone || !department || !designation || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
      return;
    }

    // Validate phone number
    if (!/^[6-9]\d{9}$/.test(phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit Indian phone number');
      return;
    }

    setLoading(true);
    try {
      await register({ 
        name, 
        email, 
        phone, 
        department, 
        designation, 
        password 
      });
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <LinearGradient
          colors={COLORS.emerald.gradient}
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
              Create Account
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 20 }}>
              Join AIIMS Hand Hygiene Initiative
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
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Full Name *</Text>
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
                <Ionicons name="person-outline" size={20} color="#64748b" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 15, color: '#0f172a' }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94a3b8"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Email *</Text>
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
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Phone Number *</Text>
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
                <Ionicons name="call-outline" size={20} color="#64748b" style={{ marginRight: 12 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 15, color: '#0f172a' }}
                  placeholder="10-digit mobile number"
                  placeholderTextColor="#94a3b8"
                  value={formData.phone}
                  onChangeText={(value) => updateField('phone', value)}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>Enter 10-digit Indian mobile number</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Department *</Text>
              <Pressable
                onPress={() => setShowDepartmentPicker(!showDepartmentPicker)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8fafc',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Ionicons name="business-outline" size={20} color="#64748b" />
                  <Text style={{ marginLeft: 12, color: formData.department ? '#0f172a' : '#94a3b8', fontSize: 15 }}>
                    {formData.department || 'Select your department'}
                  </Text>
                </View>
                <Ionicons name={showDepartmentPicker ? 'chevron-up' : 'chevron-down'} size={20} color="#64748b" />
              </Pressable>

              {showDepartmentPicker && (
                <View style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, marginTop: 8, maxHeight: 192 }}>
                  <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                    {DEPARTMENTS.map((dept, index) => (
                      <Pressable
                        key={index}
                        onPress={() => {
                          updateField('department', dept);
                          setShowDepartmentPicker(false);
                        }}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: '#f1f5f9',
                        }}
                        className="active:opacity-70"
                      >
                        <Text style={{ color: '#0f172a' }}>{dept}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Designation *</Text>
              <Pressable
                onPress={() => setShowDesignationPicker(!showDesignationPicker)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8fafc',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Ionicons name="briefcase-outline" size={20} color="#64748b" />
                  <Text style={{ marginLeft: 12, color: formData.designation ? '#0f172a' : '#94a3b8', fontSize: 15 }}>
                    {formData.designation || 'Select your designation'}
                  </Text>
                </View>
                <Ionicons name={showDesignationPicker ? 'chevron-up' : 'chevron-down'} size={20} color="#64748b" />
              </Pressable>

              {showDesignationPicker && (
                <View style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, marginTop: 8, maxHeight: 192 }}>
                  <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                    {DESIGNATIONS.map((desig, index) => (
                      <Pressable
                        key={index}
                        onPress={() => {
                          updateField('designation', desig);
                          setShowDesignationPicker(false);
                        }}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: '#f1f5f9',
                        }}
                        className="active:opacity-70"
                      >
                        <Text style={{ color: '#0f172a' }}>{desig}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Password *</Text>
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
                  placeholder="Create a password"
                  placeholderTextColor="#94a3b8"
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} className="active:opacity-70">
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748b" />
                </Pressable>
              </View>
              <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                Min 8 characters with uppercase, lowercase & number
              </Text>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Confirm Password *</Text>
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
                  placeholder="Confirm your password"
                  placeholderTextColor="#94a3b8"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateField('confirmPassword', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <Pressable onPress={handleRegister} disabled={loading} className="active:opacity-80">
              <LinearGradient
                colors={COLORS.emerald.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  shadowColor: COLORS.emerald.primary,
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
                    Create Account
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 14, color: '#64748b' }}>Already have an account? </Text>
              <Pressable onPress={() => navigation.navigate('Login')} className="active:opacity-70">
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.emerald.primary }}>
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
