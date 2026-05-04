import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, type Href } from "expo-router";

import { useAuth } from "../constants/AuthContext";
import { useVagas } from "../constants/VagasContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login, register } = useAuth();
  const { refreshCandidaturas } = useVagas();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    if (mode === "register" && !nome.trim()) {
      Alert.alert("Atenção", "Preencha seu nome.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await register(nome.trim(), email.trim(), senha);
        Alert.alert("Conta criada", "Faça login com seu e-mail e senha.", [
          { text: "OK", onPress: () => setMode("login") },
        ]);
      } else {
        await login(email.trim(), senha);
        await refreshCandidaturas();
        router.replace("/Home" as Href);
      }
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? String((e as { response?: { data?: unknown } }).response?.data)
          : "Não foi possível concluir. Verifique os dados e a URL da API.";
      Alert.alert("Erro", msg.length > 200 ? "Falha na requisição." : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Cufa Conecta</Text>
      <Text style={styles.subtitle}>
        {mode === "login" ? "Entrar na sua conta" : "Criar conta"}
      </Text>

      {mode === "register" && (
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha (mín. 8 caracteres)"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.primary, loading && styles.disabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>
            {mode === "login" ? "Entrar" : "Cadastrar"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchMode}
        onPress={() => setMode(mode === "login" ? "register" : "login")}
      >
        <Text style={styles.switchText}>
          {mode === "login"
            ? "Não tem conta? Cadastre-se"
            : "Já tem conta? Entrar"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#E5EEE3",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#006916",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 15,
    color: "#333",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  primary: {
    backgroundColor: "#0B6B2F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.7,
  },
  switchMode: {
    marginTop: 20,
    alignItems: "center",
  },
  switchText: {
    color: "#0B6B2F",
    fontWeight: "600",
  },
});
