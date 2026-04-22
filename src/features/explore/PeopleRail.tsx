import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';

// Signature Safaar story ring — a warm→cool gradient from brand mood palette
// (yellow → orange → pink → purple), reading as "fresh, live content" the
// same way Instagram's story ring does, but with our own colour progression.
const STORY_RING_COLORS = ['#FEDA77', '#F58529', '#DD2A7B', '#833AB4'] as const;

type Person = {
  id: string;
  name: string;
  photo: string;
  hasStory?: boolean;
  online?: boolean;
  /** Signature intent tag — what this person is currently up to */
  vibe?: { emoji: string; label: string };
  isMe?: boolean;
};

const MOCK_PEOPLE: Person[] = [
  { id: 'me', name: 'You', photo: 'https://i.pravatar.cc/400?u=me', isMe: true },
  {
    id: 'p1',
    name: 'Kamila',
    photo: 'https://picsum.photos/seed/person-kamila/400/600',
    hasStory: true,
    online: true,
    vibe: { emoji: '☕', label: 'chai' },
  },
  {
    id: 'p2',
    name: 'Emma',
    photo: 'https://picsum.photos/seed/person-emma/400/600',
    hasStory: true,
    vibe: { emoji: '🎨', label: 'art' },
  },
  {
    id: 'p3',
    name: 'Diego',
    photo: 'https://picsum.photos/seed/person-diego/400/600',
    online: true,
    vibe: { emoji: '🎒', label: 'exploring' },
  },
  {
    id: 'p4',
    name: 'Aziza',
    photo: 'https://picsum.photos/seed/person-aziza/400/600',
    hasStory: true,
    online: true,
    vibe: { emoji: '📸', label: 'photo' },
  },
  {
    id: 'p5',
    name: 'Chen',
    photo: 'https://picsum.photos/seed/person-chen/400/600',
    vibe: { emoji: '🍽️', label: 'dinner' },
  },
  {
    id: 'p6',
    name: 'Jonas',
    photo: 'https://picsum.photos/seed/person-jonas/400/600',
  },
  {
    id: 'p7',
    name: 'Timur',
    photo: 'https://picsum.photos/seed/person-timur/400/600',
    online: true,
    vibe: { emoji: '🗣️', label: 'uzbek' },
  },
  {
    id: 'p8',
    name: 'Priya',
    photo: 'https://picsum.photos/seed/person-priya/400/600',
    hasStory: true,
  },
];

const CARD_WIDTH = 102;
const CARD_HEIGHT = 148;

// ── Portrait card ────────────────────────────────
// When `hasStory` is true we wrap the card in a LinearGradient that acts as a
// 2.5 px "ring" by padding the inner card slightly. Otherwise a plain gray
// hairline border is enough.
const PersonCard: React.FC<{ p: Person }> = ({ p }) => {
  const cardInner = (
    <ImageBackground
      source={{ uri: p.photo }}
      style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}
      imageStyle={{ borderRadius: 12 }}
    >
      {/* Online dot */}
      {p.online && (
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 11,
            height: 11,
            borderRadius: 5.5,
            backgroundColor: '#10B981',
            borderWidth: 2,
            borderColor: '#FFFFFF',
          }}
        />
      )}

      {/* Bottom overlay: name + optional vibe tag */}
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.55)',
          paddingHorizontal: 8,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: -0.2,
          }}
          numberOfLines={1}
        >
          {p.name}
        </Text>
        {p.vibe && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
              paddingHorizontal: 5,
              paddingVertical: 1.5,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.95)',
              gap: 2,
              marginTop: 4,
            }}
          >
            <Text style={{ fontSize: 8.5 }}>{p.vibe.emoji}</Text>
            <Text style={{ fontSize: 9, fontWeight: '700', color: '#262626' }}>
              {p.vibe.label}
            </Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );

  if (p.hasStory) {
    // Gradient "story ring" — the LinearGradient padding becomes the visible
    // border colour around the card.
    return (
      <LinearGradient
        colors={STORY_RING_COLORS as unknown as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: 14,
          padding: 2.5,
        }}
      >
        <Pressable
          style={{
            flex: 1,
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
          }}
        >
          {cardInner}
        </Pressable>
      </LinearGradient>
    );
  }

  return (
    <Pressable
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#DBDBDB',
      }}
    >
      {cardInner}
    </Pressable>
  );
};

// ── "Add yourself" card — same portrait shape, photo-bg with overlay + `+` ──
const AddYourselfCard: React.FC<{ photo: string }> = ({ photo }) => (
  <Pressable
    style={{
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 14,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#DBDBDB',
      borderStyle: 'dashed',
    }}
  >
    <ImageBackground
      source={{ uri: photo }}
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* dim overlay so the + stands out */}
      <View
        style={{
          ...StyleSheet_fill,
          backgroundColor: 'rgba(0,0,0,0.35)',
        }}
      />
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: '#0095F6',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: '#FFFFFF',
        }}
      >
        <Plus size={18} color="#FFFFFF" strokeWidth={3} />
      </View>
      <Text
        style={{
          marginTop: 8,
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: -0.1,
        }}
      >
        Add vibe
      </Text>
    </ImageBackground>
  </Pressable>
);

const StyleSheet_fill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const PeopleRail: React.FC<{ cityName: string }> = ({ cityName }) => {
  const onlineCount = MOCK_PEOPLE.filter((p) => p.online).length;

  return (
    <View style={{ marginTop: 14 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              color: '#262626',
              letterSpacing: -0.2,
            }}
          >
            People in {cityName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' }} />
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#10B981' }}>
              {onlineCount} online
            </Text>
          </View>
        </View>
        <Pressable hitSlop={8}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#0095F6' }}>See all</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 6 }}
      >
        {MOCK_PEOPLE.map((p) =>
          p.isMe ? (
            <AddYourselfCard key={p.id} photo={p.photo} />
          ) : (
            <PersonCard key={p.id} p={p} />
          ),
        )}
      </ScrollView>
    </View>
  );
};

export default PeopleRail;
