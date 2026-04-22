import React from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { X as XIcon, ArrowRight } from 'lucide-react-native';

// ── Types ────────────────────────────────────────
type Suggestion = {
  id: string;
  name: string;
  age: number;
  photo: string;
  role: 'Local' | 'Traveler';
  city: string;
  flag: string;
  /** Why we're suggesting this person — mutual interest, date overlap,
   *  same hometown, hosting something, etc. */
  reason: string;
};

// ── Mock data ────────────────────────────────────
const SUGGESTIONS: Suggestion[] = [
  {
    id: 's1',
    name: 'Emma',
    age: 24,
    photo: 'https://i.pravatar.cc/300?u=emma-berlin',
    role: 'Traveler',
    city: 'Berlin',
    flag: '🇩🇪',
    reason: 'Here 3 days · dates overlap',
  },
  {
    id: 's2',
    name: 'Sergey',
    age: 29,
    photo: 'https://i.pravatar.cc/300?u=sergey-tashkent',
    role: 'Local',
    city: 'Tashkent',
    flag: '🇺🇿',
    reason: 'Hosts plov dinners Fridays',
  },
  {
    id: 's3',
    name: 'Chen',
    age: 26,
    photo: 'https://i.pravatar.cc/300?u=chen-shanghai',
    role: 'Traveler',
    city: 'Shanghai',
    flag: '🇨🇳',
    reason: '3 mutual interests',
  },
  {
    id: 's4',
    name: 'Mira',
    age: 27,
    photo: 'https://i.pravatar.cc/300?u=mira-tashkent',
    role: 'Local',
    city: 'Tashkent',
    flag: '🇺🇿',
    reason: 'Speaks EN · RU · UZ',
  },
  {
    id: 's5',
    name: 'Jonas',
    age: 31,
    photo: 'https://i.pravatar.cc/300?u=jonas-berlin',
    role: 'Traveler',
    city: 'Berlin',
    flag: '🇩🇪',
    reason: 'Also from Berlin',
  },
  {
    id: 's6',
    name: 'Aziza',
    age: 25,
    photo: 'https://i.pravatar.cc/300?u=aziza-tashkent',
    role: 'Local',
    city: 'Tashkent',
    flag: '🇺🇿',
    reason: 'Weekend photo walks',
  },
];

// ── Suggestion card ─────────────────────────────
// Split layout: photo top, white info bottom. Name + age, role + city,
// match reason, and a primary "Say hi" button. Small dismiss × at the
// top-right so users can clear suggestions they don't want.
const SuggestionCard: React.FC<{ s: Suggestion }> = ({ s }) => (
  <View
    style={{
      width: 172,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#EFEFEF',
    }}
  >
    {/* Photo */}
    <View style={{ width: 172, height: 180, position: 'relative' }}>
      <Image source={{ uri: s.photo }} style={{ width: 172, height: 180 }} />
      {/* Dismiss X in the top-right corner of the photo */}
      <Pressable
        hitSlop={4}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: 'rgba(0,0,0,0.45)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <XIcon size={14} color="#FFFFFF" strokeWidth={2.4} />
      </Pressable>
      {/* Role pill — top-left, so it reads before the photo registers */}
      <View
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          paddingHorizontal: 7,
          paddingVertical: 3,
          borderRadius: 4,
          backgroundColor: s.role === 'Local' ? '#262626' : '#FFFFFF',
        }}
      >
        <Text
          style={{
            color: s.role === 'Local' ? '#FFFFFF' : '#262626',
            fontSize: 9,
            fontWeight: '800',
            letterSpacing: 0.4,
          }}
        >
          {s.role.toUpperCase()}
        </Text>
      </View>
    </View>

    {/* Info area */}
    <View style={{ padding: 12, gap: 6 }}>
      {/* Name + age */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
        <Text
          style={{
            fontSize: 14.5,
            fontWeight: '800',
            color: '#262626',
            letterSpacing: -0.2,
          }}
          numberOfLines={1}
        >
          {s.name}
        </Text>
        <Text style={{ fontSize: 13, color: '#8E8E8E', fontWeight: '600' }}>
          {s.age}
        </Text>
      </View>

      {/* City + flag */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 12 }}>{s.flag}</Text>
        <Text style={{ fontSize: 12, color: '#3C3C3C', fontWeight: '600' }}>
          {s.city}
        </Text>
      </View>

      {/* Match reason */}
      <Text
        style={{
          fontSize: 11,
          color: '#8E8E8E',
          lineHeight: 15,
        }}
        numberOfLines={2}
      >
        {s.reason}
      </Text>

      {/* Say hi — primary action */}
      <Pressable
        style={{
          marginTop: 4,
          height: 34,
          borderRadius: 999,
          backgroundColor: '#262626',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '800',
            letterSpacing: -0.1,
          }}
        >
          Say hi
        </Text>
      </Pressable>
    </View>
  </View>
);

// ── Main section ─────────────────────────────────
interface Props {
  cityName: string;
}

const PeopleSuggestions: React.FC<Props> = ({ cityName }) => {
  return (
    <View style={{ marginTop: 28 }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 12,
          flexDirection: 'row',
          alignItems: 'baseline',
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: '#262626',
            letterSpacing: 1.4,
          }}
        >
          PEOPLE TO MEET
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: '#8E8E8E',
            marginLeft: 8,
            fontWeight: '500',
          }}
        >
          · suggested for you in {cityName}
        </Text>
        <Pressable style={{ marginLeft: 'auto' }} hitSlop={8}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#0095F6',
                letterSpacing: -0.1,
              }}
            >
              See all
            </Text>
            <ArrowRight size={12} color="#0095F6" strokeWidth={2.4} />
          </View>
        </Pressable>
      </View>

      {/* Horizontal carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {SUGGESTIONS.map((s) => (
          <SuggestionCard key={s.id} s={s} />
        ))}
      </ScrollView>
    </View>
  );
};

export default PeopleSuggestions;
