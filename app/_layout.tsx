import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { C } from "@/constants/campus";
import { I18nProvider } from "@/lib/i18n";
import { MaintenanceProvider } from "@/lib/maintenance-store";
import { ThemeProvider } from "@/lib/theme-provider";
import { createTRPCClient, trpc } from "@/lib/trpc";

export default function Layout() {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 20_000 } } }));
  const [trpcClient] = useState(() => createTRPCClient());
  return (
    <ThemeProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <MaintenanceProvider>
              <StatusBar style="light" backgroundColor={C.navy} translucent={false} animated />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="report" />
                <Stack.Screen name="request/[id]" />
                <Stack.Screen name="role-select" options={{ presentation: "modal" }} />
              </Stack>
            </MaintenanceProvider>
          </I18nProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
}
