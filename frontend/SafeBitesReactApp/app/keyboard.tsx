import { router } from "expo-router";
import React, { useState } from 'react';
import { Text, Image, View, StyleSheet, Pressable } from "react-native";
import {Provider as PaperProvider } from "react-native-paper";
import { Searchbar } from 'react-native-paper';




export default function AccountInfo() {
  //for searchbar
  const [searchQuery, setSearchQuery] = useState('');
  const suggestions = [
      "Bento",
      "Chick-fil-a",
      "Dunkin",
      "Einstein Bagel Bros",
      "Halal Shack",
      "Huey Magoos",
      "Panda Express",
      "Purple Ocean",
      "Qdoba",
      "Starbucks",
  ];

const filtered = suggestions
  .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  .slice(0, 3);
  
  return (
    <PaperProvider>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.suggest}>Suggestions</Text>
          <Pressable style={styles.editButton} onPress={() => router.push('/main_dashboard')}>
            <Image
              source={require("../assets/images/cancel.png")}
              style={styles.editImage}
            />
          </Pressable>
        </View>

      {filtered.map((item, index) => (
        <View key={index} style={styles.clicky}>
          <Image
            source={require("../assets/images/search.png")}
            style={styles.searchy}
          />
          <Text style={styles.restSug}>{item}</Text>
        </View>
      ))}

      <View style={styles.searchSpacing}>
        <Searchbar 
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchFloating}
            inputStyle={styles.searchText}
        />
      </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#FFF8F3",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 35,
    paddingRight: 20,
    paddingBottom: 10,
    marginTop: 10,
  },

  suggest: {
    color: "#674F5D",
    fontFamily: "Quicksand-SemiBold",
    fontSize: 20,
    marginTop: 10,
  },
 editButton: {
    padding: 5,
  },

  editImage: {
    width: 35,
    height: 35,
    tintColor: "#674F5D",
  },

  body: {
    paddingLeft: 35,
    paddingBottom: 20,
  },

  clicky: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 10,
  },

   searchy: {
    width: 20,
    height: 20,
    tintColor: "#674f5d",
    marginRight: 10,
  },

  restSug: {
    fontSize: 23,
    color: "#674f5d",
    fontFamily: "Quicksand-Regular",
  },
  key:{
    borderRadius:25,
    backgroundColor:"#FFF8F3",

  },
  english:{
    width:"100%",
    height:350,
    borderRadius:30,
    tintColor:"#FFF8F3",
  },
  searchFloating: {
    backgroundColor: "#FFF8F3",
    borderRadius: 26,
    width: "100%",
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: "#674f5d",
    shadowOpacity:0.9,
    shadowOffset: { width: 7, height: 7 },
    shadowColor: "#674f5d",
  
},

  searchSpacing: {
  position: "absolute",
  bottom: 360,
  alignSelf: "center",
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 50,
  paddingVertical: 12,

},

searchIcon: {
  width: 18,
  height: 18,
  tintColor: "#674f5d",
  marginRight: 7,
  fontWeight:"200",
},

searchText: {
  fontSize: 16,
  color: "#674f5d",
  fontFamily: "Quicksand-Bold",
},

});