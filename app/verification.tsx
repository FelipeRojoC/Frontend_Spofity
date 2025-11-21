// app/verification.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandLogo from '../components/brand-logo';
import PrimaryButton from '../components/ui/PrimaryButton';

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

export default function VerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const verificationType = params.type as string; // 'email', 'phone' o 'alias'
  const contact = params.contact as string; // el email, teléfono o alias
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (text: string, index: number) => {
    // Solo permitir números y un solo carácter
    if (text && (!/^\d$/.test(text) || text.length > 1)) return;

    const newCode = [...code];
    newCode[index] = text.slice(-1); // Solo tomar el último carácter
    setCode(newCode);
    setError('');

    // Auto-focus al siguiente input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Retroceder al input anterior si se presiona backspace
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Ingresa el código completo de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Construir el body según el tipo de verificación
      let requestBody;
      if (verificationType === 'email') {
        requestBody = { email: contact, code: verificationCode };
      } else if (verificationType === 'phone') {
        requestBody = { telefono: contact, code: verificationCode };
      } else if (verificationType === 'alias') {
        requestBody = { alias: contact, code: verificationCode };
      } else {
        requestBody = { email: contact, code: verificationCode };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Respuesta del backend (verificación):', data);

      if (response.ok) {
        // Código verificado correctamente
        router.replace('/(tabs)/home');
      } else {
        // Error de verificación
        setError(data.message || 'Código incorrecto. Intenta nuevamente.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      // Aquí debes llamar al endpoint para reenviar el código
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setError('Código reenviado exitosamente');
      } else {
        setError('No se pudo reenviar el código');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Verificación',
          headerStyle: { backgroundColor: '#4C63E9' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#9747FF' }} edges={['bottom']}>
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
              <BrandLogo size={60} circleSize={100} />

              <Text style={styles.title}>Verificación{'\n'}de código</Text>
              <Text style={styles.subtitle}>
                Ingresa el código de 6 dígitos{'\n'}enviado a tu correo o teléfono
              </Text>

            {/* Inputs de código */}
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[
                    styles.codeInput,
                    digit ? styles.codeInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
              ))}
            </View>

            {/* Mensaje de error */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Botón de verificar */}
            <PrimaryButton 
              title={loading ? "Verificando..." : "Verificar código"} 
              onPress={handleVerify}
            />

            {/* Reenviar código */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>¿No recibiste el código?</Text>
              <Text 
                style={styles.resendLink}
                onPress={handleResendCode}
              >
                Reenviar
              </Text>
            </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    paddingTop: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
    lineHeight: 40,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    gap: 8,
  },
  codeInput: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  errorContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  resendLink: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
