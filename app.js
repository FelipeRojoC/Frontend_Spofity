import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./app/screens/HomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    // El NavigationContainer envuelve toda tu app
    <NavigationContainer>
      {/* Stack.Navigator maneja el grupo de pantallas.
        El "initialRouteName" define cuál se muestra primero.
      */}
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false, // Oculta la barra de título superior
        }}
      >
        {/* Define cada pantalla y qué componente usa */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
