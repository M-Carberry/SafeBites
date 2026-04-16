import { Stack } from "expo-router";
import { useFonts } from "expo-font"; //ADDED BY CAMI , this lets us load custom fonts
import { UserPreferencesProvider } from "../context/UserPreferenceContext";
import { FavoritesProvider } from "../context/userFavorites";

export default function RootLayout() {

  // ADDED BY CAMI, loads all quicksand fonts from assets/fonts folder and added on 2/5 the bbhh hegarty font
  const [fontsLoaded] = useFonts({
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "BBHHegarty-Regular": require("../assets/fonts/BBHHegarty-Regular.ttf"),
  });

  // ADDED BY CAMI,waits for fonts to load before showing them on the app
  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserPreferencesProvider>
      <FavoritesProvider>  
        <Stack />
      </FavoritesProvider>
    </UserPreferencesProvider>
  );
}
