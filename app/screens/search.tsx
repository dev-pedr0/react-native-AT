import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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

  // Carrega todas as categorias
  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(["All", ...data]);
      setSelectedCategory("Pasta");
    };

    loadCategories();
  }, []);

  // Faz a primeira e automática busca na página através da categoria pasta
  useEffect(() => {
    if (categories.length > 0 && !initialLoadDone) {
      setInitialLoadDone(true);
      handleSearch();
    }
  }, [categories]);

  // Gerencia e realiza a pesquisa das receitas
  const handleSearch = async () => {
    const isAllCategory = selectedCategory === "All";

    if (!query.trim() && isAllCategory) return;

    setHasSearched(true);

    try {
      setLoading(true);
      setResults([]);
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

  // Navega para a página de detalhes da receita
  const openDetails = (id: string) => {
    router.push({
      pathname: "/screens/details",
      params: { id },
    });
  };

  return (
    <View style={styles.container}>

      {/* Seletor de categorias */}
      <View style={styles.pickerContainer}>
        <Text>Categorias:</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
      
      {/* Input de texto e botão de pesquisa */}
      <TextInput
        placeholder="Digite o nome de uma receita..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title="Buscar" onPress={handleSearch} color={"#E63946"} />

      {/* Elemento de carregamento */}  
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#E63946" />
        </View>
      )}

      {!loading && (
        <Text style={styles.title}>Receita(s)</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EDE0D4",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  picker: {
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  input: {
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E63946",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    textAlign: "center",
    color: "#eee",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});