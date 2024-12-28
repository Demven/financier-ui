# Financier UI

A React Native application, built for web and iOS devices.

Node v22.3

## Regenerate ios project
1. Delete the ios folder:
`rm -rf ios`
2. Recreate it using Expo:
`npx expo prebuild`
3. Reinstall CocoaPods:
`cd ios && pod install && cd ..`
4. Run the app again:
`expo run:ios`
