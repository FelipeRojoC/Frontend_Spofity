// app/editprofile.tsx

import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

// Color palette
const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  gradientStart: '#4C63E9',
  gradientEnd: '#9747FF',
  logoBg: '#444444',
  surface: '#F7F7FA',
  surfaceDark: '#121212',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
};

interface ProfileData {
  name: string;
  alias: string;
  bio: string;
  email: string;
  birthDate: string;
  country: string;
  gender: string;
  photo?: string;
}

export default function EditProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Ingresa tu nombre',
    alias: 'Ingresa tu usuario',
    bio: 'Ingresa una breve biografía',
    email: 'spofity@example.com',
    birthDate: 'XX/XX/XX',
    country: 'Ingresa tu país',
    gender: 'Ingresa tu género',
    photo: undefined,
  });

  const [isSaving, setIsSaving] = useState(false);
  const saveAnim = useRef(new Animated.Value(1)).current;
  const avatarScale = useRef(new Animated.Value(1)).current;

  // Animación de respiración para el avatar
  useEffect(() => {
    const breathingAnimation = () => {
      Animated.sequence([
        Animated.timing(avatarScale, {
          toValue: 1.03,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(avatarScale, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        })
      ]).start(() => breathingAnimation());
    };

    breathingAnimation();
  }, [avatarScale]);

  const handlePhotoUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileData({ ...profileData, photo: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    
    Animated.sequence([
      Animated.spring(saveAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(saveAnim, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();

    // Simulamos un guardado
    setTimeout(() => {
      setIsSaving(false);
      console.log('Perfil guardado:', profileData);
    }, 1500);
  };

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <Text style={styles.headerSubtitle}>Personaliza tu información</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: avatarScale }] }]}>
            {profileData.photo ? (
              <Image
                source={{ uri: profileData.photo }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>X</Text>
              </View>
            )}
          </Animated.View>

          <Pressable
            style={({ pressed }) => [
              styles.uploadButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={handlePhotoUpload}
          >
            <Text style={styles.uploadButtonText}>Cambiar Foto</Text>
          </Pressable>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={profileData.name}
              onChangeText={(text) => setProfileData({ ...profileData, name: text })}
            />
          </View>

          {/* Alias/Username */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Alias / Usuario</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={profileData.alias}
              onChangeText={(text) => setProfileData({ ...profileData, alias: text })}
            />
          </View>

          {/* Bio */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Biografía</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={profileData.bio}
              onChangeText={(text) => setProfileData({ ...profileData, bio: text.slice(0, 150) })}
              multiline
              maxLength={150}
            />
            <Text style={styles.charCount}>{profileData.bio.length}/150</Text>
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={profileData.email}
              onChangeText={(text) => setProfileData({ ...profileData, email: text })}
              keyboardType="email-address"
            />
          </View>

          {/* Birth Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={profileData.birthDate}
              onChangeText={(text) => setProfileData({ ...profileData, birthDate: text })}
            />
          </View>

          {/* Gender */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Género</Text>
            <View style={styles.selectRow}>
              {['Masculino', 'Femenino', 'Otro'].map((option) => (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.selectOption,
                    profileData.gender === option && styles.selectOptionActive,
                    { opacity: pressed ? 0.8 : 1 }
                  ]}
                  onPress={() => setProfileData({ ...profileData, gender: option })}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      profileData.gender === option && styles.selectOptionTextActive
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Country */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>País</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={profileData.country}
              onChangeText={(text) => setProfileData({ ...profileData, country: text })}
            />
          </View>

          {/* Save Button */}
          <Animated.View style={{ transform: [{ scale: saveAnim }] }}>
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                { opacity: pressed || isSaving ? 0.85 : 1 }
              ]}
              onPress={handleSaveProfile}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Cancel Button */}
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 84,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 32,
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.logoBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.white,
  },
  uploadButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  formSection: {
    marginTop: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'right',
  },
  selectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  selectOptionActive: {
    borderColor: COLORS.white,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  selectOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  selectOptionTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  saveButton: {
    width: '100%',
    height: 54,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: COLORS.gradientStart,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    width: '100%',
    height: 48,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
