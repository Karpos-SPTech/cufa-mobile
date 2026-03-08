import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import Header from '../../Base/Header';

export default function Home() {
  const Home = [
    {
      id: 1,
      company: "Mc Donald's",
      role: "Hamburguer",
      contract: "CLT",
      salary: "Horário de trabalho",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4f/McDonald%27s_logo.svg",
    },
    {
      id: 2,
      company: "Assaí",
      role: "Caixa",
      contract: "CLT",
      salary: "Horário de trabalho",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Assai_Atacadista_logo_2019.svg",
    },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        {Home.map((job) => (
          <View key={job.id} style={styles.card}>
            
            <View style={styles.header}>
              <Image source={{ uri: job.logo }} style={styles.logo} />

              <View>
                <Text style={styles.company}>{job.company}</Text>
                <Text>{job.role}</Text>
                <Text>{job.contract}</Text>
                <Text>{job.salary}</Text>
              </View>
            </View>

            <Text style={styles.description}>
              • Vaga oferecida pela empresa{"\n\n"}
              Descrição da empresa - Lorem ipsum dolor sit amet consectetur adipiscing elit.
            </Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>ME CANDIDATAR</Text>
            </TouchableOpacity>

          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    padding: 15,
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  header: {
    flexDirection: "row",
    marginBottom: 10,
  },

  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },

  company: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1b5e20",
  },

  description: {
    marginVertical: 10,
    fontSize: 13,
  },

  button: {
    backgroundColor: "#1b5e20",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});