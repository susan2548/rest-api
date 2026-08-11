import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, radius, shadow, spacing } from '../constants/theme';

type ToastType = 'success' | 'error';

interface ToastState {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (message: string, type: ToastType = 'success') => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setToast({ message, type });
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 6 }),
      ]).start();

      hideTimer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 16, duration: 220, useNativeDriver: true }),
        ]).start(() => setToast(null));
      }, 2200);
    },
    [opacity, translateY]
  );

  const accent = toast?.type === 'success' ? colors.gold : colors.danger;
  const accentBright = toast?.type === 'success' ? colors.goldBright : colors.danger;
  const icon = toast?.type === 'success' ? 'checkmark-circle' : 'alert-circle';

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.container,
            shadow.card,
            { opacity, transform: [{ translateY }], borderColor: accent },
          ]}
        >
          <Ionicons name={icon} size={18} color={accentBright} style={styles.icon} />
          <Text style={[styles.text, { color: accentBright }]}>{toast.message}</Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
});
