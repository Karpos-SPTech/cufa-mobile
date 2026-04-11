import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

import { VagasProvider } from "../constants/VagasContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <VagasProvider>
        <ThemeProvider value={DefaultTheme}>

          <Stack screenOptions={{ headerShown: false }}>

            {/* Tabs (tela principal) */}
            <Stack.Screen name="(tabs)" />

            {/* 🔥 SEU MODAL DE FILTRO */}
            <Stack.Screen
              name="filter"
              options={{
                presentation: "transparentModal",
                animation: "fade",
                contentStyle: { backgroundColor: "transparent" },
              }}
            />
            <Stack.Screen
              name="notifications"
              options={{
                presentation: "transparentModal",
                animation: "fade",
                contentStyle: { backgroundColor: "transparent" },
              }}
            />
            {/* Outros modais */}
            <Stack.Screen
              name="editar-bio"
              options={{
                presentation: "transparentModal",
                animation: "fade",
                contentStyle: { backgroundColor: "transparent" },
              }}
            />

          </Stack>


          <StatusBar style="light" translucent />
        </ThemeProvider>
      </VagasProvider>
    </SafeAreaProvider>
  );
}