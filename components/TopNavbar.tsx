import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../contexts/AuthContext";

interface TopNavbarProps {
  navigation: any;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error: any) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <View>
      <View style={styles.searchMenuBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.menuIcon}
            onPress={() => setShowAccountMenu(!showAccountMenu)}
          >
            <Icon name="menu" size={24} color="#5f6368" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerSection}>
          <View style={styles.searchInputContainer}>
            <Icon name="magnify" size={20} color="#5f6368" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search files..."
              placeholderTextColor="#6b7280"
              ref={searchInputRef}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.menuIcon}
            onPress={() => setShowUserMenu(!showUserMenu)}
          >
            <Icon name="account-circle" size={24} color="#5f6368" />
          </TouchableOpacity>
        </View>
      </View>

      {showAccountMenu && (
        <View style={styles.accountMenu}>
          <TouchableOpacity
            style={styles.accountMenuItem}
            onPress={() => {
              setShowAccountMenu(false);
              navigation.navigate('Home');
            }}
          >
            <Icon name="home" size={18} color="#6b7280" />
            <Text style={styles.accountMenuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accountMenuItem}
            onPress={() => {
              setShowAccountMenu(false);
              navigation.navigate('Starred');
            }}
          >
            <Icon name="star" size={18} color="#6b7280" />
            <Text style={styles.accountMenuText}>Starred</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accountMenuItem}
            onPress={() => {
              setShowAccountMenu(false);
              navigation.navigate('Shared');
            }}
          >
            <Icon name="share" size={18} color="#6b7280" />
            <Text style={styles.accountMenuText}>Shared with me</Text>
          </TouchableOpacity>
        </View>
      )}

      {showUserMenu && (
        <View style={styles.userMenu}>
          <View style={styles.userInfo}>
            <Icon name="account-circle" size={40} color="#6b7280" />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Hi, {user?.email?.split('@')[0] || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={styles.userMenuItem}
            onPress={handleSignOut}
          >
            <Icon name="logout" size={18} color="#ef4444" />
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchMenuBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 16,
    width: '100%',
  },
  leftSection: {
    flex: 0.15,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  centerSection: {
    flex: 0.7,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  rightSection: {
    flex: 0.15,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    width: '100%',
    height: 48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuIcon: {
    padding: 12,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#202124",
    height: 24,
  },
  accountMenu: {
    position: "absolute",
    top: 70,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 1000,
    minWidth: 200,
  },
  accountMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 160,
  },
  accountMenuText: {
    fontSize: 14,
    color: "#111827",
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
  userMenu: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 1000,
    minWidth: 220,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  userMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  signOutText: {
    fontSize: 14,
    color: "#ef4444",
    marginLeft: 12,
  },
});

export default TopNavbar;
