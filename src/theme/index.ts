import * as Haptics from 'expo-haptics';

export const colors = {
  background: '#06080F',
  surface: '#0C111C',
  surfaceRaised: '#141B2B',
  line: '#27324C',
  text: '#EAF2FF',
  textMuted: '#8F9EB8',
  onAccent: '#06080F',
  danger: '#FF5C7A',
  scaled: '#2FD9FF',
  intermediate: '#B08CFF',
  rx: '#FF7A1A',
};

/** Todo has its own look, apart from Forge's: deep indigo, one orange. */
export const todoColors = {
  background: '#20213A',
  surface: '#2B2C49',
  surfaceRaised: '#35365A',
  line: '#3D3E5F',
  text: '#FFFFFF',
  textMuted: '#A9AAC6',
  onAccent: '#20213A',
  accent: '#F58220',
  accentLight: '#FFA24A',
  danger: '#FF7A90',
};

export const todoFonts = {
  regular: 'Ubuntu_400Regular',
  medium: 'Ubuntu_500Medium',
  bold: 'Ubuntu_700Bold',
};

export const fonts = {
  display: 'Orbitron_700Bold',
  displayHeavy: 'Orbitron_900Black',
  body: 'Rajdhani_500Medium',
  bodySemi: 'Rajdhani_600SemiBold',
  bodyBold: 'Rajdhani_700Bold',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

/** Failures are swallowed: some devices have no haptics. */
export const haptics = {
  tap: () => Haptics.selectionAsync().catch(() => {}),
  press: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {}),
};
