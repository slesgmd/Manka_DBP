import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import OfflineBanner from "./src/components/OfflineBanner";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
          <StatusBar style="dark" />
          <AppNavigator />
          <OfflineBanner />
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
