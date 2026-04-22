import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import {
  ChevronLeft,
  Users,
  MoreHorizontal,
  Send,
  MessageCircle,
  HelpCircle,
  BarChart3,
} from 'lucide-react-native';
import type { HomeStackParamList } from '../../navigation/types';

// ── Types ─────────────────────────────────────────
type ConvoKind = 'talk' | 'question' | 'poll';

type Message = {
  id: string;
  author: string;
  avatar: string;
  isLocal?: boolean;
  text: string;
  ago: string;
  mine?: boolean;
};

// Mock thread data keyed by conversation id
const THREADS: Record<
  string,
  { kind: ConvoKind; title: string; online: number; replies: number; messages: Message[] }
> = {
  t1: {
    kind: 'talk',
    title: 'Best plov in Tashkent?',
    online: 4,
    replies: 48,
    messages: [
      {
        id: 'm1',
        author: 'Aziza',
        avatar: 'https://i.pravatar.cc/80?u=aziza',
        isLocal: true,
        text: 'Skip Center of Plov — locals go to Besh Qozon in Yunusabad. Open 11–3.',
        ago: '8m',
      },
      {
        id: 'm2',
        author: 'Timur',
        avatar: 'https://i.pravatar.cc/80?u=timur',
        isLocal: true,
        text: 'Or Plov House in Mirzo Ulugbek — same quality, less crowd.',
        ago: '5m',
      },
      {
        id: 'm3',
        author: 'You',
        avatar: 'https://i.pravatar.cc/80?u=me',
        text: 'Thanks! Does Besh Qozon take card or cash only?',
        ago: '3m',
        mine: true,
      },
      {
        id: 'm4',
        author: 'Aziza',
        avatar: 'https://i.pravatar.cc/80?u=aziza',
        isLocal: true,
        text: 'Cash only. ATM two doors down if you need.',
        ago: '1m',
      },
    ],
  },
  q1: {
    kind: 'question',
    title: 'Samarkand or Bukhara this weekend?',
    online: 2,
    replies: 27,
    messages: [
      {
        id: 'm1',
        author: 'Nico',
        avatar: 'https://i.pravatar.cc/80?u=nico',
        text: '2 days, solo, never been. Which would you pick and why?',
        ago: '20m',
      },
      {
        id: 'm2',
        author: 'Olga',
        avatar: 'https://i.pravatar.cc/80?u=olga',
        text: 'Samarkand first if you only have one. Registan at sunset is unforgettable.',
        ago: '14m',
      },
      {
        id: 'm3',
        author: 'Timur',
        avatar: 'https://i.pravatar.cc/80?u=timur',
        isLocal: true,
        text: 'Bukhara is smaller and walkable. Samarkand more monumental. Depends what you want — history or atmosphere.',
        ago: '10m',
      },
    ],
  },
  p1: {
    kind: 'poll',
    title: 'Weekend in Uzbekistan — where first?',
    online: 1,
    replies: 14,
    messages: [
      {
        id: 'm1',
        author: 'Nico',
        avatar: 'https://i.pravatar.cc/80?u=nico',
        text: 'Sharing results here as people vote!',
        ago: '14m',
      },
      {
        id: 'm2',
        author: 'Chen',
        avatar: 'https://i.pravatar.cc/80?u=chen',
        text: 'Voted Samarkand. Worth 2 days alone.',
        ago: '8m',
      },
    ],
  },
};

// Kind metadata (icon + colour for the header chip)
const KIND_META: Record<
  ConvoKind,
  { label: string; color: string; bg: string; Icon: typeof MessageCircle }
> = {
  talk: { label: 'TALK', color: '#0E7451', bg: '#E6FAF0', Icon: MessageCircle },
  question: { label: 'QUESTION', color: '#1155B8', bg: '#E5F0FF', Icon: HelpCircle },
  poll: { label: 'POLL', color: '#7C3AED', bg: '#F2E9FD', Icon: BarChart3 },
};

// ── Live pulse (green) ───────────────────────────
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

// ── Message bubble ───────────────────────────────
const MessageBubble: React.FC<{ m: Message }> = ({ m }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 14,
      justifyContent: m.mine ? 'flex-end' : 'flex-start',
      paddingHorizontal: 14,
    }}
  >
    {!m.mine && (
      <Image
        source={{ uri: m.avatar }}
        style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8, backgroundColor: '#FAFAFA' }}
      />
    )}

    <View style={{ maxWidth: '78%' }}>
      {!m.mine && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
          <Text style={{ fontSize: 11.5, fontWeight: '700', color: '#262626' }}>{m.author}</Text>
          {m.isLocal && (
            <View
              style={{
                paddingHorizontal: 4,
                paddingVertical: 1,
                borderRadius: 3,
                backgroundColor: '#262626',
              }}
            >
              <Text
                style={{ color: '#FFFFFF', fontSize: 8.5, fontWeight: '800', letterSpacing: 0.4 }}
              >
                LOCAL
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 10, color: '#8E8E8E' }}>{m.ago}</Text>
        </View>
      )}

      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 9,
          borderRadius: 14,
          borderTopLeftRadius: m.mine ? 14 : 4,
          borderTopRightRadius: m.mine ? 4 : 14,
          backgroundColor: m.mine ? '#262626' : '#F2F2F2',
        }}
      >
        <Text
          style={{
            fontSize: 13.5,
            color: m.mine ? '#FFFFFF' : '#262626',
            lineHeight: 18,
          }}
        >
          {m.text}
        </Text>
      </View>

      {m.mine && (
        <Text style={{ fontSize: 10, color: '#8E8E8E', alignSelf: 'flex-end', marginTop: 3 }}>
          {m.ago}
        </Text>
      )}
    </View>
  </View>
);

// ── Main screen ──────────────────────────────────
const ConversationScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<HomeStackParamList, 'Conversation'>>();
  const scrollRef = useRef<ScrollView>(null);

  const threadId = (route.params as any)?.id ?? 't1';
  const thread = THREADS[threadId] ?? THREADS.t1;
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>(thread.messages);

  const kind = KIND_META[thread.kind];
  const Icon = kind.Icon;

  const send = () => {
    const txt = draft.trim();
    if (!txt) return;
    setMessages((ms) => [
      ...ms,
      {
        id: `new-${Date.now()}`,
        author: 'You',
        avatar: 'https://i.pravatar.cc/80?u=me',
        text: txt,
        ago: 'now',
        mine: true,
      },
    ]);
    setDraft('');
    // Scroll to bottom next tick
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 6,
          paddingBottom: 12,
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#F2F2F2',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Pressable
          onPress={() => navigation.goBack?.()}
          hitSlop={6}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={24} color="#262626" strokeWidth={2.2} />
        </Pressable>

        <View style={{ flex: 1, marginLeft: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingHorizontal: 7,
                paddingVertical: 3,
                borderRadius: 999,
                backgroundColor: kind.bg,
              }}
            >
              <Icon size={10} color={kind.color} strokeWidth={2.4} />
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '800',
                  color: kind.color,
                  letterSpacing: 0.8,
                }}
              >
                {kind.label}
              </Text>
            </View>
            {thread.online > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <LivePulse size={5} />
                <Text
                  style={{ fontSize: 10.5, fontWeight: '700', color: '#10B981' }}
                >
                  {thread.online} live
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              color: '#262626',
              letterSpacing: -0.2,
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            {thread.title}
          </Text>
        </View>

        <Pressable
          hitSlop={6}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Users size={19} color="#262626" strokeWidth={2} />
        </Pressable>
        <Pressable
          hitSlop={6}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MoreHorizontal size={20} color="#262626" strokeWidth={2} />
        </Pressable>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} m={m} />
          ))}
        </ScrollView>

        {/* Sticky input */}
        <View
          style={{
            paddingHorizontal: 10,
            paddingTop: 8,
            paddingBottom: insets.bottom + 8,
            borderTopWidth: 1,
            borderTopColor: '#F2F2F2',
            backgroundColor: '#FFFFFF',
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F7F7F7',
              borderRadius: 22,
              paddingHorizontal: 14,
              paddingVertical: 6,
              minHeight: 44,
            }}
          >
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={
                thread.kind === 'question' ? 'Write an answer…' : 'Reply in thread…'
              }
              placeholderTextColor="#8E8E8E"
              multiline
              style={{
                flex: 1,
                fontSize: 14,
                color: '#262626',
                paddingVertical: 6,
                maxHeight: 110,
              }}
            />
          </View>
          <Pressable
            disabled={draft.trim().length === 0}
            onPress={send}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: draft.trim().length ? '#262626' : '#F2F2F2',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send
              size={16}
              color={draft.trim().length ? '#FFFFFF' : '#8E8E8E'}
              strokeWidth={2.2}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ConversationScreen;
