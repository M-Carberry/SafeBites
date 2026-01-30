import { StyleSheet, Text, View, Pressable, Image, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
        //For Main Dashboard
  router.push("/screening screens/screening");
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
          <Pressable style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#674f5dr",
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
    color: "#674f5d",
    fontFamily: "BBH-Hegarty-Regular",
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
    backgroundColor: "#FFF8F3",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#674f5d",
  },

  button: {
    backgroundColor: "#6aa792",
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
    color: "#7d6d73",
    fontSize: 16,
    textAlign: "center"
  },

  link: {
    color: "#674f5d",
    fontWeight: "bold",
    textAlign: "center"
  },
});
