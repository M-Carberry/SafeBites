//filter popup screen - cami. this opens from discover and map view screens when u click the filter icon and had to install slider package for this btw

import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import * as React from "react";
import Slider from "@react-native-community/slider";
import { useUserPreferences } from "../context/UserPreferenceContext";

interface FilterProps {
  onClose: () => void;
}

export default function DiscoverFilter({ onClose }: FilterProps) {

  const { preferences, updateManyPreferences } = useUserPreferences();

  // distance stays local to filter
  const [distance, setDistance] = React.useState(2);

  // SAME STRUCTURE as DietaryPref screen
  const [selectedAllergies, setSelectedAllergies] = React.useState<string[]>([]);
  const [selectedDietType, setSelectedDietType] = React.useState<string[]>([]);
  const [selectedHealthGoals, setSelectedHealthGoals] = React.useState<string[]>([]);

  // preload saved preferences when popup opens
  React.useEffect(() => {
    setSelectedAllergies(preferences.allergies ?? []);
    setSelectedDietType(preferences.dietType ?? []);
    setSelectedHealthGoals(preferences.dietPlan ?? []);
  }, [preferences]);

  // toggles
  const toggleAllergy = (item: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(item)
        ? prev.filter((v) => v !== item)
        : [...prev, item]
    );
  };

  const toggleDietType = (item: string) => {
    setSelectedDietType((prev) =>
      prev.includes(item)
        ? prev.filter((v) => v !== item)
        : [...prev, item]
    );
  };

  const toggleHealthGoal = (item: string) => {
    setSelectedHealthGoals((prev) =>
      prev.includes(item)
        ? prev.filter((v) => v !== item)
        : [...prev, item]
    );
  };

  const handleSave = () => {
    updateManyPreferences({
      allergies: selectedAllergies,
      dietType: selectedDietType,
      dietPlan: selectedHealthGoals,
    });

    onClose();
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.darkBackground} onPress={onClose} />

      <View style={styles.popupContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.filterTitle}>Filter</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.xButton}>X</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>


          {/* Allergies */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Allergies</Text>

            {[
              ["dairy", "eggs", "gluten", "peanuts"],
              ["treenuts", "soy", "wheat", "fish"],
              ["shellfish", "sesame"],
            ].map((row, index) => (
              <View key={index} style={styles.chipsRow}>
                {row.map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.chip,
                      selectedAllergies.includes(item) && styles.chipSelected
                    ]}
                    onPress={() => toggleAllergy(item)}
                  >
                    <Text style={[
                      styles.chipText,
                      selectedAllergies.includes(item) && styles.chipTextSelected
                    ]}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}

            <View style={styles.line} />
          </View>

          {/* Diet Type */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Diet Type</Text>
            <View style={styles.chipsRow}>
              {[
                { label: "Omnivore", value: "omnivore" },
                { label: "Vegetarian", value: "vegetarian" },
                { label: "Vegan", value: "vegan" },
                { label: "Pescatarian", value: "pescatarian" },
                { label: "None", value: "none" },
              ].map(({ label, value }) => (
                <Pressable
                  key={value}
                  style={[
                    styles.chip,
                    selectedDietType.includes(value) && styles.chipSelected
                  ]}
                  onPress={() => toggleDietType(value)}
                >
                  <Text style={[
                    styles.chipText,
                    selectedDietType.includes(value) && styles.chipTextSelected
                  ]}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.line} />
          </View>

          {/* Health Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Health Goals</Text>

            {[
              [
                { value: "manageweight", label: "Manage Weight" },
                { value: "keto", label: "Low Carb / Keto" },
                { value: "lowfat", label: "Low Fat" },
              ],
              [
                { value: "lowsugar", label: "Low Sugar" },
                { value: "lowsodium", label: "Low Sodium" },
                { value: "none", label: "None" },
              ],
            ].map((row, index) => (
              <View key={index} style={styles.chipsRow}>
                {row.map(({ value, label }) => (
                  <Pressable
                    key={value}
                    style={[
                      styles.chip,
                      selectedHealthGoals.includes(value) && styles.chipSelected
                    ]}
                    onPress={() => toggleHealthGoal(value)}
                  >
                    <Text style={[
                      styles.chipText,
                      selectedHealthGoals.includes(value) && styles.chipTextSelected
                    ]}>
                      {label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>

        </ScrollView>

        {/* Save Button */}
        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>

      </View>
    </View>
  );
}

// styles - cami
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  darkBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popupContainer: {
    height: 730,
    backgroundColor: "#6AA792",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },

  // header stuff
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 32,
    color: "#FFF8F3",
    fontFamily: "BBHHegarty-Regular",
  },
  xButton: {
    fontSize: 28,
    color: "#FFF8F3",
    fontWeight: "300",
    padding: 5,
  },

  //sections
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 18,
    color: "#FFF8F3",
    fontFamily: "Quicksand-SemiBold",
    marginBottom: 10,
  },

  // distance stuff
  distanceText: {
    fontSize: 16,
    color: "#FFF8F3",
    fontFamily: "Quicksand-Medium",
    marginBottom: 5,
  },
  line: {
    height: 1,
    backgroundColor: "rgba(255,248,243,0.3)",
    marginTop: 12,
  },

  // chips for allergies and health goals
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#FFF8F3",
  },
  chipSelected: {
    backgroundColor: "#FFF8F3",
  },
  chipText: {
    fontSize: 14,
    color: "#FFF8F3",
    fontFamily: "Quicksand-Medium",
  },
  chipTextSelected: {
    color: "#6AA792",
  },

  //radio buttons for diet type - these fill completely when selected I just copied the filter.tsx scrrene
  radioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#FFF8F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioFilled: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFF8F3",
  },
  radioLabel: {
    fontSize: 14,
    color: "#FFF8F3",
    fontFamily: "Quicksand-Medium",
  },

  // save button
  saveBtn: {
    backgroundColor: "#674f5d",
    paddingVertical: 9,
    marginHorizontal:140,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  saveBtnText: {
    fontSize: 18,
    color: "#FFF8F3",
    fontFamily: "Quicksand-Bold",
  },
});
