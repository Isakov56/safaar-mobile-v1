import React, { useRef, useEffect } from 'react';
import {
  View,
  Pressable,
  Text,
  Animated,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';

interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleProps {
  options: ToggleOption[];
  selected: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
  testID?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  options,
  selected,
  onSelect,
  style,
  testID,
}) => {
  const containerWidth = useRef(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const selectedIndex = options.findIndex((o) => o.value === selected);
  const segmentCount = options.length;

  useEffect(() => {
    if (containerWidth.current === 0) return;
    const segmentWidth = containerWidth.current / segmentCount;
    Animated.spring(slideAnim, {
      toValue: selectedIndex * segmentWidth,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [selectedIndex, segmentCount, slideAnim]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    containerWidth.current = width;
    const segmentWidth = width / segmentCount;
    slideAnim.setValue(selectedIndex * segmentWidth);
  };

  return (
    <View
      testID={testID}
      onLayout={handleLayout}
      style={[
        {
          flexDirection: 'row',
          backgroundColor: '#FAFAFA',
          borderRadius: 12,
          padding: 4,
          position: 'relative',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          width: `${100 / segmentCount}%` as unknown as number,
          backgroundColor: '#262626',
          borderRadius: 10,
          transform: [{ translateX: slideAnim }],
        }}
      />

      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-SemiBold',
                color: isSelected ? '#FFFFFF' : '#3C3C3C',
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default Toggle;
