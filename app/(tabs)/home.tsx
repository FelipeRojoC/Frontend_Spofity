import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
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
  return (
    <Pressable>
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
    <Pressable>
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

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4C63E9', '#9747FF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <FilterTabs />

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C63E9',
  },
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 24,
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
});