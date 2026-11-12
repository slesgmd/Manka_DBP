import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CatalogScreen from "../screens/CatalogScreen";
import DishDetailScreen from "../screens/DishDetailScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HomeScreen from "../screens/HomeScreen";
import LoadingScreen from "../screens/LoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import PantryScreen from "../screens/PantryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { useAuth } from "../hooks/useAuth";
import type { RootStackParamList, TabParamList } from "../types/navigation";
import type { IconName } from "../types/ui";
import { colors } from "../utils/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, [IconName, IconName]> = {
  Home: ["home", "home-outline"],
  Catalog: ["book", "book-outline"],
  Pantry: ["basket", "basket-outline"],
  Favorites: ["heart", "heart-outline"],
  Profile: ["person", "person-outline"],
};

const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.base, primary: colors.ink, text: colors.ink },
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.ink2,
        tabBarStyle: { backgroundColor: colors.dense, borderTopColor: colors.rim, borderTopWidth: 1.5 },
        tabBarLabelStyle: { fontSize: 11 },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={TAB_ICONS[route.name][focused ? 0 : 1]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ title: "Catálogo" }} />
      <Tab.Screen name="Pantry" component={PantryScreen} options={{ title: "Despensa" }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: "Favoritos" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerTintColor: colors.ink,
          headerStyle: { backgroundColor: colors.base },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen
              name="DishDetail"
              component={DishDetailScreen}
              options={({ route }) => ({ headerShown: true, title: route.params.name ?? "Plato" })}
            />
            <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: true, title: "Historial" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
