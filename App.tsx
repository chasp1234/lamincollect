import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { featuredSets, macroCategories, appLevels } from './src/data/catalog';
import { universes } from './src/data/universes';
import PlaceholderCover from './src/components/PlaceholderCover';
import pokemonAdvanceEx1 from './src/data/pokemon-advance-ex1.json';

type Tab = 'home' | 'categories' | 'sets' | 'card' | 'profile';

const selectedCard = pokemonAdvanceEx1.cards[0];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.heroShell}>
        <View style={styles.heroGlowA} />
        <View style={styles.heroGlowB} />
        <Text style={styles.eyebrow}>LAMINCOLLECT // ARCHIVE MODE</Text>
        <Text style={styles.heroTitle}>La tana definitiva del collezionista malato</Text>
        <Text style={styles.heroText}>
          Non un cataloghino morto. Un archivio vivo, con status, progressi, set chase, promo marce da yogurt e ranking da nerd terminale.
        </Text>
        <View style={styles.heroBadgeRow}>
          <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>104+ SET</Text></View>
          <View style={[styles.heroBadge, styles.heroBadgeHot]}><Text style={styles.heroBadgeText}>PROMO HUNT</Text></View>
          <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>RARITY CORE</Text></View>
        </View>
      </View>

      <View style={styles.rankCard}>
        <View>
          <Text style={styles.rankEyebrow}>COLLECTOR RANK</Text>
          <Text style={styles.rankTitle}>{appLevels[4]}</Text>
          <Text style={styles.rankSub}>68% archive synced · 82/120 Base 1</Text>
        </View>
        <View style={styles.rankMedal}><Text style={styles.rankMedalText}>IV</Text></View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statBlue]}><Text style={styles.statValue}>104+</Text><Text style={styles.statLabel}>Espansioni</Text></View>
        <View style={[styles.statCard, styles.statGreen]}><Text style={styles.statValue}>27</Text><Text style={styles.statLabel}>Promo rare</Text></View>
        <View style={[styles.statCard, styles.statPurple]}><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>Set quasi finiti</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Macro categorie</Text>
      {macroCategories.map((cat) => (
        <View key={cat.id} style={styles.categoryCard}>
          <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}><Text style={styles.categoryEmoji}>{cat.emoji}</Text></View>
          <View style={{ flex: 1 }}>
            <View style={styles.categoryHeaderRow}>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
              <View style={styles.rarityChip}><Text style={styles.rarityChipText}>CORE</Text></View>
            </View>
            <Text style={styles.categorySubtitle}>{cat.subtitle}</Text>
            <View style={styles.pillRow}>
              {cat.subcategories.slice(0, 4).map((sub) => (
                <View key={sub} style={styles.pill}><Text style={styles.pillText}>{sub}</Text></View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderCategories = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Archivio categorie</Text>
      {macroCategories.map((cat, idx) => (
        <View key={cat.id} style={styles.fullCategoryCard}>
          <View style={[styles.largeCategoryBadge, { backgroundColor: cat.color }]}><Text style={styles.largeCategoryEmoji}>{cat.emoji}</Text></View>
          <View style={styles.categoryHeaderRow}>
            <Text style={styles.categoryTitle}>{cat.title}</Text>
            <View style={[styles.rarityChip, idx % 2 === 0 ? styles.rarityChipGold : styles.rarityChipHot]}><Text style={styles.rarityChipText}>{idx % 2 === 0 ? 'ARCHIVE' : 'PROMO'}</Text></View>
          </View>
          <Text style={styles.categorySubtitle}>{cat.subtitle}</Text>
          <View style={styles.listWrap}>
            {cat.subcategories.map((sub) => (
              <View key={sub} style={styles.listItem}><Text style={styles.listItemText}>• {sub}</Text></View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderSets = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Set browser</Text>
      {featuredSets.map((set, index) => (
        <View key={set.id} style={styles.bigSetCard}>
          <PlaceholderCover label={set.imageLabel} color={index % 2 === 0 ? '#7C3AED' : '#DC2626'} />
          <View style={{ flex: 1 }}>
            <Text style={styles.setTitle}>{set.title}</Text>
            <Text style={styles.setMeta}>{set.category}</Text>
            <Text style={styles.setMeta}>Placeholder set cover, pronta per art, scansioni e checklist vere</Text>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${set.progress}%` }]} /></View>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Pokémon Advance / EX Ruby & Sapphire</Text>
      <View style={styles.fullCategoryCard}>
        <Text style={styles.categorySubtitle}>Set principale inserito come prima base dati reale. Ho agganciato nome, numerazione e immagine da Pokémon TCG API per iniziare a costruire la sezione espansioni come si deve.</Text>
        <Text style={[styles.setMeta, { marginTop: 10 }]}>Carte trovate: {pokemonAdvanceEx1.total}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 12 }}>
          {pokemonAdvanceEx1.cards.slice(0, 8).map((card: any) => (
            <TouchableOpacity key={card.id} style={styles.pokemonCardPreview} onPress={() => setTab('card')}>
              <Image source={{ uri: card.image }} style={styles.pokemonCardImage} resizeMode="cover" />
              <Text style={styles.pokemonCardName}>#{card.number} {card.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );

  const renderCardDetail = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Scheda carta</Text>
      <View style={styles.cardDetailShell}>
        <View style={styles.cardFacePanel}>
          <Image source={{ uri: selectedCard.image }} style={styles.cardFaceImage} resizeMode="cover" />
          <View style={styles.cardNameBar}>
            <Text style={styles.cardNameText}>{selectedCard.name}</Text>
            <View style={styles.cardNumberPill}><Text style={styles.cardNumberPillText}>#{selectedCard.number}</Text></View>
          </View>
        </View>

        <View style={styles.cardBackPanel}>
          <View style={styles.cardInfoHeader}>
            <Text style={styles.cardInfoTitle}>Retro / Info</Text>
            <View style={[styles.rarityChip, styles.rarityChipGold]}><Text style={styles.rarityChipText}>SET CORE</Text></View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nome</Text><Text style={styles.infoValue}>{selectedCard.name}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Numero</Text><Text style={styles.infoValue}>#{selectedCard.number}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Espansione</Text><Text style={styles.infoValue}>Pokémon Advance / EX Ruby & Sapphire</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Categoria</Text><Text style={styles.infoValue}>Espansioni Principali</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Supertype</Text><Text style={styles.infoValue}>{selectedCard.supertype || 'Carta'}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Rarity</Text><Text style={styles.infoValue}>{selectedCard.rarity || 'N/D'}</Text></View>
          </View>

          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>Vista desiderata</Text>
            <Text style={styles.featureText}>Fronte carta a sinistra, retro/informazioni a destra: set, nome, numero e caratteristiche. Questa è già la direzione giusta dentro l’app.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.profileHero}>
        <Text style={styles.profileName}>Ale</Text>
        <Text style={styles.profileRank}>Rank: {appLevels[4]}</Text>
        <Text style={styles.profileMini}>Tracker da maniaco operativo · promo hunter · completista borderline</Text>
      </View>
      <Text style={styles.sectionTitle}>Livelli collezionista</Text>
      {appLevels.map((level, idx) => (
        <View key={level} style={styles.levelCard}>
          <Text style={styles.levelIndex}>#{idx + 1}</Text>
          <Text style={styles.levelName}>{level}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LaminCollect</Text>
        <Text style={styles.headerSub}>Collector-core mobile app prototype</Text>
      </View>

      <View style={styles.tabBar}>
        {[
          { key: 'home', label: 'Home' },
          { key: 'categories', label: 'Categorie' },
          { key: 'sets', label: 'Set' },
          { key: 'card', label: 'Carta' },
          { key: 'profile', label: 'Profilo' },
        ].map((item) => (
          <TouchableOpacity key={item.key} style={[styles.tab, tab === item.key && styles.tabActive]} onPress={() => setTab(item.key as Tab)}>
            <Text style={[styles.tabText, tab === item.key && styles.tabTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'home' && renderHome()}
      {tab === 'categories' && renderCategories()}
      {tab === 'sets' && renderSets()}
      {tab === 'card' && renderCardDetail()}
      {tab === 'profile' && renderProfile()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#070A10' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  headerTitle: { color: '#F7FAFF', fontSize: 30, fontWeight: '900', letterSpacing: 0.2 },
  headerSub: { color: '#7F8BA0', fontSize: 12, marginTop: 2 },
  tabBar: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 10, backgroundColor: '#101723', borderRadius: 18, padding: 4, borderWidth: 1, borderColor: '#1B2433' },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: 'center' },
  tabActive: { backgroundColor: '#19283D' },
  tabText: { color: '#7F8BA0', fontWeight: '700', fontSize: 12 },
  tabTextActive: { color: '#5CC8FF' },
  content: { padding: 16, paddingBottom: 100, gap: 14 },
  heroShell: { backgroundColor: '#121926', borderRadius: 28, padding: 18, borderWidth: 1, borderColor: '#1E2A3C', overflow: 'hidden' },
  heroGlowA: { position: 'absolute', width: 180, height: 180, borderRadius: 999, backgroundColor: 'rgba(82, 183, 255, 0.16)', top: -50, right: -30 },
  heroGlowB: { position: 'absolute', width: 140, height: 140, borderRadius: 999, backgroundColor: 'rgba(139, 92, 246, 0.18)', bottom: -20, left: -20 },
  eyebrow: { color: '#5CC8FF', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  heroTitle: { color: '#F7FAFF', fontSize: 26, fontWeight: '900', marginTop: 8, lineHeight: 30 },
  heroText: { color: '#A8B2C2', fontSize: 14, marginTop: 10, lineHeight: 20 },
  heroBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  heroBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#182235', borderWidth: 1, borderColor: '#22324A' },
  heroBadgeHot: { backgroundColor: '#2A1636', borderColor: '#59357A' },
  heroBadgeText: { color: '#F7FAFF', fontSize: 11, fontWeight: '800' },
  rankCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#101723', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#1B2433' },
  rankEyebrow: { color: '#F59E0B', fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  rankTitle: { color: '#F7FAFF', fontSize: 24, fontWeight: '900', marginTop: 6 },
  rankSub: { color: '#8FA0B8', fontSize: 12, marginTop: 6 },
  rankMedal: { width: 58, height: 58, borderRadius: 18, backgroundColor: '#1B283E', borderWidth: 1, borderColor: '#35527B', alignItems: 'center', justifyContent: 'center' },
  rankMedalText: { color: '#8ED4FF', fontSize: 22, fontWeight: '900' },
  statsRow: { flexDirection: 'row', gap: 10 },
  universeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  universeCard: { width: '48%', backgroundColor: '#101723', borderRadius: 22, padding: 14, borderWidth: 1, borderColor: '#1B2433', overflow: 'hidden' },
  universeGlow: { position: 'absolute', width: 120, height: 120, borderRadius: 999, right: -30, top: -30, opacity: 0.18 },
  universeTitle: { color: '#F7FAFF', fontSize: 16, fontWeight: '800', marginTop: 10 },
  universeSubtitle: { color: '#8FA0B8', fontSize: 12, marginTop: 6, lineHeight: 16 },
  statCard: { flex: 1, borderRadius: 20, padding: 14, borderWidth: 1 },
  statBlue: { backgroundColor: '#101B2A', borderColor: '#223B61' },
  statGreen: { backgroundColor: '#0D201A', borderColor: '#1B5A47' },
  statPurple: { backgroundColor: '#161127', borderColor: '#44316B' },
  statValue: { color: '#F7FAFF', fontSize: 20, fontWeight: '900' },
  statLabel: { color: '#8FA0B8', fontSize: 12, marginTop: 4 },
  sectionTitle: { color: '#F7FAFF', fontSize: 18, fontWeight: '900', marginTop: 4 },
  categoryCard: { flexDirection: 'row', gap: 12, backgroundColor: '#101723', borderRadius: 22, padding: 14, borderWidth: 1, borderColor: '#1B2433' },
  categoryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  categoryIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  categoryEmoji: { fontSize: 25 },
  categoryTitle: { color: '#F7FAFF', fontSize: 16, fontWeight: '800', flex: 1 },
  categorySubtitle: { color: '#8FA0B8', fontSize: 13, marginTop: 4, lineHeight: 18 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  pill: { backgroundColor: '#162233', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#22324A' },
  pillText: { color: '#D8E2EF', fontSize: 11, fontWeight: '700' },
  rarityChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: '#1D3552', borderWidth: 1, borderColor: '#335D8F' },
  rarityChipGold: { backgroundColor: '#3B2C10', borderColor: '#7B5A18' },
  rarityChipHot: { backgroundColor: '#33182E', borderColor: '#7C3A67' },
  rarityChipText: { color: '#F7FAFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  setCard: { flexDirection: 'row', gap: 12, backgroundColor: '#101723', borderRadius: 22, padding: 14, borderWidth: 1, borderColor: '#1B2433' },
  setTitle: { color: '#F7FAFF', fontSize: 16, fontWeight: '800' },
  setMeta: { color: '#8FA0B8', fontSize: 12, marginTop: 4 },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: '#1B2433', marginTop: 10, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: '#22C55E' },
  fullCategoryCard: { backgroundColor: '#101723', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#1B2433' },
  largeCategoryBadge: { width: 66, height: 66, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  largeCategoryEmoji: { fontSize: 30 },
  listWrap: { marginTop: 12, gap: 6 },
  listItem: { backgroundColor: '#162233', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#22324A', marginTop: 8 },
  listItemText: { color: '#D8E2EF', fontSize: 13, fontWeight: '600' },
  bigSetCard: { flexDirection: 'row', gap: 14, backgroundColor: '#101723', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#1B2433' },
  pokemonCardPreview: { width: 110, gap: 8 },
  pokemonCardImage: { width: 110, height: 154, borderRadius: 16, backgroundColor: '#162233' },
  pokemonCardName: { color: '#D8E2EF', fontSize: 11, fontWeight: '700' },
  cardDetailShell: { gap: 14 },
  cardFacePanel: { backgroundColor: '#101723', borderRadius: 24, padding: 14, borderWidth: 1, borderColor: '#1B2433' },
  cardFaceImage: { width: '100%', height: 320, borderRadius: 20, backgroundColor: '#162233' },
  cardNameBar: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  cardNameText: { color: '#F7FAFF', fontSize: 20, fontWeight: '900', flex: 1 },
  cardNumberPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#182235', borderWidth: 1, borderColor: '#22324A' },
  cardNumberPillText: { color: '#F7FAFF', fontSize: 11, fontWeight: '900' },
  cardBackPanel: { backgroundColor: '#121926', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#1E2A3C' },
  cardInfoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardInfoTitle: { color: '#F7FAFF', fontSize: 18, fontWeight: '900' },
  infoGrid: { gap: 10 },
  infoRow: { backgroundColor: '#162233', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#22324A' },
  infoLabel: { color: '#8FA0B8', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  infoValue: { color: '#F7FAFF', fontSize: 14, fontWeight: '700', marginTop: 4 },
  featureBox: { marginTop: 14, backgroundColor: '#1B283E', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#35527B' },
  featureTitle: { color: '#8ED4FF', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  featureText: { color: '#D8E2EF', fontSize: 13, marginTop: 6, lineHeight: 18 },
  profileHero: { backgroundColor: '#121926', borderRadius: 26, padding: 18, borderWidth: 1, borderColor: '#1E2A3C' },
  profileName: { color: '#F7FAFF', fontSize: 26, fontWeight: '900' },
  profileRank: { color: '#5CC8FF', fontSize: 14, marginTop: 6, fontWeight: '800' },
  profileMini: { color: '#97A4B7', fontSize: 12, marginTop: 6 },
  levelCard: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: '#101723', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#1B2433' },
  levelIndex: { color: '#5CC8FF', fontSize: 14, fontWeight: '900', width: 36 },
  levelName: { color: '#F7FAFF', fontSize: 15, fontWeight: '800' },
});