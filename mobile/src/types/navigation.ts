import type { NavigatorScreenParams } from "@react-navigation/native";
import type { Recommendation } from "./account";

export type TabParamList = {
  Home: undefined;
  Catalog: undefined;
  Pantry: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  DishDetail: { dishId: number; name?: string; recommendation?: Recommendation };
  History: undefined;
  Scanner: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
