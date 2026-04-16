import { router } from "expo-router";
import * as React from "react";
import { Text, View, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
//import { Checkbox, Provider as PaperProvider } from "react-native-paper";
import {Provider as PaperProvider } from "react-native-paper";
//these are for the icon check-circle
import AntDesign from '@expo/vector-icons/AntDesign';
import { useUserPreferences } from "../context/UserPreferenceContext";

export default function Q1Answers() {
  const { savePreferencesMongoDB } = useUserPreferences();
  const [loading, setLoading] = React.useState(false);

    const handleGoToDashboard = async () => {
    setLoading(true);
    try {
      await savePreferencesMongoDB();
      router.push('/main_dashboard');
    } catch (err) {
      Alert.alert("Error", "Could not save preferences. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.header}>Thank You!</Text>
          <View style={styles.icon}>
            <AntDesign name="check-circle" size={60} color="#C5DBCA" />
          </View>
          <Text style={styles.text}>We will save this information to</Text>
          <Text style={styles.text}>personalize your dining</Text>
          <Text style={styles.text}>experience.</Text>
        </View>

        <View style={styles.nextButton}>
          <Pressable onPress={handleGoToDashboard} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#674F5D" />
              : <Text style={[styles.nextButton, styles.nextButtonBorder]}>Go to Main Dashboard</Text>
            }
          </Pressable>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6AA792",
    paddingTop:80,
  }, 
    header: {
    color: '#FFFAF0',
    fontFamily: "BBH-Hegarty-Regular",
    fontSize: 36,
    paddingTop: 100,
    textAlign: "center",
  },
  body: {
    paddingBottom: 20,
    textAlign: "center",
  },
   text: {
    color: '#FFFAF0',
    fontFamily: "Quicksand-Medium",
    fontSize: 20,
    textAlign: "center"
  },
  //checkmark icon
  icon: {
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: "center",
  },
  // Button Container
  nextButton: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFAF0',
    fontSize: 18,
    padding: 8,
    marginTop: 10,
  },

  // Button Colors
  nextButtonBorder: {
    paddingHorizontal: 35,
    borderWidth: 1,
    borderColor: '#674F5D',
    borderRadius: 30,
    backgroundColor: '#674F5D',
  },
});
