import axios from "axios";
import type { Ingredient } from "../types/catalog";
import { getIngredients } from "./ingredientService";

const openFoodFacts = axios.create({
  baseURL: "https://world.openfoodfacts.org/api/v2",
  headers: { "User-Agent": "Manka/1.0 (proyecto CS2031)" },
  timeout: 10000,
});

interface ProductResponse {
  status: number;
  product?: { product_name?: string; product_name_es?: string; generic_name?: string };
}

export class ProductNotFoundError extends Error {}

export async function getProductName(code: string) {
  try {
    const { data } = await openFoodFacts.get<ProductResponse>(`/product/${code}`, {
      params: { fields: "product_name,product_name_es,generic_name" },
    });
    const product = data.product;
    const name = (product?.product_name_es || product?.product_name || product?.generic_name)?.trim();
    if (data.status !== 1 || !name) throw new ProductNotFoundError();
    return name;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) throw new ProductNotFoundError();
    throw err;
  }
}

export function productErrorMessage(err: unknown) {
  if (err instanceof ProductNotFoundError) {
    return "No encontramos este código en Open Food Facts. Revisa los números o busca el ingrediente a mano.";
  }
  if (axios.isAxiosError(err)) {
    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") return "Open Food Facts tardó demasiado en responder. Inténtalo otra vez.";
    if (!err.response) return "Sin conexión: no pudimos consultar Open Food Facts.";
  }
  return "Open Food Facts no responde ahora. Inténtalo en un momento.";
}

const withoutAccents = (word: string) => word.normalize("NFD").replace(/\p{M}/gu, "");

export async function findIngredientMatches(productName: string) {
  const words = productName.split(/[^\p{L}]+/u).filter(word => word.length >= 3);
  const terms = new Set([productName, ...words, ...words.map(withoutAccents)].map(term => term.toLowerCase()));
  const pages = await Promise.all([...terms].map(term => getIngredients({ name: term, size: 5 })));
  const matches = new Map<number, Ingredient>();
  pages.forEach(page => page.content.forEach(ingredient => matches.set(ingredient.id, ingredient)));
  return [...matches.values()];
}
