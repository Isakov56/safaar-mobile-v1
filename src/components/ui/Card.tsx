import React, { useRef } from 'react';
import {
  Pressable,
  View,
  Animated,
  type ViewStyle,
  Platform,
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
  elevated?: boolean;
  testID?: string;
}

const shadowCard = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  android: {
    elevation: 2,
  },
  default: {},
});

const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  padding = 16,
  elevated = false,
  testID,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const containerStyle: ViewStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding,
    ...(elevated ? shadowCard : {}),
    ...style,
  };

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          testID={testID}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={containerStyle}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View testID={testID} style={containerStyle}>
      {children}
    </View>
  );
};

export default Card;
