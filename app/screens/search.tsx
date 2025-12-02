import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { filterByCategory, getCategories, searchMeals } from "../services/recipeAPI";
import { Meal } from "../types/Recipe";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  const handleSearch = async () => {
    if (!query.trim() && !selectedCategory) return;

    setHasSearched(true);

    try {
      setLoading(true);
      let data: Meal[] = [];
      if (selectedCategory) {
        data = await filterByCategory(selectedCategory);
      }
      if (query.trim() && !selectedCategory) {
        data = await searchMeals(query);
      }
      if (query.trim() && selectedCategory) {
        data = data.filter((meal) =>
          meal.strMeal.toLowerCase().includes(query.toLowerCase())
        );
      }
      setResults(data);
    } catch (error) {
      console.log(error);
      alert("Erro ao buscar receitas.");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (id: string) => {
    router.push({
      pathname: "/screens/details",
      params: { id },
    });
  };

  return (
    <View style={{ padding: 20, marginTop: 80 }}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 8,
              marginRight: 10,
              backgroundColor: selectedCategory === item ? "orange" : "#ddd",
            }}
            onPress={() => setSelectedCategory(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
  )}
      />
      <TextInput
        placeholder="Digite o nome de uma receita..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Buscar" onPress={handleSearch} />

      {loading && <Text>Carregando...</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openDetails(item.idMeal)}
          >
            <Image
              source={{ uri: item.strMealThumb }}
            />

            <Text>{item.strMeal}</Text>
          </TouchableOpacity>
        )}
      />

      {!loading && hasSearched && results.length === 0 && (
        <Text>Nenhuma receita encontrada.</Text>
      )}

    </View>
  );
}