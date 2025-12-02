import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { getMealDetails } from "../services/recipeAPI";
import { Meal } from "../types/Recipe";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState<Meal | null>(null);

  // Carrega informções da receita ao carregar a tela
  useEffect(() => {
    async function load() {
      const data = await getMealDetails(String(id));
      setMeal(data);
    }
    load();
  }, []);

  // Pega da API informações dos ingredientes e da medidasde cada um
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

  // Se a receita não estiver carregada mostra simbolo de carregamento
  if (!meal) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // vairável com informações dos ingredientes
  const ingredients = getIngredientsList(meal);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={{ uri: meal.strMealThumb }}
          style={styles.image}
        />

        <Text style={styles.recipeName}>
          {meal.strMeal}
        </Text>

        <Text style={styles.recipeCategory}>
          {meal.strCategory} • {meal.strArea}
        </Text>


        <View style={styles.marginContainer}>
          <Text style={styles.title}>
            Ingredientes:
          </Text>

          <View style={styles.ingredientsList}>
            {ingredients.map((item, index) => (
              <Text key={index} style={styles.ingredient}>
                • {item.ingredient} — {item.measure}
              </Text>
            ))}
          </View>
        </View>
        
        <View style={styles.marginContainer}>
          <Text style={styles.title}>
            Instruções:
          </Text>

          <Text style={styles.instructions}>
            {meal.strInstructions}
          </Text>
        </View>
      </View>     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    backgroundColor: "#EDE0D4",
    paddingBottom: 15,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  recipeName: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#eee",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  recipeCategory: {
    color: "#eee",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  marginContainer: {
    marginLeft: 20,
    marginRight: 10,
  },
  title: {
    color: "#eee",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  ingredientsList: {
    marginLeft: 20,
  },
  ingredient: {
    color: "#eee",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  instructions: {
    marginLeft: 20,
    color: "#eee",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});