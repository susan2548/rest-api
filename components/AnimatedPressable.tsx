import React, { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  children: React.ReactNode;
}

export default function AnimatedPressable({
  style,
  scaleTo = 0.96,
  children,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: GestureResponderEvent) => {
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
    onPressOut?.(event);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      {...rest}
    >
      <Animated.View style={[style, { transform: [{ scale }] }, disabled && { opacity: 0.5 }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
