//made by Cami

import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
//these are for the icons of back arrow, heart one, and the stars for the review section
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useFavorites } from "@/context/userFavorites";
import { Linking } from 'react-native';

//these will be functional later for the nav back button, then the review handling etc.
export default function RestProfile() {
  const router = useRouter();
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const { toggleFav, isFav } = useFavorites();

  // PLACEHOLDER as this will be later be gathered from backend
  const restaurant = {
    id:"4",
    route: "/restaurantprof_panda",
    type: "Asian Fast Food",
    image: require("../assets/images/panda.jpeg"),
    name: "Panda Express",
    cuisine: "Chinese fast food",
    distance: "1.1 mi",
    rating: 4,
    reviewCount: "200+",
    price: "$",
    tags: ["Low-sugar", "Gluten-Free"],
    about:
      "Panda Express serves American Chinese dishes like orange chicken and bowls.",
    website: "www.pandaexpress.com",
    address: "12715 Pegasus Dr, Orlando, FL 32826 UCF Student Union",
    hours: [
      "Monday: 11:00 AM – 8:00 PM",
      "Tuesday: 11:00 AM – 8:00 PM",
      "Wednesday: 11:00 AM – 8:00 PM",
      "Thursday: 11:00 AM – 8:00 PM",
      "Friday: 11:00 AM – 6:00 PM",
      "Saturday: Closed",
      "Sunday: Closed",
    ],
    bestForYou: [
      { name: "Honey Sesame Chicken Bowl", image: require("../assets/images/honeysesamechick.png") },
      { name: "Build Your Own", image: require("../assets/images/buildown.png") },
      { name: "Cream Cheese Ragoons", image: require("../assets/images/ragoons.png") },
    ],
    reviews: [
      {
        name: "Person 1",
        rating: 4,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.",
      },
      {
        name: "Person 2",
        rating: 3,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.",
      },
      {
        name: "Person 3",
        rating: 3,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.",
      },
    ],
  };

  //thisshows the stars for each review based on rating
  // console.log("rating value:", selectedRating);
  const renderStars = (rating: number, size: number, color: string) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome key={i} name={i <= rating ? "star" : "star-o"} size={size} color={color} style={{ marginRight: 2 }} />
      );
    }
    return stars;
  };

  // same but tappable for when user picks a rating
  const renderSelectableStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable key={i} onPress={() => setSelectedRating(i)}>
          <FontAwesome name={i <= selectedRating ? "star" : "star-o"} size={28} color="#6AA792" style={{ marginRight: 8 }} />
        </Pressable>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER*/}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#674F5D" />
          </Pressable>
          <Pressable style={styles.favBtn} onPress={() => toggleFav(restaurant)}>
          <Ionicons
            name={isFav(restaurant.id) ? "heart" : "heart-outline"}
            size={28}
            color="#674F5D"
          />
          <Text style={styles.favText}>
            {isFav(restaurant.id) ? "Favorited!" : "Add to\nfavorites"}
          </Text>
        </Pressable>
        </View>

        {/*RESTAURANT IMAGE*/}
        <View style={styles.imageShadow}>
          <Image
            source={require("../assets/images/pandaexpress.jpg")}
            style={styles.restaurantImage}
            resizeMode="cover"
          />
        </View>

        {/* RESTAURANT INFO*/}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
            </View>
            <Pressable style={styles.alertIcon}>
              <Image source={require("../assets/images/icons/limitedoptionsicon.png")} style={{ width: 42, height: 42 }} resizeMode="contain" />
            </Pressable>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={20} color="#674F5D" />
              <Text style={styles.detailText}>{restaurant.distance}</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesome name="star" size={14} color="#674F5D" />
              <Text style={styles.detailText}>
                {restaurant.rating} ({restaurant.reviewCount})
              </Text>
            </View>
            <Text style={styles.detailText}>{restaurant.price}</Text>
          </View>

          {/*DIET TAGS*/}
          <View style={styles.tagsRow}>
            {restaurant.tags.map((tag, index) => {
              // icons for each tag, I used png because svg was too hard to implement here
              const tagIcon = tag === "Low-sugar"
                ? require("../assets/images/icons/lowsugaricon.png")
                : tag === "Gluten-Free"
                ? require("../assets/images/icons/glutenfreeicon.png")
                : null;
              return (
                <View key={index} style={styles.tag}>
                  {tagIcon && <Image source={tagIcon} style={{ width: 16, height: 16 }} resizeMode="contain" />}
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/*BEST FOR YOU SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best for you</Text>
          <View style={styles.bfyRow}>
            {restaurant.bestForYou.map((item, index) => (
              <View key={index} style={styles.bfyItem}>
                <View style={styles.bfyShadow}>
                  <Image
                    source={item.image}
                    style={styles.bfyImg}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.bfyLabel}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ABOUT*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bodyText}>{restaurant.about}</Text>

          <Text style={styles.bodyText}>{restaurant.website}</Text>
          <Text style={styles.bodyText}>{restaurant.address}</Text>
        </View>

        {/* BUSINESS HOURS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          {restaurant.hours.map((line, index) => (
            <Text key={index} style={styles.bodyText}>
              {line}
            </Text>
          ))}
        </View>

        {/* REVIEWS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>

          {/* REVIRE INPUT FIELD*/}
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience"
            placeholderTextColor="#C5DBCA"
            value={reviewText}
            onChangeText={setReviewText}
            // onChangeText={(text) => { console.log("typed:", text); setReviewText(text); }}
          />
          <View style={styles.ratingRow}>
            <View style={styles.selectableStars}>{renderSelectableStars()}</View>
            <Pressable style={styles.postButton}>
              <Text style={styles.postButtonText}>Post</Text>
            </Pressable>
          </View>

          {/* REVIEW LINES */}
          {restaurant.reviews.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatar} />
                <View>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <View style={styles.reviewStars}>
                    {renderStars(review.rating, 14, "#6AA792")}
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
              {index < restaurant.reviews.length - 1 && (
                <View style={styles.reviewDivider} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* STICKY BUTTONS at bottom */}
      <View style={styles.stickyBtns}>
        <Pressable 
          style={styles.actionButton}
          onPress={() => Linking.openURL('https://www.pandaexpress.com/')}
        >
          <Text style={styles.actionButtonText}>See full{"\n"}menu</Text>
        </Pressable>
      </View>
    </View>
  );
}

//STYLING
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F3",
  },
  // extra space so stuff doesnt get hidden behind the sticky buttons
  scrollContent: {
    paddingBottom: 90,
  },

  //top bar
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  favBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  favText: {
    fontSize: 16,
    color: "#674F5D",
    fontFamily: "Quicksand-Medium",
  },

  // banner img with the green offset shadow thing
  imageShadow: {
    marginHorizontal: 20,
    shadowColor: "#C5DBCA",
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    borderRadius: 20,
  },
  restaurantImage: {
    width: "100%",
    height: 160,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#6AA792",
    overflow: "hidden",
  },

  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  restaurantName: {
    fontSize: 28,
    color: "#427263",
    fontFamily: "Quicksand-Bold",
  },
  cuisineText: {
    fontSize: 16,
    color: "#6AA792",
    fontFamily: "Quicksand-Medium",
    marginTop: 2,
  },
  alertIcon: {
    padding: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 16,
    color: "#674F5D",
    fontFamily: "Quicksand-Medium",
  },

  //diet tags like omnivore andlow-Fat
  tagsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: "#674F5D",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 16,
    color: "#674F5D",
    fontFamily: "Quicksand-Medium",
  },

  //this is for all sections
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#674F5D",
    fontFamily: "Quicksand-Bold",
    marginBottom: 12,
  },

  // best for you food items
  bfyRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  bfyItem: {
    alignItems: "center",
    width: 114,
  },
  bfyShadow: {
    shadowColor: "#C5DBCA",
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    borderRadius: 20,
  },
  bfyImg: {
    width: 100,
    height: 90,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#6AA792",
    overflow: "hidden",
  },
  bfyLabel: {
    fontSize: 16,
    color: "#674F5D",
    fontFamily: "Quicksand-Medium",
    marginTop: 12,
    textAlign: "center",
  },

  //overall styling for about, hours, etc
  bodyText: {
    fontSize: 16,
    color: "#674F5D",
    fontFamily: "Quicksand-Medium",
    lineHeight: 22,
    marginTop: 2,
  },

  // go to rest and full menu btns that float at bottom
  stickyBtns: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  //#674F5D at 90% transparency
  actionButton: {
    backgroundColor: "rgba(103, 79, 93, 0.9)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFF8F3",
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    textAlign: "center",
  },

  //review input and post btn
  reviewInput: {
    borderWidth: 2,
    borderColor: "#6AA792",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#674F5D",
    fontFamily: "Quicksand-Medium",
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  selectableStars: {
    flexDirection: "row",
    alignItems: "center",
  },
  postButton: {
    backgroundColor: "#6AA792",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  postButtonText: {
    color: "#FFF8F3",
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
  },

  reviewCard: {
    marginBottom: 4,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  //placeholder circle as we dont have user imgs yet
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C3D8C5",
  },
  reviewerName: {
    fontSize: 20,
    color: "#6AA792",
    fontFamily: "Quicksand-Bold",
  },
  reviewStars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  reviewRatingText: {
    fontSize: 16,
    color: "#6AA792",
    fontFamily: "Quicksand-Medium",
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 16,
    color: "#674F5D",
    fontFamily: "Quicksand-Medium",
    lineHeight: 20,
    marginLeft: 50,
  },
  //line inbetween reviews
  reviewDivider: {
    height: 1,
    backgroundColor: "#E0D8D4",
    marginVertical: 14,
  },
});
