# SecureStash

A React Native application for secure password and credential management with a modern, user-friendly interface.

## 📱 Features

- **User Authentication**: Signup and Login screens with secure password handling
- **Modern UI**: Clean, responsive design with green-themed branding
- **Navigation**: Smooth screen transitions using React Navigation
- **Cross-Platform**: Works on both Android and iOS

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **React Native CLI** - Install globally: `npm install -g @react-native-community/cli`
- **Android Studio** (for Android development) - [Download here](https://developer.android.com/studio)
- **Xcode** (for iOS development, macOS only) - Available on Mac App Store
- **Java Development Kit (JDK)** - Version 17 or higher
- **Android SDK** - Install via Android Studio

## 📋 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Shruti358/SecureStash
cd SecureStash

# If you're working with a specific branch
git checkout <branch-name>
```

### Step 2: Install Dependencies

```bash
# Install all npm dependencies
npm install
```

**Note**: If you encounter any JSON parsing errors during installation, check the `package.json` file for syntax errors (like trailing commas).

### Step 3: Install React Native Dependencies

The project requires additional React Native dependencies for navigation:

```bash
# Install React Navigation dependencies
npm install @react-navigation/native @react-navigation/native-stack

# Install required native dependencies
npm install react-native-screens react-native-gesture-handler react-native-safe-area-context
```

### Step 4: Android Setup

#### 4.1 Configure Android Environment

1. **Set up Android SDK**:
   - Open Android Studio
   - Go to Settings/Preferences → Appearance & Behavior → System Settings → Android SDK
   - Install Android SDK Platform 34 (API Level 34)
   - Install Android SDK Build-Tools 34.0.0

2. **Set Environment Variables** (Windows):
   ```bash
   # Add these to your system environment variables
   ANDROID_HOME=C:\Users\<YourUsername>\AppData\Local\Android\Sdk
   PATH=%PATH%;%ANDROID_HOME%\platform-tools
   PATH=%PATH%;%ANDROID_HOME%\tools
   ```

3. **Set Environment Variables** (macOS/Linux):
   ```bash
   # Add to your ~/.bash_profile or ~/.zshrc
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### 4.2 Create Android Virtual Device (AVD)

1. Open Android Studio
2. Go to Tools → AVD Manager
3. Click "Create Virtual Device"
4. Select a device (e.g., Pixel 9a)
5. Select a system image (e.g., API 34)
6. Click "Finish"

### Step 5: iOS Setup (macOS only)

```bash
# Install iOS dependencies
cd ios
pod install
cd ..
```

## 🚀 Running the Application

### Option 1: Run on Android

```bash
# Start the Metro bundler (in a separate terminal)
npx react-native start

# In another terminal, run the Android app
npx react-native run-android
```

**Alternative (single command)**:
```bash
# This will start Metro and run the app
npx react-native run-android
```

### Option 2: Run on iOS (macOS only)

```bash
# Start the Metro bundler (in a separate terminal)
npx react-native start

# In another terminal, run the iOS app
npx react-native run-ios
```

**Alternative (single command)**:
```bash
# This will start Metro and run the app
npx react-native run-ios
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Metro Bundler Port Already in Use
```bash
# Kill the process using port 8081
npx react-native start --reset-cache
```

#### 2. Android Build Errors
```bash
# Clean the Android build
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### 3. React Navigation ViewManager Errors
If you see errors like "Can't find ViewManager 'RNSScreenStackHeaderConfig'", ensure you have:
- Installed `react-native-screens` and `react-native-gesture-handler`
- Updated `MainActivity.kt` with the `onCreate` override
- Wrapped your app with `GestureHandlerRootView`

#### 4. Dependencies Not Found
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

#### 5. Android Emulator Not Starting
- Ensure Android Studio is properly configured
- Check that AVD is created and working
- Verify environment variables are set correctly

### Build Warnings

You may see CMake warnings about long file paths during the build process. These are common on Windows and don't affect the app's functionality.

## 📁 Project Structure

```
SecureStash/
├── android/                 # Android-specific files
├── ios/                    # iOS-specific files
├── Screens/                # Application screens
│   ├── SignupScreen.tsx    # User registration screen
│   ├── LoginScreen.tsx     # User authentication screen
│   └── HomeScreen.tsx      # Main application screen
├── App.tsx                 # Main application component
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md              # This file
```

## 🧪 Available Scripts

```bash
# Start the Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run tests
npm test

# Run linting
npm run lint
```

## 🔒 Security Features

- Secure password input fields
- Navigation state management
- Safe area handling for different device sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Ensure all prerequisites are installed correctly
3. Verify that you're using the correct Node.js version (>=20)
4. Check that all environment variables are set properly

For additional help, please open an issue in the repository.
