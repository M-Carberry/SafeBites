import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

const UserPreferenceContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    allergies: [],
    dietType: [],
    restrictions: [],
    dietPlan: [],
    medical: [],
    importance: []
  });

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await AsyncStorage.getItem('userPreferences');
        if (saved) {
          setPreferences(JSON.parse(saved));
        }
      } catch (err) {
        console.log('Failed to load preferences', err);
      }
    };
    loadPreferences();
  }, []);

  const updatePreference = async (key, value) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value };
      AsyncStorage.setItem('userPreferences', JSON.stringify(updated));
      return updated;
    });
  };

  const updateManyPreferences = (updates) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...updates };
      AsyncStorage.setItem('userPreferences', JSON.stringify(updated));
      return updated;
    });
  };

  const savePreferencesMongoDB = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.log('No userId found, skipping DB save');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/preferences/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        console.log('Failed to save preferences to DB');
      } else {
        console.log('Preferences saved to DB successfully!');
      }
    } catch (err) {
      console.log('Error saving preferences to DB:', err);
    }
  };


  const loadPreferencesFromDB = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        setPreferences({
          allergies: [],
          dietType: [],
          restrictions: [],
          dietPlan: [],
          medical: [],
          importance: []
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/preferences/${userId}`);
      const data = await response.json();

      if (data) {
        setPreferences({
          allergies: data.allergies || [],
          dietType: data.dietType || [],
          restrictions: data.restrictions || [],
          dietPlan: data.dietPlan || [],
          medical: data.medical || [],
          importance: data.importance || []
        });
        await AsyncStorage.setItem('userPreferences', JSON.stringify(data));
      }
    } catch (err) {
      console.log('Failed to load preferences from DB:', err);
    }
  };


  return (
    <UserPreferenceContext.Provider value={{
      preferences,
      updatePreference,
      updateManyPreferences,
      savePreferencesMongoDB,
      loadPreferencesFromDB 
    }}>
      {children}
    </UserPreferenceContext.Provider>
  );
};

export const useUserPreferences = () => {
  return useContext(UserPreferenceContext);
};