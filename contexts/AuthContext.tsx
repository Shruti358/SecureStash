import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  auth, 
  FirebaseAuthTypes, 
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordReset
} from '../config/firebase';

// Define the context type
interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Set up auth state listener
  useEffect(() => {
    // Guard the native auth call - if native Firebase isn't initialized yet, auth() will throw.
    // We catch that and set loading to false so the app can render and the user can see UI.
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = auth().onAuthStateChanged((authUser) => {
        setUser(authUser);
        setLoading(false);
      });
    } catch (err) {
      // Likely "No Firebase App ['DEFAULT'] has been created". Log and continue.
      console.warn('Firebase not initialized (auth listener not attached):', err);
      setLoading(false);
    }

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await firebaseSignIn(email, password);
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await firebaseSignUp(email, password);
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut();
    } catch (error: any) {
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await firebaseSendPasswordReset(email);
    } catch (error: any) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};