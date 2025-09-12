import auth from '@react-native-firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// NOTE:
// This project is using the native React Native Firebase packages (@react-native-firebase/*).
// On mobile you normally configure the Firebase app via native files:
// - Android: android/app/google-services.json + gradle changes
// - iOS: ios/<Project>/GoogleService-Info.plist + CocoaPods
// If those native files are missing or native initialization didn't run yet, calls like auth() will
// throw "No Firebase App ['DEFAULT'] has been created". The code below adds protective guards
// and clearer error messages so the app doesn't crash during render. For a proper fix, follow
// the README steps to add the native configuration files (preferred) or initialize the app
// manually per the @react-native-firebase docs.

function buildInitError(): Error {
  return new Error(
    "Firebase is not initialized. Add native configuration (google-services.json / GoogleService-Info.plist)\n" +
      "or initialize the app before using Firebase. See https://rnfirebase.io for setup instructions."
  );
}

// Export the auth function (guarded usage recommended via helper methods below)
export { auth };
export type { FirebaseAuthTypes };

// Auth helper functions with clearer errors
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  try {
    return auth().currentUser;
  } catch (e) {
    throw buildInitError();
  }
};

export const signOut = async (): Promise<void> => {
  try {
    return await auth().signOut();
  } catch (error) {
    // If the root cause is missing initialization, rethrow a clearer error
    if (String(error).includes("No Firebase App")) throw buildInitError();
    console.error('Error signing out:', error);
    throw error;
  }
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    if (String(error).includes("No Firebase App")) throw buildInitError();
    console.error('Error signing in:', error);
    throw error;
  }
};

export const createUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    return await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    if (String(error).includes("No Firebase App")) throw buildInitError();
    console.error('Error creating user:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    return await auth().sendPasswordResetEmail(email);
  } catch (error) {
    if (String(error).includes("No Firebase App")) throw buildInitError();
    console.error('Error sending password reset email:', error);
    throw error;
  }
};