import { Picker } from "@react-native-picker/picker";
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
      setCategories(["All", ...data]);
    };

    loadCategories();
  }, []);

  const handleSearch = async () => {
    const isAllCategory = selectedCategory === "All";

    if (!query.trim() && !selectedCategory) return;

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
    <View style={{ padding: 20, marginTop: 80 }}>
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