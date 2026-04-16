// Paleta corporativa ADHSOFT SPORT
export const Colors = {
  // Identidad principal
  primary:         '#1A3C5E',   // Azul marino profundo
  primaryLight:    '#2A5C8E',   // Azul marino acento
  accent:          '#F5A623',   // Naranja dorado (CTAs)
  accentDark:      '#D4891A',   // Naranja oscuro hover

  // Estado
  success:         '#27AE60',
  warning:         '#F39C12',
  danger:          '#E74C3C',
  info:            '#3498DB',

  // Fondos (Dark Mode Premium)
  background:      '#0D1B2A',   // Fondo principal
  surface:         '#162236',   // Superficie de tarjetas
  surfaceHover:    '#1E2F45',   // Tarjeta hover
  border:          '#243B55',   // Bordes sutiles
  borderLight:     '#2E4F70',   // Bordes más visibles

  // Texto
  textPrimary:     '#FFFFFF',
  textSecondary:   '#8BA3BC',
  textMuted:       '#5A7A99',
  textInverse:     '#0D1B2A',

  // Gradientes
  gradientMain:    ['#1A3C5E', '#0D1B2A'] as const,
  gradientAccent:  ['#F5A623', '#D4891A'] as const,
  gradientCard:    ['#162236', '#0D1B2A'] as const,
  gradientHero:    ['#1A3C5E', '#162236', '#0D1B2A'] as const,

  // Badges de categoría
  categoryColors: {
    FutbolFemeninoLibre: '#E91E8E',
    AdultosLibre:        '#3498DB',
    Master:              '#9B59B6',
    Sub15:               '#27AE60',
    Sub17:               '#F39C12',
    VoleyLibre:          '#E74C3C',
  } as Record<string, string>,

  // Estados de partido
  estadoColors: {
    Abierto:    '#27AE60',
    Completo:   '#E74C3C',
    Cancelado:  '#95A5A6',
    Finalizado: '#3498DB',
  } as Record<string, string>,
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium:  'System',
    bold:    'System',
  },
  size: {
    xs:   11,
    sm:   13,
    base: 15,
    md:   17,
    lg:   20,
    xl:   24,
    xxl:  32,
    hero: 42,
  },
  weight: {
    regular: '400' as const,
    medium:  '500' as const,
    semibold:'600' as const,
    bold:    '700' as const,
    black:   '900' as const,
  }
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const Radius = {
  sm:   6,
  md:   12,
  lg:   18,
  xl:   24,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: '#F5A623',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  }
};
