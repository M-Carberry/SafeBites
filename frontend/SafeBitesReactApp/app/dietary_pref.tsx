import { router } from "expo-router";
import * as React from "react";
import { Colors } from "../styles/colors";
import { Text, Image, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Divider } from "react-native-paper";
import { useUserPreferences } from "../context/UserPreferenceContext";

const Option = ({label, value, selectedValues, toggleValue}) => {
  const isChecked = selectedValues.includes(value);

  return (
    <View style={styles.optionContainer}>
      <Pressable
        onPress={() => toggleValue(value)}
        style={[styles.checkbox, isChecked && styles.checkboxChecked]}
      >
        {isChecked && <View />}
      </Pressable>
      <Text style={styles.optionLabel}>{label}</Text>
    </View>
  );
};

export default function DietaryPref() {
  const { preferences, updateManyPreferences } = useUserPreferences();

  // separate state for each section
const [selectedAllergies, setSelectedAllergies] = React.useState(preferences.allergies ?? []);
const [selectedDietType, setSelectedDietType] = React.useState(preferences.dietType ?? []);
const [selectedHealthGoals, setSelectedHealthGoals] = React.useState(preferences.dietPlan ?? []);

  // preload existing preferences from context
React.useEffect(() => {
  setSelectedAllergies(preferences.allergies ?? []);
  setSelectedDietType(preferences.dietType ?? []);
  setSelectedHealthGoals(preferences.dietPlan ?? []);
}, [preferences.allergies, preferences.dietType, preferences.dietPlan]);

  // separate toggles for each section
  const toggleAllergy = (item) => setSelectedAllergies((prev) =>
    prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]);

  const toggleDietType = (item) => setSelectedDietType((prev) =>
    prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]);

  const toggleHealthGoal = (item) => setSelectedHealthGoals((prev) =>
    prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]);

  //single handleSave using updateManyPreferences
  const handleSave = () => {
    updateManyPreferences({
      allergies: selectedAllergies,
      dietType: selectedDietType,
      dietPlan: selectedHealthGoals,
    });
    router.push("/main_dashboard");
  };

  return (
    <ScrollView style={styles.container}>
      <View>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Pressable onPress={() => router.push('/profile')}>
            <Image source={require("../assets/images/back.png")} style={styles.editBack} />
          </Pressable>
        </View>

        <View>
          <Text style={styles.header}>Dietary{" \n"}Preferences</Text>
        </View>

{/* Allergies */}
<View style={styles.body}>
  <Text style={styles.descText}>Allergies</Text>
  <View style={styles.filterRow}>
    {["dairy", "eggs", "gluten", "peanuts"].map((item) => (
      <Pressable
        key={item}
        onPress={() => toggleAllergy(item)}
        style={[styles.filterButton, selectedAllergies.includes(item) && styles.filterButtonSelected]}
      >
      <Text style={[styles.filterText, selectedAllergies.includes(item) && styles.filterTextSelected]}>
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
      </Pressable>
    ))}
  </View>
  <View style={styles.filterRow}>
    {["treenuts", "soy", "wheat", "fish"].map((item) => (
      <Pressable
        key={item}
        onPress={() => toggleAllergy(item)}
        style={[styles.filterButton, selectedAllergies.includes(item) && styles.filterButtonSelected]}
      >
      <Text style={[styles.filterText, selectedAllergies.includes(item) && styles.filterTextSelected]}>
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
      </Pressable>
    ))}
  </View>
  <View style={styles.filterRow}>
    {["shellfish", "sesame"].map((item) => (
      <Pressable
        key={item}
        onPress={() => toggleAllergy(item)}
        style={[styles.filterButton, selectedAllergies.includes(item) && styles.filterButtonSelected]}
      >
      <Text style={[styles.filterText, selectedAllergies.includes(item) && styles.filterTextSelected]}>
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>      </Pressable>
    ))}
  </View>
  <Divider style={{ height: 2, width: 400, backgroundColor: '#C5DBCA',marginTop:5 }} />
</View>

        {/* Diet Type */}
        <View>
          <Text style={[styles.descText, { paddingLeft: 40, marginTop:10 }]}>Diet Type</Text>
          <View style={styles.optionsWrapper}>
            {[
              { label: "Omnivore", value: "omnivore" },
              { label: "Vegetarian", value: "vegetarian" },
              { label: "Vegan", value: "vegan" },
              { label: "Pescatarian", value: "pescatarian" },
              { label: "None", value: "none" },
            ].map((item) => (
              <View key={item.value} style={{ height: 35, paddingLeft: 20, width: "50%",  }}>
                <Option
                  label={item.label}
                  value={item.value}
                  selectedValues={selectedDietType}
                  toggleValue={toggleDietType}
                />
              </View>
            ))}
          </View>
          <View style={styles.body}>
            <Divider style={{ height: 2, width: 400, backgroundColor: '#C5DBCA', marginTop:5 }} />
          </View>
        </View>

        {/* Health Goals */}
<View style={styles.body}>
  <Text style={styles.descText}>Health Goals</Text>
  <View style={styles.filterRow}>
    {[
      { value: "manageweight", label: "Manage Weight" },
      { value: "keto",         label: "Low Carb / Keto" },
      { value: "lowfat",       label: "Low Fat" },
    ].map(({ value, label }) => (
      <Pressable
        key={value}
        onPress={() => toggleHealthGoal(value)}
        style={[styles.filterButton, selectedHealthGoals.includes(value) && styles.filterButtonSelected]}
      >
        <Text style={[styles.filterText, selectedHealthGoals.includes(value) && styles.filterTextSelected]}>
          {label}
        </Text>
      </Pressable>
    ))}
  </View>
  <View style={styles.filterRow}>
    {[
      { value: "lowsugar", label: "Low Sugar" },
      { value: "lowsodium", label: "Low Sodium"},
      { value: "none",     label: "None" },
    ].map(({ value, label }) => (
      <Pressable
        key={value}
        onPress={() => toggleHealthGoal(value)}
        style={[styles.filterButton, selectedHealthGoals.includes(value) && styles.filterButtonSelected]}
      >
        <Text style={[styles.filterText, selectedHealthGoals.includes(value) && styles.filterTextSelected]}>
          {label}
        </Text>
      </Pressable>
    ))}
  </View>
</View>
        {/* Update Button */}
        <Pressable style={styles.updateButton} onPress={handleSave}>
          <Text style={styles.updateButtonText}>Update</Text>
        </Pressable>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF0",
  },

header: {
    marginTop:10,
    paddingLeft: 30,
    fontSize: 36,
    color: "#6aa792",
    paddingBottom: 10,
    fontFamily: "BBHHegarty-Regular",
    fontWeight: "regular",
  },

headerContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop:20,
  paddingLeft:30,
},


editBack: {
 width:28,
height:28,
tintColor:"#674F5D",
},
editImage: {
  width: 35,
  height: 35,
  tintColor:"#674F5D",
},

  body: {
    paddingLeft: 18,
    paddingBottom: 0,
    paddingTop: 10,

  },
   descText: {
    paddingLeft: 20,
    paddingBottom: 15,
    color: '#674F5D',
    fontFamily: "Quicksand-bold",
    fontSize: 20,
  },
    infoText: {
    paddingTop: 15,
    paddingLeft: 20,
    paddingBottom: 15,
    color: '#674F5D',
    fontFamily: "Quicksand-light",
    fontSize: 16,
  },
      // Custom checkbox
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#674F5D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#674F5D",
    borderColor: "#674F5D",
  },

  optionLabel: {
    fontSize: 18,
    color: "#674F5D",
    fontFamily: "Quicksand-Medium",
  },

  // Two column grid ? 
  optionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", 
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: "Quicksand-bold",
  },
  optionContainer: {
    width: "70%", 
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2, 
  },
/* Filter Row Styles */
filterRow: {
  flexDirection: "row",
  width: "90%",
  alignContent: "center",
  gap: 18,
  paddingHorizontal: 16,
  marginBottom: 12,
  paddingLeft: 20,
},

filterButton: {
  borderRadius: 18,
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderWidth: 2,
  borderColor: "#674f5d",
},
filterButtonSelected: {
  backgroundColor: "#674f5d",
  borderColor: "#674f5d",
},

filterTextSelected: {
  color: Colors.thirdText,
},

filterText: {
  fontSize: 13,
  color: "#674f5d",
  fontWeight: "500",
  fontFamily: "Quicksand-Medium",
},
  updateButton: {
    backgroundColor: Colors.primaryButton, 
    marginHorizontal: 160,
    marginTop: 50,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  updateButtonText: {
    color: Colors.thirdText,
    fontFamily: "Quicksand-SemiBold",
    fontSize: 16,
  },


});
