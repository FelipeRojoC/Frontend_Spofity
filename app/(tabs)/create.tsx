import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function CreateScreen() {
  const [query, setQuery] = useState('');
  const [playlistName, setPlaylistName] = useState('Nueva playlist');
  const [playlistSongs, setPlaylistSongs] = useState<{ id: string; title: string; artist: string }[]>([]);

  const sampleSongs = useMemo(
    () => [
      { id: 's1', title: 'Canción ejemplo 1', artist: 'Artista A' },
      { id: 's2', title: 'Canción ejemplo 2', artist: 'Artista B' },
      { id: 's3', title: 'Canción ejemplo 3', artist: 'Artista C' },
      { id: 's4', title: 'Canción feliz', artist: 'Artista D' },
      { id: 's5', title: 'Balada nocturna', artist: 'Artista E' },
      { id: 's6', title: 'Pop bailable', artist: 'Artista F' },
    ],
    []
  );

  const filtered = sampleSongs.filter(
    (s) => s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase())
  );

  function toggleSong(song: { id: string; title: string; artist: string }) {
    setPlaylistSongs((prev) => {
      const exists = prev.find((p) => p.id === song.id);
      if (exists) return prev.filter((p) => p.id !== song.id);
      return [...prev, song];
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crear Playlist</Text>
        <TextInput
          value={playlistName}
          onChangeText={setPlaylistName}
          style={styles.nameInput}
          placeholder="Nombre de la playlist"
          placeholderTextColor="rgba(0,0,0,0.4)"
        />
        <Text style={styles.subtitle}>{playlistSongs.length} canciones añadidas</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar canciones o artistas"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((s) => {
          const added = !!playlistSongs.find((p) => p.id === s.id);
          return (
            <View key={s.id} style={styles.songRow}>
              <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{s.title}</Text>
                <Text style={styles.songArtist}>{s.artist}</Text>
              </View>
              <Pressable
                onPress={() => toggleSong(s)}
                style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.8 : 1 }]}
              >
                <Text style={[styles.addText, added && styles.addedText]}>{added ? 'Añadido' : '+'}</Text>
              </Pressable>
            </View>
          );
        })}

        {playlistSongs.length > 0 && (
          <View style={styles.playlistPreview}>
            <Text style={styles.previewTitle}>Vista previa de la playlist</Text>
            {playlistSongs.map((p) => (
              <Text key={p.id} style={styles.previewItem}>• {p.title} — {p.artist}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C63E9',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '600',
  },
  searchWrap: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 12,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  songInfo: {
    flex: 1,
    paddingRight: 8,
  },
  songTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  songArtist: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  addButton: {
    width: 72,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#4C63E9',
    fontWeight: '800',
    fontSize: 16,
  },
  addedText: {
    color: '#4C63E9',
    opacity: 0.9,
  },
  playlistPreview: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
  },
  previewTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
  },
  previewItem: {
    color: 'rgba(255,255,255,0.9)'
  }
});
