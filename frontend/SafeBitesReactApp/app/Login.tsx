import { StyleSheet, Text, View, Pressable, Image, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Colors } from "../styles/colors";
import { API_BASE_URL } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAvoidingView,Platform } from "react-native";
import { useFavorites } from "../context/userFavorites";
import { useUserPreferences } from "../context/UserPreferenceContext";

export default function Login() {
  const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const { loadFavorites } = useFavorites();
const { loadPreferencesFromDB } = useUserPreferences();

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter your email and password.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Login Failed", data.error || "Something went wrong. :(");
      return;
    }

    await AsyncStorage.setItem("userId", data.userId.toString());
    await AsyncStorage.setItem("userName", data.name);
    await loadFavorites();
    await loadPreferencesFromDB();

    router.push("/main_dashboard");

  } catch (err) {
    Alert.alert("Error", "Could not reach the server. Check connection.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <Image
          source={require("../assets/images/SafeBitesLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={"#674f5d"}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"#674f5d"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable onPress={() => console.log("Forgot password pressed")}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Login</Text>
          }
        </Pressable>
      </View>

      <View style={styles.bottomText}>
        <Text style={styles.extraText}>
          Don't have an account?{" \n"}
          <Text style={styles.link} onPress={() => router.push("/Sign_up")}>
            Sign Up
          </Text>
        </Text>
      </View>
    </ScrollView>

    </KeyboardAvoidingView>
  );
    
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: "space-between",
  },

  top: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    color: Colors.secondaryText,
    fontFamily: "Quicksand-Medium",
    paddingLeft: 7
  },

  form: {
    gap: 16,

  },

  input: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.purpleBorder,
    color: Colors.secondaryText,
  },

  forgot: {
    color: Colors.secondaryText,
    textAlign: "center",
    marginTop: -8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",

  },

  button: {
    backgroundColor: Colors.secondaryButton,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
    width: "60%",
    fontFamily: "Quicksand-Medium",
  },

  buttonText: {
    color: Colors.thirdText,
    fontSize: 20,
    fontFamily: "Quicksand-Medium",
  },

  bottomText: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  extraText: {
    color: Colors.secondaryText,
    fontSize: 14,
    textAlign: "center"
  },

  link: {
    color: Colors.secondaryText,
    fontWeight: "bold",
    textAlign: "center"
  },
});
