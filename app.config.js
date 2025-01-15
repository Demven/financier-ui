export default {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  "expo": {
    "name": "financier-ui",
    "slug": "financier-ui",
    "scheme": "financier-ui",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.demven.financierui",
      "icon": "./public/images/favicons/apple-touch-icon.png",
      "runtimeVersion": "1.0.0"
    },
    "web": {
      "bundler": "metro",
      "favicon": "./public/images/favicons/favicon-32x32.png"
    },
    "splash": {
      "image": "./assets/images/splash-screen.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    "plugins": [
      "expo-router"
    ],
    "platforms": [
      "ios",
      "web"
    ],
    "android": {
      "package": "com.demven.financierui"
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "bc096fe4-114c-429b-90b9-983b2e2555b3"
      }
    },
    "updates": {
      "url": "https://u.expo.dev/bc096fe4-114c-429b-90b9-983b2e2555b3"
    },
  }
};
