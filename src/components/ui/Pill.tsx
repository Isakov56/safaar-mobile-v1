import React, { useCallback } from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { LucideIcon } from 'lucide-react-native';

interface PillProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: LucideIcon;
  color?: string;
  style?: ViewStyle;
  testID?: string;
}

const Pill: React.FC<PillProps> = ({
  label,
  selected = false,
  onPress,
  icon: Icon,
  color = '#C4993C',
  style,
  testID,
}) => {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  const bgColor = selected ? color : '#FFFFFF';
  const textColor = selected ? '#FFFFFF' : '#3C3C3C';
  const borderColor = selected ? color : '#FAFAFA';

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      style={({ pressed }) => [
        {
          backgroundColor: bgColor,
          borderRadius: 999,
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {Icon && (
        <View style={{ marginRight: 6 }}>
          <Icon size={14} color={textColor} />
        </View>
      )}
      <Text
        style={{
          fontSize: 13,
          fontFamily: 'SourceSerif4-SemiBold',
          color: textColor,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default Pill;
