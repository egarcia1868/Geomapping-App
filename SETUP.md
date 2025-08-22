# Geomapping App Setup Instructions

## Prerequisites

1. **Node.js** (version 18 or higher)
2. **React Native CLI**
3. **Android Studio** (for Android development)
4. **Xcode** (for iOS development, macOS only)
5. **Google Maps API Key**

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install iOS dependencies (macOS only):
```bash
cd ios && pod install && cd ..
```

## Google Maps API Key Setup

1. Get a Google Maps API Key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS

### Android Setup
1. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `android/app/src/main/AndroidManifest.xml` with your actual API key

### iOS Setup
1. Add your API key to `ios/GeomappingApp/AppDelegate.mm`:
```objective-c
#import <GoogleMaps/GoogleMaps.h>

// Add this in didFinishLaunchingWithOptions
[GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
```

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## Features

- **Location Tracking**: Uses GPS to track user location
- **Tag Creation**: Users can create tags within 0.5 miles of their current location
- **Tag Discovery**: View all tags within 50 miles of current location
- **Real-time Updates**: Location and tags update automatically
- **Offline Storage**: Tags are stored locally using AsyncStorage

## App Architecture

- `src/screens/MapScreen.tsx` - Main map interface
- `src/components/TagCreationModal.tsx` - Modal for creating new tags
- `src/services/LocationService.ts` - GPS and location permissions
- `src/services/TagService.ts` - Tag storage and retrieval
- `src/utils/distance.ts` - Distance calculations between locations
- `src/types/index.ts` - TypeScript type definitions

## Permissions

The app requires location permissions to function properly:
- **Android**: ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION
- **iOS**: NSLocationWhenInUseUsageDescription

## Notes

- The blue circle on the map shows the 0.5-mile radius where you can create tags
- Tags are stored locally on the device
- Distance calculations use the Haversine formula for accuracy
- The app shows your current location with a blue dot on the map