export default {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  expo: {
    name: "financier-ui",
    slug: "financier-ui",
    version: "2.8.0",
    scheme: "financier-ui",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.demven.financierui",
      icon: "./public/images/favicons/apple-touch-icon.png",
      runtimeVersion: "1.0.0",
      buildNumber: "5",
    },
    android: {
      package: "com.demven.financierui"
    },
    web: {
      bundler: "metro",
      favicon: "./public/images/favicons/favicon-32x32.png"
    },
    splash: {
      image: "./assets/images/splash-screen.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF"
    },
    plugins: [
      "expo-router"
    ],
    platforms: [
      "ios",
      "web"
    ],
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "bc096fe4-114c-429b-90b9-983b2e2555b3"
      }
    },
    updates: {
      url: "https://u.expo.dev/bc096fe4-114c-429b-90b9-983b2e2555b3"
    },
  }
};
