// Paleta corporativa ADHSOFT SPORT
export const Colors = {
  // Identidad principal (ADHSOFT SPORT LOGO)
  primary:         '#1C4A85',   // Azul marino (Logo texto)
  primaryLight:    '#15ADE5',   // Azul Cyan/Celeste (Logo interno)
  accent:          '#50AB46',   // Verde Suave (Estrellas / Borde externo)
  accentDark:      '#3F8737',   // Verde oscuro hover

  // Estado
  success:         '#27AE60',
  warning:         '#F39C12',
  danger:          '#E74C3C',
  info:            '#3498DB',

  // Fondos (Dark Mode Premium adaptado al logo)
  background:      '#05111F',   // Fondo principal azul super oscuro
  surface:         '#10243C',   // Superficie de tarjetas azul marino
  surfaceHover:    '#183350',   // Tarjeta hover
  border:          '#1C4A85',   // Bordes sutiles (Color Primario puro)
  borderLight:     '#2963A8',   // Bordes visibles

  // Texto
  textPrimary:     '#FFFFFF',
  textSecondary:   '#8BA3BC',
  textMuted:       '#5A7A99',
  textInverse:     '#0D1B2A',

  // Gradientes
  gradientMain:    ['#1C4A85', '#05111F'] as const,
  gradientAccent:  ['#50AB46', '#3F8737'] as const,
  gradientCard:    ['#10243C', '#05111F'] as const,
  gradientHero:    ['#15ADE5', '#1C4A85', '#05111F'] as const,

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
    Cancelado:  '#E74C3C', // Red for Cancelado instead of grey which is used for Finalizado
    Finalizado: '#3498DB',
    Reprogramado: '#F39C12'
  } as Record<string, string>,

  // Estados de cancha
  estadoCanchaColors: {
    Activa: '#27AE60',
    Inactiva: '#F39C12',
    Anulada: '#E74C3C'
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
    shadowColor: '#15ADE5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: '#50AB46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  }
};
