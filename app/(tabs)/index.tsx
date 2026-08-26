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
  const { role, visible } = useMaintenance();
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const student = role === "student";
  const ict = role === "ict";
  const security = role === "security";
  const open = visible.filter((request) => request.status !== "Resolved");
  const active = visible.filter((request) => request.status === "In Progress");
  const waiting = visible.filter((request) => request.status === "Submitted");
  const urgent = visible.filter((request) => request.priority === "Urgent" && request.status !== "Resolved");
  const unacknowledged = urgent.filter((request) => !request.acknowledged);
  const primary = () => { haptic.light(); router.push(student ? "/report" : "/requests"); };
  const heading = student ? t("howHelp") : ict ? "ICT work desk" : security ? "Security control desk" : t("readyImpact");
  const helper = student ? t(roleSummaryKey[role]) : ict ? "Technology requests assigned to ICT only." : security ? "Security incidents and alerts assigned to your team only." : t(roleSummaryKey[role]);

  return (
    <View style={s.screen}>
      <ServiceHeader section="home" icon={ict ? "computer" : security ? "security" : "space-dashboard"} />
      <ScrollView contentContainerStyle={[s.content, width > 740 && s.wide]}>
        <View style={s.intro}>
          <View style={{ flex: 1 }}>
            <Text style={s.eyebrow}>{student ? t("demoWorkspace") : ict ? "ICT ASSIGNED WORK" : security ? "SECURITY OPERATIONS" : t("demoWorkspace")}</Text>
            <Text style={s.title}>{heading}</Text>
            <Text style={s.sub}>{helper}</Text>
          </View>
          {security && unacknowledged.length > 0 && <View style={s.alert}><MaterialIcons name="priority-high" size={18} color={C.danger} /><Text style={s.alertText}>{unacknowledged.length}</Text></View>}
        </View>
        <Pressable onPress={primary} style={({ pressed }) => [s.primary, pressed && s.primaryPressed]}>
          <MaterialIcons name={student ? "add-circle-outline" : security ? "notifications-active" : "assignment"} size={21} color="#FFF" />
          <Text style={s.primaryText}>{student ? t("reportIssue") : security ? "Open security queue" : ict ? "Open ICT queue" : role === "administrator" ? t("reviewRequests") : t("openQueue")}</Text>
          <MaterialIcons name="arrow-forward" size={19} color="#FFF" />
        </Pressable>
        {ict && <View style={s.teamCallout}><View style={[s.calloutIcon, { backgroundColor: "#EEE9FE" }]}><MaterialIcons name="computer" size={23} color="#6941C6" /></View><View style={{ flex: 1 }}><Text style={s.calloutTitle}>ICT service focus</Text><Text style={s.calloutText}>{waiting.length} request{waiting.length === 1 ? "" : "s"} need triage and {active.length} active job{active.length === 1 ? "" : "s"} are in progress.</Text></View></View>}
        {security && <View style={[s.teamCallout, s.securityCallout]}><View style={[s.calloutIcon, { backgroundColor: "#FDECEC" }]}><MaterialIcons name="security" size={23} color={C.danger} /></View><View style={{ flex: 1 }}><Text style={[s.calloutTitle, { color: C.danger }]}>Security alerts</Text><Text style={s.calloutText}>{unacknowledged.length ? `${unacknowledged.length} urgent incident${unacknowledged.length === 1 ? " requires" : "s require"} acknowledgement.` : "No urgent incidents require acknowledgement."}</Text></View></View>}
        <View style={s.stats}>
          <Stat icon={security ? "warning-amber" : "assignment"} n={security ? urgent.length : open.length} label={security ? "Urgent alerts" : student ? t("openReports") : "Assigned work"} color={security ? C.danger : C.blue} bg={security ? "#FDECEC" : C.sky} />
          <Stat icon="task-alt" n={active.length} label={student ? t("resolved") : "In progress"} color={C.success} bg="#E7F7EF" />
          <Stat icon="schedule" n={waiting.length} label={security ? "Awaiting action" : ict ? "Need ICT triage" : t("needRouting")} color={C.warn} bg="#FFF5DE" />
        </View>
        <View style={s.section}><View><Text style={s.sectionTitle}>{student ? t("recentReports") : security ? "Security queue" : ict ? "ICT queue" : t("recentActivity")}</Text><Text style={s.sectionSub}>{student ? t("followProgress") : security ? "Only incidents assigned to Security." : ict ? "Only tasks assigned to ICT." : t("latestVisible")}</Text></View><Pressable onPress={() => router.push("/requests")}><Text style={s.viewAll}>{t("viewAll")}</Text></Pressable></View>
        <View style={s.list}>{visible.slice(0, 4).map((item) => <Card key={item.id} item={item} onPress={() => router.push(`/request/${item.id}`)} />)}</View>
      </ScrollView>
    </View>
  );
}

function Stat({ icon, n, label, color, bg }: { icon: keyof typeof MaterialIcons.glyphMap; n: number; label: string; color: string; bg: string }) {
  return <View style={s.stat}><View style={[s.statIcon, { backgroundColor: bg }]}><MaterialIcons name={icon} size={18} color={color} /></View><Text style={s.statN}>{n}</Text><Text style={s.statLabel}>{label}</Text></View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg }, content: { padding: 20, paddingBottom: 34, gap: 18, maxWidth: 780, width: "100%", alignSelf: "center" }, wide: { paddingHorizontal: 28, paddingTop: 28 }, intro: { flexDirection: "row", gap: 14, alignItems: "flex-start" }, eyebrow: { color: C.blue, fontSize: 10, letterSpacing: 1.2, fontWeight: "900", marginBottom: 6 }, title: { color: C.navy, fontSize: 29, lineHeight: 35, letterSpacing: -0.5, fontWeight: "900" }, sub: { color: C.muted, fontSize: 14, lineHeight: 20, marginTop: 5 }, alert: { flexDirection: "row", gap: 3, backgroundColor: "#FDECEC", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 9 }, alertText: { color: C.danger, fontWeight: "900" },
  primary: { minHeight: 56, borderRadius: 18, backgroundColor: C.navy, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", gap: 10, ...shadow }, primaryPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] }, primaryText: { flex: 1, color: "#FFF", fontSize: 16, fontWeight: "900" },
  teamCallout: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 19, padding: 14 }, securityCallout: { borderColor: "#F6C3BF" }, calloutIcon: { height: 43, width: 43, borderRadius: 14, alignItems: "center", justifyContent: "center" }, calloutTitle: { color: C.navy, fontSize: 14, fontWeight: "900" }, calloutText: { color: C.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  stats: { flexDirection: "row", gap: 10 }, stat: { flex: 1, minHeight: 110, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 13, gap: 6 }, statIcon: { width: 33, height: 33, borderRadius: 11, alignItems: "center", justifyContent: "center" }, statN: { color: C.navy, fontSize: 22, fontWeight: "900" }, statLabel: { color: C.muted, fontSize: 11, lineHeight: 14, fontWeight: "700" },
  section: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, sectionTitle: { color: C.navy, fontSize: 19, fontWeight: "900" }, sectionSub: { color: C.muted, fontSize: 12, marginTop: 2 }, viewAll: { color: C.blue, fontSize: 13, fontWeight: "900", padding: 6 }, list: { gap: 12 },
});
