export default {
  expo: {
    name: "AIIMS Hand Hygiene",
    slug: "aiims-hand-hygiene-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/AIIMS.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/AIIMS.png",
      resizeMode: "contain",
      backgroundColor: "#059669"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.aiims.handhygiene"
    },
    android: {
      package: "com.aiims.handhygiene",
      adaptiveIcon: {
        foregroundImage: "./assets/AIIMS.png",
        backgroundColor: "#ffffff"
      },
      usesCleartextTraffic: true,
      permissions: [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    web: {
      bundler: "metro"
    },
    plugins: [
      "expo-secure-store",
      "expo-web-browser",
      [
        "expo-image-picker",
        {
          photosPermission: "The app needs access to your photos to update your profile picture."
        }
      ]
    ],
    extra: {
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      // eas: {
      //   projectId: "your-eas-project-id"  // Uncomment and set after running: npx eas init
      // }
    }
  }
};
