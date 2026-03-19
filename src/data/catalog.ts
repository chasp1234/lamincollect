export type MacroCategory = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  subcategories: string[];
};

export const macroCategories: MacroCategory[] = [
  {
    id: 'base-classic',
    title: 'Base & Classiche',
    subtitle: 'Le serie originali, storiche e fondative.',
    emoji: '📘',
    color: '#4F7CFF',
    subcategories: [
      'Prima serie',
      'Seconda serie',
      'Terza serie',
      'Ristampe classiche',
      'Speciali vintage',
    ],
  },
  {
    id: 'main-expansions',
    title: 'Espansioni Principali',
    subtitle: 'Le uscite regolari da raccogliere e completare.',
    emoji: '🧩',
    color: '#16C47F',
    subcategories: [
      'Serie regolari',
      'Mini set',
      'Set tematici',
      'Set stagionali',
      'Set anniversary',
    ],
  },
  {
    id: 'promo-official',
    title: 'Promozionali Ufficiali',
    subtitle: 'Promo distribuite da canali ufficiali e campagne brand.',
    emoji: '✨',
    color: '#F59E0B',
    subcategories: [
      'Eventi ufficiali',
      'Promo limited',
      'Bundle & gift box',
      'Starter pack promo',
      'Reward campaign',
    ],
  },
  {
    id: 'food-partnerships',
    title: 'Promo Food & Retail',
    subtitle: 'Yogurt, latte, pizza, snack, supermercati e promo pazze.',
    emoji: '🍕',
    color: '#EF4444',
    subcategories: [
      'Yogurt',
      'Latte',
      'Pizza',
      'Merendine & snack',
      'Supermercati',
    ],
  },
  {
    id: 'newsstand-media',
    title: 'Edicola & Media',
    subtitle: 'Allegati da giornali, riviste, edicola e collane speciali.',
    emoji: '🗞️',
    color: '#8B5CF6',
    subcategories: [
      'Edicola',
      'Riviste',
      'Giornali',
      'Collezioni a fascicoli',
      'Allegati promo',
    ],
  },
  {
    id: 'modern-specials',
    title: 'Moderne & Speciali',
    subtitle: 'Le linee più recenti, premium, chase e sperimentali.',
    emoji: '🚀',
    color: '#06B6D4',
    subcategories: [
      'Modern era',
      'Special edition',
      'Chase cards',
      'Exclusive drops',
      'Collab speciali',
    ],
  },
];

export const appLevels = [
  'Carta Straccia',
  'Legno',
  'Bronzo',
  'Argento',
  'Oro',
  'Diamante',
  'Titanio',
  'Archivista Supremo',
];

export const featuredSets = [
  {
    id: 'pokemon-advance-ex1',
    title: 'Pokémon Advance / EX Ruby & Sapphire',
    category: 'Espansioni Principali',
    progress: 0,
    totalCards: 109,
    owned: 0,
    imageLabel: 'ADV',
  },
  {
    id: 'set-001',
    title: 'Serie Base 1',
    category: 'Base & Classiche',
    progress: 68,
    totalCards: 120,
    owned: 82,
    imageLabel: 'BASE',
  },
  {
    id: 'set-002',
    title: 'Promo Yogurt Mania',
    category: 'Promo Food & Retail',
    progress: 21,
    totalCards: 24,
    owned: 5,
    imageLabel: 'YOGO',
  },
  {
    id: 'set-003',
    title: 'Speciali Edicola Gold',
    category: 'Edicola & Media',
    progress: 40,
    totalCards: 30,
    owned: 12,
    imageLabel: 'PRESS',
  },
  {
    id: 'set-004',
    title: 'Modern Blast 2024',
    category: 'Moderne & Speciali',
    progress: 9,
    totalCards: 80,
    owned: 7,
    imageLabel: 'BLAST',
  },
];