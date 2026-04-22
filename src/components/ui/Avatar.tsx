import React, { useMemo } from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle } from 'lucide-react-native';

interface AvatarProps {
  uri?: string | null;
  size?: number;
  name?: string;
  online?: boolean;
  verified?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const FALLBACK_COLORS = [
  '#C4993C',
  '#2E7D32',
  '#E65100',
  '#3C3C3C',
  '#8B6914',
  '#FF8A65',
  '#66BB6A',
  '#E53935',
] as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = 40,
  name,
  online,
  verified,
  style,
  testID,
}) => {
  const initials = useMemo(() => (name ? getInitials(name) : ''), [name]);
  const bgColor = useMemo(() => (name ? getColorFromName(name) : '#8E8E8E'), [name]);
  const initialsSize = Math.round(size * 0.38);
  const dotSize = Math.max(10, Math.round(size * 0.25));
  const badgeSize = Math.max(14, Math.round(size * 0.35));

  return (
    <View
      testID={testID}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          position: 'relative',
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: initialsSize,
              fontFamily: 'SourceSerif4-SemiBold',
            }}
          >
            {initials}
          </Text>
        </View>
      )}

      {online && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: '#2E7D32',
            borderWidth: 2,
            borderColor: '#FFFFFF',
          }}
        />
      )}

      {verified && (
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle size={badgeSize - 2} color="#1E88E5" fill="#1E88E5" />
        </View>
      )}
    </View>
  );
};

export default Avatar;
