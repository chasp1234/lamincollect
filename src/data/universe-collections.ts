export const universeCollections = {
  pokemon: [
    {
      id: 'pokemon-vertical',
      title: 'Lamincards Vertical',
      subtitle: 'Serie verticali, liste numerate, fronte / subject / retro',
      total: 100,
      accent: '#2563EB',
      pill: 'VERTICAL',
    },
    {
      id: 'pokemon-advanced',
      title: 'Pokémon Advanced',
      subtitle: 'Espansioni Advance, set numerati e checklist reali',
      total: 109,
      accent: '#0EA5E9',
      pill: 'ADVANCED',
    },
    {
      id: 'pokemon-promo',
      title: 'Promo & Speciali',
      subtitle: 'Edicola, retail, allegati e promo strane',
      total: 24,
      accent: '#7C3AED',
      pill: 'PROMO',
    },
  ],
  'dragon-ball': [
    {
      id: 'dragon-ball-core',
      title: 'Serie principali',
      subtitle: 'Base, movie, GT e set classici',
      total: 48,
      accent: '#F97316',
      pill: 'CORE',
    },
  ],
  'yu-gi-oh': [
    {
      id: 'yugioh-core',
      title: 'Set base',
      subtitle: 'Prima ondata, speciali e limited',
      total: 36,
      accent: '#8B5CF6',
      pill: 'CORE',
    },
  ],
  naruto: [
    {
      id: 'naruto-core',
      title: 'Shinobi archive',
      subtitle: 'Espansioni, foil e promo',
      total: 28,
      accent: '#EF4444',
      pill: 'NINJA',
    },
  ],
  'one-piece': [
    {
      id: 'onepiece-core',
      title: 'Grand Line sets',
      subtitle: 'Starter, promo e allegati',
      total: 32,
      accent: '#06B6D4',
      pill: 'SEA',
    },
  ],
  mixed: [
    {
      id: 'mixed-weird',
      title: 'Promo strane',
      subtitle: 'Yogurt, pizza, riviste e robe fuori di testa',
      total: 18,
      accent: '#22C55E',
      pill: 'WEIRD',
    },
  ],
} as const;
