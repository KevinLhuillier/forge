import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton, Panel, ScreenBackground } from '@/components/hud';
import { supabase } from '@/lib/supabase';
import { colors, fonts, haptics, spacing } from '@/theme';

type Mode = 'signIn' | 'signUp';

function errorMessage(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'Wrong email or password.';
  if (/email not confirmed/i.test(message)) return 'Confirm your email first, then sign in.';
  if (/already (been )?registered/i.test(message)) return 'This email already has an account.';
  if (/password should be at least/i.test(message)) return 'Use a longer password.';
  if (/rate limit|for security purposes/i.test(message)) return 'Too many tries. Wait a moment.';
  return message;
}

export default function SignIn() {
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const canSubmit = email.includes('@') && password.length >= 6;

  async function submit() {
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const credentials = { email: email.trim(), password };
      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword(credentials);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp(credentials);
        if (error) throw error;
        // With "Confirm email" enabled, Supabase returns no session yet.
        if (!data.session) {
          setInfo('Account created. Check your email to confirm it, then sign in.');
          setMode('signIn');
        }
      }
      // On success the guard in _layout switches to the app.
    } catch (e) {
      haptics.error();
      setError(errorMessage(e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <SafeAreaView style={styles.root}>
        <KeyboardAvoidingView style={styles.root} behavior="padding">
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.hero}>
              <Text style={styles.logo}>FORGE</Text>
              <Text style={styles.tagline}>Level up your CrossFit, one set at a time.</Text>
            </View>

            <Panel accent={colors.rx} style={styles.form}>
              <Text style={styles.heading}>
                {mode === 'signIn' ? 'ENTER THE FORGE' : 'CREATE ATHLETE'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                textContentType={mode === 'signIn' ? 'password' : 'newPassword'}
                onSubmitEditing={() => canSubmit && submit()}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {info ? <Text style={styles.info}>{info}</Text> : null}
              <ActionButton
                label={mode === 'signIn' ? 'SIGN IN' : 'SIGN UP'}
                onPress={submit}
                loading={loading}
                disabled={!canSubmit}
              />
            </Panel>

            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => {
                setMode(mode === 'signIn' ? 'signUp' : 'signIn');
                setError(null);
                setInfo(null);
              }}>
              <Text style={styles.switch}>
                {mode === 'signIn' ? 'New here? Create an account' : 'Already an athlete? Sign in'}
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.xl },
  hero: { alignItems: 'center', gap: spacing.xs },
  logo: {
    fontFamily: fonts.displayHeavy,
    fontSize: 46,
    letterSpacing: 8,
    color: colors.rx,
    textShadowColor: colors.rx,
    textShadowRadius: 18,
  },
  tagline: { fontFamily: fonts.body, fontSize: 18, color: colors.textMuted, textAlign: 'center' },
  form: { gap: spacing.md, padding: spacing.xl },
  heading: { fontFamily: fonts.display, fontSize: 16, letterSpacing: 2, color: colors.text },
  input: {
    height: 52,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.text,
    fontFamily: fonts.bodySemi,
    fontSize: 18,
  },
  error: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.danger },
  info: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.scaled },
  switch: {
    fontFamily: fonts.bodySemi,
    fontSize: 17,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
