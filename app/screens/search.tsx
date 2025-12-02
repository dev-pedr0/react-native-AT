import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Image, Pressable, Text, TextInput, View } from "react-native";
import { filterByCategory, getCategories, searchMeals } from "../services/recipeAPI";
import { Meal } from "../types/Recipe";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(["All", ...data]);
      setSelectedCategory("Pasta");
    };

    loadCategories();
  }, []);

  useEffect(() => {
  if (categories.length > 0 && !initialLoadDone) {
    setInitialLoadDone(true);
    handleSearch();
  }
}, [categories]);

  const handleSearch = async () => {
    const isAllCategory = selectedCategory === "All";

    if (!query.trim() && isAllCategory) return;

    setHasSearched(true);

    try {
      setLoading(true);
      let data: Meal[] = [];

      if (!isAllCategory) {
        data = await filterByCategory(selectedCategory);
      }

      if (query.trim() && isAllCategory) {
        data = await searchMeals(query);
      }

      if (query.trim() && !isAllCategory) {
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
    <View style={{ flex: 1, padding: 20, marginTop: 80 }}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(value) => setSelectedCategory(value)}
        style={{ backgroundColor: "#eee", marginVertical: 10 }}
      >
        {categories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
      
      <TextInput
        placeholder="Digite o nome de uma receita..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Buscar" onPress={handleSearch} />

      {loading && (
        <ActivityIndicator size="large" color="#000"/>
      )}

      <FlatList
        style={{ flex: 1 }}
        data={results}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <Pressable onPress={() => openDetails(item.idMeal)}>
            <Image
              style={{ width: "100%", height: 180, borderRadius: 8 }}
              source={{ uri: item.strMealThumb }}
            />
            <Text>{item.strMeal}</Text>
          </Pressable>
        )}
      />

      {!loading && hasSearched && results.length === 0 && (
        <Text>Nenhuma receita encontrada.</Text>
      )}

    </View>
  );
}