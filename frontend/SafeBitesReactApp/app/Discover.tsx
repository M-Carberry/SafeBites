import { StyleSheet, Text, FlatList, View, Pressable, Image, ScrollView, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import DiscoverFilter from "./Discover_filter";
import { useFavorites } from "../context/userFavorites";
import * as Location from "expo-location";
import { ALL_RESTAURANTS } from "../constants/restaurantData";
import { sortByMatch, getMatchLabel, getMatchScore } from "../constants/scoreMatch";
import { useUserPreferences } from "../context/UserPreferenceContext";

//haversine formula to calculate distance between two coordinates from miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

//Open now checker
function openNow(hours: string[]) {
  const now = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = days[now.getDay()];
  const todayLine = hours.find((h) => h.startsWith(today));
  if (!todayLine || todayLine.includes("Closed")) return false;

  const match = todayLine.match(/(\d+:\d+\s[AP]M)\s*–\s*(\d+:\d+\s[AP]M)/);
  if (!match) return false;

  const toMinutes = (t: string) => {
    const [time, period] = t.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const current = now.getHours() * 60 + now.getMinutes();
  return current >= toMinutes(match[1]) && current <= toMinutes(match[2]);
}

export default function Discover() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const { isFav } = useFavorites();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [restaurants, setRestaurants] = useState(ALL_RESTAURANTS);
  const { preferences } = useUserPreferences();

  //gets users location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const { coords } = await Location.getCurrentPositionAsync({});
      setUserLocation(coords);
    })();
  }, []);

  //re-apply filter whenever active filter or user location changes
  useEffect(() => {
    applyFilter(activeFilter);
  }, [activeFilter, userLocation]);

  const applyFilter = (filter: string | null) => {
    let sorted = sortByMatch([...ALL_RESTAURANTS], preferences);

    if (filter === "Nearby" && userLocation) {
      sorted.sort((a, b) => {
        const distA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distA - distB;
      });
    } else if (filter === "Most popular") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (filter === "Low price") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (filter === "Open now") {
      sorted = sorted.filter((r) => openNow(r.hours));
    }

    setRestaurants(sorted);
  };

  const handleFilter = (filter: string) => {
    const next = activeFilter === filter ? null : filter;
    setActiveFilter(next);
  };

  //shows the display distance string from user location
  const getDisplayDistance = (r: typeof ALL_RESTAURANTS[0]) => {
    if (!userLocation) return "";
    const d = calculateDistance(userLocation.latitude, userLocation.longitude, r.latitude, r.longitude);
    return `${d.toFixed(1)} mi`;
  };

  return (
    <View style={styles.container}>

      <View style={styles.topRow}>
        <Text style={styles.discoverTitle}>Discover</Text>
        <View style={styles.iconRow}>
          <Pressable onPress={() => router.push("/map_view")}>
            <Image source={require("../assets/images/icon.png")} style={styles.topIcon} />
          </Pressable>
          <Pressable onPress={() => setShowFilter(true)}>
            <Image source={require("../assets/images/filter.png")} style={styles.topIcon} />
          </Pressable>
        </View>
      </View>

      {/*filter buttons*/}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {["Nearby", "Most popular", "Low price", "Open now"].map((item) => (
          <Pressable
            key={item}
            onPress={() => handleFilter(item)}
            style={[
              styles.filterButton,
              activeFilter === item && styles.filterButtonActive,
            ]}
          >
            <Text style={[
              styles.filterText,
              activeFilter === item && styles.filterTextActive,
            ]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* grid */}
      <FlatList
        data={restaurants}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const score = getMatchScore(item, preferences);
          const { label, color, borderColor } = getMatchLabel(score);

          return (
            <Pressable style={styles.card} onPress={() => router.push(item.route as any)}>
              <Image source={item.image} style={styles.cardImage} />
              {/*match badge*/}
              <View style={[styles.matchBadge, { backgroundColor: color, borderColor: borderColor, borderWidth: 1.5 }]}>
                <Text style={styles.matchBadgeText}>{label}</Text>
              </View>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <Text style={styles.restaurantType}>{item.type}</Text>
              <Text style={styles.distance}>{getDisplayDistance(item)}</Text>
            </Pressable>
          );
        }}
      />

      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={styles.bottomGradient}
      >
        <Pressable onPress={() => router.push("/keyboard")} style={styles.searchFloating}>
          <Image source={require("../assets/images/search.png")} style={styles.searchIcon} />
          <Text style={styles.searchText}>Search</Text>
        </Pressable>

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
          <Pressable onPress={() => router.push("/profile")}>
            <Image source={require("../assets/images/profilepic.jpg")} style={styles.navIcon} />
            </Pressable>
        </View>
      </LinearGradient>

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
    color: "#719F91",
    paddingBottom: 10,
    marginLeft: 10,
    fontFamily: "BBHHegarty-Regular",
  },

  iconRow: {
    paddingBottom: 14,
    flexDirection: "row",
    gap: 15,
  },

  topIcon: {
    width: 35,
    height: 35,
    tintColor: "#674f5d",
  },

    filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    paddingHorizontal: 30,
  },

  filterButton: {
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: "#674f5d",
    paddingBottom: 7,
  },
  filterButtonActive: {
  backgroundColor: "#6AA792",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  filterText: {
    fontSize: 13,
    color: "#674f5d",
    fontWeight: "500",
    fontFamily: "Quicksand-Medium",
    paddingBottom:5,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  matchBadge: {
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 5,
  },
  matchBadgeText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: "Quicksand-SemiBold",
  },
  card: {
    backgroundColor: "#FFF8F3",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#6aa792",
    padding: 9.5,
    margin: 8,
    flex: 1,
    shadowOpacity: 0.9,
    shadowOffset: { width: 7, height: 7 },
    shadowColor: "#6aa792",
    shadowRadius: 0, //removed blur to make shadow sharp fixed by cams
  },

  cardImage: {
    width: "100%",
    height: 110,
    borderRadius: 16,
    marginBottom: 9,
  },

  restaurantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A5A5A",
    fontFamily: "Quicksand-Bold",
    marginBottom:4,
  },

  restaurantType: {
    fontSize: 17,
    color: "#8A9A9A",
    fontFamily: "Quicksand-SemiBold",
    marginBottom:4,
  },

  distance: {
    fontSize: 15,
    color: "#674f5d ",
    fontFamily: "Quicksand-SemiBold",

  },

  // gradient white, height 278px as figma prot cami changed this
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 278,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },

  searchFloating: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F3",
    borderRadius: 26,
    paddingHorizontal: 70,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#674f5d",
    shadowOpacity: 0.9,
    shadowOffset: { width: 7, height: 7 },
    shadowColor: "#674f5d",
    shadowRadius: 0, // again removed blur to make shadow sharp
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
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  navIcon: {
    width: 40,
    height: 40,
    tintColor: "#7A9A87",
  },
});
