// app/register.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandLogo from '../components/brand-logo';
import OutlineButton from '../components/ui/OutlineButton';
import PrimaryButton from '../components/ui/PrimaryButton';
import ValidatedInput from '../components/ui/ValidatedInput';

// Ignorar warnings de errores en desarrollo
LogBox.ignoreAllLogs(true);

// Configuración de API - Cambia esto según tu entorno
const getApiUrl = () => {
  // Para dispositivo físico con Expo Go, usa la IP de tu computadora
  // Tu computadora está en: 192.168.59.157
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return 'http://192.168.59.157:3000';
  }
  
  // Para web o desarrollo local
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiUrl();

// Define el componente de la pantalla de registro.
export default function RegisterScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados de validación
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  
  // Errores del backend
  const [backendError, setBackendError] = useState<string>('');

  function toggleMode() {
    setMode((m) => (m === 'email' ? 'phone' : 'email'));
  }

  async function handleRegister() {
    setAttemptedSubmit(true);
    setBackendError(''); // Limpiar errores previos
    
    // Validar que las contraseñas coincidan
    if (contrasenia !== confirmarContrasenia) {
      setBackendError('Las contraseñas no coinciden');
      return;
    }
    
    // Validar según el modo
    let isValid = isNameValid && isPasswordValid && alias.trim().length > 0 && contrasenia.trim().length > 0;
    
    if (mode === 'email') {
      isValid = isValid && isEmailValid && email.trim().length > 0;
    } else {
      isValid = isValid && isPhoneValid && telefono.trim().length > 0;
    }
    
    // Si no es válido, no continuar (los inputs mostrarán errores automáticamente)
    if (!isValid) {
      return;
    }

    setLoading(true);
    
    try {
      let requestBody;
      let apiUrl;
      
      if (mode === 'email') {
        // Modo email
        requestBody = {
          alias: alias,
          correo: email,
          contrasenia: confirmarContrasenia,
        };
        apiUrl = `${API_BASE_URL}/api/auth/register/email`;
      } else {
        // Modo teléfono
        requestBody = {
          alias: alias,
          telefono: telefono,
          contrasenia: confirmarContrasenia,
        };
        apiUrl = `${API_BASE_URL}/api/auth/register/phone`;
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Intentar parsear la respuesta como JSON
      let data;
      try {
        data = await response.json();
        console.log('Respuesta del backend (registro):', data);
      } catch (parseError) {
        const textResponse = await response.text();
        console.log('Respuesta del backend (texto):', textResponse);
        data = { message: textResponse || 'Error desconocido' };
      }

      if (response.ok) {
        // Guardar token si el backend lo devuelve
        // if (data.token) {
        //   await AsyncStorage.setItem('userToken', data.token);
        // }
        
        // Siempre redirigir a verificación después de un registro exitoso
        const verificationType = mode === 'email' ? 'email' : 'phone';
        const contact = mode === 'email' ? email : telefono;
        router.push(`/verification?type=${verificationType}&contact=${encodeURIComponent(contact)}`);
        return;
      } else {
        // Verificar si se requiere verificación de cuenta
        if (response.status === 403 || data.message?.toLowerCase().includes('verificación') || data.requiresVerification) {
          const verificationType = mode === 'email' ? 'email' : 'phone';
          const contact = mode === 'email' ? email : telefono;
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
          setBackendError('Error al registrar. Verifica los datos ingresados.');
        }
      }
    } catch (error) {
      setBackendError('Error de conexión. Asegúrate de que el servidor esté disponible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4C63E9' }} edges={['top']}>
      <LinearGradient
      colors={['#4C63E9', '#9747FF']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      >
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        >
        <View style={styles.container}>
          {/* Logo arriba */}
          <BrandLogo size={72} circleSize={120} />

          {/* Large title (multi-line) */}
          <Text style={styles.title}>Regístrate{`\n`}para empezar{`\n`}a escuchar{`\n`}contenido</Text>

          {/* Nombre de usuario */}
          <ValidatedInput
            label="Nombre de usuario"
            placeholder="Tu nombre de usuario"
            autoCapitalize="words"
            value={alias}
            onChangeText={setAlias}
            forceShowError={attemptedSubmit}
            validationRules={[
              {
                test: (value) => value.trim().length > 0,
                message: 'El nombre de usuario es requerido'
              },
              {
                test: (value) => value.length >= 1 && value.length <= 80,
                message: 'Debe tener entre 1 y 80 caracteres'
              }
            ]}
            onValidationChange={setIsNameValid}
          />

          {/* Inputs dinámicos según modo */}
          {mode === 'email' ? (
          <ValidatedInput
            label="Dirección de email"
            placeholder="correo@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            forceShowError={attemptedSubmit}
            validationRules={[
            {
              test: (value) => value.trim().length > 0,
              message: 'El email es requerido'
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
              message: 'El teléfono es requerido'
            },
            {
              test: (value) => /^\+56\d{9}$/.test(value),
              message: 'Formato: +56912345678 (sin espacios)'
            }
            ]}
            onValidationChange={setIsPhoneValid}
          />
          )}

          {/* Contraseña (común a ambos modos) */}
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
            message: 'La contraseña es requerida'
            },
            {
            test: (value) => value.length >= 8 && value.length <= 15,
            message: 'Debe tener entre 8 y 15 caracteres'
            },
            {
            test: (value) => /[A-Z]/.test(value),
            message: 'Debe incluir al menos una mayúscula'
            },
            {
            test: (value) => /[a-z]/.test(value),
            message: 'Debe incluir al menos una minúscula'
            },
            {
            test: (value) => /[0-9]/.test(value),
            message: 'Debe incluir al menos un número'
            },
            {
            test: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
            message: 'Debe incluir al menos un símbolo'
            }
          ]}
          onValidationChange={setIsPasswordValid}
          />

          {/* Confirmar contraseña */}
          <ValidatedInput
          label="Confirmar contraseña"
          placeholder="Confirma tu contraseña"
          secureTextEntry
          autoCapitalize="none"
          value={confirmarContrasenia}
          onChangeText={setConfirmarContrasenia}
          forceShowError={attemptedSubmit}
          validationRules={[
            {
            test: (value) => value.length === 0 || value === contrasenia,
            message: 'Las contraseñas no coinciden'
            }
          ]}
          onValidationChange={(isValid) => {
            setIsConfirmPasswordValid(isValid && confirmarContrasenia === contrasenia);
          }}
          />

          {/* Botón de registro */}
          <PrimaryButton 
          title={loading ? "Registrando..." : "Registrarse"} 
          onPress={handleRegister}
          />

          {/* Mensaje de error del backend */}
          {backendError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {backendError}</Text>
          </View>
          )}

          {/* Toggle modo registro */}
          <OutlineButton
          title={mode === 'email' ? 'Registrarse con número de teléfono' : 'Registrarse con email'}
          onPress={toggleMode}
          />

          {/* Link to login */}
          <View style={styles.registerWrap}>
          <Text style={styles.noAccount}>¿Ya tienes una cuenta?</Text>
          <Link href={'/login' as unknown as any} style={styles.registerLink}>
            Inicia Sesión
          </Link>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Define los estilos.
const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    paddingTop: 20,
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
    marginBottom: 40,
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