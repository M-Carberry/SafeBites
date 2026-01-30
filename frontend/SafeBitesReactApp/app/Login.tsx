import { StyleSheet, Text, View, Pressable, Image, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.push("/main_dashboard");
  };

  return (
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
          placeholder="Name"
          placeholderTextColor={"#674f5d"}
          value={Username}
          onChangeText={setUsername}
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

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF8F3",
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
    color: "#674f5d",
    fontFamily: "BBH-Hegarty-Regular",
    paddingLeft: 7
  },

  form: {
    gap: 16,

  },

  input: {
    backgroundColor: "#FFF8F3",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#7d6d73",
    color: "#7d6d73",
  },

  forgot: {
    color: "#7d6d73",
    textAlign: "center",
    marginTop: -8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",

  },

  button: {
    backgroundColor: "#6aa792",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
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
    color: "#674f5d",
    fontSize: 14,
    textAlign: "center"
  },

  link: {
    color: "#674f5d",
    fontWeight: "bold",
    textAlign: "center"
  },
});
