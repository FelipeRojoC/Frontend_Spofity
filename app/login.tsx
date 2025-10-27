// app/login.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Define el componente de la pantalla de login.
export default function LoginScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={['#4C63E9', '#9747FF']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Image
            source={require('../assets/images/react-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Username input */}
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          placeholder="Introduce tu usuario"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.input}
        />

        {/* Primary button */}
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>

        {/* Small center dot */}
        <Text style={styles.centerDot}>•</Text>

        {/* Alternative methods */}
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.8}>
          <Text style={styles.outlineButtonText}>Continuar con email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.8}>
          <Text style={styles.outlineButtonText}>Continuar con telefono</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.8}>
          <Text style={styles.outlineButtonText}>Continuar con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.8}>
          <Text style={styles.outlineButtonText}>Continuar con Apple</Text>
        </TouchableOpacity>

        {/* Register link */}
        <View style={styles.registerWrap}>
          <Text style={styles.noAccount}>¿No tienes cuenta?</Text>
          <Link href={'/register' as unknown as any} style={styles.registerLink}>
            Regístrate
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
  text: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 72,
    height: 72,
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
    marginBottom: 16,
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
  link: {
    color: '#1DB954',
    fontSize: 18,
    margin: 10,
  }
  ,
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
  }
});