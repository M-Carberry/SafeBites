import { StyleSheet, Text, View, Pressable, Image, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import DiscoverFilter from "./Discover_filter";
import * as Location from "expo-location";
import MapWrapper from "../components/MapWrapper";

const RESTAURANTS = [
  { id: "10", name: "Bento Asian Kitchen + Sushi", latitude: 28.6018, longitude: -81.2010, route: "/restaurantprof_bento" },
  { id: "1",  name: "Chick-fil-A",                latitude: 28.6013, longitude: -81.2014, route: "/restaurantprof_chickfila" },
  { id: "5",  name: "Dunkin'",                    latitude: 28.6068, longitude: -81.1986, route: "/restaurantprof_dunkin" },
  { id: "9",  name: "Einstein Bros. Bagels",       latitude: 28.6009, longitude: -81.1993, route: "/restaurantprof_einstein" },
  { id: "8",  name: "Halal Shack",                latitude: 28.6021, longitude: -81.2000, route: "/restaurantprof_halal" },
  { id: "3",  name: "Huey Magoo's",               latitude: 28.6125, longitude: -81.2084, route: "/restaurantprof_huey" },
  { id: "4",  name: "Panda Express",              latitude: 28.6022, longitude: -81.2004, route: "/restaurantprof_panda" },
  { id: "6",  name: "Purple Ocean",               latitude: 28.6020, longitude: -81.2007, route: "/restaurantprof_purpleocean" },
  { id: "2",  name: "Qdoba",                      latitude: 28.5480, longitude: -81.3876, route: "/restaurantprof_qdoba" },
  { id: "7",  name: "Starbucks",                  latitude: 28.6033, longitude: -81.1989, route: "/restaurantprof_starbucks" },
];

export default function Discover() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
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

      {/* header */}
      <View style={styles.topRow}>
        <Text style={styles.discoverTitle}>Discover</Text>
        <View style={styles.iconRow}>
          <Pressable onPress={() => router.push("/Discover")}>
            <Image source={require("../assets/images/grid.png")} style={styles.topIcon} />
          </Pressable>
          <Pressable onPress={() => setShowFilter(true)}>
            <Image source={require("../assets/images/filter.png")} style={styles.topIcon} />
          </Pressable>
        </View>
      </View>

      {/* map */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapWrapper
            latitude={location.latitude}
            longitude={location.longitude}
            restaurants={RESTAURANTS}
          />
        ) : (
          <Text>Map loading</Text>
        )}
      </View>

      {/* search */}
      <View style={styles.searchFloating}>
        <Image source={require("../assets/images/search.png")} style={styles.searchIcon} />
        <Text onPress={() => router.push("/keyboard")} style={styles.searchText}>Search</Text>
      </View>

      {/* nav */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.push("/main_dashboard")}>
          <Image source={require("../assets/images/house.png")} style={styles.navIcon} />
        </Pressable>
        <Pressable onPress={() => router.push("/Discover")}>
          <Image source={require("../assets/images/compass.png")} style={styles.navIconActive} />
        </Pressable>
        <Pressable onPress={() => router.push("/favorites")}>
          <Image source={require("../assets/images/heart.png")} style={styles.navIcon} />
        </Pressable>
        <Pressable onPress={() => router.push("/profile")}>
          <Image source={require("../assets/images/profilepic.jpg")} style={styles.navIcon} />
        </Pressable>
      </View>

      {/* filter modal */}
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
    marginLeft: 10,
    fontFamily: "BBHHegarty-Regular",
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
  mapContainer: {
    height: 600,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
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
    marginBottom: 9,
  },
  navIconActive: {
    width: 38,
    height: 38,
    tintColor: "#7A9A87",
  },
});