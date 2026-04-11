import { Tabs, useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#c7e6cf",
        tabBarStyle: {
          backgroundColor: "#006916",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="jobs"
        options={{
          tabBarIcon: ({ color }) => <Feather name="briefcase" size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="filter-tab"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="filter" size={28} color={color} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/filter");
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
