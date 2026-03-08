import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

type Props = {
  company: string;
  role: string;
  city: string;
  image: any;
};

export default function Card({ company, role, city, image }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={image} style={styles.logo} />

        <View>
          <Text style={styles.company}>{company}</Text>
          <Text style={styles.role}>{role}</Text>
          <Text style={styles.city}>{city}</Text>
        </View>
      </View>

      <Text style={styles.label}>• Vaga oferecida pela empresa</Text>

      <Text style={styles.description}>
        Descrição da empresa - Lorem ipsum dolor sit amet consectetur adipiscing
        elit. Quis provident unde consequatur quidem eos rem explicabo suscipit.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>ME CANDIDATAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },

  header: {
    flexDirection: "row",
    marginBottom: 10,
  },

  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 4,
  },

  company: {
    fontWeight: "700",
    fontSize: 16,
    color: "#0B6B2F",
  },

  role: {
    fontSize: 13,
  },

  city: {
    fontSize: 13,
    color: "#555",
  },

  label: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: "600",
  },

  description: {
    fontSize: 12,
    color: "#444",
    marginTop: 6,
    marginBottom: 14,
  },

  button: {
    backgroundColor: "#0B6B2F",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});