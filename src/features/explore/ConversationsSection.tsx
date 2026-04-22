import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
  Dimensions,
  FlatList,
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Flame, ArrowRight, Send, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import type { HomeStackParamList } from '../../navigation/types';

// ── Types ────────────────────────────────────────
type Filter = 'all' | 'questions' | 'talks' | 'polls';

type BaseConv = {
  id: string;
  title: string;
  ago: string;
};

type PreviewMsg = {
  author: string;
  avatar: string;
  isLocal?: boolean;
  text: string;
  ago: string;
  /** Reactions already placed on this message by other users. */
  reactions?: { emoji: string; count: number }[];
};

type TalkItem = BaseConv & {
  type: 'talk';
  liveCount: number;
  replies: number;
  participants: string[];
  hot?: boolean;
  /** 1–2 most recent messages to show inline so there's context to react to */
  latest?: PreviewMsg[];
};

type QuestionItem = BaseConv & {
  type: 'question';
  asker: { name: string; avatar: string; role?: 'Local' | 'Traveler' };
  replies: number;
  teaser: string;
  /** Latest top answer(s) to the question */
  latest?: PreviewMsg[];
};

type PollItem = BaseConv & {
  type: 'poll';
  asker: { name: string; avatar: string; role?: 'Local' | 'Traveler' };
  options: { id: string; label: string; votes: number }[];
  totalVotes: number;
  timeLeft: string;
};

type Conv = TalkItem | QuestionItem | PollItem;

// ── Mock data ────────────────────────────────────
const CONVERSATIONS: Conv[] = [
  {
    id: 't1',
    type: 'talk',
    title: 'Best plov in Tashkent?',
    ago: '2m',
    liveCount: 4,
    replies: 48,
    participants: [
      'https://i.pravatar.cc/80?u=aziza',
      'https://i.pravatar.cc/80?u=timur',
      'https://i.pravatar.cc/80?u=mira',
    ],
    hot: true,
    latest: [
      {
        author: 'Nico',
        avatar: 'https://i.pravatar.cc/80?u=nico',
        text: 'Ok folks — plov hunt. Where are we going?',
        ago: '42m',
      },
      {
        author: 'Olga',
        avatar: 'https://i.pravatar.cc/80?u=olga',
        text: 'Every guidebook says Center of Plov. Is it actually good?',
        ago: '35m',
      },
      {
        author: 'Aziza',
        avatar: 'https://i.pravatar.cc/80?u=aziza',
        isLocal: true,
        text: 'Skip Center of Plov — locals go to Besh Qozon in Yunusabad.',
        ago: '8m',
      },
      {
        author: 'Jonas',
        avatar: 'https://i.pravatar.cc/80?u=jonas',
        text: 'Besh Qozon line is usually wild though right?',
        ago: '7m',
      },
      {
        author: 'Aziza',
        avatar: 'https://i.pravatar.cc/80?u=aziza',
        isLocal: true,
        text: 'Go before 11:30. After that it’s 40 min wait easily.',
        ago: '7m',
        reactions: [{ emoji: '🙌', count: 2 }],
      },
      {
        author: 'Timur',
        avatar: 'https://i.pravatar.cc/80?u=timur',
        isLocal: true,
        text: 'Or Plov House in Mirzo Ulugbek — same quality, less crowd.',
        ago: '5m',
        reactions: [
          { emoji: '🔥', count: 3 },
          { emoji: '❤️', count: 2 },
        ],
      },
      {
        author: 'Chen',
        avatar: 'https://i.pravatar.cc/80?u=chen',
        text: 'Plov House also has a vegetarian version, just FYI.',
        ago: '4m',
      },
      {
        author: 'Nico',
        avatar: 'https://i.pravatar.cc/80?u=nico',
        text: 'Wait — vegetarian plov is a thing?',
        ago: '3m',
      },
      {
        author: 'Timur',
        avatar: 'https://i.pravatar.cc/80?u=timur',
        isLocal: true,
        text: 'It’s not traditional but it’s decent. Mostly carrots + rice.',
        ago: '2m',
      },
      {
        author: 'Mira',
        avatar: 'https://i.pravatar.cc/80?u=mira',
        text: 'Going to Besh Qozon tonight — anyone wanna come?',
        ago: '1m',
        reactions: [
          { emoji: '🙌', count: 4 },
          { emoji: '👀', count: 1 },
        ],
      },
    ],
  },
  {
    id: 'q1',
    type: 'question',
    title: 'Samarkand or Bukhara this weekend?',
    ago: '8m',
    asker: { name: 'Nico', avatar: 'https://i.pravatar.cc/80?u=nico', role: 'Traveler' },
    replies: 27,
    teaser: '2 days, solo, never been. Which would you pick?',
    latest: [
      {
        author: 'Olga',
        avatar: 'https://i.pravatar.cc/80?u=olga',
        text: 'Samarkand first. Registan at sunset is unforgettable.',
        ago: '14m',
      },
    ],
  },
  {
    id: 'p1',
    type: 'poll',
    title: 'Weekend in Uzbekistan — where first?',
    ago: '14m',
    asker: { name: 'Nico', avatar: 'https://i.pravatar.cc/80?u=nico', role: 'Traveler' },
    timeLeft: '8h left',
    options: [
      { id: 'a', label: 'Samarkand', votes: 48 },
      { id: 'b', label: 'Bukhara', votes: 31 },
      { id: 'c', label: 'Stay in Tashkent', votes: 9 },
    ],
    totalVotes: 88,
  },
  {
    id: 't2',
    type: 'talk',
    title: 'Chimgan weekend — who has a spare seat?',
    ago: '26m',
    liveCount: 3,
    replies: 31,
    participants: [
      'https://i.pravatar.cc/80?u=a9',
      'https://i.pravatar.cc/80?u=a10',
    ],
    hot: true,
    latest: [
      {
        author: 'Yuki',
        avatar: 'https://i.pravatar.cc/80?u=yuki',
        text: 'Chimgan this Sat — who’s got a spare seat or needs one?',
        ago: '38m',
      },
      {
        author: 'Lena',
        avatar: 'https://i.pravatar.cc/80?u=lena',
        text: 'What’s the plan? Day trip or overnight?',
        ago: '34m',
      },
      {
        author: 'Yuki',
        avatar: 'https://i.pravatar.cc/80?u=yuki',
        text: 'Day trip. Leaving 8 AM, back by 8 PM-ish.',
        ago: '30m',
      },
      {
        author: 'Emre',
        avatar: 'https://i.pravatar.cc/80?u=emre',
        text: 'Hiking? Or just lounging at the mountain cafes?',
        ago: '25m',
      },
      {
        author: 'Yuki',
        avatar: 'https://i.pravatar.cc/80?u=yuki',
        text: 'Both. Easy 2h hike + plov lunch up there.',
        ago: '22m',
      },
      {
        author: 'Yuki',
        avatar: 'https://i.pravatar.cc/80?u=yuki',
        text: 'Already 5 of us, need 2 more to split fuel. Leaving 8 AM Sat.',
        ago: '20m',
      },
      {
        author: 'Priya',
        avatar: 'https://i.pravatar.cc/80?u=priya',
        text: 'I’ll go! Never been to Chimgan before.',
        ago: '15m',
        reactions: [{ emoji: '🙌', count: 1 }],
      },
      {
        author: 'Carlos',
        avatar: 'https://i.pravatar.cc/80?u=carlos',
        text: "I'm in! Can bring a Bluetooth speaker and snacks for the hike.",
        ago: '12m',
        reactions: [
          { emoji: '🙌', count: 2 },
          { emoji: '🔥', count: 1 },
        ],
      },
      {
        author: 'Yuki',
        avatar: 'https://i.pravatar.cc/80?u=yuki',
        text: 'Perfect — that’s the car full. Meet at Mustaqillik Sq 7:45.',
        ago: '6m',
      },
      {
        author: 'Aziza',
        avatar: 'https://i.pravatar.cc/80?u=aziza',
        isLocal: true,
        text: 'Weather is perfect Sat, clear skies. Chimgan will be beautiful.',
        ago: '3m',
        reactions: [
          { emoji: '❤️', count: 3 },
          { emoji: '✨', count: 2 },
        ],
      },
    ],
  },
  {
    id: 'q2',
    type: 'question',
    title: 'Anyone patient with Uzbek learners?',
    ago: '34m',
    asker: { name: 'Emma', avatar: 'https://i.pravatar.cc/80?u=emma', role: 'Traveler' },
    replies: 15,
    teaser: 'Looking for casual chai + language exchange, A1 level.',
    latest: [
      {
        author: 'Timur',
        avatar: 'https://i.pravatar.cc/80?u=timur',
        isLocal: true,
        text: 'I host a chai & chat every Thursday — beginners welcome.',
        ago: '12m',
      },
    ],
  },
];

// ── Live pulse ───────────────────────────────────
const LivePulse: React.FC<{ size?: number; color?: string }> = ({
  size = 6,
  color = '#10B981',
}) => {
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
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        }}
      />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
};

// ── Props ────────────────────────────────────────
interface Props {
  cityName: string;
}

// ── X/Twitter-style tab bar (text tabs with underline) ──
const FeedTab: React.FC<{
  label: string;
  active: boolean;
  onPress: () => void;
}> = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      flex: 1,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        fontSize: 14,
        fontWeight: active ? '800' : '600',
        color: active ? '#262626' : '#8E8E8E',
        letterSpacing: -0.1,
      }}
    >
      {label}
    </Text>
    {active && (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: 3,
          width: 40,
          borderRadius: 2,
          backgroundColor: '#262626',
        }}
      />
    )}
  </Pressable>
);

// ── Engagement row — compact count pills (X style) ──
const EngagementRow: React.FC<{
  items: { icon: string; count: number | string; color?: string }[];
}> = ({ items }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 10 }}>
    {items.map((e, i) => (
      <View
        key={i}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
      >
        <Text style={{ fontSize: 13 }}>{e.icon}</Text>
        <Text
          style={{
            fontSize: 12.5,
            color: e.color ?? '#8E8E8E',
            fontWeight: '600',
          }}
        >
          {e.count}
        </Text>
      </View>
    ))}
  </View>
);

// ── Unified feed post — one card shape for all types ──
// All posts share the same top row (avatar + author + type tag + ago),
// same title typography, same engagement strip. Only the middle body
// varies by type: text preview for talks/questions, inline vote bars
// for polls. Flat, no heavy borders — just a hairline between posts.
const FeedPost: React.FC<{ item: Conv; onOpen: () => void }> = ({
  item,
  onOpen,
}) => {
  // Pull a representative author for the top-row regardless of type
  const author =
    item.type === 'talk'
      ? {
          name: 'Live Talk',
          avatar: item.participants[0] ?? '',
          isLocal: false,
        }
      : item.type === 'question'
        ? item.asker
        : item.asker;

  const typeLabel =
    item.type === 'talk' ? 'Live' : item.type === 'question' ? 'Ask' : 'Poll';
  const typeColor =
    item.type === 'talk' ? '#10B981' : item.type === 'question' ? '#1155B8' : '#7C3AED';

  // Grab the most recent preview line for talks/questions
  const preview =
    item.type === 'talk' || item.type === 'question'
      ? item.latest?.[item.latest.length - 1]
      : undefined;

  return (
    <Pressable
      onPress={onOpen}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        flexDirection: 'row',
        gap: 10,
      }}
    >
      {/* Avatar */}
      <Image
        source={{ uri: author.avatar }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#FAFAFA',
        }}
      />

      <View style={{ flex: 1 }}>
        {/* Author line — name · type · ago */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#262626',
              letterSpacing: -0.1,
            }}
            numberOfLines={1}
          >
            {author.name}
          </Text>
          {'isLocal' in author && author.isLocal && (
            <View
              style={{
                paddingHorizontal: 4,
                paddingVertical: 1,
                borderRadius: 3,
                backgroundColor: '#262626',
              }}
            >
              <Text
                style={{ color: '#FFFFFF', fontSize: 8.5, fontWeight: '800', letterSpacing: 0.3 }}
              >
                LOCAL
              </Text>
            </View>
          )}
          <View
            style={{
              paddingHorizontal: 5,
              paddingVertical: 1,
              borderRadius: 4,
              backgroundColor: typeColor,
            }}
          >
            <Text
              style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.4 }}
            >
              {typeLabel.toUpperCase()}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: '#8E8E8E', marginLeft: 'auto' }}>
            {item.ago}
          </Text>
        </View>

        {/* Title */}
        <Text
          style={{
            marginTop: 4,
            fontSize: 14.5,
            fontWeight: '600',
            color: '#262626',
            lineHeight: 19,
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Preview — last reply (talks/questions) */}
        {preview && (
          <Text
            style={{
              marginTop: 4,
              fontSize: 13.5,
              color: '#5C5C5C',
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            <Text style={{ fontWeight: '700', color: '#262626' }}>
              {preview.author}:{' '}
            </Text>
            {preview.text}
          </Text>
        )}

        {/* Poll preview — inline top 2 options with percentages */}
        {item.type === 'poll' && (
          <View style={{ marginTop: 6, gap: 4 }}>
            {[...item.options]
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 2)
              .map((opt) => {
                const pct = Math.round((opt.votes / item.totalVotes) * 100);
                return (
                  <View
                    key={opt.id}
                    style={{
                      position: 'relative',
                      height: 24,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: '#EFEFEF',
                      overflow: 'hidden',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${pct}%`,
                        backgroundColor: '#EDE6FE',
                      }}
                    />
                    <View
                      style={{
                        paddingHorizontal: 8,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#262626' }}>
                        {opt.label}
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#7C3AED' }}>
                        {pct}%
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        )}

        {/* Engagement strip — compact counts, no buttons */}
        <EngagementRow
          items={
            item.type === 'talk'
              ? [
                  { icon: '💬', count: item.replies },
                  { icon: '🟢', count: `${item.liveCount} live`, color: '#10B981' },
                ]
              : item.type === 'question'
                ? [{ icon: '💬', count: `${item.replies} answers` }]
                : [
                    { icon: '📊', count: `${item.totalVotes} votes` },
                    { icon: '⏱', count: item.timeLeft },
                  ]
          }
        />
      </View>
    </Pressable>
  );
};

// ── Browse view (X/Twitter-style hub) ────────────
// Minimal: text tabs on top, single vertical feed below. All types render
// as the same post shape so scanning is fast — no carousels, no filter
// chips, no heavy cards.
export const ConversationsBrowseView: React.FC<Props> = ({ cityName: _cityName }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const openConversation = (id: string) => {
    try {
      navigation.navigate('Conversation', { id });
    } catch {
      /* navigator may not be ready */
    }
  };

  const visible = useMemo(() => {
    if (filter === 'talks') return CONVERSATIONS.filter((c) => c.type === 'talk');
    if (filter === 'questions')
      return CONVERSATIONS.filter((c) => c.type === 'question');
    if (filter === 'polls') return CONVERSATIONS.filter((c) => c.type === 'poll');
    return CONVERSATIONS;
  }, [filter]);

  return (
    <View>
      {/* Minimal tab bar — X-style underlined text tabs */}
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#EFEFEF',
        }}
      >
        <FeedTab label="For you" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FeedTab label="Live" active={filter === 'talks'} onPress={() => setFilter('talks')} />
        <FeedTab
          label="Asks"
          active={filter === 'questions'}
          onPress={() => setFilter('questions')}
        />
        <FeedTab label="Polls" active={filter === 'polls'} onPress={() => setFilter('polls')} />
      </View>

      {/* Single flat feed — all types share one post shape */}
      {visible.map((item) => (
        <FeedPost
          key={item.id}
          item={item}
          onOpen={() => openConversation(item.id)}
        />
      ))}
    </View>
  );
};

// ── Live Chat Peek (full-width, bubble style) ───
// The "welcoming" home variant: no hard card border, soft bg, messages as
// real chat bubbles, typing indicator, and a big "Say something..." input
// that looks like a real messenger bar. Tapping the peek or the input
// opens the full thread.
const SCREEN_WIDTH = Dimensions.get('window').width;
const PEEK_MARGIN = 16;
const PEEK_WIDTH = SCREEN_WIDTH - PEEK_MARGIN * 2;

// ── Floating reactions — emojis drift up, fade out ──
// Drifts ambient emojis on a timer AND exposes an imperative `spawn(emoji)`
// via ref so user taps (quick-react bar, long-press picker) can push a
// specific emoji up the screen on demand.
const FLOAT_EMOJIS = ['❤️', '🔥', '😂', '👋', '✨', '🙌'];
type FloatingRef = { spawn: (emoji: string, originX?: number) => void };

const FloatingReactions = React.forwardRef<
  FloatingRef,
  { width: number; height: number }
>(({ width, height }, ref) => {
  const [pops, setPops] = useState<
    { id: number; x: number; emoji: string; anim: Animated.Value }[]
  >([]);
  const nextId = useRef(0);

  const spawn = React.useCallback(
    (emoji: string, originX?: number) => {
      const id = nextId.current++;
      const x = originX ?? 30 + Math.random() * (width - 70);
      const anim = new Animated.Value(0);
      setPops((prev) => [...prev, { id, x, emoji, anim }]);
      Animated.timing(anim, {
        toValue: 1,
        duration: 2600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setPops((prev) => prev.filter((p) => p.id !== id));
      });
    },
    [width],
  );

  React.useImperativeHandle(ref, () => ({ spawn }), [spawn]);

  // Ambient: pick a random emoji every 1.3s
  useEffect(() => {
    const tick = () =>
      spawn(FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)]);
    tick();
    const iv = setInterval(tick, 1300);
    return () => clearInterval(iv);
  }, [spawn]);

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height,
        overflow: 'hidden',
      }}
    >
      {pops.map((p) => (
        <Animated.Text
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            bottom: 0,
            fontSize: 18,
            transform: [
              {
                translateY: p.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -(height - 40)],
                }),
              },
              {
                translateX: p.anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 12, -8],
                }),
              },
              {
                scale: p.anim.interpolate({
                  inputRange: [0, 0.2, 1],
                  outputRange: [0.4, 1.15, 0.9],
                }),
              },
            ],
            opacity: p.anim.interpolate({
              inputRange: [0, 0.1, 0.7, 1],
              outputRange: [0, 1, 1, 0],
            }),
          }}
        >
          {p.emoji}
        </Animated.Text>
      ))}
    </View>
  );
});
FloatingReactions.displayName = 'FloatingReactions';

// ── Live Room hero (gradient, face-forward, one CTA) ─
// A mood-colored immersive hero instead of a chat-preview card. Fewer
// elements, more atmosphere — meant to feel like opening a door to a
// cozy room rather than peeking at a log.
type RoomMood = 'food' | 'outdoor' | 'social' | 'night';
// Multi-hue gradients — each stop lives in a different hue zone so the
// gradient reads as a real color shift (not a light→dark shade of one
// color). Food = warm Instagram (yellow→red→pink). Outdoor = cool
// tropical (mint→sky→navy). Night = dawn (amber→pink→indigo). Social
// = sunset (gold→coral→purple). The two home cards end up in opposite
// color worlds.
const roomGradient = (mood: RoomMood): [string, string, string] => {
  switch (mood) {
    case 'food':
      // Instagram warm: yellow → orange-red → hot pink
      return ['#FFD96B', '#FF6B47', '#D63384'];
    case 'outdoor':
      // Cool tropical: mint → sky blue → deep navy
      return ['#6AE1C8', '#4BA8E0', '#2D3A8A'];
    case 'night':
      // Dawn: amber → pink → deep indigo
      return ['#FFB55A', '#E63D87', '#2E1B6A'];
    default:
      // Sunset lounge: gold → coral → purple
      return ['#FFC66B', '#E75D5D', '#8D3D80'];
  }
};

// Bubble gradient — gentle sub-gradient that feels related to the card
// but has its own soft tonal shift. Light warm top fading into a medium
// accent (not deep/dark) so the bubble reads as distinct without
// becoming heavy.
const bubbleGradient = (mood: RoomMood): [string, string] => {
  switch (mood) {
    case 'food':
      // cream → soft wine
      return ['rgba(255,215,180,0.5)', 'rgba(180,80,110,0.35)'];
    case 'outdoor':
      // light mint → soft steel blue
      return ['rgba(195,235,230,0.5)', 'rgba(70,105,155,0.35)'];
    case 'night':
      // light lilac → soft purple
      return ['rgba(235,205,235,0.5)', 'rgba(100,70,150,0.35)'];
    default:
      // warm cream → soft plum
      return ['rgba(255,210,175,0.5)', 'rgba(160,80,110,0.35)'];
  }
};

// Pick a mood from the title keywords so each room has its own character
const moodFor = (title: string): RoomMood => {
  const t = title.toLowerCase();
  if (/plov|food|eat|dinner|cafe|tea|chai/.test(t)) return 'food';
  if (/mountain|chimgan|hike|trip|walk|tour/.test(t)) return 'outdoor';
  if (/night|jazz|bar|club|dj/.test(t)) return 'night';
  return 'social';
};

// Pulsing ring around an avatar — "they're live in the room"
const PulseAvatar: React.FC<{ uri: string; size?: number; delay?: number }> = ({
  uri,
  size = 44,
  delay = 0,
}) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, {
          toValue: 1,
          duration: 1700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, delay]);
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }),
          transform: [
            {
              scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.55] }),
            },
          ],
        }}
      />
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          backgroundColor: '#FAFAFA',
        }}
      />
    </View>
  );
};

// ── Facebook-style reaction picker (staggered pop-in) ──
// Individual emoji pills as separate glass circles, positioned above the
// bubble so they sit half-inside / half-outside the top edge. Each emoji
// animates in one-by-one with a spring scale for the FB popping feel.
const REACTION_PICKER = ['❤️', '🔥', '😂', '🙌', '👀', '✨'];

const ReactionPicker: React.FC<{
  open: boolean;
  onPick: (emoji: string) => void;
}> = ({ open, onPick }) => {
  const anims = useRef(
    REACTION_PICKER.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    if (open) {
      anims.forEach((a) => a.setValue(0));
      Animated.stagger(
        55,
        anims.map((a) =>
          Animated.spring(a, {
            toValue: 1,
            friction: 6,
            tension: 140,
            useNativeDriver: true,
          }),
        ),
      ).start();
    } else {
      anims.forEach((a) => a.setValue(0));
    }
  }, [open, anims]);

  if (!open) return null;
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: '100%',
        // right-aligned so it doesn't cover the author name + LOCAL
        // badge on the left of the bubble
        right: 6,
        marginBottom: -14,
        flexDirection: 'row',
        gap: 3,
        zIndex: 30,
      }}
    >
      {REACTION_PICKER.map((e, i) => (
        <Animated.View
          key={e}
          style={{
            opacity: anims[i],
            transform: [
              {
                scale: anims[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 1],
                }),
              },
              {
                translateY: anims[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          }}
        >
          <Pressable
            onPress={() => onPick(e)}
            hitSlop={4}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.16,
              shadowRadius: 3,
            }}
          >
            <BlurView
              intensity={70}
              tint="light"
              experimentalBlurMethod="dimezisBlurView"
              style={{
                flex: 1,
                borderRadius: 14,
                borderWidth: 0.5,
                borderColor: 'rgba(255,255,255,0.85)',
                backgroundColor: 'rgba(255,255,255,0.95)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 15 }}>{e}</Text>
            </BlurView>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
};

// ── Chat bubble for the gradient hero (liquid-glass) ──
// Real native blur (expo-blur BlurView) for an Apple-style frosted
// glass look. Single tap on the bubble toggles the reaction picker.
// Picker open/close is controlled by the parent so only one message's
// picker can be open at a time (tapping another auto-closes the prior).
const HeroChatBubble: React.FC<{
  msg: PreviewMsg;
  mood: RoomMood;
  onReact: (emoji: string) => void;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  onClosePicker: () => void;
}> = ({ msg, mood, onReact, pickerOpen, onTogglePicker, onClosePicker }) => {
  const bubbleGrad = bubbleGradient(mood);
  const [reactions, setReactions] = useState(msg.reactions ?? []);

  const addReaction = (emoji: string) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r,
        );
      }
      return [...prev, { emoji, count: 1 }];
    });
    onReact(emoji);
    onClosePicker();
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
      <Image
        source={{ uri: msg.avatar }}
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: 'rgba(255,255,255,0.4)',
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.7)',
        }}
      />
      <View style={{ flex: 1 }}>
        {/* Telegram-style bubble: author at top INSIDE, time at
            bottom-right INSIDE, all wrapped in the liquid-glass pill.
            The picker floats above with half-overlap. */}
        <View style={{ position: 'relative', alignSelf: 'flex-start', maxWidth: '100%' }}>
          <ReactionPicker open={pickerOpen} onPick={addReaction} />
          <Pressable onPress={onTogglePicker}>
            <View
              style={{
                borderRadius: 18,
                borderTopLeftRadius: 6,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
              }}
            >
              <BlurView
                intensity={35}
                tint="light"
                experimentalBlurMethod="dimezisBlurView"
                style={{
                  paddingHorizontal: 13,
                  paddingTop: 9,
                  paddingBottom: 16,
                  paddingRight: 50,
                  borderWidth: 0.5,
                  borderColor: 'rgba(255,255,255,0.45)',
                  borderRadius: 18,
                  borderTopLeftRadius: 6,
                }}
              >
                {/* Bubble's own sub-gradient tint (warmer/lighter
                    version of the card gradient, runs opposite
                    direction so the bubble has its own identity). */}
                <LinearGradient
                  colors={bubbleGrad}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
                {/* Author name + LOCAL badge at the TOP inside */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    marginBottom: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '800',
                      color: '#FFFFFF',
                      letterSpacing: -0.1,
                      textShadowColor: 'rgba(0,0,0,0.2)',
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    {msg.author}
                  </Text>
                  {msg.isLocal && (
                    <View
                      style={{
                        paddingHorizontal: 4,
                        paddingVertical: 1,
                        borderRadius: 3,
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <Text
                        style={{
                          color: '#262626',
                          fontSize: 8,
                          fontWeight: '800',
                          letterSpacing: 0.3,
                        }}
                      >
                        LOCAL
                      </Text>
                    </View>
                  )}
                </View>

                {/* Message body */}
                <Text
                  style={{
                    fontSize: 13.5,
                    color: '#FFFFFF',
                    lineHeight: 19,
                    textShadowColor: 'rgba(0,0,0,0.15)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                  numberOfLines={3}
                >
                  {msg.text}
                </Text>

                {/* Time at the bottom-right INSIDE the bubble */}
                <Text
                  style={{
                    position: 'absolute',
                    right: 10,
                    bottom: 5,
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: '600',
                  }}
                >
                  {msg.ago}
                </Text>
              </BlurView>
            </View>
          </Pressable>
        </View>

        {/* Existing reaction pills — tap to add one more */}
        {reactions.length > 0 && (
          <View
            style={{
              marginTop: 6,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 5,
            }}
          >
            {reactions.map((r) => (
              <Pressable
                key={r.emoji}
                onPress={() => addReaction(r.emoji)}
                style={{ borderRadius: 999, overflow: 'hidden' }}
              >
                <BlurView
                  intensity={35}
                  tint="light"
                  experimentalBlurMethod="dimezisBlurView"
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 3,
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    borderWidth: 0.5,
                    borderColor: 'rgba(255,255,255,0.45)',
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ fontSize: 11 }}>{r.emoji}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFFFFF' }}>
                    {r.count}
                  </Text>
                </BlurView>
              </Pressable>
            ))}
            <Pressable
              onPress={onTogglePicker}
              hitSlop={4}
              style={{
                paddingHorizontal: 7,
                paddingVertical: 3,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.5)',
                borderStyle: 'dashed',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFFFFF' }}>+</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

// ── Typing dots + cycling "X is typing" row ──────
const TypingDots: React.FC<{ color?: string }> = ({ color = '#FFFFFF' }) => {
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const bounce = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, {
            toValue: 1,
            duration: 360,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 360,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(240),
        ]),
      );
    const a = bounce(d1, 0);
    const b = bounce(d2, 140);
    const c = bounce(d3, 280);
    a.start();
    b.start();
    c.start();
    return () => {
      a.stop();
      b.stop();
      c.stop();
    };
  }, [d1, d2, d3]);
  const dot = (v: Animated.Value) => (
    <Animated.View
      style={{
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: color,
        transform: [
          { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) },
        ],
        opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
      }}
    />
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {dot(d1)}
      {dot(d2)}
      {dot(d3)}
    </View>
  );
};

// Typing indicator that cycles through speakers every few seconds to
// keep the "live" feel even with static mock data.
const TYPING_CANDIDATES = [
  { name: 'Nico', avatar: 'https://i.pravatar.cc/80?u=nico' },
  { name: 'Emma', avatar: 'https://i.pravatar.cc/80?u=emma' },
  { name: 'Sana', avatar: 'https://i.pravatar.cc/80?u=sana' },
  { name: 'Leo', avatar: 'https://i.pravatar.cc/80?u=leo' },
];

const LiveTypingRow: React.FC = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setIdx((i) => (i + 1) % TYPING_CANDIDATES.length);
    }, 4200);
    return () => clearInterval(iv);
  }, []);
  const who = TYPING_CANDIDATES[idx];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
      <Image
        source={{ uri: who.avatar }}
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.5)',
        }}
      />
      <BlurView
        intensity={35}
        tint="light"
        experimentalBlurMethod="dimezisBlurView"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 999,
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.45)',
          overflow: 'hidden',
        }}
      >
        <Text
          style={{
            fontSize: 11.5,
            color: '#FFFFFF',
            fontWeight: '600',
            fontStyle: 'italic',
          }}
        >
          {who.name} is typing
        </Text>
        <TypingDots />
      </BlurView>
    </View>
  );
};

// ── Scrollable chat thread with jump-to-latest button ──
// Vertical ScrollView with fixed height, starts at the bottom (newest
// message) like a real messenger. If the user scrolls up to read older
// messages, a floating ↓ button fades in that scrolls them back to the
// latest.
const CHAT_AREA_HEIGHT = 260;

const ChatScrollArea: React.FC<{
  messages: PreviewMsg[];
  mood: RoomMood;
  onReact: (emoji: string) => void;
}> = ({ messages, mood, onReact }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [contentH, setContentH] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  // Only one message picker can be open at a time. Tapping another
  // message auto-closes the previously open picker.
  const [openPickerIdx, setOpenPickerIdx] = useState<number | null>(null);
  const closePicker = () => setOpenPickerIdx(null);
  const togglePicker = (i: number) =>
    setOpenPickerIdx((prev) => (prev === i ? null : i));

  const atBottom =
    contentH <= CHAT_AREA_HEIGHT ||
    scrollY >= contentH - CHAT_AREA_HEIGHT - 40;

  const scrollToBottom = (animated = true) => {
    scrollRef.current?.scrollToEnd({ animated });
  };

  return (
    <View style={{ marginTop: 18, height: CHAT_AREA_HEIGHT, position: 'relative' }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          gap: 12,
        }}
        onContentSizeChange={(_w, h) => {
          setContentH(h);
          // Auto-stick to bottom on first render and when new content
          // arrives (e.g. another message appears).
          scrollRef.current?.scrollToEnd({ animated: false });
        }}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {messages.map((msg, i) => (
          <HeroChatBubble
            key={i}
            msg={msg}
            mood={mood}
            onReact={onReact}
            pickerOpen={openPickerIdx === i}
            onTogglePicker={() => togglePicker(i)}
            onClosePicker={closePicker}
          />
        ))}
        {/* Live typing indicator pinned at the bottom of the thread */}
        <LiveTypingRow />
      </ScrollView>

      {/* Floating scroll-to-latest button (appears when scrolled up) */}
      {!atBottom && (
        <Pressable
          onPress={() => scrollToBottom(true)}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: 'rgba(255,255,255,0.92)',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.18,
            shadowRadius: 4,
          }}
        >
          <ChevronDown size={18} color="#262626" strokeWidth={2.4} />
        </Pressable>
      )}
    </View>
  );
};

const QUICK_REACT_EMOJIS = ['🔥', '❤️', '😂', '🙌', '👀'];

const LiveRoomHero: React.FC<{ item: TalkItem; onOpen: () => void }> = ({
  item,
  onOpen,
}) => {
  const mood = moodFor(item.title);
  const grad = roomGradient(mood);
  const [peekH, setPeekH] = useState(440);
  const floatRef = useRef<FloatingRef>(null);
  const spawnFloat = (emoji: string) => floatRef.current?.spawn(emoji);

  return (
    <Pressable
      onPress={onOpen}
      onLayout={(e) => setPeekH(e.nativeEvent.layout.height)}
      style={{
        width: PEEK_WIDTH,
        marginHorizontal: PEEK_MARGIN / 2,
        borderRadius: 24,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={grad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 18,
        }}
      >
        {/* Light white frost — gentle softening that doesn't wash out
            the Tinder colors. Subtle top highlight for natural light. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.13)',
          }}
        />
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Ambient + user-triggered floating reactions drifting up */}
        <FloatingReactions ref={floatRef} width={PEEK_WIDTH} height={peekH} />

        {/* Room status bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <LivePulse size={7} color="#FFFFFF" />
          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '800',
              color: '#FFFFFF',
              letterSpacing: 1,
            }}
          >
            LIVE ROOM
          </Text>
          <View
            style={{
              marginLeft: 'auto',
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.2)',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {item.hot && <Flame size={11} color="#FFFFFF" fill="#FFFFFF" />}
            <Text style={{ color: '#FFFFFF', fontSize: 10.5, fontWeight: '700' }}>
              {item.liveCount} here · {item.ago}
            </Text>
          </View>
        </View>

        {/* Topic — big and welcoming */}
        <Text
          style={{
            marginTop: 18,
            fontSize: 24,
            fontWeight: '800',
            color: '#FFFFFF',
            letterSpacing: -0.5,
            lineHeight: 28,
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Participants cluster — pulsing avatars = people present.
            Tightened a bit (36px) to leave breathing room for the chat. */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
            gap: 4,
          }}
        >
          {item.participants.slice(0, 4).map((uri, i) => (
            <PulseAvatar key={i} uri={uri} size={36} delay={i * 400} />
          ))}
          {item.participants.length > 4 && (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.22)',
                borderWidth: 2,
                borderColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
                +{item.participants.length - 4}
              </Text>
            </View>
          )}
        </View>

        {/* Scrollable chat thread — last ~10 messages, scroll up to read
            earlier ones. Starts pinned to the bottom (newest) and shows a
            floating ↓ button when user scrolls up, same UX as messenger
            apps. Fixed height so the card itself stays compact. */}
        <ChatScrollArea messages={item.latest ?? []} mood={mood} onReact={spawnFloat} />

        {/* Quick-react emoji row — one-tap floats an emoji up, no typing */}
        <View
          style={{
            marginTop: 18,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {QUICK_REACT_EMOJIS.map((e) => (
            <Pressable
              key={e}
              onPress={() => spawnFloat(e)}
              hitSlop={4}
              style={{ width: 36, height: 36, borderRadius: 18, overflow: 'hidden' }}
            >
              <BlurView
                intensity={70}
                tint="light"
                experimentalBlurMethod="dimezisBlurView"
                style={{
                  flex: 1,
                  borderRadius: 18,
                  borderWidth: 0.5,
                  borderColor: 'rgba(255,255,255,0.85)',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 17 }}>{e}</Text>
              </BlurView>
            </Pressable>
          ))}
        </View>

        {/* Messenger-style input — the welcome mat, real send button */}
        <Pressable
          onPress={onOpen}
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
            paddingLeft: 4,
            paddingRight: 4,
            height: 48,
          }}
        >
          <Image
            source={{ uri: 'https://i.pravatar.cc/80?u=me' }}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FAFAFA' }}
          />
          <Text
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 13.5,
              color: '#8E8E8E',
              fontWeight: '500',
            }}
          >
            Jump in — say hi 👋
          </Text>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#262626',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={16} color="#FFFFFF" strokeWidth={2.2} />
          </View>
        </Pressable>
      </LinearGradient>
    </Pressable>
  );
};

// ── Paged peek carousel with dot pagination ─────
const LiveChatPeekCarousel: React.FC<{
  talks: TalkItem[];
  onOpen: (id: string) => void;
}> = ({ talks, onOpen }) => {
  const [page, setPage] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (PEEK_WIDTH + PEEK_MARGIN));
    if (idx !== page) setPage(idx);
  };
  return (
    <View>
      <FlatList
        data={talks}
        keyExtractor={(t) => t.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={PEEK_WIDTH + PEEK_MARGIN}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: PEEK_MARGIN / 2 }}
        renderItem={({ item }) => (
          <LiveRoomHero item={item} onOpen={() => onOpen(item.id)} />
        )}
      />
      {talks.length > 1 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            marginTop: 10,
          }}
        >
          {talks.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === page ? 16 : 5,
                height: 5,
                borderRadius: 3,
                backgroundColor: i === page ? '#262626' : '#DBDBDB',
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// ── Live Now home pulse ──────────────────────────
// A minimal attention-grabbing teaser: header row + a short "Hot right
// now" carousel + a single "See all" CTA. The full browse experience
// (filters, per-type carousels, vertical cards) lives on the dedicated
// Conversations hub screen — keeps home uncluttered for a travel app.
const ConversationsSection: React.FC<Props> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const openConversation = (id: string) => {
    try {
      navigation.navigate('Conversation', { id });
    } catch {
      /* navigator may not be ready */
    }
  };

  const openHub = () => {
    try {
      navigation.navigate('ConversationsHub');
    } catch {
      /* navigator may not be ready */
    }
  };

  // Grab the hottest talks first, then fill up to 3 with other types so
  // there's always a varied "pulse" on home regardless of what's hot.
  const teasers = useMemo<TalkItem[]>(() => {
    const hot = CONVERSATIONS.filter(
      (c): c is TalkItem => c.type === 'talk' && !!c.hot,
    );
    return hot.slice(0, 3);
  }, []);

  return (
    <View style={{ marginTop: 24 }}>
      {/* Header — title + live count + See all link */}
      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'baseline',
        }}
      >
        <Text
          style={{ fontSize: 11, fontWeight: '700', color: '#262626', letterSpacing: 1.4 }}
        >
          CONVERSATIONS · {CONVERSATIONS.length} LIVE
        </Text>
        <Pressable onPress={openHub} style={{ marginLeft: 'auto' }} hitSlop={8}>
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

      {/* Live chat peek — full-width, swipeable peek into real ongoing
          conversations. Bubble-style messages + inline messenger input
          make it feel welcoming, not gated. */}
      {teasers.length > 0 && (
        <LiveChatPeekCarousel talks={teasers} onOpen={openConversation} />
      )}
    </View>
  );
};

export default ConversationsSection;
