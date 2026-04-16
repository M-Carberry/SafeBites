import { router } from "expo-router";
import * as React from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { layouts, spacing } from "../styles/spacing";
import { Colors } from "../styles/colors";
import { useUserPreferences } from "../context/UserPreferenceContext";

/* manages options being added to an array, yes we are going to have to manage strings later*/
/* Backend phase change variable names*/
const Option = ({ label, value, selectedValues, toggleValue }) => {
  const checkedQ1 = selectedValues.includes(value);

  return (
    <View style={styles.optionContainer}>
      {/* Checkbox button */}
      <Pressable
        onPress={() => toggleValue(value)}
        style={[
          styles.checkbox,
          checkedQ1 && styles.checkboxChecked]}
      >
        {checkedQ1 && <View />}
      </Pressable>

      {/* text or something */}
      <Text style={styles.optionLabel}>{label}</Text>
    </View>
  );
};

export default function Q3Answers() {
  //access context
  const { preferences, updatePreference } = useUserPreferences();

  // Preload saved selections if they exist
 const [selectedValues, setSelectedValues] = React.useState([]);

React.useEffect(() => {
  if (preferences.strictness?.length) {
    setSelectedValues([preferences.strictness[0]]);
  }
}, [preferences.strictness]);

  /*changed to just one value */
  const toggleValue = (item) => {
  setSelectedValues([item]);
};

const handleNext = () => {
  updatePreference("strictness", selectedValues[0] || "");
  router.push("/screenQ4");
};

  return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.header}>
            How strict are you{"\n"}with your diet or{"\n"}restrictions?
          </Text>
          <Text style={styles.body}>Select one</Text>
        </View>

        {/* options */}
        <View style={styles.optionsWrapper}>
            <Option label="Very Strict" value="veryStrict" {...{ selectedValues, toggleValue }} />
            <Option label="Generally Strict" value="generallyStrict" {...{ selectedValues, toggleValue }} />
            <Option label="Flexible" value="flexible" {...{ selectedValues, toggleValue }} />
        </View>

        {/* Next Button */}
       <Pressable
        style={[styles.nextButtonBorder, { backgroundColor: Colors.primaryButton }]}
        onPress={handleNext}
      >
        <Text style={styles.nextButton}>Next</Text>
      </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
       ...layouts.container
  },

  // Header 
  header: {
    ...layouts.headerBase,
    fontFamily: "Quicksand-Medium",
    fontSize: 36,
  },
  body: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    ...layouts.body,
    fontSize: 20,
  },

  // Two column grid ? 
  optionsWrapper: {
    flexWrap: "wrap",
    paddingLeft: 40,
    paddingTop: 40,
  },
  optionContainer: {
    width: "40%",
        ...layouts.optionContainer,
  },
  optionLabel: {
    fontSize: 18,
    color: "#FFFAF0",
    fontFamily: "Quicksand-Medium",
  },

    // Custom checkbox
  checkbox: {
    ...layouts.checkbox,
    borderColor:Colors.primary,
  },
  checkboxChecked: {
    backgroundColor: Colors.headerColor,
    borderColor: Colors.primary,
  },

  // Button Container
  nextButton: {
    ...layouts.nextButtonText,
    color: Colors.thirdText,
    fontSize: 20,
  },

  nextButtonBorder: {
    ...layouts.nextButtonBorder,
  },
});
