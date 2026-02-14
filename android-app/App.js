import 'react-native-gesture-handler';
import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AppSplashScreen from './src/components/common/SplashScreen';

// Import NativeWind CSS
import './src/theme/global.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const onReady = useCallback(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <AppSplashScreen onReady={onReady} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}
