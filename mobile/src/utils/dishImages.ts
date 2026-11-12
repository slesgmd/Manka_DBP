import type { ImageSourcePropType } from "react-native";
import { slugify } from "./slug";

const DISH_IMAGES: Record<string, ImageSourcePropType> = {
  "aji-de-gallina": require("../../assets/dishes/aji-de-gallina.jpg"),
  "arroz-chaufa-de-pollo": require("../../assets/dishes/arroz-chaufa-de-pollo.jpg"),
  "arroz-con-pollo": require("../../assets/dishes/arroz-con-pollo.jpg"),
  "causa-rellena": require("../../assets/dishes/causa-rellena.jpg"),
  ceviche: require("../../assets/dishes/ceviche.jpg"),
  "estofado-de-pollo": require("../../assets/dishes/estofado-de-pollo.jpg"),
  "lomo-saltado": require("../../assets/dishes/lomo-saltado.jpg"),
  "papa-a-la-huancaina": require("../../assets/dishes/papa-a-la-huancaina.jpg"),
  "seco-de-res": require("../../assets/dishes/seco-de-res.jpg"),
  "tacu-tacu": require("../../assets/dishes/tacu-tacu.jpg"),
  "tallarines-verdes": require("../../assets/dishes/tallarines-verdes.jpg"),
  "tortilla-de-verduras": require("../../assets/dishes/tortilla-de-verduras.jpg"),
};

export const dishImage = (name: string): ImageSourcePropType | undefined => DISH_IMAGES[slugify(name)];
