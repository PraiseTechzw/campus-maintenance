import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "@/constants/campus";
import { GlobalSearch } from "@/components/global-search";
import { useI18n } from "@/lib/i18n";
import { useMaintenance } from "@/lib/maintenance-store";

export default function TabLayout() {
  const inset = useSafeAreaInsets(); const { t } = useI18n(); const { width } = useWindowDimensions(); const { role } = useMaintenance(); const desktopWeb = Platform.OS === "web" && width >= 900; const bottom = Platform.OS === "web" ? 12 : Math.max(10, inset.bottom);
  const icon = (name: keyof typeof MaterialIcons.glyphMap) => ({ color, size, focused }: { color: string; size: number; focused: boolean }) => <View style={[s.iconWrap, focused && s.iconWrapActive, desktopWeb && s.webIconWrap]}><MaterialIcons name={name} color={color} size={desktopWeb ? 21 : size - 2} /></View>;
  return <View style={{ flex: 1 }}><Tabs screenOptions={{ headerShown: false, tabBarPosition: desktopWeb ? "left" : "bottom", tabBarActiveTintColor: desktopWeb ? "#FFFFFF" : C.blue, tabBarInactiveTintColor: desktopWeb ? "#BBD8FF" : "#718099", tabBarStyle: desktopWeb ? s.webRail : [s.tab, { height: 64 + bottom, paddingBottom: bottom }], tabBarLabelStyle: desktopWeb ? s.webLabel : s.label, tabBarItemStyle: desktopWeb ? s.webItem : s.item, tabBarLabelPosition: desktopWeb ? "beside-icon" : "below-icon", tabBarActiveBackgroundColor: desktopWeb ? "rgba(255,255,255,0.14)" : "#F0F7FF", tabBarInactiveBackgroundColor: "transparent", tabBarHideOnKeyboard: true }}><Tabs.Screen name="index" options={{ title: t("home"), tabBarIcon: icon("home-filled") }} /><Tabs.Screen name="requests" options={{ title: t("requests"), tabBarIcon: icon("assignment") }} /><Tabs.Screen name="activity" options={{ title: t("activity"), tabBarIcon: icon("notifications") }} /><Tabs.Screen name="analytics" options={{ title: "Analytics", href: desktopWeb && role === "administrator" ? undefined : null, tabBarIcon: icon("analytics") }} /><Tabs.Screen name="profile" options={{ title: t("profile"), tabBarIcon: icon("person") }} /></Tabs>{desktopWeb && <GlobalSearch />}</View>;
}

const s = StyleSheet.create({
  tab: { backgroundColor: "#FFFFFF", borderTopColor: "#DDE5F0", borderTopWidth: 1, paddingTop: 7, elevation: 14, shadowColor: C.navy, shadowOpacity: 0.12, shadowRadius: 15, shadowOffset: { width: 0, height: -5 } },
  label: { fontSize: 10, fontWeight: "900", marginTop: 1 }, item: { borderRadius: 12, marginHorizontal: 2, marginVertical: 2 }, iconWrap: { width: 30, height: 24, justifyContent: "center", alignItems: "center", borderRadius: 9 }, iconWrapActive: { backgroundColor: "#DDEEFF" },
  webRail: { width: 232, backgroundColor: C.navy, borderRightWidth: 0, paddingTop: 106, paddingHorizontal: 14, elevation: 0 }, webItem: { minHeight: 54, marginVertical: 4, paddingHorizontal: 9, borderRadius: 14 }, webLabel: { fontSize: 14, fontWeight: "900", marginLeft: 5 }, webIconWrap: { backgroundColor: "transparent", width: 29, height: 29 },
});
