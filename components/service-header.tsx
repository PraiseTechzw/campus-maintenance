import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { C } from "@/constants/campus";
import { LanguagePicker } from "@/components/language-picker";
import { roleLabelKey, roleSummaryKey, useI18n } from "@/lib/i18n";
import { roles, useMaintenance } from "@/lib/maintenance-store";

export function ServiceHeader({ section, icon }: { section: string; icon: keyof typeof MaterialIcons.glyphMap }) {
  const { role } = useMaintenance();
  const { t } = useI18n();
  const detail = roles[role];
  return (
    <>
      <StatusBar style="light" backgroundColor={C.navy} translucent={false} animated />
      <View style={s.wrap}>
        <View style={s.topLine}>
          <View style={s.brand}><View style={s.brandMark}><MaterialIcons name="account-balance" size={17} color="#FFFFFF" /></View><View><Text style={s.brandText}>CAMPUS MAINTENANCE</Text><Text style={s.brandDetail}>{t(roleLabelKey[role])}</Text></View></View>
          <LanguagePicker compact />
        </View>
        <View style={s.sectionLine}>
          <View style={s.icon}><MaterialIcons name={icon} size={19} color="#FFFFFF" /></View>
          <View style={s.copy}><Text style={s.section}>{t(section)}</Text><Text style={s.summary} numberOfLines={1}>{t(roleSummaryKey[role])}</Text></View>
          <View style={s.initials}><Text style={s.initialsText}>{detail.initials}</Text></View>
        </View>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  wrap: { backgroundColor: C.navy, paddingHorizontal: 20, paddingTop: 13, paddingBottom: 18, gap: 15, borderBottomLeftRadius: 26, borderBottomRightRadius: 26 },
  topLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  brand: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  brandMark: { height: 29, width: 29, borderRadius: 10, backgroundColor: "#1B8AF1", alignItems: "center", justifyContent: "center" },
  brandText: { color: "#FFFFFF", fontSize: 10, letterSpacing: 1.4, fontWeight: "900" },
  brandDetail: { color: "#A8CFFF", fontSize: 10, marginTop: 2, fontWeight: "700" },
  sectionLine: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.13)", alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: 2 },
  section: { color: "#FFFFFF", fontSize: 20, lineHeight: 25, fontWeight: "900" },
  summary: { color: "#BBD8FF", fontSize: 11, lineHeight: 16, fontWeight: "600" },
  initials: { width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
  initialsText: { color: C.navy, fontSize: 10, fontWeight: "900" },
});
