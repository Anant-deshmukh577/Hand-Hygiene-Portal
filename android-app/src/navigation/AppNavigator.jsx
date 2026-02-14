import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('[AppNavigator] Render - Auth state:', { 
    isAuthenticated, 
    loading, 
    hasUser: !!user,
    userEmail: user?.email 
  });

  if (loading) {
    console.log('[AppNavigator] Still loading, showing loader...');
    return <Loader fullScreen text="Initializing..." />;
  }

  console.log('[AppNavigator] Loading complete, rendering navigation');
  console.log('[AppNavigator] Will show:', isAuthenticated ? 'Main Navigator' : 'Auth Navigator');

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
