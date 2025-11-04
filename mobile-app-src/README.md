# EduPortal Mobile App

React Native mobile application for EduPortal education platform.

## Features

- Student authentication (login/register)
- Browse and enroll in courses
- View learning progress
- Dashboard with statistics
- Profile management

## Platforms

- iOS
- Android

## Setup

```bash
cd mobile-app
npm install
```

## Run

```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## API Configuration

The app connects to: `https://agentic-c6a39ab8.vercel.app`

Update `API_URL` in screen files to change the backend endpoint.

## Build

Use Expo EAS Build for production builds:

```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```
