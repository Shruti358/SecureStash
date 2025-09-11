import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TopNavbar from "../components/TopNavbar";

// --- Screens ---
export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [tab, setTab] = useState("Suggested");
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  const dummyFiles = [
    { id: "1", name: "Report.pdf" },
    { id: "2", name: "Invoice.docx" },
    { id: "3", name: "Image.png" },
  ];

  return (
    <View style={styles.container}>
      <TopNavbar navigation={navigation} />

      {/* Suggested / Activity Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setTab("Suggested")}>
          <Text style={[styles.tabText, tab === "Suggested" && styles.activeTab]}>
            Suggested
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("Activity")}>
          <Text style={[styles.tabText, tab === "Activity" && styles.activeTab]}>
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      {/* File List */}
      <FlatList
        data={dummyFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <Icon name="file-document-outline" size={20} color="#6b7280" />
            <Text style={styles.fileText}>{item.name}</Text>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowPlusMenu(!showPlusMenu)}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Plus Menu */}
      {showPlusMenu && (
        <View style={styles.plusMenu}>
          <TouchableOpacity style={styles.plusMenuItem} onPress={() => setShowPlusMenu(false)}>
            <Icon name="folder-open" size={20} color="#22c55e" />
            <Text style={styles.plusMenuText}>Open Files</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plusMenuItem} onPress={() => setShowPlusMenu(false)}>
            <Icon name="upload" size={20} color="#22c55e" />
            <Text style={styles.plusMenuText}>Add Files</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plusMenuItem} onPress={() => setShowPlusMenu(false)}>
            <Icon name="camera" size={20} color="#22c55e" />
            <Text style={styles.plusMenuText}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plusMenuItem} onPress={() => setShowPlusMenu(false)}>
            <Icon name="cloud-upload" size={20} color="#22c55e" />
            <Text style={styles.plusMenuText}>Upload Files</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const StarredScreen = ({ navigation }: { navigation: any }) => (
  <View style={styles.container}>
    <TopNavbar navigation={navigation} />
    <View style={styles.centered}>
      <Icon name="star" size={48} color="#22c55e" />
      <Text style={styles.pageTitle}>Starred Files</Text>
      <Text style={styles.placeholder}>Your starred files will appear here</Text>
    </View>
  </View>
);

const SharedScreen = ({ navigation }: { navigation: any }) => (
  <View style={styles.container}>
    <TopNavbar navigation={navigation} />
    <View style={styles.centered}>
      <Icon name="account-group" size={48} color="#22c55e" />
      <Text style={styles.pageTitle}>Shared Files</Text>
      <Text style={styles.placeholder}>Files shared with you will appear here</Text>
    </View>
  </View>
);

// --- Bottom Tab Navigator ---
const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName: string, color: string, size?: number) => {
  let iconName: string = "help-circle";
  if (routeName === "Home") iconName = "view-dashboard";
  if (routeName === "Starred") iconName = "star";
  if (routeName === "Shared") iconName = "account-group";
  return <Icon name={iconName} size={size || 24} color={color} />;
};

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#6b7280",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Starred" component={StarredScreen} />
      <Tab.Screen name="Shared" component={SharedScreen} />
    </Tab.Navigator>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecfdf5",
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22c55e",
    textAlign: "center",
    marginBottom: 16,
  },
  searchMenuBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchIconButton: {
    padding: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    maxWidth: 280,
  },
  menuIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    padding: 8,
    marginLeft: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    color: "#111827",
  },
  accountMenu: {
    position: "absolute",
    top: 120,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 1000,
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
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  plusMenu: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    minWidth: 180,
    zIndex: 1000,
  },
  plusMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  plusMenuText: {
    fontSize: 14,
    color: "#111827",
    marginLeft: 12,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
  userMenu: {
    position: "absolute",
    top: 120,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 1000,
    minWidth: 200,
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
  userMenuText: {
    fontSize: 14,
    color: "#111827",
    marginLeft: 12,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  tabText: {
    fontSize: 16,
    color: "#6b7280",
  },
  activeTab: {
    color: "#22c55e",
    fontWeight: "600",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  fileText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#111827",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    fontSize: 16,
    color: "#6b7280",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22c55e",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 18,
  },
});