// app/account.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';

interface TokenData {
  id?: number;
  alias?: string | null;
  nombre?: string | null;
  correo?: string | null;
  telefono?: string | null;
  fotoPerfil?: string | null;
}

function decodeJwt(token: string): TokenData | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const pad = payload.length % 4;
    const base64 = pad ? payload + '='.repeat(4 - pad) : payload;
    // Usar Buffer para decodificar base64
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

export default function AccountScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TokenData | null>(null);
  const [tokenRaw, setTokenRaw] = useState<string | null>(null);
  
  // Estados para modo edición
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<TokenData>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        console.log('Token recuperado:', storedToken);
        setTokenRaw(storedToken);
        if (storedToken) {
          const payload = decodeJwt(storedToken);
          console.log('Payload decodificado:', payload);
          setData(payload);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayOrFallback = (value?: string | null) => {
    if (!value || value.trim().length === 0) return 'No proporcionado';
    return value;
  };

  const enterEditMode = () => {
    setEditedData({
      alias: data?.alias || '',
      nombre: data?.nombre || '',
      correo: data?.correo || '',
      telefono: data?.telefono || '',
      fotoPerfil: data?.fotoPerfil || ''
    });
    setIsEditMode(true);
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditedData({});
  };

  const saveChanges = async () => {
    if (!tokenRaw) {
      console.log('No hay token disponible');
      return;
    }

    try {
      // Comparar datos originales con editados para enviar solo los cambios
      const changedFields: Partial<TokenData> = {};
      
      if (editedData.alias !== data?.alias) changedFields.alias = editedData.alias;
      if (editedData.nombre !== data?.nombre) changedFields.nombre = editedData.nombre;
      if (editedData.correo !== data?.correo) changedFields.correo = editedData.correo;
      if (editedData.telefono !== data?.telefono) changedFields.telefono = editedData.telefono;
      if (editedData.fotoPerfil !== data?.fotoPerfil) changedFields.fotoPerfil = editedData.fotoPerfil;

      // Si no hay cambios, solo salir del modo edición
      if (Object.keys(changedFields).length === 0) {
        console.log('No hay cambios para guardar');
        setIsEditMode(false);
        return;
      }

      console.log('Enviando cambios al backend:', changedFields);

      const apiUrl = Platform.OS === 'android' 
        ? 'http://192.168.59.157:3000/api/users/update-profile'
        : 'http://localhost:3000/api/users/update-profile';

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenRaw}`
        },
        body: JSON.stringify(changedFields)
      });

      console.log('Status de respuesta:', response.status);
      console.log('Headers de respuesta:', response.headers);

      // Obtener el texto de la respuesta primero
      const responseText = await response.text();
      console.log('Respuesta en texto:', responseText);

      // Intentar parsear como JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Respuesta del backend (update-profile):', responseData);
      } catch (e) {
        console.log('La respuesta no es JSON válido. Respuesta completa:', responseText);
        return;
      }

      if (response.ok) {
        // Actualizar datos locales con los cambios guardados
        setData(editedData);
        setIsEditMode(false);
        console.log('Perfil actualizado exitosamente');
      } else {
        console.log('Error al actualizar perfil:', responseData.message || 'Error desconocido');
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.log('Error de red al actualizar perfil:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const updateField = (field: keyof TokenData, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Mi Cuenta', headerShown: false }} />
      <LinearGradient
        colors={['#4C63E9', '#9747FF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Información de la Cuenta</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>
          {loading ? (
            <ActivityIndicator color="#fff" size="large" style={{ marginTop: 40 }} />
          ) : !tokenRaw ? (
            <Text style={styles.error}>No se encontró un token de sesión.</Text>
          ) : (
            <View style={styles.card}>
              <View style={styles.avatarWrapper}>
                {data?.fotoPerfil ? (
                  <Image source={{ uri: data.fotoPerfil }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={48} color="#fff" />
                  </View>
                )}
                
                {isEditMode && (
                  <TouchableOpacity style={styles.editPhotoButton} onPress={() => console.log('Editar foto de perfil')}>
                    <Ionicons name="pencil" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
                
                {!isEditMode && (
                  <TouchableOpacity style={styles.editAccountButton} onPress={enterEditMode}>
                    <Text style={styles.editAccountButtonText}>Editar Cuenta</Text>
                  </TouchableOpacity>
                )}
              </View>

              {isEditMode ? (
                <>
                  {/* Modo Edición */}
                  <View style={styles.editGroup}>
                    <Text style={styles.label}>ALIAS</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editedData.alias || ''}
                      onChangeText={(text) => updateField('alias', text)}
                      placeholder="Alias"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                  </View>

                  <View style={styles.editGroup}>
                    <Text style={styles.label}>NOMBRE</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editedData.nombre || ''}
                      onChangeText={(text) => updateField('nombre', text)}
                      placeholder="Nombre completo"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                  </View>

                  <View style={styles.editGroup}>
                    <Text style={styles.label}>CORREO</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editedData.correo || ''}
                      onChangeText={(text) => updateField('correo', text)}
                      placeholder="correo@ejemplo.com"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.editGroup}>
                    <Text style={styles.label}>TELÉFONO</Text>
                    <TextInput
                      style={styles.editInput}
                      value={editedData.telefono || ''}
                      onChangeText={(text) => updateField('telefono', text)}
                      placeholder="+56912345678"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.editButtonsContainer}>
                    <TouchableOpacity style={[styles.editActionButton, styles.cancelButton]} onPress={cancelEdit}>
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editActionButton, styles.saveButton]} onPress={saveChanges}>
                      <Text style={styles.saveButtonText}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  {/* Modo Vista */}
                  <View style={styles.infoGroup}>
                    <Text style={styles.label}>ALIAS</Text>
                    <Text style={styles.value}>{displayOrFallback(data?.alias)}</Text>
                  </View>
                  <View style={styles.infoGroup}>
                    <Text style={styles.label}>NOMBRE</Text>
                    <Text style={styles.value}>{displayOrFallback(data?.nombre)}</Text>
                  </View>
                  <View style={styles.infoGroup}>
                    <Text style={styles.label}>CORREO</Text>
                    <Text style={styles.value}>{displayOrFallback(data?.correo)}</Text>
                  </View>
                  <View style={styles.infoGroup}>
                    <Text style={styles.label}>TELÉFONO</Text>
                    <Text style={styles.value}>{displayOrFallback(data?.telefono)}</Text>
                  </View>
                  <PrimaryButton title="Cambiar contraseña" onPress={() => router.push('/change-password' as any)} style={{ marginTop: 24 }} />
                </>
              )}
            </View>
          )}
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
    scrollContent: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonPlaceholder: {
        width: 40,
        height: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        flex: 1,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 500,
    },
    avatarWrapper: {
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },
    avatarPlaceholder: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: -10,
        right: '32%',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4C63E9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#9747FF',
    },
    editAccountButton: {
        marginTop: 12,
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    editAccountButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    infoGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
        marginTop: 4,
    },
    error: {
        color: '#fff',
        fontSize: 16,
    },
    editGroup: {
        marginBottom: 20,
    },
    editInput: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#fff',
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    editButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    editActionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    saveButton: {
        backgroundColor: '#fff',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4C63E9',
    },
});
