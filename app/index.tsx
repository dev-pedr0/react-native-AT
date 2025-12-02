import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  // Envia a tela principal de pesquisa
  return <Redirect href="/screens/search" />;
}