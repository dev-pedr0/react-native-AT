import axios from "axios";
import { Meal } from "../types/Recipe";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(query: string): Promise<Meal[]> {
  const url = `${API_BASE}/search.php?s=${query}`;

  const response = await axios.get(url);

  return response.data.meals || [];
}

export async function getMealDetails(id: string): Promise<Meal | null> {
  const url = `${API_BASE}/lookup.php?i=${id}`;
  const response = await axios.get(url);
  return response.data.meals?.[0] || null;
}

export async function getCategories(): Promise<string[]> {
  const url = `${API_BASE}/categories.php`;
  const response = await axios.get(url);
  return response.data.categories.map((c: any) => c.strCategory);
}

export async function filterByCategory(category: string): Promise<Meal[]> {
  const url = `${API_BASE}/filter.php?c=${category}`;
  const response = await axios.get(url);
  return response.data.meals || [];
}

export async function getRandomMeal(): Promise<Meal | null> {
  const url = `${API_BASE}/random.php`;
  const response = await axios.get(url);
  return response.data.meals?.[0] || null;
}