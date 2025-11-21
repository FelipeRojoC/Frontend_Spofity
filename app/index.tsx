// app/index.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text } from 'react-native';
import BrandLogo from '../components/brand-logo';

// Define el componente de la pantalla de bienvenida.
export default function WelcomeScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación del logo
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();

    // Navegar al login después de 2 segundos
    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient
      colors={['#4C63E9', '#9747FF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View style={[
        styles.logoContainer,
        { 
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim
        }
      ]}>
        <BrandLogo size={100} circleSize={180} />
        <Text style={styles.title}>Spofity</Text>
      </Animated.View>
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
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '800',
    marginTop: 24,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
});