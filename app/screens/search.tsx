import { router } from "expo-router";
import React, { useState } from "react";
import { Button, FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { searchMeals } from "../services/recipeAPI";
import { Meal } from "../types/Recipe";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
  if (!query.trim()) return;

    setHasSearched(true);

    try {
      setLoading(true);
      const data = await searchMeals(query);
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