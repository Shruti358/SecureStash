import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import { StyleSheet, View } from "react-native";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { FileProvider } from "./contexts/FileContext";

// Enable screens for better performance
enableScreens();

// Import screens
import SignupScreen from "./Screens/SignupScreen";
import LoginScreen from "./Screens/LoginScreen";
import Home from "./Screens/HomeScreen";

export type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* You can add a loading spinner here */}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={user ? "Home" : "Login"}
        screenOptions={{ headerShown: false }}
        id="root"
      >
        {user ? (
          // Authenticated user screens
          <Stack.Screen name="Home" component={Home} />
        ) : (
          // Unauthenticated user screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FileProvider>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </FileProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});