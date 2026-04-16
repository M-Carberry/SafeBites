import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/api";

type Restaurant = {
  id: string;
  name: string;
  type: string;
  distance: string;
  image: any;
  route: string;
};

type FavoritesContextType = {
  favorites: Restaurant[];
  toggleFav: (restaurant: Restaurant) => void;
  isFav: (id: string) => boolean;
  loading: boolean;
  loadFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFav: () => {},
  isFav: () => false,
  loading: false,
  loadFavorites: async () => {},
});

export const useFavorites = () => useContext(FavoritesContext);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        setFavorites([]); //clear if no user logged in
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/favorites/${userId}`);
      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      console.log("Failed to load favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const toggleFav = async (restaurant: Restaurant) => {
    const already = isFav(restaurant.id);

    setFavorites((prev) =>
      already
        ? prev.filter((r) => r.id !== restaurant.id)
        : [...prev, restaurant]
    );

    //sync to MongoDB
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      await fetch(`${API_BASE_URL}/api/favorites/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant }),
      });
    } catch (err) {
      console.log("Failed to sync favorite:", err);
      setFavorites((prev) =>
        already
          ? [...prev, restaurant]
          : prev.filter((r) => r.id !== restaurant.id)
      );
    }
  };

  const isFav = (id: string) => favorites.some((r) => r.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFav, isFav, loading, loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}