import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "@/constants/campus";
import { useI18n } from "@/lib/i18n";

export default function TabLayout() {
  const inset = useSafeAreaInsets();
  const { t } = useI18n();
  const bottom = Platform.OS === "web" ? 12 : Math.max(10, inset.bottom);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: C.blue, tabBarInactiveTintColor: "#718099", tabBarStyle: [s.tab, { height: 64 + bottom, paddingBottom: bottom }], tabBarLabelStyle: s.label, tabBarItemStyle: s.item, tabBarActiveBackgroundColor: "#F0F7FF" }}><Tabs.Screen name="index" options={{ title: t("home"), tabBarIcon: ({ color, size, focused }) => <View style={[s.iconWrap, focused && s.iconWrapActive]}><MaterialIcons name="home-filled" color={color} size={size - 2} /></View> }} /><Tabs.Screen name="requests" options={{ title: t("requests"), tabBarIcon: ({ color, size, focused }) => <View style={[s.iconWrap, focused && s.iconWrapActive]}><MaterialIcons name="assignment" color={color} size={size - 2} /></View> }} /><Tabs.Screen name="activity" options={{ title: t("activity"), tabBarIcon: ({ color, size, focused }) => <View style={[s.iconWrap, focused && s.iconWrapActive]}><MaterialIcons name="notifications" color={color} size={size - 2} /></View> }} /><Tabs.Screen name="profile" options={{ title: t("profile"), tabBarIcon: ({ color, size, focused }) => <View style={[s.iconWrap, focused && s.iconWrapActive]}><MaterialIcons name="person" color={color} size={size - 2} /></View> }} /></Tabs>;
}

const s = StyleSheet.create({
  tab: { backgroundColor: "#FFFFFF", borderTopColor: "#DDE5F0", borderTopWidth: 1, paddingTop: 7, elevation: 14, shadowColor: C.navy, shadowOpacity: 0.12, shadowRadius: 15, shadowOffset: { width: 0, height: -5 } },
  label: { fontSize: 10, fontWeight: "900", marginTop: 1 },
  item: { borderRadius: 12, marginHorizontal: 2, marginVertical: 2 },
  iconWrap: { width: 30, height: 24, justifyContent: "center", alignItems: "center", borderRadius: 9 },
  iconWrapActive: { backgroundColor: "#DDEEFF" },
});
