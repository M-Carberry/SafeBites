import { StyleSheet, Text, FlatList, View, Pressable, Image, ScrollView, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient"; // added this for the gradient behind by camii
import DiscoverFilter from "./Discover_filter"; //now this goes properly to filter screen cami
import { useFavorites } from "../context/userFavorites";

export default function Discover() {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
    const { isFav } = useFavorites();

  const restaurants = [
    {
      id: "1",
      name: "Chick-Fil-A",
      type: "American fast food",
      distance: "0.5 mi",
      image: require("../assets/images/chickfila.jpg"),
      route:"/restaurantprof_chickfila",
    },
    {
      id: "2",
      name: "Qdoba",
      type: "Mexican food",
      distance: "0.7 mi",
      image: require("../assets/images/qdoba.jpg"),
      route:"/restaurantprof_qdoba",
    },
    {
      id: "3",
      name: "Huey Magoos",
      type: "American fast food",
      distance: "0.7 mi",
      image: require("../assets/images/huey.jpg"),
      route:"/restaurantprof_huey",
    },
    {
      id: "4",
      name: "Panda Express",
      type: "Chinese fast food",
      distance: "1.1 mi",
      image: require("../assets/images/panda.jpeg"),
      route:"/restaurantprof_panda",
    },
    {
      id: "5",
      name: "Dunkin Donuts",
      type: "American Cafe",
      distance: "2 mi",
      image: require("../assets/images/dunkin.jpg"),
      route:"/restaurantprof_dunkin",

    },
    {
      id: "6",
      name: "Purple Ocean Superfood Bar",
      type: "Vegan Kitchen",
      distance: "2.6 mi",
      image: require("../assets/images/purple.jpg"),
      route:"/restaurantprof_purple",
    },
  ];

  return (
    <View style={styles.container}>

      <View style={styles.topRow}>
        <Text style={styles.discoverTitle}>Discover</Text>

        <View style={styles.iconRow}>
          <Pressable onPress={() => router.push("/map_view")}>
                <Image
                    source={require("../assets/images/icon.png")}
                    style={styles.topIcon}
                />
            </Pressable>
          {/* fixed by cami - open filter popup overlay instead of navigation */}
          <Pressable onPress={() => setShowFilter(true)}>
            <Image
            source={require("../assets/images/filter.png")}
            style={styles.topIcon}
          />
          </Pressable>

        </View>
      </View>

      {/* filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {["Nearby", "Most popular", "Low price", "Open now"].map((item) => (
          <View key={item} style={styles.filterButton}>
            <Text style={styles.filterText}>{item}</Text>
          </View>
        ))}
      </ScrollView>

      {/* grid */}
      <FlatList
        data={restaurants}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(item.route as any)}>
            <Image source={item.image} style={styles.cardImage} />
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantType}>{item.type}</Text>
            <Text style={styles.distance}>{item.distance}</Text>
          </Pressable>
        )}
      />
      {/* fixed by cami - added gradient behind search bar and navbar */}
      {/* and also gradient white, 0% opacity top to 100% opacity bottom, 278px height */}
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={styles.bottomGradient}
      >
        <Pressable onPress={() => router.push("/keyboard")} style={styles.searchFloating}>
          <Image
            source={require("../assets/images/search.png")}
            style={styles.searchIcon}
          />
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
        </View>
      </LinearGradient>

      {/*fixed by cami filter popup overlay */}
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
    fontSize: 13,
    color: "#674f5d",
    fontWeight: "500",
    paddingBottom:12,
    fontFamily: "Quicksand-Medium",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    color: "#8A9A9A",
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
