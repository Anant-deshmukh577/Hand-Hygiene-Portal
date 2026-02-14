import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-8">
          {/* Back Button */}
          <Pressable
            onPress={() => navigation.goBack()}
            className="mb-8 active:opacity-70"
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>

          {/* Header */}
          <View className="mb-8">
            <View className="bg-teal-100 rounded-full w-16 h-16 items-center justify-center mb-4">
              <Ionicons name="key" size={32} color="#0d9488" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </Text>
            <Text className="text-gray-600 text-base">
              Enter your email and we'll send you instructions to reset your password
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Email Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                <TextInput
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!sent}
                />
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading || sent}
              className={`rounded-xl py-4 px-6 mt-6 ${
                loading || sent ? 'bg-teal-400' : 'bg-teal-600 active:bg-teal-700'
              }`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? 'Sending...' : sent ? 'Email Sent' : 'Send Reset Link'}
              </Text>
            </Pressable>

            {/* Back to Login */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600">Remember your password? </Text>
              <Pressable
                onPress={() => navigation.navigate('Login')}
                className="active:opacity-70"
              >
                <Text className="text-teal-600 font-semibold">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
