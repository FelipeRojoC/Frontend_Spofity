import { StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Bienvenida (Welcome)</Text>
    </View>
  );
}

// Estilos básicos para que se vea centrado
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Un fondo oscuro
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
