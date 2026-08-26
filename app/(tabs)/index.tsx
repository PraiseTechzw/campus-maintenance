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
  const nextIct = visible.find((request) => request.status !== "Resolved");
  const nextSecurity = unacknowledged[0] ?? urgent[0] ?? visible.find((request) => request.status !== "Resolved");
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
        {ict && nextIct ? <Pressable onPress={() => router.push(`/request/${nextIct.id}`)} style={({ pressed }) => [s.nextHero, pressed && s.primaryPressed]}><View style={s.heroTop}><View style={s.heroEyebrow}><MaterialIcons name="bolt" size={15} color="#BBD8FF" /><Text style={s.heroEyebrowText}>NEXT ICT ASSIGNMENT</Text></View><Text style={s.heroReference}>{nextIct.id}</Text></View><Text style={s.heroTitle} numberOfLines={2}>{nextIct.title}</Text><View style={s.heroLocation}><MaterialIcons name="location-on" size={16} color="#BBD8FF" /><Text style={s.heroLocationText} numberOfLines={1}>{nextIct.location}</Text></View><View style={s.heroFooter}><View><Text style={s.heroMeta}>{nextIct.status} · {nextIct.priority} priority</Text><Text style={s.heroMeta}>{waiting.length} waiting for ICT triage</Text></View><View style={s.heroAction}><Text style={s.heroActionText}>{nextIct.status === "Assigned" ? "Start work" : "Open job"}</Text><MaterialIcons name="arrow-forward" size={17} color={C.navy} /></View></View></Pressable> : security && nextSecurity ? <Pressable onPress={() => router.push(`/request/${nextSecurity.id}`)} style={({ pressed }) => [s.securityHero, pressed && s.primaryPressed]}><View style={s.heroTop}><View style={s.heroEyebrow}><MaterialIcons name="priority-high" size={15} color="#FFE1DE" /><Text style={s.heroEyebrowText}>URGENT SECURITY ALERT</Text></View><Text style={s.heroReference}>{nextSecurity.id}</Text></View><Text style={s.heroTitle} numberOfLines={2}>{nextSecurity.title}</Text><View style={s.heroLocation}><MaterialIcons name="location-on" size={16} color="#FFE1DE" /><Text style={s.heroLocationText} numberOfLines={1}>{nextSecurity.location}</Text></View><View style={s.heroFooter}><View><Text style={s.heroMeta}>{nextSecurity.acknowledged ? "Acknowledged incident" : "Acknowledgement required"}</Text><Text style={s.heroMeta}>{unacknowledged.length} urgent alert{unacknowledged.length === 1 ? "" : "s"} open</Text></View><View style={[s.heroAction, s.securityAction]}><Text style={[s.heroActionText, { color: C.danger }]}>{nextSecurity.acknowledged ? "Inspect" : "Respond"}</Text><MaterialIcons name="arrow-forward" size={17} color={C.danger} /></View></View></Pressable> : <Pressable onPress={primary} style={({ pressed }) => [s.primary, pressed && s.primaryPressed]}><MaterialIcons name={student ? "add-circle-outline" : "assignment"} size={21} color="#FFF" /><Text style={s.primaryText}>{student ? t("reportIssue") : role === "administrator" ? t("reviewRequests") : t("openQueue")}</Text><MaterialIcons name="arrow-forward" size={19} color="#FFF" /></Pressable>}
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
  nextHero: { backgroundColor: C.navy, borderRadius: 23, padding: 18, gap: 10, ...shadow }, securityHero: { backgroundColor: "#761D19", borderRadius: 23, padding: 18, gap: 10, shadowColor: "#7A271A", shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 }, heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, heroEyebrow: { flexDirection: "row", alignItems: "center", gap: 5 }, heroEyebrowText: { color: "#BBD8FF", fontSize: 10, letterSpacing: 1, fontWeight: "900" }, heroReference: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" }, heroTitle: { color: "#FFFFFF", fontSize: 21, lineHeight: 27, fontWeight: "900" }, heroLocation: { flexDirection: "row", alignItems: "center", gap: 4 }, heroLocationText: { color: "#D7E8FF", fontSize: 12, fontWeight: "700", flex: 1 }, heroFooter: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.18)", paddingTop: 12, marginTop: 2 }, heroMeta: { color: "#BBD8FF", fontSize: 10, lineHeight: 15, fontWeight: "700" }, heroAction: { minHeight: 34, backgroundColor: "#FFFFFF", borderRadius: 11, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 4 }, securityAction: { backgroundColor: "#FFF4F2" }, heroActionText: { color: C.navy, fontSize: 11, fontWeight: "900" },
  stats: { flexDirection: "row", gap: 10 }, stat: { flex: 1, minHeight: 110, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 13, gap: 6 }, statIcon: { width: 33, height: 33, borderRadius: 11, alignItems: "center", justifyContent: "center" }, statN: { color: C.navy, fontSize: 22, fontWeight: "900" }, statLabel: { color: C.muted, fontSize: 11, lineHeight: 14, fontWeight: "700" },
  section: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, sectionTitle: { color: C.navy, fontSize: 19, fontWeight: "900" }, sectionSub: { color: C.muted, fontSize: 12, marginTop: 2 }, viewAll: { color: C.blue, fontSize: 13, fontWeight: "900", padding: 6 }, list: { gap: 12 },
});
