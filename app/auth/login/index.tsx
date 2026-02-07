import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      await login(username, password);
      // Navigation handled by root layout
    } catch (err: any) {
      Alert.alert("Error de inicio de sesión", err.message || "Credenciales inválidas");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Bienvenido</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Inicia sesión para continuar
        </Text>

        <TextInput
          style={[styles.input, {
            color: colors.text,
            borderColor: colors.icon,
            backgroundColor: colorScheme === 'dark' ? '#222' : '#f5f5f5'
          }]}
          placeholder="Usuario"
          placeholderTextColor={colors.icon}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, {
            color: colors.text,
            borderColor: colors.icon,
            backgroundColor: colorScheme === 'dark' ? '#222' : '#f5f5f5'
          }]}
          placeholder="Contraseña"
          placeholderTextColor={colors.icon}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colorScheme === 'dark' ? colors.background : '#fff'} />
          ) : (
            <Text style={[styles.buttonText, { color: colorScheme === 'dark' ? colors.background : '#fff' }]}>
              Iniciar Sesión
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={[styles.link, { color: colors.tint }]}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>

        {/* Demo credentials hint */}
        <View style={styles.demoHint}>
          <Text style={[styles.demoText, { color: colors.icon }]}>
            Credenciales de prueba:
          </Text>
          <Text style={[styles.demoText, { color: colors.icon }]}>
            Usuario: mor_2314
          </Text>
          <Text style={[styles.demoText, { color: colors.icon }]}>
            Contraseña: 83r5^_
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
  demoHint: {
    marginTop: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  demoText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 2,
  },
});
