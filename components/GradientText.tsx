import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TextProps } from 'react-native';
import { gradients } from '../constants/theme';

interface GradientTextProps extends TextProps {
  colors?: readonly [string, string, ...string[]];
}

export default function GradientText({
  style,
  colors = gradients.gold,
  children,
  ...rest
}: GradientTextProps) {
  return (
    <MaskedView maskElement={<Text style={style} {...rest}>{children}</Text>}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={[style, { opacity: 0 }]} {...rest}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}
