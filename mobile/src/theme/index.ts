// Paleta corporativa ChapatuCancha
export const Colors = {
  // Identidad principal (ChapatuCancha LOGO)
  primary:         '#2EAB3A',   // Verde principal del logo
  primaryLight:    '#4DC95A',   // Verde claro
  primaryDark:     '#1E7A28',   // Verde oscuro hover
  accent:          '#1B75D0',   // Azul del logo (letras "ChapatuCancha")
  accentLight:     '#3A96ED',   // Azul claro
  accentDark:      '#1459A8',   // Azul oscuro hover

  // Estado
  success:         '#2EAB3A',
  warning:         '#F39C12',
  danger:          '#E74C3C',
  info:            '#1B75D0',

  // Fondos (Dark Mode Premium - tonos verdes oscuros)
  background:      '#051208',   // Fondo principal verde super oscuro
  surface:         '#0A2010',   // Superficie de tarjetas verde oscuro
  surfaceHover:    '#12311A',   // Tarjeta hover
  border:          '#1E7A28',   // Bordes sutiles (Verde primario)
  borderLight:     '#2EAB3A',   // Bordes visibles

  // Texto
  textPrimary:     '#F0FDF4',
  textSecondary:   '#86EFAC',
  textMuted:       '#4ADE80',
  textInverse:     '#051208',

  // Gradientes
  gradientMain:    ['#1E7A28', '#051208'] as const,
  gradientAccent:  ['#2EAB3A', '#1E7A28'] as const,
  gradientCard:    ['#0A2010', '#051208'] as const,
  gradientHero:    ['#4DC95A', '#2EAB3A', '#051208'] as const,

  // Badges de categoría
  categoryColors: {
    FutbolFemeninoLibre: '#E91E8E',
    AdultosLibre:        '#1B75D0',
    Master:              '#9B59B6',
    Sub15:               '#2EAB3A',
    Sub17:               '#F39C12',
    VoleyLibre:          '#E74C3C',
  } as Record<string, string>,

  // Estados de partido
  estadoColors: {
    Abierto:    '#2EAB3A',
    Completo:   '#E74C3C',
    Cancelado:  '#E74C3C',
    Finalizado: '#1B75D0',
    Reprogramado: '#F39C12'
  } as Record<string, string>,

  // Estados de cancha
  estadoCanchaColors: {
    Activa: '#2EAB3A',
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
    shadowColor: '#2EAB3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: '#2EAB3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 6,
  }
};
