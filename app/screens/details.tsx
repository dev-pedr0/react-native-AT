import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { getMealDetails } from "../services/recipeAPI";
import { Meal } from "../types/Recipe";

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

  function getIngredientsList(meal: Meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ing && ing.trim() !== "") {
        ingredients.push({ ingredient: ing, measure: measure || "" });
      }
    }

    return ingredients;
  }

  if (!meal) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const ingredients = getIngredientsList(meal);

  return (
    <ScrollView>
      
      <Image
        source={{ uri: meal.strMealThumb }}
        style={{
          width: "100%",
          height: 250,
        }}
      />

      <Text>
        {meal.strMeal}
      </Text>

      <Text>
        {meal.strCategory} • {meal.strArea}
      </Text>

      <Text >
        Ingredientes
      </Text>

      {ingredients.map((item, index) => (
        <Text key={index}>
          • {item.ingredient} — {item.measure}
        </Text>
      ))}

      <Text>
        Instruções
      </Text>

      <Text>
        {meal.strInstructions}
      </Text>
    </ScrollView>
  );
}