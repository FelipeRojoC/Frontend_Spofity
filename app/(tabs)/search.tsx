import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const GENRES = ['Pop', 'Rock', 'Reggaetón', 'Indie', 'Electronica', 'Podcast'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const sampleResults = [
    { id: 1, title: 'Canción ejemplo', subtitle: 'Artista A' },
    { id: 2, title: 'Playlist ejemplo', subtitle: 'Playlist curada' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchBarWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.chipsRow}>
          {GENRES.map((g) => (
            <Pressable
              key={g}
              onPress={() => setSelectedGenre(selectedGenre === g ? null : g)}
              style={({ pressed }) => [
                styles.chip,
                selectedGenre === g && styles.chipActive,
                { opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <Text style={[styles.chipText, selectedGenre === g && styles.chipTextActive]}>{g}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Resultados</Text>
          {sampleResults.map((r) => (
            <View key={r.id} style={styles.resultRow}>
              <View style={styles.resultThumb} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.resultTitle}>{r.title}</Text>
                <Text style={styles.resultSubtitle}>{r.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C63E9',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  searchBarWrap: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  chipActive: {
    backgroundColor: '#fff',
  },
  chipText: {
    color: 'rgba(255,255,255,0.9)'
  },
  chipTextActive: {
    color: '#000'
  },
  resultsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
  }
});