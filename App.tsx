import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appLevels } from './src/data/catalog';
import { universes } from './src/data/universes';
import { universeCollections } from './src/data/universe-collections';
import pokemonVerticalAdvanced from './src/data/pokemon-vertical-lamincards-advanced.json';

type Screen = 'home' | 'collections' | 'cards' | 'card';
type UniverseId = keyof typeof universeCollections;
type CollectionId = 'pokemon-vertical' | 'pokemon-advanced' | 'pokemon-promo' | 'dragon-ball-core' | 'yugioh-core' | 'naruto-core' | 'onepiece-core' | 'mixed-weird';

const defaultUniverseId: UniverseId = 'pokemon';
const defaultCollectionId: CollectionId = 'pokemon-vertical';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseId>(defaultUniverseId);
  const [selectedCollection, setSelectedCollection] = useState<CollectionId>(defaultCollectionId);
  const [selectedCardId, setSelectedCardId] = useState<string>(pokemonVerticalAdvanced.cards[0].id);

  const activeUniverse = useMemo(
    () => universes.find((universe) => universe.id === selectedUniverse) ?? universes[0],
    [selectedUniverse],
  );

  const activeCollections = universeCollections[selectedUniverse] ?? [];

  const activeCard = useMemo(
    () => pokemonVerticalAdvanced.cards.find((card) => card.id === selectedCardId) ?? pokemonVerticalAdvanced.cards[0],
    [selectedCardId],
  );

  const openUniverse = (universeId: UniverseId) => {
    setSelectedUniverse(universeId);
    setScreen('collections');
  };

  const openCollection = (collectionId: CollectionId) => {
    setSelectedCollection(collectionId);
    setScreen('cards');
  };

  const openCard = (cardId: string) => {
    setSelectedCardId(cardId);
    setScreen('card');
  };

  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>LAMINCOLLECT</Text>
        <Text style={styles.heroTitle}>Apri un cartone. Vedi subito le sue collezioni.</Text>
        <Text style={styles.heroText}>
          Zero casino. Tocchi Pokémon, entri nella collezione e ti scorri le carte come un archivio vero.
        </Text>
      </View>

      <View style={styles.rankStrip}>
        <View>
          <Text style={styles.rankMini}>RANK</Text>
          <Text style={styles.rankMain}>{appLevels[4]}</Text>
        </View>
        <Text style={styles.rankMeta}>Prima collezione reale: Pokémon Vertical Lamincards Advanced.</Text>
      </View>

      <Text style={styles.sectionTitle}>Cartoni / Universi</Text>
      <View style={styles.grid}>
        {universes.map((universe) => (
          <TouchableOpacity key={universe.id} style={styles.universeTile} onPress={() => openUniverse(universe.id as UniverseId)}>
            <View style={[styles.universeBadge, { backgroundColor: universe.color }]}>
              <Text style={styles.universeEmoji}>{universe.emoji}</Text>
            </View>
            <Text style={styles.universeName}>{universe.title}</Text>
            <Text style={styles.universeInfo}>{universe.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderCollections = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => setScreen('home')}>
        <Text style={styles.backButtonText}>← Torna ai cartoni</Text>
      </TouchableOpacity>

      <View style={styles.collectionsHero}>
        <View style={[styles.collectionsBadge, { backgroundColor: activeUniverse.color }]}>
          <Text style={styles.collectionsEmoji}>{activeUniverse.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.collectionsTitle}>{activeUniverse.title}</Text>
          <Text style={styles.collectionsSubtitle}>{activeUniverse.subtitle}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Collezioni</Text>
      {activeCollections.map((collection) => (
        <TouchableOpacity key={collection.id} style={styles.collectionCard} onPress={() => openCollection(collection.id as CollectionId)}>
          <View style={[styles.collectionAccent, { backgroundColor: collection.accent }]} />
          <View style={{ flex: 1 }}>
            <View style={styles.collectionTopRow}>
              <Text style={styles.collectionTitle}>{collection.title}</Text>
              <View style={styles.collectionPill}><Text style={styles.collectionPillText}>{collection.pill}</Text></View>
            </View>
            <Text style={styles.collectionSubtitle}>{collection.subtitle}</Text>
            <Text style={styles.collectionMeta}>{collection.total} carte archiviate</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderCards = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => setScreen('collections')}>
        <Text style={styles.backButtonText}>← Torna alle collezioni</Text>
      </TouchableOpacity>

      <View style={styles.listHero}>
        <Text style={styles.listTitle}>{pokemonVerticalAdvanced.title}</Text>
        <Text style={styles.listSubtitle}>{pokemonVerticalAdvanced.notes}</Text>
        <Text style={styles.listMeta}>Fonte: Bulbapedia · Carte inserite: {pokemonVerticalAdvanced.total}</Text>
      </View>

      <View style={styles.cardsGrid}>
        {pokemonVerticalAdvanced.cards.map((card) => (
          <TouchableOpacity key={card.id} style={styles.cardTile} onPress={() => openCard(card.id)}>
            <Image source={{ uri: card.image }} style={styles.cardTileImage} resizeMode="cover" />
            <Text style={styles.cardTileNumber}>#{card.number}</Text>
            <Text style={styles.cardTileName}>{card.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderCard = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => setScreen('cards')}>
        <Text style={styles.backButtonText}>← Torna alla lista carte</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Scheda carta</Text>
      <View style={styles.cardShell}>
        <View style={styles.cardDualImages}>
          <Image source={{ uri: activeCard.image }} style={styles.cardHalfImage} resizeMode="cover" />
          <Image source={{ uri: activeCard.back }} style={styles.cardHalfImage} resizeMode="cover" />
        </View>
        <View style={styles.cardInfoBox}>
          <Text style={styles.cardTitle}>{activeCard.name}</Text>
          <Text style={styles.cardSmall}>#{activeCard.number} · {pokemonVerticalAdvanced.title}</Text>

          <View style={styles.infoLine}><Text style={styles.infoLabel}>Nome</Text><Text style={styles.infoValue}>{activeCard.name}</Text></View>
          <View style={styles.infoLine}><Text style={styles.infoLabel}>Numero</Text><Text style={styles.infoValue}>#{activeCard.number}</Text></View>
          <View style={styles.infoLine}><Text style={styles.infoLabel}>Subject</Text><Text style={styles.infoValue}>{activeCard.subject}</Text></View>
          <View style={styles.infoLine}><Text style={styles.infoLabel}>Retro</Text><Text style={styles.infoValue}>Immagine retro caricata da Bulbagarden Archives</Text></View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LaminCollect</Text>
        <Text style={styles.headerSub}>Archivio minimale, leggibile, cattivo il giusto</Text>
      </View>
      {screen === 'home' && renderHome()}
      {screen === 'collections' && renderCollections()}
      {screen === 'cards' && renderCards()}
      {screen === 'card' && renderCard()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#06080D' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { color: '#F8FAFC', fontSize: 28, fontWeight: '900' },
  headerSub: { color: '#94A3B8', fontSize: 12, marginTop: 3 },
  content: { padding: 16, paddingBottom: 80, gap: 14 },
  heroCard: { backgroundColor: '#0F172A', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#1E293B' },
  heroEyebrow: { color: '#60A5FA', fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  heroTitle: { color: '#F8FAFC', fontSize: 24, fontWeight: '900', lineHeight: 28, marginTop: 8 },
  heroText: { color: '#CBD5E1', fontSize: 14, lineHeight: 20, marginTop: 8 },
  rankStrip: { backgroundColor: '#111827', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#1F2937', flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center' },
  rankMini: { color: '#F59E0B', fontSize: 11, fontWeight: '900' },
  rankMain: { color: '#F8FAFC', fontSize: 20, fontWeight: '900', marginTop: 4 },
  rankMeta: { color: '#94A3B8', fontSize: 12, flex: 1, textAlign: 'right' },
  sectionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  universeTile: { width: '48%', backgroundColor: '#0F172A', borderRadius: 22, padding: 14, borderWidth: 1, borderColor: '#1E293B', minHeight: 144 },
  universeBadge: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  universeEmoji: { fontSize: 24 },
  universeName: { color: '#F8FAFC', fontSize: 16, fontWeight: '800', marginTop: 12 },
  universeInfo: { color: '#94A3B8', fontSize: 12, lineHeight: 17, marginTop: 6 },
  backButton: { alignSelf: 'flex-start', backgroundColor: '#111827', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: '#1F2937' },
  backButtonText: { color: '#E2E8F0', fontSize: 12, fontWeight: '800' },
  collectionsHero: { flexDirection: 'row', gap: 12, backgroundColor: '#0F172A', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#1E293B', alignItems: 'center' },
  collectionsBadge: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  collectionsEmoji: { fontSize: 28 },
  collectionsTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '900' },
  collectionsSubtitle: { color: '#94A3B8', fontSize: 13, marginTop: 5, lineHeight: 18 },
  collectionCard: { backgroundColor: '#0F172A', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#1E293B', flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  collectionAccent: { width: 6, borderRadius: 999 },
  collectionTopRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'center' },
  collectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '800', flex: 1 },
  collectionPill: { backgroundColor: '#172554', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  collectionPillText: { color: '#DBEAFE', fontSize: 10, fontWeight: '900' },
  collectionSubtitle: { color: '#CBD5E1', fontSize: 13, lineHeight: 18, marginTop: 8 },
  collectionMeta: { color: '#64748B', fontSize: 12, marginTop: 8 },
  listHero: { backgroundColor: '#111827', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#1F2937' },
  listTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '900' },
  listSubtitle: { color: '#CBD5E1', fontSize: 13, lineHeight: 18, marginTop: 8 },
  listMeta: { color: '#60A5FA', fontSize: 12, marginTop: 8, fontWeight: '700' },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cardTile: { width: '20.5%', backgroundColor: '#0F172A', borderRadius: 14, padding: 5, borderWidth: 1, borderColor: '#1E293B' },
  cardTileImage: { width: '100%', aspectRatio: 0.72, borderRadius: 10, backgroundColor: '#1E293B' },
  cardTileNumber: { color: '#60A5FA', fontSize: 9, fontWeight: '900', marginTop: 5 },
  cardTileName: { color: '#F8FAFC', fontSize: 10, fontWeight: '700', marginTop: 3 },
  cardShell: { gap: 14 },
  cardDualImages: { flexDirection: 'row', gap: 10 },
  cardHalfImage: { flex: 1, height: 300, borderRadius: 20, backgroundColor: '#1E293B' },
  cardInfoBox: { backgroundColor: '#0F172A', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#1E293B', gap: 10 },
  cardTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '900' },
  cardSmall: { color: '#94A3B8', fontSize: 13, marginBottom: 4 },
  infoLine: { backgroundColor: '#111827', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#1F2937' },
  infoLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  infoValue: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginTop: 4 },
});
