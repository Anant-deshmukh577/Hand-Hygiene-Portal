import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0d9488" />
        {text && (
          <Text className="mt-4 text-gray-600 text-base">{text}</Text>
        )}
      </View>
    );
  }

  return (
    <View className="py-8 justify-center items-center">
      <ActivityIndicator size="large" color="#0d9488" />
      {text && (
        <Text className="mt-4 text-gray-600 text-base">{text}</Text>
      )}
    </View>
  );
};

export default Loader;
