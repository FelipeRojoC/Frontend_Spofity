// app/_layout.tsx

// Importa el componente Stack de expo-router, que permite la navegación tipo "mazo de cartas".
import { Stack } from 'expo-router';
import React from 'react';

// Define el layout (distribución) principal de la aplicación.
export default function RootLayout() {
  return (
    // Stack es el componente principal que envuelve todas las pantallas.
    <Stack>
      {/* Define la pantalla inicial (app/index.tsx). */}
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} // Oculta la barra de título superior.
      />
      {/* Define la pantalla de login (app/login.tsx). */}
      <Stack.Screen 
        name="login" 
        options={{ headerShown: false }} 
      />
      {/* Define la pantalla de registro (app/register.tsx). */}
      <Stack.Screen 
        name="register" 
        options={{ headerShown: false }} 
      />
      {/* Define la pantalla de edición de perfil (app/editprofile.tsx). */}
      <Stack.Screen 
        name="editprofile" 
        options={{ headerShown: false }} 
      />
      {/* Define la pantalla de gestión de plan (app/spofityplan.tsx). */}
      <Stack.Screen 
        name="spofityplan" 
        options={{ headerShown: false }} 
      />
      {/* Define el grupo de pantallas principal (app/(tabs)). */}
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}