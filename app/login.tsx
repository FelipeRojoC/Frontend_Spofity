// app/login.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    LogBox,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import BrandLogo from '../components/brand-logo';
import OutlineButton from '../components/ui/OutlineButton';
import PrimaryButton from '../components/ui/PrimaryButton';
import ValidatedInput from '../components/ui/ValidatedInput';

// Ignorar warnings de errores en desarrollo
LogBox.ignoreAllLogs(true);

// Configuración de API
const getApiUrl = () => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return 'http://192.168.59.157:3000';
  }
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiUrl();

// Define el componente de la pantalla de login.
export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'username' | 'email' | 'phone'>('username');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados de validación
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  
  // Errores del backend
  const [backendError, setBackendError] = useState<string>('');

  function toggleToEmail() {
    setMode('email');
  }

  function toggleToPhone() {
    setMode('phone');
  }

  function toggleToUsername() {
    setMode('username');
  }

  async function handleLogin() {
    setAttemptedSubmit(true);
    setBackendError(''); // Limpiar errores previos del backend
    
    // Validar según el modo actual
    let isValid = false;
    
    if (mode === 'username') {
      isValid = isUsernameValid && isPasswordValid && username.trim().length > 0;
    } else if (mode === 'email') {
      isValid = isEmailValid && isPasswordValid && email.trim().length > 0;
    } else {
      isValid = isPhoneValid && isPasswordValid && telefono.trim().length > 0;
    }
    
    if (!isPasswordValid || contrasenia.trim().length === 0) {
      isValid = false;
    }
    
    // Si no es válido, no continuar (los inputs mostrarán errores automáticamente)
    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let requestBody: any = { contrasenia };

      if (mode === 'username') {
        endpoint = `${API_BASE_URL}/api/auth/login/alias`;
        requestBody.alias = username;
      } else if (mode === 'email') {
        endpoint = `${API_BASE_URL}/api/auth/login/email`;
        requestBody.correo = email;
      } else {
        endpoint = `${API_BASE_URL}/api/auth/login/phone`;
        requestBody.telefono = telefono;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      let data;
      try {
        data = await response.json();
        console.log('Respuesta del backend (login):', data);
      } catch (parseError) {
        const textResponse = await response.text();
        console.log('Respuesta del backend (texto):', textResponse);
        data = { message: textResponse || 'Error desconocido' };
      }

      if (response.ok) {
        // Guardar token si el backend lo devuelve
        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token);
        }
        
        // Navegar al home
        router.replace('/(tabs)/home');
      } else {
        // Verificar si la cuenta no está verificada
        if (response.status === 403 || data.message?.toLowerCase().includes('no verificad') || data.message?.toLowerCase().includes('verificación')) {
          // Redirigir a la pantalla de verificación con los parámetros correctos
          let verificationType: string;
          let contact: string;
          
          if (mode === 'email') {
            verificationType = 'email';
            contact = email;
          } else if (mode === 'phone') {
            verificationType = 'phone';
            contact = telefono;
          } else {
            verificationType = 'alias';
            contact = username;
          }
          
          router.push(`/verification?type=${verificationType}&contact=${encodeURIComponent(contact)}`);
          return;
        }
        
        // Capturar errores del backend y mostrarlos visualmente
        if (data.errors && Array.isArray(data.errors)) {
          // Errores de validación por campo
          const errorMessages = data.errors.map((err: any) => {
            const fieldName = err.field === 'contrasenia' ? 'Contraseña' : err.field;
            return `${fieldName}: ${err.message}`;
          }).join('\n');
          setBackendError(errorMessages);
        } else if (data.message) {
          setBackendError(data.message);
        } else if (data.error) {
          setBackendError(data.error);
        } else {
          setBackendError('Error al iniciar sesión. Verifica tus credenciales.');
        }
      }
    } catch (error) {
      setBackendError('Error de conexión. Asegúrate de que el servidor esté disponible.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={['#4C63E9', '#9747FF']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Logo */}
        <BrandLogo size={72} circleSize={120} />

        {/* Inputs dinámicos según modo */}
        {mode === 'username' ? (
          <ValidatedInput
            label="Nombre de usuario"
            placeholder="Introduce tu usuario"
            value={username}
            onChangeText={setUsername}
            forceShowError={attemptedSubmit}
            validationRules={[
              {
                test: (value) => value.trim().length > 0,
                message: "El nombre de usuario es requerido"
              },
              {
                test: (value) => value.length >= 3,
                message: "Debe tener al menos 3 caracteres"
              }
            ]}
            onValidationChange={setIsUsernameValid}
          />
        ) : mode === 'email' ? (
          <ValidatedInput
            label="Dirección de email"
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            forceShowError={attemptedSubmit}
            validationRules={[
              {
                test: (value) => value.trim().length > 0,
                message: "El email es requerido"
              },
              {
                test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Formato de email inválido'
              }
            ]}
            onValidationChange={setIsEmailValid}
          />
        ) : (
          <ValidatedInput
            label="Número de teléfono"
            placeholder="+56912345678"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
            forceShowError={attemptedSubmit}
            validationRules={[
              {
                test: (value) => value.trim().length > 0,
                message: "El teléfono es requerido"
              },
              {
                test: (value) => /^\+56\d{9}$/.test(value),
                message: 'Formato: +56912345678 (sin espacios)'
              }
            ]}
            onValidationChange={setIsPhoneValid}
          />
        )}

        {/* Contraseña (común a todos los modos) */}
        <ValidatedInput
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          autoCapitalize="none"
          value={contrasenia}
          onChangeText={setContrasenia}
          forceShowError={attemptedSubmit}
          validationRules={[
            {
              test: (value) => value.trim().length > 0,
              message: "La contraseña es requerida"
            },
            {
              test: (value) => value.length >= 6,
              message: 'Mínimo 6 caracteres'
            }
          ]}
          onValidationChange={setIsPasswordValid}
        />

        {/* Botón de login */}
        <PrimaryButton 
          title={loading ? "Iniciando sesión..." : "Continuar"} 
          onPress={handleLogin}
        />

        {/* Mensaje de error del backend */}
        {backendError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {backendError}</Text>
          </View>
        )}

        {/* Botones para cambiar de modo */}
        {mode !== 'email' && (
          <OutlineButton 
            title="Continuar con email" 
            onPress={toggleToEmail}
          />
        )}
        {mode !== 'phone' && (
          <OutlineButton 
            title="Continuar con teléfono" 
            onPress={toggleToPhone}
          />
        )}
        {mode !== 'username' && (
          <OutlineButton 
            title="Continuar con nombre de usuario" 
            onPress={toggleToUsername}
          />
        )}

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
  },
  errorContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '600',
  }
});