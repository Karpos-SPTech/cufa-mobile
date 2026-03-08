import { ScrollView, StyleSheet, View } from "react-native";

import Header from "../../components/Base/Header";
import Vagas from "../../components/Home/CardVaga";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <Vagas
          company="Mc Donald's"
          role="Hum..."
          city="Londrina"
          image={require("../../assets/images/mcdonalds.png")}
        />

        <Vagas
          company="Assaí"
          role="Repositor"
          city="Curitiba"
          image={require("../../assets/images/assai.png")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5EEE3",
  },

  content: {
    padding: 16,
  },
});