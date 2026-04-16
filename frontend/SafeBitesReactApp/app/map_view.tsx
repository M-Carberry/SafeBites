import { StyleSheet, Text, View, Pressable, Image, ScrollView, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import DiscoverFilter from "./Discover_filter";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect } from "react"; 

export default function Discover() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false); //state for filter popup added by Cams
  const [location, setLocation] = useState(null);

  useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied");
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({});
    setLocation(coords);
  })();
}, []);

  return (
    <View style={styles.container}>

      {/*header*/}
      <View style={styles.topRow}>
        <Text style={styles.discoverTitle}>Discover</Text>

        <View style={styles.iconRow}>
          <Pressable onPress={() => router.push("/Discover")}>
            <Image
            source={require("../assets/images/grid.png")}
            style={styles.topIcon}
          />
          </Pressable>

          {/*by cami open filter popup overlay instead of navigation */}
          <Pressable onPress={() => setShowFilter(true)}>
            <Image
            source={require("../assets/images/filter.png")}
            style={styles.topIcon}
          />
          </Pressable>

        </View>
      </View>

      {/*filter*/}
      {/*map*/}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            showsUserLocation={true}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here!"
            />
          </MapView>
        ) : (
          <Text>Map loading</Text>
        )}
      </View>

      <View style={styles.searchFloating}>
        <Image
          source={require("../assets/images/search.png")}
          style={styles.searchIcon}
        />
        <Text onPress={()=>router.push("/keyboard")} style={styles.searchText}>Search</Text>
      </View>

      {/*nav*/}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.push("/main_dashboard")}>
          <Image
            source={require("../assets/images/house.png")}
            style={styles.navIcon}
          />
        </Pressable>

        <Pressable onPress={() => router.push("/Discover")}>
          <Image
            source={require("../assets/images/compass.png")}
            style={styles.navIconActive}
          />
        </Pressable>

        <Pressable onPress={() => router.push("/favorites")}>
          <Image
            source={require("../assets/images/heart.png")}
            style={styles.navIcon}
          />
        </Pressable>
      </View>

      {/* fixed by camfilter popup overlay */}
      <Modal
        visible={showFilter}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilter(false)}
      >
        <DiscoverFilter onClose={() => setShowFilter(false)} />
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
  flex: 1,
  backgroundColor: "#FFF8F3",
},

topRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  marginTop: 20,
},

discoverTitle: {
  fontSize: 38,
  fontWeight: "600",
  color: "#8AA197",
  marginLeft:10,
  fontFamily: "BBHHegarty-Regular", //corrected font name typo - cami
},

iconRow: {
  flexDirection: "row",
  gap: 14,
},

topIcon: {
  width: 32,
  height: 32,
  tintColor: "#674f5d",
},

filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    paddingHorizontal: 30,
    marginTop:10,
    marginBottom:10,
  },

  filterButton: {
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: "#674f5d",
  },

  filterText: {
    fontSize: 15,
    color: "#674f5d",
    fontWeight: "500",
    paddingBottom:8,
    fontFamily: "Quicksand-SemiBold",
  },

mapScroll: {
  paddingHorizontal: 16,
  paddingBottom: 200,
  paddingTop:25,
},

mapContainer: {
  height: 600,
  marginHorizontal: 15,
  marginTop: 10,
  borderRadius: 20,
  overflow: "hidden",
},

map: {
  flex: 1,
},

searchFloating: {
  position: "absolute",
  bottom: 90,
  alignSelf: "center",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF8F3",
  borderRadius: 26,
  paddingHorizontal: 70,
  paddingVertical: 12,
  borderWidth: 3,
  borderColor: "#674f5d",
  shadowOpacity: 0.9,
  shadowOffset: { width: 7, height: 7 },
  shadowColor: "#674f5d",
},

searchIcon: {
  width: 18,
  height: 18,
  tintColor: "#674f5d",
  marginRight: 8,
  fontWeight:"200",
},

searchText: {
  fontSize: 16,
  color: "#674f5d",
  fontFamily: "Quicksand-Bold",
},

navBar: {
  position: "absolute",
  bottom: 0,
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-evenly",
  paddingVertical: 14,
  backgroundColor: "#FFF8F3",
},

navIcon: {
  width: 38,
  height: 38,
  tintColor: "#C6D8CF",
  marginBottom:9,
},

navIconActive: {
  width: 38,
  height: 38,
  tintColor: "#7A9A87",
},

})