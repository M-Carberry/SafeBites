import { router } from "expo-router";
import * as React from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { layouts, spacing } from "../styles/spacing";
import { Colors } from "../styles/colors";
import { useUserPreferences } from "../context/UserPreferenceContext";
import { API_BASE_URL } from "../constants/api";


/* whole block manages options being added to an array + option styling and stuff , yes we are going to have to manage strings later*/
/* Backend phase change variable names*/

//fixed this - Cami (renamed from allergiesArray to Option so JSX can find the component)
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


/*this specifically is the first screening component */
export default function Q1Answers() {
  //access context
  const { preferences, updatePreference } = useUserPreferences();


const [selectedValues, setSelectedValues] = React.useState([]);

React.useEffect(() => {
  if (preferences.allergies?.length) {
    setSelectedValues(preferences.allergies);
  }
}, [preferences.allergies]);
  
  /* manages the checkbox selection values */
  const toggleValue = (item) => {
    const updatedValues = selectedValues.includes(item)
      ? selectedValues.filter((v) => v !== item)
      : [...selectedValues, item];

    setSelectedValues(updatedValues); 
   
  };

  const handleNext = () => {
    updatePreference("allergies", selectedValues);
    router.push("/screenQ2");
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.header}>
          Do you have any{"\n"}food allergies or{"\n"}intolerances?
        </Text>
        <Text style={styles.body}>Select all that apply</Text>
      </View>

      {/* options */}
      <View style={styles.optionsWhole}>
      <View style={styles.optionsWrapper}>
        <Option label="Dairy" value="dairy" {...{ selectedValues, toggleValue }} />
        <Option label="Eggs" value="eggs" {...{ selectedValues, toggleValue }} />
        <Option label="Gluten" value="gluten" {...{ selectedValues, toggleValue }} />
        <Option label="Peanuts" value="peanuts" {...{ selectedValues, toggleValue }} />
        <Option label="Tree nuts" value="treenuts" {...{ selectedValues, toggleValue }} />
        <Option label="Soy" value="soy" {...{ selectedValues, toggleValue }} />
      </View>
      <View style={styles.optionsWrapper}>
        <Option label="Wheat" value="wheat" {...{ selectedValues, toggleValue }} />
        <Option label="Fish" value="fish" {...{ selectedValues, toggleValue }} />
        <Option label="Shellfish" value="shellfish" {...{ selectedValues, toggleValue }} />
        <Option label="Sesame" value="sesame" {...{ selectedValues, toggleValue }} />
        <Option label="Other" value="other" {...{ selectedValues, toggleValue }} />
      </View>
    
      </View>
 
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    ...layouts.body,
    fontSize: 20,
  },

  // Two column grid ? 
  optionsWhole: {
    flexDirection: 'row',
  },
  optionsWrapper: {
    flexWrap: "wrap",
    paddingLeft: spacing.xxxl,
    paddingTop: spacing.xl,
    paddingHorizontal:spacing.huge,
  },
  optionContainer: {
    width: "70%",
    ...layouts.optionContainer,
  },
  optionLabel: {
    fontSize: 18,
    color: Colors.thirdText,
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