import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "@/constants/campus";
import { useI18n } from "@/lib/i18n";

export default function TabLayout() { const inset = useSafeAreaInsets(); const { t } = useI18n(); const bottom = Platform.OS === "web" ? 10 : Math.max(8, inset.bottom); return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: C.blue, tabBarInactiveTintColor: "#718099", tabBarStyle: [s.tab, { height: 60 + bottom, paddingBottom: bottom }], tabBarLabelStyle: s.label }}><Tabs.Screen name="index" options={{ title: t("home"), tabBarIcon: ({ color, size }) => <MaterialIcons name="home-filled" color={color} size={size} /> }} /><Tabs.Screen name="requests" options={{ title: t("requests"), tabBarIcon: ({ color, size }) => <MaterialIcons name="assignment" color={color} size={size} /> }} /><Tabs.Screen name="activity" options={{ title: t("activity"), tabBarIcon: ({ color, size }) => <MaterialIcons name="notifications" color={color} size={size} /> }} /><Tabs.Screen name="profile" options={{ title: t("profile"), tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} /> }} /></Tabs>; }
const s = StyleSheet.create({ tab: { backgroundColor: "#FFF", borderTopColor: C.border, paddingTop: 7, elevation: 8 }, label: { fontSize: 10, fontWeight: "800", marginTop: 1 } });
