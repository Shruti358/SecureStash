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

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const validateEmail = (emailAddress: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };

  const handleSignup = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await signUp(normalizedEmail, password);
      // Navigation handled by auth state change in App.tsx
    } catch (error: any) {
      setIsLoading(false);
      let errorMessage = "An error occurred during signup";
      const code = error?.code || "";

      switch (code) {
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Invalid or expired credential. Re-enter details and try again.";
          break;
        default:
          errorMessage = error?.message || errorMessage;
      }

      Alert.alert("Signup Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SecureStash</Text>
      <Text style={styles.subtitle}>Signup</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#9CA3AF"
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
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
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

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm your password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Icon 
            name={showConfirmPassword ? "eye-off" : "eye"} 
            size={20} 
            color="#6b7280" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Creating Account..." : "Signup"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", color: "green", marginBottom: 10 },
  subtitle: { fontSize: 20, color: "#007bff", marginBottom: 20 },
  input: { width: "80%", borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 10, color: '#374151' },
  passwordContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  passwordInput: { flex: 1, padding: 10, color: '#374151' },
  eyeIcon: {
    padding: 10,
  },
  button: { backgroundColor: "green", padding: 15, borderRadius: 8, width: "80%", alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { marginTop: 15, color: "#007bff" }
});