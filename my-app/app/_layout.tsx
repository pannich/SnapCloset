import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../provider/AuthProvider';

const InitialLayout = () => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!session && inAppGroup) {
      // Unauthenticated user trying to access protected app
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Logged in user trying to access login/register
      router.replace('/(tabs)');
    }
  }, [session, initialized, segments]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
