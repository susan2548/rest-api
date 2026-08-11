import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AnimatedPressable from './AnimatedPressable';
import { colors, gradients, radius, shadow, spacing } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const textColor =
    variant === 'primary' ? colors.black : variant === 'danger' ? colors.danger : colors.gold;

  const content = loading ? (
    <ActivityIndicator color={textColor} />
  ) : (
    <View style={styles.contentRow}>
      {icon ? <Ionicons name={icon} size={18} color={textColor} style={styles.icon} /> : null}
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </View>
  );

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.shadowWrap, shadow.gold]}
      >
        <LinearGradient
          colors={gradients.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.base}
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, variant === 'secondary' && styles.secondary, variant === 'danger' && styles.danger]}
    >
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: radius.md,
    backgroundColor: 'transparent',
  },
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: colors.gold,
  },
  danger: {
    backgroundColor: colors.dangerWash,
    borderColor: colors.danger,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.xs + 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
