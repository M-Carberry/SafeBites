import { router } from "expo-router";
import * as React from "react";
import { Text, View, Pressable, StyleSheet, Image } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 👈 add
import { useFavorites } from "../context/userFavorites"; 
import { useUserPreferences } from "../context/UserPreferenceContext"; // 👈 add

export default function Profile() {
  const { loadFavorites } = useFavorites(); 
  const { loadPreferencesFromDB } = useUserPreferences();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("userName");
    await AsyncStorage.removeItem("userPreferences");

    //clear favorites and preferences from memory
    await loadFavorites();
    await loadPreferencesFromDB();

    //goes back to login
    router.push("/");
  };

  return (
    <PaperProvider>
      <View style={styles.container}>

        <View style={styles.body}>
          <Text style={styles.header}>My Profile</Text>
        </View>

        <View style={styles.icon}>
          <Image
            source={require("../assets/images/accSettingsPhoto.png")}
            style={styles.profilepic}
          />
        </View>

        <View style={styles.navigation}>
          <Pressable onPress={() => router.push('/dietary_pref')}>
            <Text style={styles.descText}>Dietary Preferences &gt;</Text>
          </Pressable>
        </View>

        <View style={styles.navigation}>
          <Pressable onPress={() => router.push('/account_info')}>
            <Text style={styles.descText}>Account Information &gt;</Text>
          </Pressable>
        </View>

        <View style={styles.navigation}>
          <Pressable onPress={() => router.push('/appearance')}>
            <Text style={styles.descText}>Appearance &gt;</Text>
          </Pressable>
        </View>

        {/* Logout Button */}
        <View style={styles.nextButton}>
          <Pressable onPress={handleLogout}>
            <Text style={[styles.nextButton, styles.nextButtonBorder]}>Logout</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.navBar}>
        <Pressable onPress={() => router.push("/main_dashboard")}>
          <Image source={require("../assets/images/house.png")} style={styles.navIcon} />
        </Pressable>
        <Pressable onPress={() => router.push("/Discover")}>
          <Image source={require("../assets/images/compass.png")} style={styles.navIcon} />
        </Pressable>
        <Pressable onPress={() => router.push("/favorites")}>
          <Image source={require("../assets/images/heart.png")} style={styles.navIcon} />
        </Pressable>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF0",
  }, 
    header: {
    fontSize: 36,
    color: "#719F91",
    paddingBottom: 10,
    marginLeft: 10,
    fontFamily: "BBH Sans Hegarty",
    fontWeight: "regular",
  },
  body: {
    paddingLeft: 20,
    paddingBottom: 20,
  },
   descText: {
    paddingLeft: 20,
    color: '#674F5D',
    fontFamily: "Quicksand-Medium",
    fontSize: 20,
    alignItems: "left",
  },
  //checkmark icon
  icon: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
    // Button Container
  navigation: {
    color: '#FFFAF0',
    fontSize: 20,
    padding: 10,
  },
  // Button Container
  nextButton: {
    paddingHorizontal: 40,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFAF0',
    fontSize: 20,
    padding: 10,
  },

  // Button Colors
  nextButtonBorder: {
    paddingHorizontal: 40,
    borderWidth: 2,
    borderColor: '#674F5D',
    borderRadius: 30,
    backgroundColor: '#674F5D',
  },
  //text profile pic
    profilepic: {
    width: 125,
    height: 125,
    alignContent: 'center',
  },
    navBar: {
    flexDirection: "row",
    justifyContent:"space-evenly",
    borderTopWidth: 1,
    borderTopColor: "#FFFAF0",
    backgroundColor: '#FFFAF0',
    paddingBottom:30,
  },

  navIcon: {
    width: 40,
    height: 40,
    tintColor: "#7A9A87",
  },
});
