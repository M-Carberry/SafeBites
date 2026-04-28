import { Restaurant } from "../constants/restaurantData";

type Preferences = {
  allergies?: string[];
  dietType?: string[];
  dietPlan?: string[];
};

export function getMatchScore(restaurant: Restaurant, preferences: Preferences): number {
  const allergies = preferences.allergies ?? [];
  const dietTypes = preferences.dietType ?? [];
  const healthGoals = preferences.dietPlan ?? [];

  //if user has no preferences set, everything is a great match :o
  const hasNoPreferences =
    allergies.length === 0 &&
    (dietTypes.length === 0 || dietTypes.includes("none")) &&
    (healthGoals.length === 0 || healthGoals.includes("none"));

  if (hasNoPreferences) return 5;

  let score = 0;

  //diet type match — highest weight
  for (const diet of dietTypes) {
    if (diet === "none") continue;
    if (restaurant.dietTypes.includes(diet)) score += 3;
  }

  //allergy safety bonus
  for (const allergy of allergies) {
    if (restaurant.allergySafe.includes(allergy)) score += 2;
  }

  //allergy risk penalty
  for (const allergy of allergies) {
    if (restaurant.allergyRisk.includes(allergy)) score -= 2;
  }

  //health goal match
  for (const goal of healthGoals) {
    if (goal === "none") continue;
    if (restaurant.healthGoals.includes(goal)) score += 1;
  }

  return score;
}

export function getMatchLabel(score: number): { label: string; color: string; borderColor: string } {
  if (score >= 4) return { label: "Great match!", color: "#6AA792", borderColor: "#427263" };
  if (score >= 1) return { label: "Okay match", color: "#E6A817", borderColor: "#B8860B" };
  return { label: "Poor match", color: "#C0605A", borderColor: "#8B3A3A" };
}

export function sortByMatch(restaurants: Restaurant[], preferences: Preferences): Restaurant[] {
  return [...restaurants].sort(
    (a, b) => getMatchScore(b, preferences) - getMatchScore(a, preferences)
  );
}