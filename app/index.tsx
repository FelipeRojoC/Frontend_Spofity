// app/index.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

// Define el componente de la pantalla de bienvenida.
export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#4C63E9', '#9747FF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Link href={'/login' as unknown as any}>
        <View style={styles.clickArea}>
          <View style={styles.logoWrap}>
            <Image
              source={require('../assets/images/react-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Spofity</Text>
        </View>
          </Link>
    </LinearGradient>
  );
}// Define los estilos para esta pantalla.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickArea: {
    alignItems: 'center',
  },
  logoWrap: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '800',
    marginTop: 24,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
});