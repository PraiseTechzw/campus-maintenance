import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter as useExpoRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { C, shadow } from "@/constants/campus";
import { startOAuthLogin } from "@/constants/oauth";
import { useAuth } from "@/hooks/use-auth";

const useRouter = () => useExpoRouter() as any;

export default function RoleSelect() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  return <View style={s.screen}><View style={s.card}><View style={s.icon}><MaterialIcons name="verified-user" size={25} color={C.blue} /></View><Text style={s.title}>Roles are managed by your institution</Text><Text style={s.text}>Campus Maintenance selects your Student, ICT, Physical Maintenance, Security, or Administrator workspace from the operational role assigned to your approved account.</Text>{isAuthenticated ? <Pressable onPress={() => router.replace("/(tabs)")} style={s.primary}><Text style={s.primaryText}>Open my workspace</Text><MaterialIcons name="arrow-forward" size={18} color="#FFF" /></Pressable> : <Pressable onPress={() => void startOAuthLogin()} style={s.primary}><Text style={s.primaryText}>Sign in securely</Text><MaterialIcons name="login" size={18} color="#FFF" /></Pressable>}<Pressable onPress={() => router.back()} style={s.secondary}><Text style={s.secondaryText}>Return</Text></Pressable></View></View>;
}

const s = StyleSheet.create({ screen: { flex: 1, backgroundColor: C.bg, justifyContent: "center", padding: 22 }, card: { maxWidth: 520, width: "100%", alignSelf: "center", backgroundColor: "#FFF", borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 22, alignItems: "center", gap: 11, ...shadow }, icon: { width: 55, height: 55, borderRadius: 18, backgroundColor: C.sky, justifyContent: "center", alignItems: "center" }, title: { color: C.navy, fontSize: 21, fontWeight: "900", textAlign: "center" }, text: { color: C.muted, fontSize: 13, lineHeight: 20, textAlign: "center" }, primary: { marginTop: 4, width: "100%", minHeight: 48, borderRadius: 14, paddingHorizontal: 15, backgroundColor: C.navy, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, primaryText: { color: "#FFF", fontSize: 13, fontWeight: "900" }, secondary: { minHeight: 38, justifyContent: "center", paddingHorizontal: 12 }, secondaryText: { color: C.blue, fontSize: 12, fontWeight: "900" } });
