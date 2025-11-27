import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { getMealDetails } from "./services/recipeAPI";
import { Meal } from "./types/Recipe";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getMealDetails(String(id));
      setMeal(data);
    }
    load();
  }, []);

  if (!meal) {
    return (
      <View>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Text>
        {meal.strMeal}
      </Text>

      <Image
        source={{ uri: meal.strMealThumb }}
      />

      <Text>
        Instruções
      </Text>

      <Text>
        {meal.strInstructions}
      </Text>
    </ScrollView>
  );
}