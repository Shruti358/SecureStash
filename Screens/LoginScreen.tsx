import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../contexts/AuthContext";

type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, resetPassword } = useAuth();

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      await signIn(normalizedEmail, password);
      // Navigation handled by auth state change in App.tsx
    } catch (error: any) {
      setIsLoading(false);
      let errorMessage = "An error occurred during login";
      const code = error?.code || "";

      switch (code) {
        case 'auth/user-not-found':
          errorMessage = "No user found with this email";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Invalid or expired credential. Re-enter email and password and try again.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled";
          break;
        default:
          errorMessage = error?.message || errorMessage;
      }

      Alert.alert("Login Failed", errorMessage);
    }
  };

  const handleResetPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      Alert.alert("Reset Password", "Enter your email above to receive a reset link.");
      return;
    }
    try {
      await resetPassword(normalizedEmail);
      Alert.alert("Reset Email Sent", "Check your inbox for a password reset link.");
    } catch (error: any) {
      let message = "Unable to send reset email";
      if (error?.code === 'auth/user-not-found') message = "No user found with this email";
      else if (error?.code === 'auth/invalid-email') message = "Invalid email address";
      Alert.alert("Reset Failed", message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SecureStash</Text>
      <Text style={styles.subtitle}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon 
            name={showPassword ? "eye-off" : "eye"} 
            size={20} 
            color="#6b7280" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleResetPassword}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Don’t have an account? Signup
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", color: "green", marginBottom: 10 },
  subtitle: { fontSize: 20, color: "#007bff", marginBottom: 20 },
  input: { width: "80%", borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 10 },
  passwordContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  forgot: { alignSelf: 'flex-end', width: '80%', color: '#007bff', marginBottom: 12 },
  button: { backgroundColor: "green", padding: 15, borderRadius: 8, width: "80%", alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { marginTop: 15, color: "#007bff" }
});