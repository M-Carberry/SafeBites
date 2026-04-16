import { StyleSheet, Text, View, Pressable, Image, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Colors } from "../styles/colors";
import { API_BASE_URL } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAvoidingView,Platform } from "react-native";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
 
const handleSignUp = async () => {
  if (!name || !email || !password || !confirmPassword) {
    Alert.alert("Error", "Please fill in all fields.");
    return;
  }
  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Signup Failed", data.error || "Something went wrong. :(");
      return;
    }


    await AsyncStorage.setItem("userId", data.userId.toString());
    await AsyncStorage.setItem("userName", name);

    Alert.alert("Success", "Account created!");
    router.push("/screening");

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
    <ScrollView contentContainerStyle={styles.container} 
    keyboardShouldPersistTaps="handled">
      <View style={styles.top}>
        <Image
          source={require("../assets/images/SafeBitesLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={"#7d6d73"}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={"#7d6d73"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"#7d6d73"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={"#7d6d73"}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
  <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleSignUp} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Sign Up</Text>
            }
          </Pressable>
  </View>

      </View>

      <View style={styles.bottomText}>
        <Text style={styles.extraText}>
          Already have an account?{" \n"}
          <Text style={styles.link} onPress={() => router.push("/Login")}>
            Login
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
    fontSize: 23,
    color: Colors.secondaryText,
    fontFamily: "Quicksand-Medium",
    paddingLeft: 7
  },

  form: {
    gap: 16,
    marginTop: -120,
    alignSelf: "center",
    width: "90%"
  },

  buttonContainer: {
    marginTop: 50,
  },

  input: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.purpleBorder,
  },

  button: {
    backgroundColor: Colors.secondaryButton,
    paddingVertical: 8,
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "center",
    width: "60%"
  },

  buttonText: {
    color: "#FFF8F3",
    fontSize: 20,
    fontFamily: "Quicksand-Regular",
  },

  bottomText: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  extraText: {
    color: Colors.secondaryText,
    fontSize: 16,
    textAlign: "center"
  },

  link: {
    color: Colors.secondaryText,
    fontWeight: "bold",
    textAlign: "center"
  },
});
