import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Compass, Globe2, Users, ChevronRight } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

type Stat = {
  id: string;
  label: string;
  value: number;
  goal: number;
  icon: LucideIcon;
};

const STATS: Stat[] = [
  { id: 'cities', label: 'Cities', value: 3, goal: 15, icon: Compass },
  { id: 'languages', label: 'Languages', value: 2, goal: 10, icon: Globe2 },
  { id: 'locals', label: 'Locals met', value: 5, goal: 25, icon: Users },
];

const ProgressBar: React.FC<{ value: number; goal: number }> = ({ value, goal }) => {
  const pct = Math.min(1, value / goal);
  return (
    <View
      style={{
        height: 3,
        borderRadius: 999,
        backgroundColor: '#EFEFEF',
        overflow: 'hidden',
        marginTop: 6,
      }}
    >
      <View
        style={{
          width: `${pct * 100}%`,
          height: '100%',
          backgroundColor: '#262626',
        }}
      />
    </View>
  );
};

const StatBlock: React.FC<{ stat: Stat }> = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon size={14} color="#8E8E8E" />
        <Text
          style={{
            fontSize: 11,
            color: '#8E8E8E',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
          }}
        >
          {stat.label}
        </Text>
      </View>
      <Text
        style={{
          fontWeight: '700',
          fontSize: 22,
          color: '#262626',
          marginTop: 4,
        }}
      >
        {stat.value}
        <Text
          style={{
            fontWeight: '400',
            fontSize: 13,
            color: '#8E8E8E',
          }}
        >
          {' / '}
          {stat.goal}
        </Text>
      </Text>
      <ProgressBar value={stat.value} goal={stat.goal} />
    </View>
  );
};

const PassportCard: React.FC<{ onPress?: () => void }> = ({ onPress }) => (
  <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DBDBDB',
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 11,
              color: '#8E8E8E',
              textTransform: 'uppercase',
              letterSpacing: 0.6,
            }}
          >
            Your Passport
          </Text>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 16,
              color: '#262626',
              marginTop: 2,
              letterSpacing: -0.2,
            }}
          >
            Level 2 · Curious Traveler
          </Text>
        </View>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#FAFAFA',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={16} color="#262626" />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        {STATS.map((s) => (
          <StatBlock key={s.id} stat={s} />
        ))}
      </View>
    </Pressable>
  </View>
);

export default PassportCard;
