// app/change-password.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import ValidatedInput from '../components/ui/ValidatedInput';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [attempted, setAttempted] = useState(false);

  const validNew = newPassword.length >= 6;
  const validConfirm = confirmPassword === newPassword && confirmPassword.length >= 6;
  const validCurrent = currentPassword.length > 0;

  const handleSubmit = () => {
    setAttempted(true);
    if (!validCurrent || !validNew || !validConfirm) {
      return;
    }
    // Placeholder: Aquí iría llamada al backend para cambiar contraseña
    Alert.alert('Contraseña', 'Funcionalidad de cambio de contraseña pendiente de integración con backend.');
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Cambiar contraseña', headerShown: false }} />
      <LinearGradient
        colors={['#4C63E9', '#9747FF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Cambiar contraseña</Text>
          <Text style={styles.subtitle}>Ingresa los datos para actualizar tu contraseña.</Text>

          <ValidatedInput
            label="Contraseña actual"
            placeholder="********"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            forceShowError={attempted}
            validationRules={[{ test: (v)=> v.length>0, message: 'Requerida' }]}
          />

          <ValidatedInput
            label="Nueva contraseña"
            placeholder="********"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            forceShowError={attempted}
            validationRules={[{ test: (v)=> v.length>=6, message: 'Mínimo 6 caracteres' }]}
          />

          <ValidatedInput
            label="Confirmar nueva"
            placeholder="********"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            forceShowError={attempted}
            validationRules={[{ test: (v)=> v===newPassword && v.length>=6, message: 'No coincide' }]}
          />

          <PrimaryButton title="Guardar" onPress={handleSubmit} style={{ marginTop: 24 }} />
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 60,
    paddingHorizontal: 20,
    minHeight: '100%',
  },
  scroll: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 24,
  },
});
