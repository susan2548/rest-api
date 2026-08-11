import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '../components/Toast';
import { colors, gradients } from '../constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerBackground: () => (
              <LinearGradient
                colors={gradients.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: colors.border }}
              />
            ),
            headerTintColor: colors.goldBright,
            headerTitleStyle: { color: colors.goldBright, fontWeight: '800' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Student Directory' }} />
          <Stack.Screen name="addPhone" options={{ title: 'New Contact' }} />
          <Stack.Screen name="editPhone" options={{ title: 'Edit Contact' }} />
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
