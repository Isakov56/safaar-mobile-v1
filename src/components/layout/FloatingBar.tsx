import React, { useRef, useEffect } from 'react';
import { View, Animated, Platform, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FloatingBarProps {
  children: React.ReactNode;
  visible?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const FloatingBar: React.FC<FloatingBarProps> = ({
  children,
  visible = true,
  style,
  testID,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(visible ? 0 : 120)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 120,
      useNativeDriver: true,
      speed: 16,
      bounciness: 4,
    }).start();
  }, [visible, translateY]);

  const shadow = Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
    default: {},
  });

  return (
    <Animated.View
      testID={testID}
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F2EDE4',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
          transform: [{ translateY }],
          ...shadow,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default FloatingBar;
