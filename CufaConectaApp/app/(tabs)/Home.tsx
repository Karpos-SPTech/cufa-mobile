import { ScrollView, StyleSheet, View, StatusBar } from "react-native";
import Header from "../../components/Base/Header";
import Vagas from "../../components/Home/CardVaga";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Vagas
          company="Mc Donald's"
          role="Ramo: Alimentação"
          city="Contrato: CLT"
          image={require("../../assets/images/mcdonalds.png")}
        />

        <Vagas
          company="Assaí"
          role="Ramo: Atacadista"
          city="Contrato: CLT"
          image={require("../../assets/images/assai.png")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5EEE3", // Cor de fundo do Figma
  },
  content: {
    padding: 16,
    paddingBottom: 100, // Espaço para não cobrir o último card com a TabBar
  },
});