import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function LibraryScreen() {
  const [playlists] = useState([
    { id: 'p1', name: 'Mi playlist 1' },
    { id: 'p2', name: 'Road Trip' },
    { id: 'p3', name: 'Favoritas' },
  ]);

  const [liked] = useState([
    { id: 's1', title: 'Canción favorita', artist: 'Artista X' },
  ]);

  const isEmpty = playlists.length === 0 && liked.length === 0;
  const router = useRouter();

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Tu biblioteca está vacía</Text>
        <Text style={styles.emptyText}>Sigue artistas y crea playlists para llenar tu biblioteca.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={{ marginBottom: 12 }}>
        <Pressable onPress={() => router.push('/create-playlist' as any)} style={({ pressed }) => [{ padding: 12, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center' , opacity: pressed ? 0.9 : 1 }] }>
          <Text style={{ color: '#4C63E9', fontWeight: '800' }}>Crear Playlist</Text>
        </Pressable>
      </View>
      <Text style={styles.sectionTitle}>Playlists</Text>
      <View style={styles.listRow}>
        {playlists.map((p) => (
          <Pressable key={p.id} style={({ pressed }) => [styles.playlistCard, { opacity: pressed ? 0.9 : 1 }]}>
            <View style={styles.playlistThumb} />
            <Text style={styles.playlistTitle}>{p.name}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Me gustas</Text>
      <View style={styles.likedList}>
        {liked.map((s) => (
          <View key={s.id} style={styles.likedRow}>
            <View style={styles.resultThumb} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.resultTitle}>{s.title}</Text>
              <Text style={styles.resultSubtitle}>{s.artist}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C63E9',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  listRow: {
    flexDirection: 'row',
    gap: 12,
  },
  playlistCard: {
    width: 140,
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  playlistThumb: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  likedList: {
    marginTop: 8,
  },
  likedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)'
  },
  resultTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  resultSubtitle: {
    color: 'rgba(255,255,255,0.7)'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4C63E9',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  }
});