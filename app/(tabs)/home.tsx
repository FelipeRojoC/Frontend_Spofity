import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Componente para los filtros superiores (Todas, Música, Podcast)
function FilterTabs({ selected, onSelect }: { selected: 'Todas' | 'Música' | 'Podcast'; onSelect: (s: 'Todas' | 'Música' | 'Podcast') => void }) {
  return (
    <View style={styles.filterContainer}>
      <Pressable
        onPress={() => onSelect('Todas')}
        style={[styles.filterTab, selected === 'Todas' && styles.filterTabActive]}
      >
        <Text style={selected === 'Todas' ? styles.filterTextActive : styles.filterText}>Todas</Text>
      </Pressable>
      <Pressable
        onPress={() => onSelect('Música')}
        style={[styles.filterTab, selected === 'Música' && styles.filterTabActive]}
      >
        <Text style={selected === 'Música' ? styles.filterTextActive : styles.filterText}>Música</Text>
      </Pressable>
      <Pressable
        onPress={() => onSelect('Podcast')}
        style={[styles.filterTab, selected === 'Podcast' && styles.filterTabActive]}
      >
        <Text style={selected === 'Podcast' ? styles.filterTextActive : styles.filterText}>Podcast</Text>
      </Pressable>
    </View>
  );
}

// Componente para las tarjetas recientes (rectangulares)
function RecentCard({ title = 'Título de la canción', subtitle = 'Artista • Álbum' }: { title?: string; subtitle?: string }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/song?title=${encodeURIComponent(title || '')}` as any)}
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.985 : 1 }] },
        { opacity: pressed ? 0.92 : 1 },
      ]}
    >
      <View style={styles.recentCard}>
        <View style={styles.recentThumbnail} />
        <View style={styles.recentInfo}>
          <Text style={styles.recentTitle}>{title || 'Sin título'}</Text>
          <Text style={styles.recentSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// Componente para las tarjetas cuadradas (sugerencias y nuevos lanzamientos)
function SquareCard({ title = 'Título', subtitle = 'Artista' }: { title?: string; subtitle?: string }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/album?name=${encodeURIComponent(title || '')}` as any)}
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.985 : 1 }] },
        { opacity: pressed ? 0.92 : 1 },
      ]}
    >
      <View style={styles.squareCard}>
        <View style={styles.squareThumbnail} />
        <Text style={styles.squareTitle}>{title}</Text>
        <Text style={styles.squareSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

function ArtistCard({ name = 'Artista' }: { name?: string }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/artist?name=${encodeURIComponent(name || '')}` as any)}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.artistCard}>
        <View style={styles.artistAvatar} />
        <Text style={styles.artistName}>{name}</Text>
      </View>
    </Pressable>
  );
}

function PodcastCard({ title = 'Podcast' }: { title?: string }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/podcast?title=${encodeURIComponent(title || '')}` as any)}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.podcastCard}>
        <View style={styles.podcastThumb} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.recentTitle}>{title}</Text>
          <Text style={styles.recentSubtitle}>Episodio • Duración</Text>
        </View>
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
  const [filter, setFilter] = useState<'Todas' | 'Música' | 'Podcast'>('Todas');
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4C63E9', '#9747FF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <FilterTabs selected={filter} onSelect={setFilter} />

        {(filter === 'Todas' || filter === 'Música') && (
          <Section title="Recientes">
            <View style={styles.recentList}>
              <RecentCard title="La canción del día" subtitle="Artista • Single" />
              <RecentCard title="Éxitos 2025" subtitle="Artista • Álbum" />
              <RecentCard title="Indie Pop" subtitle="Artista • Álbum" />
            </View>
          </Section>
        )}

        {(filter === 'Todas' || filter === 'Música') && (
          <Section title="Artistas">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.rowContainer}>
                <ArtistCard name="The Weeknd" />
                <ArtistCard name="Dua Lipa" />
                <ArtistCard name="Bad Bunny" />
                <ArtistCard name="Shakira" />
              </View>
            </ScrollView>
          </Section>
        )}

        {(filter === 'Todas' || filter === 'Música') && (
          <Section title="Álbumes">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.rowContainer}>
                <SquareCard title="Album 1" subtitle="Artista A" />
                <SquareCard title="Album 2" subtitle="Artista B" />
                <SquareCard title="Album 3" subtitle="Artista C" />
              </View>
            </ScrollView>
          </Section>
        )}

        {(filter === 'Todas' || filter === 'Podcast') && (
          <Section title="Podcasts">
            <View style={styles.recentList}>
              <PodcastCard title="Historias de la música" />
              <PodcastCard title="Charlas y playlists" />
            </View>
          </Section>
        )}
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
  /* Artist & Podcast styles */
  artistCard: {
    width: 100,
    alignItems: 'center',
    marginRight: 12,
  },
  artistAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 8,
  },
  artistName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  podcastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  podcastThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)'
  },
});