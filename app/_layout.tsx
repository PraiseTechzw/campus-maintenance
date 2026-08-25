import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaintenanceProvider } from "@/lib/maintenance-store";
import { ThemeProvider } from "@/lib/theme-provider";
export default function Layout() { return <ThemeProvider><MaintenanceProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" /><Stack.Screen name="report" /><Stack.Screen name="request/[id]" /><Stack.Screen name="role-select" options={{ presentation: "modal" }} /></Stack></MaintenanceProvider></ThemeProvider>; }
