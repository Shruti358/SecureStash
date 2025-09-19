import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TopNavbar from "../components/TopNavbar";
import StarredScreen from "./StarredScreen";
import SharedScreen from "./SharedScreen";

// Define the tab param list to align with React Navigation types
type RootTabParamList = {
  Home: undefined;
  Starred: undefined;
  Shared: undefined;
};

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
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => {}}
              accessibilityLabel="File password options"
            >
              <Icon name="lock-outline" size={14} color="#6b7280" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Backdrop for Plus Menu */}
      {showPlusMenu && (
        <Pressable style={styles.backdrop} onPress={() => setShowPlusMenu(false)} />
      )}

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

// --- Bottom Tab Navigator ---
const Tab = createBottomTabNavigator<RootTabParamList>();

const getTabBarIcon = (routeName: string, color: string, size?: number) => {
  let iconName: string = "help-circle";
  if (routeName === "Home") iconName = "view-dashboard";
  if (routeName === "Starred") iconName = "star";
  if (routeName === "Shared") iconName = "account-group";
  return <Icon name={iconName} size={size || 24} color={color} />;
};

export default function Home() {
  return (
    // @ts-ignore - React Navigation v7 typing mismatch with JSX children in this TS version
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
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 900,
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
});