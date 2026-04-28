import { StyleSheet, Text, FlatList, View, Pressable, Image, Modal, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useFavorites } from "../context/userFavorites";
import DiscoverFilter from "./Discover_filter";
import * as Location from "expo-location";
import { useUserPreferences } from "../context/UserPreferenceContext";
import { sortByMatch, getMatchLabel, getMatchScore } from "../constants/scoreMatch";

function getDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
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

function isOpenNow(hours: string[]) {
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

export default function Favorites() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const { favorites, toggleFav, isFav, loading } = useFavorites();
  const { preferences } = useUserPreferences();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [filteredFavs, setFilteredFavs] = useState(favorites);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const { coords } = await Location.getCurrentPositionAsync({});
      setUserLocation(coords);
    })();
  }, []);

  useEffect(() => {
    applyFilter(activeFilter);
  }, [activeFilter, userLocation, favorites]);

  const applyFilter = (filter: string | null) => {
    let sorted = sortByMatch([...favorites], preferences);

    if (filter === "Nearby" && userLocation) {
      sorted.sort((a, b) =>
        getDistanceMiles(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude) -
        getDistanceMiles(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
      );
    } else if (filter === "Most popular") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (filter === "Low price") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (filter === "Open now") {
      sorted = sorted.filter((r) => isOpenNow(r.hours));
    }

    setFilteredFavs(sorted);
  };

  const handleFilter = (filter: string) => {
    const next = activeFilter === filter ? null : filter;
    setActiveFilter(next);
  };

  const getDisplayDistance = (item: any) => {
    if (!userLocation || !item.latitude) return "";
    const d = getDistanceMiles(userLocation.latitude, userLocation.longitude, item.latitude, item.longitude);
    return `${d.toFixed(1)} mi`;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#674F5D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.topRow}>
        <Text style={styles.discoverTitle}>Favorites</Text>
        <View style={styles.iconRow}>
          <Pressable onPress={() => router.push("/map_favorites")}>
            <Image source={require("../assets/images/icon.png")} style={styles.topIcon} />
          </Pressable>
          <Pressable onPress={() => setShowFilter(true)}>
            <Image source={require("../assets/images/filter.png")} style={styles.topIcon} />
          </Pressable>
        </View>
      </View>

      {/* filter buttons */}
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

      {/* fav list */}
      <FlatList
        data={filteredFavs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Text style={{ color: "#674F5D", fontSize: 16 }}>
              {activeFilter === "Open now" ? "No favorites are open right now!" : "No favorites yet!"}
            </Text>
            <Text style={{ color: "#674F5D", fontSize: 14, marginTop: 8 }}>
              {activeFilter === "Open now" ? "Try checking back later." : "Tap the heart on any restaurant to save it here."}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const score = getMatchScore(item, preferences);
          const { label, color, borderColor } = getMatchLabel(score);

          return (
            <View style={styles.cardShadow}>
              <Pressable
                style={styles.card}
                onPress={() => router.push(item.route as any)}
              >
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.cardText}>
                  <Text style={styles.restaurantName}>{item.name}</Text>
                  <Text style={styles.restaurantType}>{item.type}</Text>
                  <Text style={styles.distance}>{getDisplayDistance(item)}</Text>
                  {/* match badge */}
                  <View style={[styles.matchBadge, { backgroundColor: color, borderColor: borderColor, borderWidth: 1.5 }]}>
                    <Text style={styles.matchBadgeText}>{label}</Text>
                  </View>
                </View>
                {/* heart button */}
                <Pressable
                  style={styles.heartIcon}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFav(item);
                  }}
                >
                  <Image
                    source={
                      isFav(item.id)
                        ? require("../assets/images/heartFilled.png")
                        : require("../assets/images/heart.png")
                    }
                    style={{ width: 25, height: 25 }}
                  />
                </Pressable>
              </Pressable>
            </View>
          );
        }}
      />

      <View style={styles.searchFloating}>
        <Image source={require("../assets/images/search.png")} style={styles.searchIcon} />
        <Text onPress={() => router.push("/keyboard")} style={styles.searchText}>Search</Text>
      </View>

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
    fontFamily: "BBHHegarty-Regular", // fixed by cami - added the font
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

  /*filter*/
filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    paddingHorizontal: 30,
    marginBottom: 10,
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
    paddingBottom:12,
    fontFamily: "Quicksand-SemiBold",
  },

  /* grid */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
cardShadow: {
  shadowColor: "#A4C4B0",
  shadowOffset: { width: 7, height: 9 },
  shadowOpacity: .9,
  shadowRadius: 0, // fixed by cami - made shadow sharp not blurred
  borderRadius: 22,
  marginVertical: 5,
},

  card: {
     flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF8F3",
  borderRadius: 22,
  borderWidth: 2.5,
  borderColor: "#427263",
  padding: 15,
  marginVertical: 8,
  },

 cardImage: {
  width: 140,
  height: 120,
  borderRadius: 16,
  marginRight: 12,
},
cardText: {
  flex: 1,
},


restaurantName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#427263",
    fontFamily: "Quicksand-Bold",
  },

  restaurantType: {
    marginTop:10,
    fontSize: 16,
    color: "#427263",
    fontFamily: "Quicksand-Medium",
  },

  distance: {
    marginTop:10,
    fontSize: 15,
    color: "#427263",
    fontFamily: "Quicksand-Medium",
  },

  heartIcon: {
  width: 32,
  height: 32,
  tintColor: "#674f5d",
  marginLeft: 12,
},

filterButtonActive: {
  backgroundColor: "#6AA792",
  borderColor: "#6AA792",
},
filterTextActive: {
  color: "#FFFFFF",
},
matchBadge: {
  alignSelf: "flex-start",
  borderRadius: 10,
  paddingHorizontal: 8,
  paddingVertical: 3,
  marginTop: 5,
},
matchBadgeText: {
  fontSize: 11,
  color: "#FFFFFF",
  fontFamily: "Quicksand-SemiBold",
},

  /*search  - fixed by cami*/
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
  shadowOpacity:0.9,
  shadowOffset: { width: 7, height: 7 },
  shadowColor: "#674f5d",
  shadowRadius: 0, // fixed by cami - sharp shadow not blurry
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

  navBar: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent:"space-evenly",
    borderTopWidth: 1,
    borderTopColor: "#FFF8F3",
  },

  navIcon: {
    width: 40,
    height: 40,
    tintColor: "#7A9A87",
  },
});
