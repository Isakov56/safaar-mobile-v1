import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Pressable, Animated, Easing } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import ActivityDrawer from './ActivityDrawer';

type Ping = {
  id: string;
  avatar: string;
  who: string;
  action: string;
  ago: string;
};

const PINGS: Ping[] = [
  {
    id: 'p1',
    avatar: 'https://i.pravatar.cc/80?u=alex',
    who: 'Alex',
    action: "joined Kamila's rooftop chai",
    ago: '1m',
  },
  {
    id: 'p2',
    avatar: 'https://i.pravatar.cc/80?u=mira',
    who: 'Mira',
    action: 'started a thread · "Best samsa in Tashkent?"',
    ago: '3m',
  },
  {
    id: 'p3',
    avatar: 'https://i.pravatar.cc/80?u=ravshan',
    who: 'Ravshan',
    action: 'is at Chorsu Bazaar right now',
    ago: '5m',
  },
  {
    id: 'p4',
    avatar: 'https://i.pravatar.cc/80?u=yuki',
    who: 'Yuki',
    action: 'invited 2 friends to Chimgan trip',
    ago: '6m',
  },
  {
    id: 'p5',
    avatar: 'https://i.pravatar.cc/80?u=ali',
    who: 'Ali',
    action: 'started a live talk · "Samarkand or Bukhara?"',
    ago: '8m',
  },
];

interface Props {
  cityName?: string;
}

const ActivityTicker: React.FC<Props> = ({ cityName = 'Tashkent' }) => {
  const [index, setIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cycle = setInterval(() => {
      Animated.sequence([
        Animated.timing(fade, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex((i) => (i + 1) % PINGS.length);
        Animated.timing(fade, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      });
    }, 3800);
    return () => clearInterval(cycle);
  }, [fade]);

  const p = PINGS[index];

  return (
    <View style={{ marginTop: 16 }}>
      <Pressable
        onPress={() => setDrawerOpen(true)}
        style={{
          marginHorizontal: 16,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 999,
          backgroundColor: '#FAFAFA',
          borderWidth: 1,
          borderColor: '#DBDBDB',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#10B981',
            marginRight: 8,
          }}
        />
        <Animated.View
          style={{
            opacity: fade,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Image
            source={{ uri: p.avatar }}
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              marginRight: 6,
              backgroundColor: '#F2F2F2',
            }}
          />
          <Text
            style={{
              fontSize: 12,
              color: '#262626',
              flex: 1,
            }}
            numberOfLines={1}
          >
            <Text style={{ fontWeight: '700' }}>{p.who}</Text>{' '}
            <Text style={{ color: '#3C3C3C' }}>{p.action}</Text>
          </Text>
        </Animated.View>
        <Text
          style={{ fontSize: 10, color: '#8E8E8E', fontWeight: '600', marginLeft: 6, marginRight: 4 }}
        >
          {p.ago}
        </Text>
        <ChevronRight size={14} color="#8E8E8E" />
      </Pressable>

      <ActivityDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cityName={cityName}
      />
    </View>
  );
};

export default ActivityTicker;
