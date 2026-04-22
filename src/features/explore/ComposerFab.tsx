import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';

interface Props {
  visible: boolean;
  bottomOffset: number;
  onPress: () => void;
}

/**
 * Floating `+` FAB shown at bottom-right while the in-feed Composer is off-screen.
 * Tap → scroll back to the composer's position.
 */
const ComposerFab: React.FC<Props> = ({ visible, bottomOffset, onPress }) => {
  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={{
        position: 'absolute',
        right: 16,
        // Pulled deep into the tab bar zone so the FAB visually hugs the nav.
        // Clamped to ≥ 6 px from screen bottom so it's never cut off.
        bottom: Math.max(6, bottomOffset - 36),
        opacity: anim,
        transform: [
          {
            scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
          },
          {
            translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }),
          },
        ],
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: '#262626',
          alignItems: 'center',
          justifyContent: 'center',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
            },
            android: { elevation: 6 },
          }),
        }}
      >
        <Plus size={22} color="#FFFFFF" strokeWidth={2.6} />
      </Pressable>
    </Animated.View>
  );
};

export default ComposerFab;
