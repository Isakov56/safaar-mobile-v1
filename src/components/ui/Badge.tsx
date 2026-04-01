import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';

type BadgeVariant = 'gold' | 'success' | 'warning' | 'error' | 'traveler' | 'local' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  testID?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  gold: { bg: '#E8D5A8', text: '#8B6914' },
  success: { bg: '#E8F5E9', text: '#2E7D32' },
  warning: { bg: '#FFF3E0', text: '#E65100' },
  error: { bg: '#FFEBEE', text: '#C62828' },
  traveler: { bg: '#FBE9E7', text: '#BF360C' },
  local: { bg: '#E8F5E9', text: '#2E7D32' },
  outline: { bg: 'transparent', text: '#4A4A4A', border: '#F2EDE4' },
};

const sizeStyles: Record<BadgeSize, { paddingH: number; paddingV: number; fontSize: number }> = {
  sm: { paddingH: 8, paddingV: 2, fontSize: 11 },
  md: { paddingH: 12, paddingV: 4, fontSize: 13 },
};

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'gold',
  size = 'md',
  style,
  testID,
}) => {
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];

  return (
    <View
      testID={testID}
      style={[
        {
          backgroundColor: vStyle.bg,
          borderRadius: 999,
          paddingHorizontal: sStyle.paddingH,
          paddingVertical: sStyle.paddingV,
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          ...(vStyle.border ? { borderWidth: 1, borderColor: vStyle.border } : {}),
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: sStyle.fontSize,
          fontFamily: 'SourceSerif4-SemiBold',
          color: vStyle.text,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default Badge;
