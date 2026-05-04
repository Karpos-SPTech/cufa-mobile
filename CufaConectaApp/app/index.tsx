import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Redirect, type Href } from "expo-router";

import { useAuth } from "../constants/AuthContext";

export default function Index() {
  const { ready, token } = useAuth();

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#006916" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href={"/login" as Href} />;
  }

  return <Redirect href={"/Home" as Href} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5EEE3",
  },
});
