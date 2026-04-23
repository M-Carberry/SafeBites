import { StyleSheet, Text, View, Pressable, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useUserPreferences } from "../context/UserPreferenceContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

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

const ALL_RESTAURANTS = [
  {
    id: "1", name: "Chick-Fil-A", distance: "0.5 mi",
    image: require("../assets/images/chickfila.jpg"), route: "/restaurantprof_chickfila",
    latitude: 28.5960, longitude: -81.1988, rating: 3.7, price: 1,
    hours: ["Monday: 7:30 AM – 8:00 PM","Tuesday: 7:30 AM – 8:00 PM","Wednesday: 7:30 AM – 8:00 PM","Thursday: 7:30 AM – 8:00 PM","Friday: 7:30 AM – 5:00 PM","Saturday: 11:00 AM – 4:00 PM","Sunday: Closed"],
  },
  {
    id: "2", name: "Qdoba Mexican", distance: "0.7 mi",
    image: require("../assets/images/qdoba.jpg"), route: "/restaurantprof_qdoba",
    latitude: 28.5480, longitude: -81.3876, rating: 3.9, price: 1,
    hours: ["Monday: 10:30 AM – 9:00 PM","Tuesday: 10:30 AM – 9:00 PM","Wednesday: 10:30 AM – 9:00 PM","Thursday: 10:30 AM – 9:00 PM","Friday: 10:30 AM – 9:00 PM","Saturday: 10:30 AM – 9:00 PM","Sunday: 11:00 AM – 8:00 PM"],
  },
  {
    id: "3", name: "Huey Magoos", distance: "0.7 mi",
    image: require("../assets/images/huey.jpg"), route: "/restaurantprof_huey",
    latitude: 28.6125, longitude: -81.2084, rating: 3.2, price: 1,
    hours: ["Monday: 10:30 AM – 11:00 PM","Tuesday: 10:30 AM – 11:00 PM","Wednesday: 10:30 AM – 11:00 PM","Thursday: 10:30 AM – 11:00 PM","Friday: 10:30 AM – 11:00 PM","Saturday: 10:30 AM – 11:00 PM","Sunday: 10:30 AM – 11:00 PM"],
  },
  {
    id: "4", name: "Panda Express", distance: "1.1 mi",
    image: require("../assets/images/panda.jpeg"), route: "/restaurantprof_panda",
    latitude: 28.6022, longitude: -81.2004, rating: 4.0, price: 1,
    hours: ["Monday: 11:00 AM – 8:00 PM","Tuesday: 11:00 AM – 8:00 PM","Wednesday: 11:00 AM – 8:00 PM","Thursday: 11:00 AM – 8:00 PM","Friday: 11:00 AM – 6:00 PM","Saturday: Closed","Sunday: Closed"],
  },
  {
    id: "5", name: "Dunkin Donuts", distance: "2 mi",
    image: require("../assets/images/dunkin.jpg"), route: "/restaurantprof_dunkin",
    latitude: 28.6068, longitude: -81.1986, rating: 2.8, price: 1,
    hours: ["Monday: 6:00 AM – 8:00 PM","Tuesday: 6:00 AM – 8:00 PM","Wednesday: 6:00 AM – 8:00 PM","Thursday: 6:00 AM – 8:00 PM","Friday: 6:00 AM – 8:00 PM","Saturday: 7:00 AM – 8:00 PM","Sunday: 7:00 AM – 5:00 PM"],
  },
  {
    id: "6", name: "Purple Ocean", distance: "2.6 mi",
    image: require("../assets/images/purple.jpg"), route: "/restaurantprof_purple",
    latitude: 28.6020, longitude: -81.2007, rating: 3.5, price: 2,
    hours: ["Monday: 9:00 AM – 6:00 PM","Tuesday: 9:00 AM – 6:00 PM","Wednesday: 9:00 AM – 6:00 PM","Thursday: 9:00 AM – 6:00 PM","Friday: 9:00 AM – 6:00 PM","Saturday: Closed","Sunday: Closed"],
  },
  {
    id: "7", name: "Starbucks", distance: "0.9 mi",
    image: require("../assets/images/starbucks.webp"), route: "/restaurantprof_starbucks",
    latitude: 28.6033, longitude: -81.1989, rating: 3.8, price: 2,
    hours: ["Monday: 7:30 AM – 5:00 PM","Tuesday: 7:30 AM – 5:00 PM","Wednesday: 7:30 AM – 5:00 PM","Thursday: 7:30 AM – 5:00 PM","Friday: 7:30 AM – 4:00 PM","Saturday: Closed","Sunday: Closed"],
  },
  {
    id: "8", name: "Halal Shack", distance: "1.2 mi",
    image: require("../assets/images/thehalal.png"), route: "/restaurantprof_halal",
    latitude: 28.6016, longitude: -81.2013, rating: 3.7, price: 1,
    hours: ["Monday: 11:00 AM – 8:00 PM","Tuesday: 11:00 AM – 8:00 PM","Wednesday: 11:00 AM – 8:00 PM","Thursday: 11:00 AM – 8:00 PM","Friday: 11:00 AM – 6:00 PM","Saturday: Closed","Sunday: Closed"],
  },
  {
    id: "9", name: "Einstein Bros. Bagels", distance: "1.3 mi",
    image: require("../assets/images/einsteinbros.jpeg"), route: "/restaurantprof_einstein",
    latitude: 28.6009, longitude: -81.1993, rating: 3.1, price: 1,
    hours: ["Monday: Closed","Tuesday: 9:00 AM – 4:00 PM","Wednesday: 9:00 AM – 4:00 PM","Thursday: 9:00 AM – 4:00 PM","Friday: 9:00 AM – 4:00 PM","Saturday: Closed","Sunday: Closed"],
  },
  {
    id: "10", name: "Bento Asian Kitchen", distance: "1.6 mi",
    image: require("../assets/images/bentoasian.jpeg"), route: "/restaurantprof_bento",
    latitude: 28.6018, longitude: -81.2010, rating: 3.1, price: 1,
    hours: ["Monday: 11:00 AM – 8:00 PM","Tuesday: 11:00 AM – 8:00 PM","Wednesday: 11:00 AM – 8:00 PM","Thursday: 11:00 AM – 8:00 PM","Friday: 11:00 AM – 8:00 PM","Saturday: 11:00 AM – 6:00 PM","Sunday: 11:00 AM – 6:00 PM"],
  },
];

export default function MainDashboard() {
  const router = useRouter();
  const { preferences } = useUserPreferences();
  const [userName, setUserName] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [displayedRestaurants, setDisplayedRestaurants] = useState(ALL_RESTAURANTS.slice(0, 4));

  useEffect(() => {
    AsyncStorage.getItem("userName").then((name) => {
      if (name) setUserName(name);
    });
  }, []);

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
  }, [activeFilter, userLocation]);

  const applyFilter = (filter: string | null) => {
    let sorted = [...ALL_RESTAURANTS];

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

    //shows only top 4 after filtering/sorting
    setDisplayedRestaurants(sorted.slice(0, 4));
  };

  const handleFilter = (filter: string) => {
    const next = activeFilter === filter ? null : filter;
    setActiveFilter(next);
  };

  const getDisplayDistance = (item: typeof ALL_RESTAURANTS[0]) => {
    if (!userLocation) return item.distance;
    const d = getDistanceMiles(userLocation.latitude, userLocation.longitude, item.latitude, item.longitude);
    return `${d.toFixed(1)} mi`;
  };

  const labelMap: Record<string, string> = {
    manageweight: "Manage Weight", lowfat: "Low Fat", lowsugar: "Low Sugar",
    lowsodium: "Low Sodium", keto: "Keto", none: "None",
  };
  const formatLabel = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeName}>
              <Text style={styles.welcomeText}>Hi, {userName || "!"}!</Text>
            </View>
            <Pressable onPress={() => router.push("/profile")}>
              <Image source={require("../assets/images/profilepic.jpg")} style={styles.profilepic} />
            </Pressable>
          </View>

          <Text style={styles.dietPreferance}>Your Dietary Preferences</Text>
          <View style={styles.preferenceRow}>
            {preferences.allergies?.length > 0 && preferences.allergies.map((item: string) => (
              <View key={item} style={styles.preferenceBorder}>
                <Text style={styles.dietChoice}>{formatLabel(item)}</Text>
              </View>
            ))}
            {preferences.dietType?.length > 0 && preferences.dietType.map((item: string) => (
              <View key={item} style={styles.preferenceBorder}>
                <Text style={styles.dietChoice}>{formatLabel(item)}</Text>
              </View>
            ))}
            {preferences.dietPlan?.length > 0 && preferences.dietPlan.map((item: string) => (
              <View key={item} style={styles.preferenceBorder}>
                <Text style={styles.dietChoice}>{labelMap[item] || item}</Text>
              </View>
            ))}
            {(!preferences.allergies?.length && !preferences.dietType?.length && !preferences.dietPlan?.length) && (
              <Text style={styles.dietChoice}>No preferences set</Text>
            )}
          </View>
          <Text onPress={() => router.push("/dietary_pref")} style={styles.editPreferences}>
            {"\n"}edit my preferences
          </Text>
        </View>

        {/* Top Picks */}
        <View style={styles.middleContainer}>
          <Text style={styles.sectionTitle}>Top picks for you</Text>

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

        
          <View style={styles.shadowBox}>
            <View style={styles.card}>
              <ScrollView>
                {displayedRestaurants.length === 0 ? (
                  <Text style={{ color: "#674F5D", textAlign: "center", marginTop: 20, fontFamily: "Quicksand-Medium" }}>
                    No restaurants open right now
                  </Text>
                ) : (
                  displayedRestaurants.map((item) => (
                    <Pressable key={item.id} onPress={() => router.push(item.route as any)}>
                      <View style={styles.cardRow}>
                        <Image source={item.image} style={styles.cardImage} />
                        <View>
                          <Text style={styles.restaurantName}>{item.name}</Text>
                          <Text style={styles.distance}>{getDisplayDistance(item)}</Text>
                        </View>
                      </View>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </View>

        <Pressable onPress={() => router.push("/Discover")}>
          <Text style={styles.seeMore}>see more</Text>
        </Pressable>
      </View>

      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={styles.bottomGradient}
        pointerEvents="box-none"
      >
        <Pressable onPress={() => router.push("/keyboard")} style={styles.searchBar}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFF8F3",
  },
  container: {
    flex: 1,
    paddingBottom: 80,
    backgroundColor: "#FFF8F3",
    flexDirection:"column",
  },

header: {
  backgroundColor: "#C5DBCA",
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  paddingHorizontal: 16,
  paddingVertical: 30,
  marginBottom: 16,
},
welcomeRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

  welcomeName: {
    backgroundColor: "#6aa792",
    paddingHorizontal: 80,
    paddingVertical: 5,
    borderRadius: 25,
    marginLeft: -30,
  },

  welcomeText: {
    fontSize: 30,
    fontWeight: "600",
    color: "#FFF8F3",
    fontFamily: "BBHHegarty-Regular",
    marginLeft: -30,
  },

  profilepic: {
    width: 65,
    height: 65,
    marginRight: 30,
    borderRadius: 50,
    backgroundColor: "#c1a9c5", 
  },

  /* Dietary Preferences */
  dietPreferance: {
    marginTop: 20,
    fontSize: 25,
    color: "#674f5d",
    marginBottom: 15,
    fontWeight: "400",
    paddingHorizontal: 16,
    fontFamily: "Quicksand-Bold",
  },

  preferenceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 2,

  },

  preferenceBorder: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#674f5d",
    // fixed by cami - removed paddingTop:1 that was cropping the icon
  },

  dietIcon: {
    width: 22,  // fixed by cami - increased width to fit icon without cropping
    height: 18,
    marginRight: 6,
    resizeMode: "contain", // fixed by cami - ensures icon fits without cropping
  },

  dietChoice: {
    fontSize: 15,
    color: "#674f5d",
    fontWeight: "300",
    fontFamily: "Quicksand-SemiBold",
  },

  editPreferences: {
    fontSize: 15,
    color: "#674f5d",
    textAlign: "center",
    marginTop: -5,
    marginBottom: -10,
    fontFamily: "Quicksand-Medium",
  },

  middleContainer:{
    
  },
  /* Top Picks */
  sectionTitle: {
    fontSize: 24,
    color: "#8AA197",
    marginBottom: 12,
    fontWeight: "500",
    paddingHorizontal: 16,
    marginLeft:10,
    fontFamily: "Quicksand-Bold",
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginLeft:-3,
  },

  filterButtonActive: {
  backgroundColor: "#6AA792",
  borderColor: "#6AA792",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },

  filterButton: {
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#674f5d",
  },

  filterText: {
    fontSize: 13,
    color: "#674f5d",
    fontWeight: "500",
    fontFamily: "Quicksand-Medium",
  },

  /* Restaurant Cards */
  card: {
    backgroundColor: "#FFF8F3",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#427263",
    marginBottom:140,
    marginHorizontal: 16,
    shadowOpacity:1,
    shadowOffset: {
      width:10,height:10,
    },
    shadowColor:"#A4C4B0",
    shadowRadius: 0,
    height:250,
  },
  shadowBox:{
    
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EFEA",
  },

cardImage: {
  width: 75,
  height: 54,
  borderRadius: 10,
  marginRight: 14,
},

  restaurantName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#427263",
    fontFamily: "Quicksand-Bold",
  },

  distance: {
    fontSize: 13,
    color: "#8A9A9A",
    fontFamily: "Quicksand-Medium",
  },

  seeMore: {
    fontSize: 15,
    color: "#427263",
    textAlign: "center",
    fontFamily: "Quicksand-Medium",
    marginTop:-110,
    zIndex:100,
  },

  // fixed by cami - searchBar inside gradient, removed position absolute
  searchBar: {
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
    shadowRadius: 0, // fixed by cami - removed blur to make shadow sharp
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

  // fixed by cami - gradient white, height 278px
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 278,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },

  // fixed by cami - matched navbar style to Discover page
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
