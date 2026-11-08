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
