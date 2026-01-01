import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getRandomMeal } from "../services/recipeAPI";
import { Meal } from "../types/Recipe";

export default function Home() {
    const router = useRouter();
    const [meal, setMeal] = useState<Meal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function loadMeal() {
      try {
        const randomMeal = await getRandomMeal();
        setMeal(randomMeal);
      } catch (error) {
        console.log("Erro ao carregar imagem:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMeal();
  }, []);

    return (
        <ScrollView
            style={styles.box}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>World's Recipes</Text>
                    <Text style={styles.subtitle}>Encontre receitas rápidas e deliciosas</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#E63946" />
                ) : (
                    meal?.strMealThumb && (
                    <Image
                        source={{ uri: meal.strMealThumb }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    )
                )}

                <TouchableOpacity
                    onPress={() => router.push("/screens/search")}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Buscar Receitas</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        backgroundColor: "#EDE0D4",
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "#EDE0D4",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#eee",
        textShadowColor: "#000000",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 20,
        color: "#555",
        marginBottom: 40,
        textAlign: "center",
    },
    image: {
        width: "50%",
        aspectRatio: 1/1,
        borderRadius: 12,
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#E63946",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
})