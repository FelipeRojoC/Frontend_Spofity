// app/index.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text } from 'react-native';
import BrandLogo from '../components/brand-logo';

// Define el componente de la pantalla de bienvenida.
export default function WelcomeScreen() {
  const [isReady, setIsReady] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <LinearGradient
      colors={['#4C63E9', '#9747FF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Link href={'/login' as unknown as any} asChild>
        <Pressable
          onPressIn={() => {
            Animated.spring(scaleAnim, {
              toValue: 0.95,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }}
        >
          <Animated.View style={[
            styles.clickArea,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <BrandLogo size={100} circleSize={180} />
            <Text style={styles.title}>Spofity</Text>
          </Animated.View>
        </Pressable>
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