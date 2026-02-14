import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const AppSplashScreen = ({ onReady }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
      if (onReady) {
        onReady();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <LinearGradient
      colors={['#059669', '#047857']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Logo/Icon */}
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Image source={require('../../../assets/AIIMS.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      {/* App Name */}
      <Text style={styles.title}>AIIMS</Text>
      <Text style={styles.subtitle}>Hand Hygiene Portal</Text>

      {/* Loading Indicator */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>All India Institute of Medical Sciences</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    width: 72,
    height: 72,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.92)',
    marginBottom: 56,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export default AppSplashScreen;
