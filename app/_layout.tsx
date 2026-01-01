import { Stack } from 'expo-router';
import React from 'react';

export default function App() {
  return (
    <Stack>
      {/* Tela inicial */}
      <Stack.Screen
        name="screens/home"
        options={{
          title: "Aplicativo de Receitas",
          headerStyle: { backgroundColor: "#E63946" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
        }}
      />

      {/* Página principal */}
      <Stack.Screen
        name="screens/search"
        options={{
          title: "Buscar Receitas",
          headerStyle: { backgroundColor: "#E63946" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
        }}
      />

      {/* Página de detalhes */}
      <Stack.Screen
        name="screens/details"
        options={{
          title: "Detalhes da Receita",
          headerStyle: { backgroundColor: "#E63946" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
}