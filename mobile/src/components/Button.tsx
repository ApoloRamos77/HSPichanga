import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle, View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, Typography, Shadows } from '../theme';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
}

export function Button({
  title, onPress, variant = 'accent', size = 'md',
  loading = false, disabled = false, style, leftIcon
}: Props) {

  const isAccent   = variant === 'accent';
  const isPrimary  = variant === 'primary';
  const isOutline  = variant === 'outline';

  const heights: Record<Size, number> = { sm: 40, md: 52, lg: 60 };
  const fontSizes: Record<Size, number> = { sm: 13, md: 15, lg: 17 };

  const buttonStyle: ViewStyle = {
    height: heights[size],
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    ...(isOutline ? {
      borderWidth: 2,
      borderColor: Colors.accent,
      backgroundColor: 'transparent'
    } : {}),
    ...((disabled || loading) ? { opacity: 0.6 } : {}),
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize: fontSizes[size],
    fontWeight: Typography.weight.bold,
    color: isOutline ? Colors.accent : Colors.textPrimary,
    letterSpacing: 0.5,
  };

  if (isAccent || isPrimary) {
    const gradColors = isAccent
      ? Colors.gradientAccent
      : Colors.gradientMain;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[buttonStyle, Shadows.button]}
      >
        <LinearGradient
          colors={gradColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
          // @ts-ignore
          borderRadius={Radius.lg}
        />
        {loading
          ? <ActivityIndicator color={Colors.textPrimary} />
          : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              {leftIcon}
              <Text style={textStyle}>{title}</Text>
            </View>
          )
        }
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={buttonStyle}
    >
      {loading
        ? <ActivityIndicator color={Colors.accent} />
        : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            {leftIcon}
            <Text style={textStyle}>{title}</Text>
          </View>
        )
      }
    </TouchableOpacity>
  );
}
