import React, { useEffect, useMemo, useState } from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { appLevels } from './src/data/catalog';
import { universes } from './src/data/universes';
import { universeCollections } from './src/data/universe-collections';

type Screen = 'home' | 'collections' | 'cards' | 'card' | 'pack';
type UniverseId = keyof typeof universeCollections;
type CollectionId = 'pokemon-vertical' | 'pokemon-advanced' | 'pokemon-promo' | 'dragon-ball-core' | 'yugioh-core' | 'naruto-core' | 'onepiece-core' | 'spongebob-core' | 'gormiti-core' | 'marvel-core' | 'mixed-weird';
type SortMode = 'num-asc' | 'num-desc' | 'name-asc' | 'name-desc';

const defaultUniverseId: UniverseId = 'pokemon';
const defaultCollectionId: CollectionId = 'pokemon-vertical';
const pokemonVerticalPack = {
  image: 'https://archives.bulbagarden.net/media/upload/7/79/5._Pok%C3%A9mon_Vertical_Lamincards_Advanced_-_booster_pack_front.jpg',
  name: 'Pokémon Vertical Lamincards Advanced - Booster Pack Sealed',
  releaseDate: '2004 (Italia, Edibas Collections)',
  info: 'Bustina sealed ufficiale della serie Vertical Lamincards Advanced. Set da 150 carte con focus Gen III; distribuzione italiana Edibas.',
};
const pokemonLogoPng = require('./assets/pokemon-logo.png');
const universeLogos: Partial<Record<UniverseId, any>> = {
  pokemon: pokemonLogoPng,
  'dragon-ball': require('./assets/dragon-ball-logo.png'),
  'yu-gi-oh': require('./assets/yugioh-logo.png'),
  naruto: require('./assets/naruto-logo.png'),
  'one-piece': require('./assets/onepiece-logo.png'),
  spongebob: require('./assets/spongebob-logo.png'),
  gormiti: require('./assets/gormiti-logo.png'),
  marvel: require('./assets/marvel-logo.png'),
  mixed: require('./assets/mixed-logo.png'),
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseId>(defaultUniverseId);
  const [selectedCollection, setSelectedCollection] = useState<CollectionId>(defaultCollectionId);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [gridMode, setGridMode] = useState<3 | 5>(5);
  const [sortMode, setSortMode] = useState<SortMode>('num-asc');
  const [sortPanelOpen, setSortPanelOpen] = useState(false);
  const [showCardNames, setShowCardNames] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { width: viewportWidth } = useWindowDimensions();

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const id = 'lamincollect-logo-font';
    if (document.getElementById(id)) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Bungee&display=swap';
    document.head.appendChild(link);
  }, []);

  const activeUniverse = useMemo(
    () => universes.find((universe) => universe.id === selectedUniverse) ?? universes[0],
    [selectedUniverse],
  );

  const activeCollections = universeCollections[selectedUniverse] ?? [];
  const activeUniverseLogo = universeLogos[selectedUniverse];
  const isPokemonTheme = selectedUniverse === 'pokemon' && screen !== 'home';

  const activeSet = useMemo(() => {
    const needsSet = screen === 'cards' || screen === 'card' || searchOpen;
    if (!needsSet) {
      return { title: '', source: '', total: 0, notes: '', cards: [] as any[] };
    }
    if (selectedUniverse === 'dragon-ball' && selectedCollection === 'dragon-ball-core') {
      return require('./src/data/dbz-edibas-lamincards.json');
    }
    return require('./src/data/pokemon-vertical-lamincards-advanced.json');
  }, [selectedUniverse, selectedCollection, screen, searchOpen]);

  const cardToning = useMemo(() => {
    if (screen === 'cards' || screen === 'card') {
      return require('./src/data/card-toning').cardToning as Record<string, { brightness: number; saturation: number; contrast: number; overlay: number; hueRotate: number }>;
    }
    return {} as Record<string, { brightness: number; saturation: number; contrast: number; overlay: number; hueRotate: number }>;
  }, [screen]);

  const activeCard = useMemo(
    () => activeSet.cards.find((card: any) => card.id === selectedCardId) ?? activeSet.cards[0] ?? { id: '', number: '', name: '', image: '', back: '', subject: '' },
    [selectedCardId, activeSet],
  );

  const resolveAssetUri = (uri: string) => {
    if (!uri) return uri;
    if (/^https?:\/\//.test(uri)) return uri;
    if (uri.startsWith('/') && typeof window !== 'undefined' && window.location?.origin) {
      return `${window.location.origin}${uri}`;
    }
    return uri;
  };

  const sortedCards = useMemo(() => {
    const cards = [...activeSet.cards];
    switch (sortMode) {
      case 'num-desc':
        return cards.sort((a, b) => Number(b.number) - Number(a.number));
      case 'name-asc':
        return cards.sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }));
      case 'name-desc':
        return cards.sort((a, b) => b.name.localeCompare(a.name, 'it', { sensitivity: 'base' }));
      case 'num-asc':
      default:
        return cards.sort((a, b) => Number(a.number) - Number(b.number));
    }
  }, [sortMode, activeSet]);

  const searchNormalized = searchQuery.trim().toLowerCase();

  const filteredCollections = useMemo(() => {
    if (!searchNormalized) return activeCollections;
    return activeCollections.filter((collection) =>
      `${collection.title} ${collection.subtitle} ${collection.pill}`.toLowerCase().includes(searchNormalized),
    );
  }, [activeCollections, searchNormalized]);

  const filteredCards = useMemo(() => {
    if (!searchNormalized) return sortedCards;
    return sortedCards.filter((card) =>
      `${card.number} ${card.name}`.toLowerCase().includes(searchNormalized),
    );
  }, [sortedCards, searchNormalized]);



  const searchCardSuggestions = useMemo(() => {
    if (!searchNormalized || searchNormalized.length < 3) return [];
    return activeSet.cards
      .filter((card) => card.name.toLowerCase().includes(searchNormalized))
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aStarts = aName.startsWith(searchNormalized) ? 1 : 0;
        const bStarts = bName.startsWith(searchNormalized) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;
        return aName.localeCompare(bName, 'it', { sensitivity: 'base' });
      })
      .slice(0, 6);
  }, [searchNormalized, activeSet]);

  const searchCollectionSuggestions = useMemo(() => {
    if (!searchNormalized || searchNormalized.length < 3) return [];
    return Object.entries(universeCollections)
      .flatMap(([universeId, cols]) => cols.map((c) => ({ ...c, universeId: universeId as UniverseId })))
      .filter((c) => `${c.title} ${c.subtitle}`.toLowerCase().includes(searchNormalized))
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const aStarts = aTitle.startsWith(searchNormalized) ? 1 : 0;
        const bStarts = bTitle.startsWith(searchNormalized) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;
        return aTitle.localeCompare(bTitle, 'it', { sensitivity: 'base' });
      })
      .slice(0, 4);
  }, [searchNormalized]);

  const openUniverse = (universeId: UniverseId) => {
    setSelectedUniverse(universeId);
    setScreen('collections');
  };

  const openCollection = (collectionId: CollectionId) => {
    setSelectedCollection(collectionId);
    if (selectedUniverse === 'pokemon' && collectionId === 'pokemon-vertical') {
      const pokemonSet = require('./src/data/pokemon-vertical-lamincards-advanced.json');
      setSelectedCardId(pokemonSet.cards[0].id);
      setScreen('cards');
      return;
    }
    if (selectedUniverse === 'dragon-ball' && collectionId === 'dragon-ball-core') {
      const dbzSet = require('./src/data/dbz-edibas-lamincards.json');
      setSelectedCardId(dbzSet.cards[0].id);
      setScreen('cards');
      return;
    }
    setScreen('collections');
  };

  const openCard = (cardId: string) => {
    setSelectedCardId(cardId);
    setScreen('card');
  };

  const openSearchCard = (cardId: string) => {
    setSelectedUniverse('pokemon');
    setSelectedCollection('pokemon-vertical');
    setSelectedCardId(cardId);
    setScreen('card');
    setSearchQuery('');
    setSearchOpen(false);
  };

  const openSearchCollection = (universeId: UniverseId, collectionId: CollectionId) => {
    setSelectedUniverse(universeId);
    setSelectedCollection(collectionId);
    if (universeId === 'pokemon' && collectionId === 'pokemon-vertical') {
      setScreen('cards');
    } else {
      setScreen('collections');
    }
    setSearchQuery('');
    setSearchOpen(false);
  };

  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.rankStrip}>
        <View>
          <Text style={styles.rankMini}>RANK</Text>
          <Text style={styles.rankMain}>{appLevels[4]}</Text>
        </View>
        <Text style={styles.rankMeta}>Prima collezione reale: Pokémon Vertical Lamincards Advanced.</Text>
      </View>

      <Text style={styles.sectionTitle}>Cartoni / Universi</Text>

      <View style={styles.grid}>
        {universes.map((universe) => {
          const uid = universe.id as UniverseId;
          const logo = universeLogos[uid];
          return (
          <TouchableOpacity key={universe.id} style={styles.universeTile} onPress={() => openUniverse(uid)}>
            <View style={[styles.universeBadge, logo ? styles.universeBadgeLogo : { backgroundColor: universe.color }, uid === 'marvel' && styles.universeBadgeMarvel]}>
              {logo ? (
                <Image source={logo} style={[styles.universeLogoImage, (uid === 'marvel' || uid === 'spongebob') && styles.universeLogoImageFeature, uid === 'gormiti' && styles.universeLogoImageGormiti]} resizeMode="contain" />
              ) : (
                <Text style={styles.universeEmoji}>{universe.emoji}</Text>
              )}
            </View>
            {!logo ? (
              <>
                <Text style={styles.universeName}>{universe.title}</Text>
                <Text style={styles.universeInfo}>{universe.subtitle}</Text>
              </>
            ) : null}
          </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderCollections = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => setScreen('home')}>
        <Text style={styles.backButtonText}>← Torna ai cartoni</Text>
      </TouchableOpacity>

      <View style={styles.collectionsHero}>
        {activeUniverseLogo ? (
          <Image source={activeUniverseLogo} style={[styles.collectionsHeroLogo, selectedUniverse === 'marvel' && styles.collectionsHeroLogoMarvel]} resizeMode="contain" />
        ) : (
          <>
            <View style={[styles.collectionsBadge, { backgroundColor: activeUniverse.color }]}> 
              <Text style={styles.collectionsEmoji}>{activeUniverse.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.collectionsTitle}>{activeUniverse.title}</Text>
              <Text style={styles.collectionsSubtitle}>{activeUniverse.subtitle}</Text>
            </View>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Collezioni</Text>
      {filteredCollections.map((collection) => {
        const isLiveArchive =
          (selectedUniverse === 'pokemon' && collection.id === 'pokemon-vertical') ||
          (selectedUniverse === 'dragon-ball' && collection.id === 'dragon-ball-core');
        return (
        <TouchableOpacity key={collection.id} style={[styles.collectionCard, !isLiveArchive && styles.collectionCardDisabled]} onPress={() => openCollection(collection.id as CollectionId)}>
          <View style={[styles.collectionAccent, { backgroundColor: collection.accent }]} />
          <View style={styles.collectionMainRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.collectionTopRow}>
                <Text style={styles.collectionTitle}>{collection.title}</Text>
                <View style={styles.collectionPill}><Text style={styles.collectionPillText}>{isLiveArchive ? collection.pill : 'PREVIEW'}</Text></View>
              </View>
              <Text style={styles.collectionSubtitle}>{collection.subtitle}</Text>
              <Text style={styles.collectionMeta}>{isLiveArchive ? `${collection.total} carte archiviate` : 'Struttura pronta, database non collegato qui'}</Text>
            </View>
            {'sealedImage' in collection && typeof collection.sealedImage === 'string' ? (
              <Image source={{ uri: collection.sealedImage }} style={styles.collectionSealedImage} resizeMode="cover" />
            ) : universeLogos[selectedUniverse] ? (
              <Image source={universeLogos[selectedUniverse]} style={styles.collectionUniverseLogo} resizeMode="contain" />
            ) : null}
          </View>
        </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderCards = () => {
    const columns = gridMode;
    const horizontalPadding = 20;
    const maxGridWidth = 980;
    const availableWidth = Math.min(Math.max(viewportWidth - horizontalPadding, 280), maxGridWidth);
    const tileWidthPercent = columns === 5 ? '20%' : '33.3333%';

    return (
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => setScreen('collections')}>
        <Text style={styles.backButtonText}>← Torna alle collezioni</Text>
      </TouchableOpacity>

      <View style={styles.listHero}>
        <View style={styles.listHeroMainRow}>
          <View style={styles.listHeroTextCol}>
            <Text style={styles.listEyebrow}>ARCHIVE SET // EDIBAS 2004</Text>
            <Text style={styles.listTitle} numberOfLines={2}>{activeSet.title}</Text>
            <Text style={styles.listSubtitle} numberOfLines={3}>{activeSet.notes}</Text>
            <Text style={styles.listMeta}>Fonte: {activeSet.source} · Carte inserite: {activeSet.total}</Text>
          </View>

          <TouchableOpacity onPress={() => setScreen('pack')} activeOpacity={0.85}>
            <Image
              source={{ uri: pokemonVerticalPack.image }}
              style={styles.listHeroSealedImageTall}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.gridSwitchRow}>
          <TouchableOpacity style={[styles.gridSwitchBtn, gridMode === 3 && styles.gridSwitchBtnActive]} onPress={() => setGridMode(3)}>
            <Text style={[styles.gridSwitchText, gridMode === 3 && styles.gridSwitchTextActive]}>3 colonne</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridSwitchBtn, gridMode === 5 && styles.gridSwitchBtnActive]} onPress={() => setGridMode(5)}>
            <Text style={[styles.gridSwitchText, gridMode === 5 && styles.gridSwitchTextActive]}>5 colonne</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.namesToggle} onPress={() => setShowCardNames((v) => !v)} activeOpacity={0.85}>
            <View style={[styles.checkboxBase, showCardNames && styles.checkboxChecked]}>
              {showCardNames ? <Text style={styles.checkboxTick}>✓</Text> : null}
            </View>
            <Text style={styles.namesToggleText}>Nomi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridSwitchBtn, styles.filterBtn, sortPanelOpen && styles.gridSwitchBtnActive]} onPress={() => setSortPanelOpen((prev) => !prev)}>
            <View style={styles.funnelIconWrap}>
              <View style={[styles.funnelTopBar, sortPanelOpen && styles.funnelActive]} />
              <View style={[styles.funnelIconBody, sortPanelOpen && styles.funnelActive]} />
            </View>
          </TouchableOpacity>
        </View>

        {sortPanelOpen && (
          <View style={styles.sortPanel}>
            <TouchableOpacity style={[styles.sortOption, sortMode === 'num-asc' && styles.sortOptionActive]} onPress={() => setSortMode('num-asc')}>
              <Text style={[styles.sortOptionText, sortMode === 'num-asc' && styles.sortOptionTextActive]}>Numero crescente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sortOption, sortMode === 'num-desc' && styles.sortOptionActive]} onPress={() => setSortMode('num-desc')}>
              <Text style={[styles.sortOptionText, sortMode === 'num-desc' && styles.sortOptionTextActive]}>Numero decrescente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sortOption, sortMode === 'name-asc' && styles.sortOptionActive]} onPress={() => setSortMode('name-asc')}>
              <Text style={[styles.sortOptionText, sortMode === 'name-asc' && styles.sortOptionTextActive]}>Alfabeto A→Z</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sortOption, sortMode === 'name-desc' && styles.sortOptionActive]} onPress={() => setSortMode('name-desc')}>
              <Text style={[styles.sortOptionText, sortMode === 'name-desc' && styles.sortOptionTextActive]}>Alfabeto Z→A</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={[styles.cardsGrid, { maxWidth: availableWidth }]}>
        {filteredCards.map((card) => {
          const tone = cardToning[card.number] || { brightness: 1, saturation: 1, contrast: 1, overlay: 0, hueRotate: 0 };
          const tileFilter = { filter: `contrast(${tone.contrast}) brightness(${tone.brightness})` } as any;
          const tileOverlay = { backgroundColor: 'rgba(0,0,0,0)' };
          return (
          <TouchableOpacity key={card.id} style={[styles.cardTile, { width: tileWidthPercent, paddingHorizontal: gridMode === 5 ? 1 : 2, marginBottom: gridMode === 5 ? 3 : 5 }]} onPress={() => openCard(card.id)}>
            <View style={styles.cardTileImageWrap}>
              <View style={styles.cardTileSkeleton} />
              <Image source={{ uri: resolveAssetUri((card as any).thumb || card.image) }} style={[styles.cardTileImage as any, tileFilter]} resizeMode="cover" />
              <View style={[styles.cardImageToneOverlay, tileOverlay]} pointerEvents="none" />
            </View>
            {showCardNames ? <Text style={styles.cardTileName} numberOfLines={1} ellipsizeMode="tail">{card.name}</Text> : null}
          </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
    );
  };

  const renderPack = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => setScreen('cards')}>
        <Text style={styles.backButtonText}>← Torna alla collezione</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Pack espansione</Text>
      <View style={styles.packInfoCard}>
        <Image source={{ uri: pokemonVerticalPack.image }} style={styles.packInfoImage} resizeMode="contain" />
        <View style={styles.packInfoBody}>
          <Text style={styles.packInfoTitle}>{pokemonVerticalPack.name}</Text>
          <Text style={styles.packInfoDate}>Release: {pokemonVerticalPack.releaseDate}</Text>
          <Text style={styles.packInfoText}>{pokemonVerticalPack.info}</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderCard = () => {
    const tone = cardToning[activeCard.number] || { brightness: 1, saturation: 1, contrast: 1, overlay: 0, hueRotate: 0 };
    const detailFilter = { filter: `contrast(${tone.contrast}) brightness(${tone.brightness})` } as any;
    const detailOverlay = { backgroundColor: 'rgba(0,0,0,0)' };
    return (
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => setScreen('cards')}>
        <Text style={styles.backButtonText}>← Torna alla lista carte</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Scheda carta</Text>
      <View style={styles.cardShell}>
        <View style={styles.cardDualImages}>
          <View style={styles.cardFaceBlock}>
            <Text style={styles.cardFaceLabel}>FRONTE</Text>
            <View style={styles.cardHalfSkeleton} />
            <Image source={{ uri: resolveAssetUri(activeCard.image) }} style={[styles.cardHalfImage as any, detailFilter]} resizeMode="contain" />
            <View style={[styles.cardImageToneOverlayLarge, detailOverlay]} pointerEvents="none" />
          </View>
          <View style={styles.cardFaceBlock}>
            <Text style={styles.cardFaceLabel}>RETRO</Text>
            <View style={styles.cardHalfSkeleton} />
            <Image source={{ uri: resolveAssetUri(activeCard.back) }} style={[styles.cardHalfImage as any, detailFilter]} resizeMode="contain" />
            <View style={[styles.cardImageToneOverlayLarge, detailOverlay]} pointerEvents="none" />
          </View>
        </View>
        <View style={styles.cardInfoBox}>
          <Text style={styles.cardTitle}>{activeCard.name}</Text>
          <Text style={styles.cardSmall}>#{activeCard.number} · {activeSet.title}</Text>

          <View style={styles.infoLine}><Text style={styles.infoLabel}>Nome</Text><Text style={styles.infoValue}>{activeCard.name}</Text></View>
          <View style={styles.infoLine}><Text style={styles.infoLabel}>Numero</Text><Text style={styles.infoValue}>#{activeCard.number}</Text></View>
          <View style={styles.infoLine}><Text style={styles.infoLabel}>Subject</Text><Text style={styles.infoValue}>{activeCard.subject}</Text></View>
          <View style={styles.infoLine}><Text style={styles.infoLabel}>Retro</Text><Text style={styles.infoValue}>Immagine retro caricata da Bulbagarden Archives</Text></View>
        </View>
      </View>
    </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, isPokemonTheme && styles.safePokemonTheme]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.headerBand, isPokemonTheme && styles.headerBandPokemonTheme]}>
        <View style={[styles.header, isPokemonTheme && styles.headerPokemonTheme]}>
          <Text style={styles.headerTitle}>LaminCollect</Text>
        </View>
      </View>
      <View style={styles.searchSubBand}>
        <TouchableOpacity style={styles.homeIconBtn} onPress={() => setScreen('home')}>
          <View style={styles.homeIconWrap}>
            <View style={styles.homeRoof} />
            <View style={styles.homeBody} />
          </View>
        </TouchableOpacity>

        <View style={styles.searchWrap}>
          <View style={styles.searchRowRight}>
            {searchOpen ? (
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Cerca carte o espansioni"
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
                autoFocus
              />
            ) : null}
            <TouchableOpacity
              style={styles.searchIconBtn}
              onPress={() => {
                if (searchOpen && searchQuery.trim()) return;
                if (searchOpen) setSearchQuery('');
                setSearchOpen((v) => !v);
              }}
            >
              <View style={styles.searchIconWrap}>
                <View style={styles.searchLensCircle} />
                <View style={styles.searchLensHole} />
                <View style={styles.searchLensHandle} />
              </View>
            </TouchableOpacity>
          </View>

          {searchOpen && (searchCardSuggestions.length > 0 || searchCollectionSuggestions.length > 0) ? (
            <View style={styles.searchDropdown}>
              {searchCollectionSuggestions.map((collection) => (
                <TouchableOpacity
                  key={`${collection.universeId}:${collection.id}`}
                  style={styles.searchDropdownItem}
                  onPress={() => openSearchCollection(collection.universeId, collection.id as CollectionId)}
                >
                  <Image source={universeLogos[collection.universeId] || pokemonLogoPng} style={styles.searchDropdownThumb} resizeMode="contain" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.searchDropdownText}>{collection.title}</Text>
                    <Text style={styles.searchDropdownMeta}>Espansione</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {searchCardSuggestions.map((card) => (
                <TouchableOpacity key={card.id} style={styles.searchDropdownItem} onPress={() => openSearchCard(card.id)}>
                  <Image source={{ uri: card.image }} style={styles.searchDropdownThumb} resizeMode="cover" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.searchDropdownText}>{card.name}</Text>
                    <Text style={styles.searchDropdownMeta}>Carta</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </View>
      {screen === 'home' && renderHome()}
      {screen === 'collections' && renderCollections()}
      {screen === 'cards' && renderCards()}
      {screen === 'pack' && renderPack()}
      {screen === 'card' && renderCard()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#06080D' },
  safePokemonTheme: { backgroundColor: '#110708' },
  headerBand: { backgroundColor: '#1D4ED8', borderBottomWidth: 2, borderBottomColor: '#0B1220' },
  headerBandPokemonTheme: { backgroundColor: '#B91C1C', borderBottomColor: '#450A0A' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, alignItems: 'center' },
  headerPokemonTheme: { },
  headerTitle: { color: '#F1EDE2', fontSize: 34, fontWeight: '900', fontFamily: 'Bungee' as any, letterSpacing: 0.8, textTransform: 'uppercase', textAlign: 'center', textShadowColor: '#1E3A8A', textShadowOffset: { width: 1.8, height: 1.8 }, textShadowRadius: 0.8 },
  searchSubBand: { backgroundColor: '#0B1220', borderBottomWidth: 1, borderBottomColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 40 },
  homeIconBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: '#334155', backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  homeIconWrap: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  homeRoof: { width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#E2E8F0', marginBottom: -1 },
  homeBody: { width: 10, height: 8, backgroundColor: '#E2E8F0', borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, marginTop: 0 },
  searchWrap: { width: '78%', maxWidth: 380, minWidth: 180, position: 'relative' },
  searchRowRight: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 6 },
  searchIconBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: '#334155', backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  searchIconWrap: { width: 16, height: 16, position: 'relative' },
  searchLensCircle: { width: 12, height: 12, borderRadius: 99, backgroundColor: '#E2E8F0' },
  searchLensHole: { position: 'absolute', width: 7, height: 7, borderRadius: 99, backgroundColor: '#111827', top: 2.5, left: 2.5 },
  searchLensHandle: { position: 'absolute', width: 7, height: 3, backgroundColor: '#E2E8F0', right: -1, bottom: 0, transform: [{ rotate: '45deg' }] as any, borderRadius: 2 },
  searchInput: { flex: 1, backgroundColor: '#111827', color: '#F8FAFC', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 12, fontWeight: '700' },
  searchDropdown: { position: 'absolute', top: 40, left: 0, right: 0, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155', borderRadius: 12, overflow: 'hidden', zIndex: 50 },
  searchDropdownItem: { paddingHorizontal: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#1E293B', flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchDropdownThumb: { width: 20, height: 28, borderRadius: 4, borderWidth: 1, borderColor: '#334155', backgroundColor: '#0B1220' },
  searchDropdownText: { color: '#E2E8F0', fontSize: 12, fontWeight: '700', flex: 1 },
  searchDropdownMeta: { color: '#94A3B8', fontSize: 10, fontWeight: '700', marginTop: 1 },
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
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionSearchBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: '#334155', backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  universeSearchInput: { backgroundColor: '#111827', color: '#F8FAFC', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 12, fontWeight: '700', marginTop: -4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  universeTile: { width: '48%', backgroundColor: '#0F172A', borderRadius: 16, padding: 8, borderWidth: 1, borderColor: '#1E293B', minHeight: 56 },
  universeBadge: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  universeBadgeLogo: { width: '100%', backgroundColor: 'transparent' },
  universeBadgeMarvel: { backgroundColor: 'transparent', borderRadius: 8, paddingHorizontal: 4 },
  universeLogoImage: { width: '100%', height: 34 },
  universeLogoImageFeature: { height: 40 },
  universeLogoImageGormiti: { height: 44 },
  universeEmoji: { fontSize: 24 },
  universeName: { color: '#F8FAFC', fontSize: 16, fontWeight: '800', marginTop: 12 },
  universeInfo: { color: '#94A3B8', fontSize: 12, lineHeight: 17, marginTop: 6 },
  backButton: { alignSelf: 'flex-start', backgroundColor: '#111827', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderColor: '#1F2937' },
  backButtonText: { color: '#E2E8F0', fontSize: 12, fontWeight: '800' },
  collectionsHero: { flexDirection: 'row', gap: 12, backgroundColor: '#0F172A', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#1E293B', alignItems: 'center' },
  collectionsHeroLogo: { width: '100%', height: 46 },
  collectionsHeroLogoMarvel: { height: 46 },
  collectionsBadge: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  collectionsEmoji: { fontSize: 28 },
  collectionsTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '900' },
  collectionsSubtitle: { color: '#94A3B8', fontSize: 13, marginTop: 5, lineHeight: 18 },
  collectionCard: { backgroundColor: '#0F172A', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#1E293B', flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  collectionMainRow: { flex: 1, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  collectionSealedImage: { width: 68, height: 104, borderRadius: 10, borderWidth: 1, borderColor: '#334155', backgroundColor: '#111827' },
  collectionUniverseLogo: { width: 84, height: 36, marginTop: 2 },
  collectionCardDisabled: { opacity: 0.68 },
  collectionAccent: { width: 6, borderRadius: 999 },
  collectionTopRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'center' },
  collectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '800', flex: 1 },
  collectionPill: { backgroundColor: '#172554', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  collectionPillText: { color: '#DBEAFE', fontSize: 10, fontWeight: '900' },
  collectionSubtitle: { color: '#CBD5E1', fontSize: 13, lineHeight: 18, marginTop: 8 },
  collectionMeta: { color: '#64748B', fontSize: 12, marginTop: 8 },
  listHero: { backgroundColor: '#111827', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#1F2937' },
  listHeroMainRow: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  listHeroTextCol: { flex: 1, minHeight: 124 },
  listHeroSealedImageTall: { width: 94, height: 124, alignSelf: 'flex-start', borderRadius: 12, borderWidth: 1, borderColor: '#334155', backgroundColor: '#0F172A' },
  listEyebrow: { color: '#F59E0B', fontSize: 11, fontWeight: '900', letterSpacing: 1.6, marginBottom: 6 },
  listTitle: { color: '#F8FAFC', fontSize: 19, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase', textShadowColor: 'rgba(96, 165, 250, 0.28)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 },
  listSubtitle: { color: '#CBD5E1', fontSize: 13, lineHeight: 18, marginTop: 8 },
  listMeta: { color: '#60A5FA', fontSize: 12, marginTop: 8, fontWeight: '700' },
  gridSwitchRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  gridSwitchBtn: { backgroundColor: '#0F172A', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#334155' },
  namesToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 'auto', paddingHorizontal: 4 },
  namesToggleText: { color: '#CBD5E1', fontSize: 11, fontWeight: '800' },
  checkboxBase: { width: 16, height: 16, borderRadius: 4, borderWidth: 1, borderColor: '#475569', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A' },
  checkboxChecked: { borderColor: '#60A5FA', backgroundColor: '#172554' },
  checkboxTick: { color: '#F8FAFC', fontSize: 11, fontWeight: '900', lineHeight: 11 },
  filterBtn: { width: 42, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0 },
  funnelIconWrap: { width: 16, alignItems: 'center', justifyContent: 'center', gap: 0 },
  funnelTopBar: { width: 14, height: 2, borderRadius: 99, backgroundColor: '#CBD5E1', marginBottom: 1 },
  funnelIconBody: { width: 14, height: 11, backgroundColor: '#CBD5E1', clipPath: 'polygon(0% 0%, 100% 0%, 64% 56%, 64% 100%, 38% 100%, 38% 56%)' as any },
  funnelActive: { backgroundColor: '#F8FAFC' },
  gridSwitchBtnActive: { backgroundColor: '#172554', borderColor: '#60A5FA' },
  gridSwitchText: { color: '#CBD5E1', fontSize: 11, fontWeight: '800' },
  gridSwitchTextActive: { color: '#F8FAFC' },
  sortPanel: { marginTop: 10, backgroundColor: '#0B1220', borderWidth: 1, borderColor: '#1E293B', borderRadius: 14, padding: 8, gap: 6 },
  sortOption: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 9, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1F2937' },
  sortOptionActive: { backgroundColor: '#172554', borderColor: '#60A5FA' },
  sortOptionText: { color: '#CBD5E1', fontSize: 12, fontWeight: '700' },
  sortOptionTextActive: { color: '#F8FAFC' },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignSelf: 'center', width: '100%' },
  cardTile: { backgroundColor: '#0F172A', borderRadius: 10, padding: 3, borderWidth: 1, borderColor: '#1E293B', boxSizing: 'border-box' as any },
  cardTileImageWrap: { position: 'relative' },
  cardTileSkeleton: { position: 'absolute', inset: 0, borderRadius: 10, backgroundColor: '#172033' },
  cardTileImage: { width: '100%', aspectRatio: 0.72, borderRadius: 10, backgroundColor: 'transparent' },
  cardImageToneOverlay: { position: 'absolute', inset: 0, borderRadius: 10, backgroundColor: 'rgba(96, 165, 250, 0.045)' },
  cardTileBackBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(15, 23, 42, 0.88)', borderRadius: 999, paddingHorizontal: 6, paddingVertical: 3, borderWidth: 1, borderColor: '#334155' },
  cardTileBackBadgeText: { color: '#E2E8F0', fontSize: 8, fontWeight: '900' },
  cardTileNumber: { color: '#60A5FA', fontSize: 9, fontWeight: '900', marginTop: 5 },
  cardTileName: { color: '#FFDE59', fontSize: 9, fontWeight: '800', fontFamily: 'Arial Rounded MT Bold, Trebuchet MS, Verdana, sans-serif' as any, marginTop: 4, letterSpacing: 0.1, textTransform: 'uppercase', textShadowColor: '#1E3A8A', textShadowOffset: { width: 0.6, height: 0.6 }, textShadowRadius: 0.4, lineHeight: 11, minHeight: 11 },
  packInfoCard: { backgroundColor: '#0F172A', borderRadius: 20, borderWidth: 1, borderColor: '#1E293B', padding: 12, gap: 12 },
  packInfoImage: { width: '100%', height: 260, borderRadius: 12, backgroundColor: '#111827' },
  packInfoBody: { gap: 8 },
  packInfoTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '900' },
  packInfoDate: { color: '#60A5FA', fontSize: 13, fontWeight: '700' },
  packInfoText: { color: '#CBD5E1', fontSize: 13, lineHeight: 19 },
  cardShell: { gap: 14 },
  cardDualImages: { flexDirection: 'row', gap: 10 },
  cardFaceBlock: { flex: 1, gap: 8, position: 'relative' },
  cardFaceLabel: { color: '#60A5FA', fontSize: 11, fontWeight: '900', letterSpacing: 1, textAlign: 'center' },
  cardHalfSkeleton: { position: 'absolute', inset: 0, borderRadius: 20, backgroundColor: '#172033' },
  cardHalfImage: { flex: 1, height: 360, borderRadius: 20, backgroundColor: 'transparent' },
  cardImageToneOverlayLarge: { position: 'absolute', inset: 0, borderRadius: 20, backgroundColor: 'rgba(96, 165, 250, 0.04)' },
  cardInfoBox: { backgroundColor: '#0F172A', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#1E293B', gap: 10 },
  cardTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '900' },
  cardSmall: { color: '#94A3B8', fontSize: 13, marginBottom: 4 },
  infoLine: { backgroundColor: '#111827', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#1F2937' },
  infoLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  infoValue: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginTop: 4 },
});
