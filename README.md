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

## Build new production version to submit to App Store
1. Regenerate ios project (see above)
2. Build preview and test locally
`npm run build-ios-preview`
3. Build production version
`npm run build-ios-production`
