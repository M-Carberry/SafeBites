import { router } from "expo-router";
import React, { useState } from 'react';
import { Text, Image, View, StyleSheet, Pressable } from "react-native";
import {Provider as PaperProvider } from "react-native-paper";
import { Searchbar } from 'react-native-paper';




export default function AccountInfo() {
  //for searchbar
  const [searchQuery, setSearchQuery] = useState('');
  const suggestions = [
    { name: "Bento",             path: "/restaurantprof_bento" },
    { name: "Chick-fil-a",       path: "/restaurantprof_chickfila" },
    { name: "Dunkin",            path: "/restaurantprof_dunkin" },
    { name: "Einstein Bagel Bros", path: "/restaurantprof_einstein" },
    { name: "Halal Shack",       path: "/restaurantprof_halal" },
    { name: "Huey Magoos",       path: "/restaurantprof_huey" },
    { name: "Panda Express",     path: "/restaurantprof_panda" },
    { name: "Purple Ocean",      path: "/restaurantprof_purple" },
    { name: "Qdoba",             path: "/restaurantprof_qdoba" },
    { name: "Starbucks",         path: "/restaurantsprof_starbucks" },
  ];

const filtered = suggestions
  .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  .slice(0, 5);
  
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
          <Pressable
            key={index}
            onPress={() => router.push(item.path)}
            style={({ pressed }) => [styles.clicky, pressed && { opacity: 0.6 }]}
          >
            <Image source={require("../assets/images/search.png")} style={styles.searchy} />
            <Text style={styles.restSug}>{item.name}</Text>
          </Pressable>
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
    color: "#674f5d",
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
  color: "#674f5d",
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