import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          source={require("../assets/images/SafeBitesLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcome}>Welcome</Text>
      </View>

      <View style={styles.bottomPanel}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/Sign_up")}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F3", 
  },

  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },

  welcome: {
    fontSize: 39,
    color: "#6aa792",
    fontFamily: "BBH-Hegarty-Regular",
  },

  bottomPanel: {
    flex: 1, 
    backgroundColor: "#674f5d",
    paddingTop: 50,
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: "flex-start",
  },

  button: {
    marginTop:20,
    paddingTop: 10,
    backgroundColor: "#6aa792",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 3,
    width: "70%",
    alignSelf: "center"
  },

  buttonText: {
    fontSize: 20,
    color: "#FFF8F3",
    fontFamily: "Quicksand-Regular",
  },
});
