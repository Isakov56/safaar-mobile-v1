import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { Flame, MessageCircle, ArrowRight, Send } from 'lucide-react-native';

const GREEN = '#10B981';

// ── Types ───────────────────────────────────────
type Message = { id: string; avatar: string; author: string; text: string; ago: string };

type Discussion = {
  id: string;
  topic: string;
  teaser: string;
  replies: number;
  liveCount: number;
  participants: { avatar: string }[];
  hot?: boolean;
};

// ── Data ─────────────────────────────────────────
const FEATURED_MESSAGES: Message[] = [
  {
    id: 'm1',
    avatar: 'https://i.pravatar.cc/80?u=aziza',
    author: 'Aziza',
    text: 'Skip Center of Plov — locals go to Besh Qozon in Yunusabad.',
    ago: '2m',
  },
  {
    id: 'm2',
    avatar: 'https://i.pravatar.cc/80?u=timur',
    author: 'Timur',
    text: 'Or Plov House in Mirzo Ulugbek — same quality, less crowd.',
    ago: '1m',
  },
];

const FEATURED_THREAD = {
  id: 'featured',
  topic: 'Best plov in Tashkent?',
  liveCount: 4,
  replies: 48,
  messages: FEATURED_MESSAGES,
};

const OTHER_DISCUSSIONS: Discussion[] = [
  {
    id: 'd2',
    topic: 'Samarkand vs Bukhara this weekend?',
    teaser: '2 days, solo, never been. Which would you pick?',
    replies: 27,
    liveCount: 2,
    participants: [
      { avatar: 'https://i.pravatar.cc/80?u=a4' },
      { avatar: 'https://i.pravatar.cc/80?u=a5' },
    ],
  },
  {
    id: 'd3',
    topic: 'Anyone speaking Uzbek patient with learners?',
    teaser: 'Looking for casual chai + language exchange, A1 level.',
    replies: 15,
    liveCount: 1,
    participants: [
      { avatar: 'https://i.pravatar.cc/80?u=a6' },
      { avatar: 'https://i.pravatar.cc/80?u=a7' },
      { avatar: 'https://i.pravatar.cc/80?u=a8' },
    ],
  },
  {
    id: 'd4',
    topic: 'Chimgan weekend — who has a spare seat?',
    teaser: 'Already 5 going, looking for 2 more to split fuel.',
    replies: 31,
    liveCount: 3,
    participants: [
      { avatar: 'https://i.pravatar.cc/80?u=a9' },
      { avatar: 'https://i.pravatar.cc/80?u=a10' },
    ],
    hot: true,
  },
];

// ── Live pulse ──────────────────────────────────
const LivePulse: React.FC<{ size?: number }> = ({ size = 6 }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 2.4,
            duration: 1100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 1100, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.8, duration: 0, useNativeDriver: true }),
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
          backgroundColor: GREEN,
          transform: [{ scale }],
          opacity,
        }}
      />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: GREEN }} />
    </View>
  );
};

// ── Featured thread — full-width with inline reply ─
const FeaturedThread: React.FC = () => {
  const [draft, setDraft] = useState('');

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#DBDBDB',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <View style={{ padding: 14, paddingBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Flame size={12} color={GREEN} fill={GREEN} />
          <LivePulse size={6} />
          <Text
            style={{
              fontSize: 10,
              fontWeight: '800',
              color: '#262626',
              letterSpacing: 0.6,
            }}
          >
            {FEATURED_THREAD.liveCount} LIVE · {FEATURED_THREAD.replies} REPLIES
          </Text>
        </View>
        <Text
          style={{
            marginTop: 10,
            fontSize: 17,
            fontWeight: '800',
            color: '#262626',
            letterSpacing: -0.3,
            lineHeight: 22,
          }}
        >
          {FEATURED_THREAD.topic}
        </Text>
      </View>

      {/* Live messages preview */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#F2F2F2',
          backgroundColor: '#FAFAFA',
          paddingHorizontal: 14,
          paddingVertical: 10,
          gap: 10,
        }}
      >
        {FEATURED_THREAD.messages.map((m) => (
          <View key={m.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <Image
              source={{ uri: m.avatar }}
              style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#F2F2F2' }}
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#262626' }}>
                  {m.author}
                </Text>
                <Text style={{ fontSize: 10, color: '#8E8E8E' }}>{m.ago}</Text>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: '#262626',
                  marginTop: 1,
                  lineHeight: 17,
                }}
              >
                {m.text}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Inline reply input */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderTopWidth: 1,
          borderTopColor: '#F2F2F2',
          gap: 8,
        }}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Reply to this thread..."
          placeholderTextColor="#8E8E8E"
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#DBDBDB',
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 9,
            fontSize: 13,
            color: '#262626',
          }}
        />
        <Pressable
          disabled={draft.trim().length === 0}
          onPress={() => setDraft('')}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: draft.trim().length === 0 ? '#F2F2F2' : '#262626',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send
            size={15}
            color={draft.trim().length === 0 ? '#8E8E8E' : '#FFFFFF'}
            strokeWidth={2}
          />
        </Pressable>
      </View>
    </View>
  );
};

// ── Compact discussion card (for other threads) ───
const DiscussionCard: React.FC<{ d: Discussion }> = ({ d }) => (
  <Pressable
    style={{
      width: 260,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#DBDBDB',
      borderRadius: 12,
      padding: 14,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {d.hot && <Flame size={12} color={GREEN} fill={GREEN} />}
      <LivePulse size={6} />
      <Text style={{ fontSize: 10, fontWeight: '800', color: '#262626', letterSpacing: 0.6 }}>
        {d.liveCount} LIVE
      </Text>
      <Text style={{ marginLeft: 'auto', fontSize: 11, color: '#8E8E8E' }}>{d.replies} replies</Text>
    </View>

    <Text
      style={{
        marginTop: 10,
        fontSize: 15,
        fontWeight: '700',
        color: '#262626',
        letterSpacing: -0.2,
        lineHeight: 20,
      }}
      numberOfLines={2}
    >
      {d.topic}
    </Text>

    <Text
      style={{ marginTop: 6, fontSize: 12, color: '#3C3C3C', lineHeight: 16 }}
      numberOfLines={2}
    >
      "{d.teaser}"
    </Text>

    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        {d.participants.slice(0, 3).map((p, i) => (
          <Image
            key={i}
            source={{ uri: p.avatar }}
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 2,
              borderColor: '#FFFFFF',
              marginLeft: i === 0 ? 0 : -6,
              backgroundColor: '#FAFAFA',
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <MessageCircle size={13} color="#262626" strokeWidth={2} />
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#262626' }}>Join</Text>
        <ArrowRight size={12} color="#262626" strokeWidth={2.4} />
      </View>
    </View>
  </Pressable>
);

// ── Main ─────────────────────────────────────────
const LiveDiscussionsRail: React.FC = () => (
  <View>
    <View style={{ paddingHorizontal: 16, marginTop: 28, marginBottom: 10 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          color: '#8E8E8E',
          letterSpacing: 1.4,
        }}
      >
        LIVE TALKS · JUMP INTO A CONVERSATION
      </Text>
    </View>

    <FeaturedThread />

    <Text
      style={{
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 10,
        fontSize: 11,
        fontWeight: '600',
        color: '#8E8E8E',
        letterSpacing: 0.4,
      }}
    >
      Other threads
    </Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
    >
      {OTHER_DISCUSSIONS.map((d) => (
        <DiscussionCard key={d.id} d={d} />
      ))}
    </ScrollView>
  </View>
);

export default LiveDiscussionsRail;
