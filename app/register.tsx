// app/register.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BrandLogo from '../components/brand-logo';
import OutlineButton from '../components/ui/OutlineButton';
import PrimaryButton from '../components/ui/PrimaryButton';

// Define el componente de la pantalla de registro.
export default function RegisterScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={['#4C63E9', '#9747FF']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Logo arriba */}
        <BrandLogo size={72} circleSize={120} />

        {/* Large title (multi-line) */}
        <Text style={styles.title}>Regístrate{`\n`}para empezar{`\n`}a escuchar{`\n`}contenido</Text>

        {/* Inputs */}
        <Text style={styles.label}>Dirección de email</Text>
        <TextInput
          placeholder="correo@ejemplo.com"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Usar numero de teléfono</Text>
        <TextInput
          placeholder="+569 7672 8541"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.input}
          keyboardType="phone-pad"
        />

        {/* Primary button */}
        <PrimaryButton title="Siguiente" />

        {/* Small center dot */}
        <Text style={styles.centerDot}>•</Text>

        {/* Alternative signup methods */}
        <OutlineButton title="Registrarse con Google" />
        <OutlineButton title="Registrarse con Apple" />

        {/* Link to login */}
        <View style={styles.registerWrap}>
          <Text style={styles.noAccount}>¿Ya tienes una cuenta?</Text>
          <Link href={'/login' as unknown as any} style={styles.registerLink}>
            Inicia Sesión
          </Link>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

// Define los estilos.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 84,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 72,
    height: 72,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 38,
  },
  label: {
    alignSelf: 'flex-start',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    color: '#fff',
    marginBottom: 12,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  centerDot: {
    color: 'rgba(255,255,255,0.7)',
    marginVertical: 8,
    fontSize: 18,
  },
  outlineButton: {
    width: '100%',
    height: 46,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  outlineButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  registerWrap: {
    marginTop: 18,
    alignItems: 'center',
  },
  noAccount: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  },
  registerLink: {
    color: '#fff',
    fontWeight: '700',
  },
});