import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { C } from "@/constants/campus";
import { haptic } from "@/lib/haptics";
import { languageOptions, useI18n } from "@/lib/i18n";

export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useI18n();
  return (
    <View style={[s.wrap, compact && s.compactWrap]} accessibilityLabel={t("language")}>
      {!compact && <View style={s.titleRow}><MaterialIcons name="translate" size={16} color={C.blue} /><Text style={s.title}>{t("language")}</Text></View>}
      <View style={s.options}>
        {languageOptions.map((option) => (
          <Pressable key={option.code} onPress={() => { haptic.light(); setLanguage(option.code); }} style={({ pressed }) => [s.option, language === option.code && s.selected, pressed && s.pressed]} accessibilityRole="button" accessibilityLabel={option.label}>
            <Text style={[s.optionText, language === option.code && s.selectedText]}>{compact ? option.short : option.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 7, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 10, borderRadius: 16 },
  compactWrap: { padding: 5, borderRadius: 14 },
  titleRow: { flexDirection: "row", gap: 6, alignItems: "center" },
  title: { color: C.navy, fontSize: 11, fontWeight: "900" },
  options: { flexDirection: "row", gap: 4 },
  option: { minHeight: 29, justifyContent: "center", alignItems: "center", paddingHorizontal: 9, borderRadius: 9 },
  selected: { backgroundColor: C.navy },
  optionText: { color: C.muted, fontSize: 10, fontWeight: "900" },
  selectedText: { color: "#FFFFFF" },
  pressed: { opacity: 0.68 },
});
