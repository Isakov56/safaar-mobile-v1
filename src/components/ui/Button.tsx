import React, { useCallback } from 'react';
import {
  Pressable,
  ActivityIndicator,
  Text,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { LucideIcon } from 'lucide-react-native';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  pill?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

const variantStyles: Record<
  NonNullable<ButtonProps['variant']>,
  { container: string; text: string; iconColor: string }
> = {
  primary: {
    container: 'bg-gold',
    text: 'text-white',
    iconColor: '#FFFFFF',
  },
  secondary: {
    container: 'bg-ink',
    text: 'text-white',
    iconColor: '#FFFFFF',
  },
  outline: {
    container: 'bg-transparent border border-ink',
    text: 'text-ink',
    iconColor: '#1A1A1A',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-ink',
    iconColor: '#1A1A1A',
  },
};

const sizeStyles: Record<
  NonNullable<ButtonProps['size']>,
  { height: number; paddingHorizontal: number; fontSize: number; iconSize: number }
> = {
  sm: { height: 40, paddingHorizontal: 16, fontSize: 13, iconSize: 16 },
  md: { height: 50, paddingHorizontal: 24, fontSize: 15, iconSize: 18 },
  lg: { height: 56, paddingHorizontal: 32, fontSize: 17, iconSize: 20 },
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  pill = false,
  fullWidth = false,
  onPress,
  children,
  style,
  testID,
}) => {
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [disabled, loading, onPress]);

  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    height: sStyle.height,
    paddingHorizontal: sStyle.paddingHorizontal,
    borderRadius: pill ? 999 : 12,
    opacity: isDisabled ? 0.5 : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...(fullWidth ? { width: '100%' } : {}),
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize: sStyle.fontSize,
    fontFamily: 'SourceSerif4-SemiBold',
    lineHeight: sStyle.fontSize * 1.3,
  };

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      disabled={isDisabled}
      className={vStyle.container}
      style={({ pressed }) => [
        containerStyle,
        { opacity: pressed && !isDisabled ? 0.85 : isDisabled ? 0.5 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#1A1A1A' : '#FFFFFF'}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <View className="mr-sm">
              <Icon size={sStyle.iconSize} color={vStyle.iconColor} />
            </View>
          )}
          <Text className={vStyle.text} style={textStyle}>
            {children}
          </Text>
          {Icon && iconPosition === 'right' && (
            <View className="ml-sm">
              <Icon size={sStyle.iconSize} color={vStyle.iconColor} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};

export default Button;
