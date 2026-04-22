import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { ChevronRight, Radio } from 'lucide-react-native';

const PulseDot: React.FC<{ color?: string; size?: number }> = ({
  color = '#FF3B30',
  size = 8,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 2.2,
            duration: 1100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 1100, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale, opacity]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        }}
      />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
};

interface Props {
  cityName: string;
  travelersCount: number;
  eventsCount: number;
  startingSoonCount: number;
  onPress?: () => void;
}

const LivePulseBanner: React.FC<Props> = ({
  cityName,
  travelersCount,
  eventsCount,
  startingSoonCount,
  onPress,
}) => (
  <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#262626',
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <PulseDot />
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 11,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}
          >
            Live in {cityName}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 8 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '800', letterSpacing: -1 }}>
            {travelersCount}
          </Text>
          <Text style={{ color: '#A8A8A8', fontSize: 14, marginLeft: 6 }}>
            travelers here right now
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
          <Radio size={12} color="#A8A8A8" />
          <Text style={{ color: '#A8A8A8', fontSize: 12 }}>
            {eventsCount} events ·{' '}
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
              {startingSoonCount} starting soon
            </Text>
          </Text>
        </View>
      </View>

      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.12)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChevronRight size={20} color="#FFFFFF" />
      </View>
    </Pressable>
  </View>
);

export default LivePulseBanner;
