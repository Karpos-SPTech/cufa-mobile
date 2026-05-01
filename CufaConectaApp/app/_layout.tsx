import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

import { AuthProvider } from "../constants/AuthContext";
import { FiltrosVagasProvider } from "../constants/FiltrosVagasContext";
import { VagasProvider } from "../constants/VagasContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <VagasProvider>
          <FiltrosVagasProvider>
            <ThemeProvider value={DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" />

                <Stack.Screen name="(tabs)" />

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
          </FiltrosVagasProvider>
        </VagasProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
