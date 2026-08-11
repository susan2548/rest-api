import React, { useState } from 'react';
import { BlurEvent, FocusEvent, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function Input({ label, error, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: FocusEvent) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: BlurEvent) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={colors.textDim}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  input: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    color: colors.text,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: colors.gold,
    ...shadow.gold,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
});
