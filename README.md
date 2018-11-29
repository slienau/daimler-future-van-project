# app

[![Build Status](https://travis-ci.com/pasws18/app.svg?token=UdnpNRsQPVxpTPh6DNqo&branch=master)](https://travis-ci.com/pasws18/app)

## Setup

### Requirements

- `npm` package manager (included in [Node.js](https://nodejs.org/en/))
- React Native, install via `npm install -g react-native-cli`
- Android SDK (included in [Android Studio](https://developer.android.com/studio/)). React Native requires `Android 8.1 (Oreo)` in particular which can be installed through the SDK Manager in Android Studio. For more information on how to setup the Android development environment on your system, see the official [React Native Getting Started Page](https://facebook.github.io/react-native/docs/getting-started.html)

#### Set environment variables

On unix systems, the variables can be set in the file `.bash_profile`

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Development

`cd` into the project folder, then

1. Install dependencies via `npm install`.
2. Run an Android Virtual Device via the AVD Manager. If you haven't created a device yet, see the official Android Studio User Guide: [Create and manage virtual devices](https://developer.android.com/studio/run/managing-avds)
3. Start the application via `react-native run-android`. If the application doesn't start on the virtual device, make sure that you set the environment variables correctly.