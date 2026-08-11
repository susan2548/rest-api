import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AnimatedPressable from './AnimatedPressable';
import { colors, gradients, radius, shadow, spacing, typography } from '../constants/theme';

interface RadioOption<T extends string> {
  label: string;
  value: T;
}

interface RadioGroupProps<T extends string> {
  label: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export default function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: RadioGroupProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <AnimatedPressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.optionWrap, selected && shadow.gold]}
            >
              {selected ? (
                <LinearGradient
                  colors={gradients.gold}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.option}
                >
                  <Text style={styles.optionTextSelected}>{option.label}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.option, styles.optionOutlined]}>
                  <Text style={styles.optionText}>{option.label}</Text>
                </View>
              )}
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs + 2,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionWrap: {
    borderRadius: radius.md,
  },
  option: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  optionOutlined: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  optionText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '800',
  },
});
