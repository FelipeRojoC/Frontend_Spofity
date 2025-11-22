import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Animated,
    Image,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Componente para los filtros superiores (Todas, Música, Podcast)
function FilterTabs() {
  return (
    <View style={styles.filterContainer}>
      <Pressable style={[styles.filterTab, styles.filterTabActive]}>
        <Text style={styles.filterTextActive}>Todas</Text>
      </Pressable>
      <Pressable style={styles.filterTab}>
        <Text style={styles.filterText}>Música</Text>
      </Pressable>
      <Pressable style={styles.filterTab}>
        <Text style={styles.filterText}>Podcast</Text>
      </Pressable>
    </View>
  );
}

// Componente para las tarjetas recientes (rectangulares)
function RecentCard() {
  const [pressed, setPressed] = React.useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={styles.recentCard}>
        <View style={styles.recentThumbnail} />
        <View style={styles.recentInfo}>
          <Text style={styles.recentTitle}>Título de la canción</Text>
          <Text style={styles.recentSubtitle}>Artista • Álbum</Text>
        </View>
      </View>
    </Pressable>
  );
}

// Componente para las tarjetas cuadradas (sugerencias y nuevos lanzamientos)
function SquareCard() {
  return (
    <Pressable
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={styles.squareCard}>
        <View style={styles.squareThumbnail} />
        <Text style={styles.squareTitle}>Título</Text>
        <Text style={styles.squareSubtitle}>Artista</Text>
      </View>
    </Pressable>
  );
}

// Componente para una sección con título
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
}

interface TokenData {
  alias?: string | null;
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
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(-300)).current;
  const [userAlias, setUserAlias] = React.useState<string>('Usuario');
  const [profileImage, setProfileImage] = React.useState<string | null>(null);

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const userData = decodeJwt(token);
          if (userData) {
            setUserAlias(userData.alias || 'Usuario');
            setProfileImage(userData.fotoPerfil || null);
          }
        }
      } catch (error) {
        console.log('Error al cargar datos del usuario:', error);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Eliminar el token de AsyncStorage
      await AsyncStorage.removeItem('userToken');
      console.log('Token eliminado, sesión cerrada');
      
      // Cerrar el menú
      closeMenu();
      
      // Redirigir al login
      router.replace('/login');
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#4C63E9', '#9747FF']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Botón de perfil y Filtros */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={openMenu}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person" size={24} color="#fff" />
              )}
            </TouchableOpacity>
            
            <FilterTabs />
          </View>

          {/* Sección Recientes */}
          <Section title="Recientes">
            <View style={styles.recentList}>
              <RecentCard />
              <RecentCard />
              <RecentCard />
              <RecentCard />
              <RecentCard />
              <RecentCard />
            </View>
          </Section>

          {/* Sección Sugerencias para hoy */}
          <Section title="Sugerencias para hoy">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.rowContainer}>
                <SquareCard />
                <SquareCard />
                <SquareCard />
              </View>
            </ScrollView>
          </Section>

          {/* Sección Nuevos lanzamientos */}
          <Section title="Nuevos lanzamientos">
            <View style={styles.gridContainer}>
              <SquareCard />
              <SquareCard />
              <SquareCard />
              <SquareCard />
              <SquareCard />
              <SquareCard />
            </View>
          </Section>
        </LinearGradient>
      </ScrollView>

      {/* Menú lateral */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={closeMenu}
        >
          <Animated.View 
            style={[
              styles.menuContainer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
              <View style={styles.menuHeader}>
                <View style={styles.menuProfileContainer}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.menuProfileImage} />
                  ) : (
                    <View style={styles.menuProfilePlaceholder}>
                      <Ionicons name="person" size={40} color="#fff" />
                    </View>
                  )}
                  <Text style={styles.menuUserName}>{userAlias}</Text>
                </View>
              </View>

              <View style={styles.menuOptions}>
                <TouchableOpacity style={styles.menuOption} onPress={() => { closeMenu(); router.push('/account' as any); }}>
                  <Ionicons name="person-outline" size={24} color="#fff" />
                  <Text style={styles.menuOptionText}>Mi Cuenta</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuOption}>
                  <Ionicons name="card-outline" size={24} color="#fff" />
                  <Text style={styles.menuOptionText}>Mi Plan</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuOption}>
                  <Ionicons name="settings-outline" size={24} color="#fff" />
                  <Text style={styles.menuOptionText}>Configuración</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.menuFooter}>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuOption} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
                  <Text style={[styles.menuOptionText, styles.logoutText]}>Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C63E9',
  },
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 36,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  filterContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 4,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionContent: {
    marginHorizontal: -8,
  },
  recentList: {
    gap: 12,
  },
  recentCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    height: 72,
  },
  recentThumbnail: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  recentInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  recentTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 8,
  },
  squareCard: {
    width: 150,
  },
  squareThumbnail: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  squareTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  squareSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '60%',
    backgroundColor: '#2E3A59',
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 24) + 36,
  },
  menuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuProfileContainer: {
    alignItems: 'center',
  },
  menuProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  menuProfilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuUserName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  menuOptions: {
    paddingTop: 20,
    flex: 1,
  },
  menuFooter: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 12,
    marginHorizontal: 20,
  },
  logoutText: {
    color: '#FF6B6B',
  },
});