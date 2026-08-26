import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter as useExpoRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Card } from "@/components/campus-ui";
import { ServiceHeader } from "@/components/service-header";
import { C, shadow } from "@/constants/campus";
import { haptic } from "@/lib/haptics";
import { roleSummaryKey, useI18n } from "@/lib/i18n";
import { useMaintenance } from "@/lib/maintenance-store";

const useRouter = () => useExpoRouter() as any;

export default function Home() {
  const router = useRouter();
  const { role, visible, requests } = useMaintenance();
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const student = role === "student";
  const open = visible.filter((request) => request.status !== "Resolved");
  const urgent = requests.filter((request) => request.priority === "Urgent" && request.status !== "Resolved");
  const primary = () => { haptic.light(); router.push(student ? "/report" : "/requests"); };

  return (
    <View style={s.screen}>
      <ServiceHeader section="home" icon="space-dashboard" />
      <ScrollView contentContainerStyle={[s.content, width > 740 && s.wide]}>
        <View style={s.intro}>
          <View style={{ flex: 1 }}>
            <Text style={s.eyebrow}>{t("demoWorkspace")}</Text>
            <Text style={s.title}>{student ? t("howHelp") : t("readyImpact")}</Text>
            <Text style={s.sub}>{t(roleSummaryKey[role])}</Text>
          </View>
          {role === "security" && urgent.length > 0 && <View style={s.alert}><MaterialIcons name="priority-high" size={18} color={C.danger} /><Text style={s.alertText}>{urgent.length}</Text></View>}
        </View>
        <Pressable onPress={primary} style={({ pressed }) => [s.primary, pressed && s.primaryPressed]}>
          <MaterialIcons name={student ? "add-circle-outline" : "assignment"} size={21} color="#FFF" />
          <Text style={s.primaryText}>{student ? t("reportIssue") : role === "administrator" ? t("reviewRequests") : t("openQueue")}</Text>
          <MaterialIcons name="arrow-forward" size={19} color="#FFF" />
        </Pressable>
        <View style={s.stats}>
          <Stat icon="assignment" n={open.length} label={student ? t("openReports") : t("activeWork")} color={C.blue} bg={C.sky} />
          <Stat icon="task-alt" n={visible.filter((request) => request.status === "Resolved").length} label={t("resolved")} color={C.success} bg="#E7F7EF" />
          <Stat icon="schedule" n={visible.filter((request) => request.status === "Submitted").length} label={t("needRouting")} color={C.warn} bg="#FFF5DE" />
        </View>
        {role === "administrator" && <View style={s.admin}><View style={s.adminIcon}><MaterialIcons name="admin-panel-settings" size={21} color="#FFF" /></View><View style={{ flex: 1 }}><Text style={s.adminTitle}>{t("commandCenter")}</Text><Text style={s.adminText}>{urgent.length} {t("urgentNeeds")}</Text></View></View>}
        <View style={s.section}><View><Text style={s.sectionTitle}>{student ? t("recentReports") : t("recentActivity")}</Text><Text style={s.sectionSub}>{student ? t("followProgress") : t("latestVisible")}</Text></View><Pressable onPress={() => router.push("/requests")}><Text style={s.viewAll}>{t("viewAll")}</Text></Pressable></View>
        <View style={s.list}>{visible.slice(0, 3).map((item) => <Card key={item.id} item={item} onPress={() => router.push(`/request/${item.id}`)} />)}</View>
      </ScrollView>
    </View>
  );
}

function Stat({ icon, n, label, color, bg }: { icon: keyof typeof MaterialIcons.glyphMap; n: number; label: string; color: string; bg: string }) {
  return <View style={s.stat}><View style={[s.statIcon, { backgroundColor: bg }]}><MaterialIcons name={icon} size={18} color={color} /></View><Text style={s.statN}>{n}</Text><Text style={s.statLabel}>{label}</Text></View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg }, content: { padding: 20, paddingBottom: 34, gap: 21, maxWidth: 780, width: "100%", alignSelf: "center" }, wide: { paddingHorizontal: 28, paddingTop: 28 },
  intro: { flexDirection: "row", gap: 14, alignItems: "flex-start" }, eyebrow: { color: C.blue, fontSize: 10, letterSpacing: 1.2, fontWeight: "900", marginBottom: 6 }, title: { color: C.navy, fontSize: 29, lineHeight: 35, letterSpacing: -0.5, fontWeight: "900" }, sub: { color: C.muted, fontSize: 14, lineHeight: 20, marginTop: 5 },
  alert: { flexDirection: "row", gap: 3, backgroundColor: "#FDECEC", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 9 }, alertText: { color: C.danger, fontWeight: "900" }, primary: { minHeight: 56, borderRadius: 18, backgroundColor: C.navy, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", gap: 10, ...shadow }, primaryPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] }, primaryText: { flex: 1, color: "#FFF", fontSize: 16, fontWeight: "900" },
  stats: { flexDirection: "row", gap: 10 }, stat: { flex: 1, minHeight: 118, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 13, gap: 6 }, statIcon: { width: 33, height: 33, borderRadius: 11, alignItems: "center", justifyContent: "center" }, statN: { color: C.navy, fontSize: 22, fontWeight: "900" }, statLabel: { color: C.muted, fontSize: 11, lineHeight: 14, fontWeight: "700" },
  admin: { flexDirection: "row", alignItems: "center", gap: 11, borderWidth: 1, borderColor: "#CFE4FC", backgroundColor: C.sky, borderRadius: 19, padding: 15 }, adminIcon: { backgroundColor: C.blue, width: 39, height: 39, borderRadius: 13, justifyContent: "center", alignItems: "center" }, adminTitle: { color: C.navy, fontSize: 14, fontWeight: "900" }, adminText: { color: "#31547F", fontSize: 12, lineHeight: 17, marginTop: 2 },
  section: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, sectionTitle: { color: C.navy, fontSize: 19, fontWeight: "900" }, sectionSub: { color: C.muted, fontSize: 12, marginTop: 2 }, viewAll: { color: C.blue, fontSize: 13, fontWeight: "900", padding: 6 }, list: { gap: 12 },
});
