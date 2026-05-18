import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { OptionDetailScreen } from "./src/screens/OptionDetailScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ResultsScreen } from "./src/screens/ResultsScreen";
import { RootStackParamList } from "./src/navigation/types";
import { colors } from "./src/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTitleStyle: { color: colors.text, fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "DropPoint" }} />
        <Stack.Screen name="Results" component={ResultsScreen} options={{ title: "Puntos sugeridos" }} />
        <Stack.Screen name="OptionDetail" component={OptionDetailScreen} options={{ title: "Detalle" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
