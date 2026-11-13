import { Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';
import {
  Rajdhani_500Medium,
  Rajdhani_600SemiBold,
  Rajdhani_700Bold,
} from '@expo-google-fonts/rajdhani';
import { Ubuntu_400Regular, Ubuntu_500Medium, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from '@/lib/auth';
import { ProgressProvider } from '@/lib/progress';
import { clearRecap, refreshRecap } from '@/lib/recap';
import { colors, todoColors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <AuthProvider>
        <ProgressProvider>
          <RootNavigator />
        </ProgressProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const [fontsLoaded, fontError] = useFonts({
    Orbitron_700Bold,
    Orbitron_900Black,
    Rajdhani_500Medium,
    Rajdhani_600SemiBold,
    Rajdhani_700Bold,
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_700Bold,
  });
  const { session, ready } = useAuth();
  const loading = (!fontsLoaded && !fontError) || !ready;

  useEffect(() => {
    if (!loading) SplashScreen.hide();
  }, [loading]);

  // The evening recap follows the data, so it is rebuilt each time the app comes back.
  const signedIn = !!session;
  useEffect(() => {
    if (!ready) return;
    if (!signedIn) {
      clearRecap();
      return;
    }
    refreshRecap();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshRecap();
    });
    return () => subscription.remove();
  }, [ready, signedIn]);

  if (loading) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        {/* Guards switch screens automatically when the session changes. */}
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="index" />
          <Stack.Screen name="forge" />
          <Stack.Screen
            name="todo"
            options={{ contentStyle: { backgroundColor: todoColors.background } }}
          />
          <Stack.Screen
            name="calendar"
            options={{ contentStyle: { backgroundColor: todoColors.background } }}
          />
          <Stack.Screen
            name="settings"
            options={{ contentStyle: { backgroundColor: todoColors.background } }}
          />
          <Stack.Screen name="skill/[id]" />
          <Stack.Screen name="prs" />
          <Stack.Screen name="stats" />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
