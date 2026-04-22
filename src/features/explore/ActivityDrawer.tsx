import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
  Platform,
  PanResponder,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MessageCircle,
  MapPin,
  UserPlus,
  Mic,
  Zap,
  Users,
  ArrowRight,
  Send,
  Heart,
  Share2,
  Crown,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const DRAWER_HEIGHT = Math.round(WINDOW_HEIGHT * 0.85);
const DISMISS_THRESHOLD = DRAWER_HEIGHT * 0.25;
const DISMISS_VELOCITY = 0.6;

type Category = 'event' | 'thread' | 'location' | 'invite' | 'talk';

type Ping = {
  id: string;
  avatar: string;
  who: string;
  action: string;
  ago: string;
  agoSec: number;
  category: Category;
  /** Context specific to the category — used by the detail view */
  context?: {
    title?: string;
    host?: { name: string; avatar: string; role?: 'Local' | 'Traveler' };
    attendees?: number;
    max?: number;
    participants?: string[];
    location?: string;
    description?: string;
    messages?: { who: string; avatar: string; text: string; ago: string }[];
  };
};

const ALL_PINGS: Ping[] = [
  {
    id: 'p1',
    avatar: 'https://i.pravatar.cc/80?u=alex',
    who: 'Alex',
    action: "joined Kamila's rooftop chai",
    ago: '1m',
    agoSec: 60,
    category: 'event',
    context: {
      title: 'Rooftop chai & city skyline',
      host: { name: 'Kamila S.', avatar: 'https://i.pravatar.cc/80?u=kamila', role: 'Local' },
      attendees: 5,
      max: 8,
      participants: [
        'https://i.pravatar.cc/80?u=p1',
        'https://i.pravatar.cc/80?u=p2',
        'https://i.pravatar.cc/80?u=alex',
        'https://i.pravatar.cc/80?u=p4',
      ],
      location: 'Hyatt Regency Tashkent',
      description:
        'Sunset rooftop chai at Hyatt Regency. Stunning skyline, cozy crowd, bring a conversation.',
    },
  },
  {
    id: 'p2',
    avatar: 'https://i.pravatar.cc/80?u=mira',
    who: 'Mira',
    action: 'started a thread · "Best samsa in Tashkent?"',
    ago: '3m',
    agoSec: 180,
    category: 'thread',
    context: {
      title: 'Best samsa in Tashkent?',
      host: { name: 'Mira', avatar: 'https://i.pravatar.cc/80?u=mira', role: 'Traveler' },
      messages: [
        { who: 'Mira', avatar: 'https://i.pravatar.cc/80?u=mira', text: 'Just arrived — where are the locals going for samsa? Not tourist traps please.', ago: '3m' },
        { who: 'Aziza', avatar: 'https://i.pravatar.cc/80?u=aziza', text: 'Nonni Samsa in Yunusabad. Wood-fired.', ago: '2m' },
        { who: 'Timur', avatar: 'https://i.pravatar.cc/80?u=timur', text: '+1 Nonni. Or the stall next to Chorsu north gate at 8am.', ago: '1m' },
      ],
    },
  },
  {
    id: 'p3',
    avatar: 'https://i.pravatar.cc/80?u=ravshan',
    who: 'Ravshan',
    action: 'is at Chorsu Bazaar right now',
    ago: '5m',
    agoSec: 300,
    category: 'location',
    context: {
      title: 'Chorsu Bazaar',
      location: 'Chorsu Bazaar, Tashkent',
      participants: [
        'https://i.pravatar.cc/80?u=ravshan',
        'https://i.pravatar.cc/80?u=p20',
        'https://i.pravatar.cc/80?u=p21',
      ],
      attendees: 7,
      description: 'Main market today — samsa stalls, fresh pomegranate, textile row.',
    },
  },
  {
    id: 'p4',
    avatar: 'https://i.pravatar.cc/80?u=yuki',
    who: 'Yuki',
    action: 'invited 2 friends to Chimgan trip',
    ago: '6m',
    agoSec: 360,
    category: 'invite',
    context: {
      title: 'Chimgan mountains day trip',
      host: { name: 'Yuki', avatar: 'https://i.pravatar.cc/80?u=yuki', role: 'Traveler' },
      attendees: 5,
      max: 7,
      location: 'Chimgan, 85 km from Tashkent',
      description: 'Shared car, splitting fuel. Saturday, 8 AM.',
    },
  },
  {
    id: 'p5',
    avatar: 'https://i.pravatar.cc/80?u=ali',
    who: 'Ali',
    action: 'started a live talk · "Samarkand or Bukhara?"',
    ago: '8m',
    agoSec: 480,
    category: 'talk',
    context: {
      title: 'Samarkand or Bukhara this weekend?',
      host: { name: 'Ali', avatar: 'https://i.pravatar.cc/80?u=ali', role: 'Local' },
      attendees: 12,
      messages: [
        { who: 'Ali', avatar: 'https://i.pravatar.cc/80?u=ali', text: 'Going live — share your pick with reason.', ago: '8m' },
      ],
    },
  },
  {
    id: 'p6',
    avatar: 'https://i.pravatar.cc/80?u=diego',
    who: 'Diego',
    action: 'opened a table at Plov House for tonight',
    ago: '12m',
    agoSec: 720,
    category: 'event',
    context: {
      title: 'Communal plov & strangers',
      host: { name: 'Diego', avatar: 'https://i.pravatar.cc/80?u=diego', role: 'Traveler' },
      attendees: 4,
      max: 12,
      location: 'Plov House, Mirzo Ulugbek',
      description: 'Long table, local plov, 4 strangers already. 7:30 PM.',
    },
  },
  {
    id: 'p7',
    avatar: 'https://i.pravatar.cc/80?u=emma',
    who: 'Emma',
    action: 'replied to "Best plov in Tashkent?"',
    ago: '18m',
    agoSec: 1080,
    category: 'thread',
  },
  {
    id: 'p8',
    avatar: 'https://i.pravatar.cc/80?u=aziza',
    who: 'Aziza',
    action: 'set a vibe · ☕ for chai',
    ago: '22m',
    agoSec: 1320,
    category: 'location',
  },
  {
    id: 'p9',
    avatar: 'https://i.pravatar.cc/80?u=chen',
    who: 'Chen',
    action: 'is looking for a photo-walk buddy',
    ago: '30m',
    agoSec: 1800,
    category: 'invite',
  },
  {
    id: 'p10',
    avatar: 'https://i.pravatar.cc/80?u=timur',
    who: 'Timur',
    action: 'voted in "Weekend in Uzbekistan — where first?"',
    ago: '45m',
    agoSec: 2700,
    category: 'thread',
  },
  {
    id: 'p11',
    avatar: 'https://i.pravatar.cc/80?u=olga',
    who: 'Olga',
    action: 'posted a story from Hyatt rooftop',
    ago: '58m',
    agoSec: 3480,
    category: 'location',
  },
];

const CATEGORY_META: Record<
  Category,
  { label: string; icon: LucideIcon; color: string; bg: string; cta: string }
> = {
  event: { label: 'Event', icon: Calendar, color: '#8B5E00', bg: '#FFF8E7', cta: 'Join now' },
  thread: { label: 'Thread', icon: MessageCircle, color: '#1155B8', bg: '#E5F0FF', cta: 'Reply' },
  location: { label: 'Location', icon: MapPin, color: '#0E7451', bg: '#E6FAF0', cta: 'Open on map' },
  invite: { label: 'Invite', icon: UserPlus, color: '#7C3AED', bg: '#F2E9FD', cta: 'Accept' },
  talk: { label: 'Talk', icon: Mic, color: '#C01D5D', bg: '#FFE5F0', cta: 'Listen in' },
};

// ── Filter chip ───────────────────────────────────
const FilterChip: React.FC<{ label: string; active?: boolean; onPress?: () => void }> = ({
  label,
  active,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: active ? '#262626' : '#FAFAFA',
      borderWidth: 1,
      borderColor: active ? '#262626' : '#DBDBDB',
    }}
  >
    <Text
      style={{
        color: active ? '#FFFFFF' : '#262626',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: -0.1,
      }}
    >
      {label}
    </Text>
  </Pressable>
);

// ── Ping row ──────────────────────────────────────
const PingRow: React.FC<{ p: Ping; isFresh: boolean; onPress: () => void }> = ({
  p,
  isFresh,
  onPress,
}) => {
  const meta = CATEGORY_META[p.category];
  const Icon = meta.icon;
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: '#F4F4F4' }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 12,
        backgroundColor: pressed ? '#FAFAFA' : '#FFFFFF',
      })}
    >
      <View style={{ position: 'relative', marginRight: 12 }}>
        <Image
          source={{ uri: p.avatar }}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: '#FAFAFA',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: meta.bg,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={9} color={meta.color} strokeWidth={2.4} />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#262626' }}>{p.who}</Text>
          {isFresh && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 3,
                paddingHorizontal: 5,
                paddingVertical: 1.5,
                borderRadius: 3,
                backgroundColor: '#FFECEB',
              }}
            >
              <View
                style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#E53935' }}
              />
              <Text
                style={{
                  fontSize: 8.5,
                  fontWeight: '800',
                  color: '#E53935',
                  letterSpacing: 0.4,
                }}
              >
                NEW
              </Text>
            </View>
          )}
        </View>
        <Text
          style={{ fontSize: 13, color: '#3C3C3C', marginTop: 1, lineHeight: 18 }}
          numberOfLines={2}
        >
          {p.action}
        </Text>
      </View>

      <Text
        style={{
          fontSize: 11,
          color: '#8E8E8E',
          fontWeight: '600',
          marginLeft: 8,
          marginRight: 4,
        }}
      >
        {p.ago}
      </Text>
      <ChevronRight size={14} color="#C7C7C7" />
    </Pressable>
  );
};

// ── Detail view (contextual per ping) ─────────────
const PingDetail: React.FC<{ p: Ping; onBack: () => void }> = ({ p, onBack }) => {
  const meta = CATEGORY_META[p.category];
  const Icon = meta.icon;
  const [reply, setReply] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Detail header — back + category chip + close */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 6,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Pressable
          onPress={onBack}
          hitSlop={8}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: '#F2F2F2',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={18} color="#262626" strokeWidth={2.4} />
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            backgroundColor: meta.bg,
          }}
        >
          <Icon size={12} color={meta.color} strokeWidth={2.4} />
          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '800',
              color: meta.color,
              letterSpacing: 0.8,
            }}
          >
            {meta.label.toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* The ping itself, shown big */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 18,
            paddingBottom: 14,
          }}
        >
          <Image
            source={{ uri: p.avatar }}
            style={{ width: 44, height: 44, borderRadius: 22 }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#262626' }}>
              {p.who}
            </Text>
            <Text style={{ fontSize: 13, color: '#3C3C3C', marginTop: 1 }}>
              {p.action} · {p.ago}
            </Text>
          </View>
        </View>

        <View style={{ height: 8, backgroundColor: '#FAFAFA' }} />

        {/* Context card — adapts per category */}
        {p.context && (
          <View style={{ padding: 16 }}>
            {/* Title + host */}
            {p.context.title && (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: '#262626',
                  letterSpacing: -0.3,
                  lineHeight: 24,
                }}
              >
                {p.context.title}
              </Text>
            )}

            {p.context.host && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  gap: 8,
                }}
              >
                <View style={{ position: 'relative' }}>
                  <Image
                    source={{ uri: p.context.host.avatar }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      borderWidth: 2,
                      borderColor: '#FFD166',
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 15,
                      height: 15,
                      borderRadius: 7.5,
                      backgroundColor: '#FFD166',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1.5,
                      borderColor: '#FFFFFF',
                    }}
                  >
                    <Crown size={8} color="#262626" strokeWidth={2.5} fill="#262626" />
                  </View>
                </View>
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#262626' }}>
                  Hosted by {p.context.host.name}
                </Text>
                {p.context.host.role === 'Local' && (
                  <View
                    style={{
                      paddingHorizontal: 5,
                      paddingVertical: 1.5,
                      borderRadius: 3,
                      backgroundColor: '#262626',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: '800',
                        color: '#FFFFFF',
                        letterSpacing: 0.4,
                      }}
                    >
                      LOCAL
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Location */}
            {p.context.location && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  gap: 4,
                }}
              >
                <MapPin size={13} color="#8E8E8E" />
                <Text style={{ fontSize: 12.5, color: '#3C3C3C' }}>
                  {p.context.location}
                </Text>
              </View>
            )}

            {/* Social proof */}
            {typeof p.context.attendees === 'number' && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 14,
                  gap: 10,
                }}
              >
                {p.context.participants && p.context.participants.length > 0 && (
                  <View style={{ flexDirection: 'row' }}>
                    {p.context.participants.slice(0, 4).map((uri, i) => (
                      <Image
                        key={i}
                        source={{ uri }}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          borderWidth: 2,
                          borderColor: '#FFFFFF',
                          marginLeft: i === 0 ? 0 : -10,
                          backgroundColor: '#FAFAFA',
                        }}
                      />
                    ))}
                  </View>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Users size={13} color="#262626" />
                  <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#262626' }}>
                    {p.context.attendees}
                    {p.context.max ? ` / ${p.context.max}` : ''}
                    {' '}
                    {p.category === 'location' ? 'here now' : 'going'}
                  </Text>
                </View>
                {p.context.max && p.context.attendees < p.context.max && (
                  <Text style={{ fontSize: 12, color: '#10B981', fontWeight: '700' }}>
                    {p.context.max - p.context.attendees} spots left
                  </Text>
                )}
              </View>
            )}

            {/* Description */}
            {p.context.description && (
              <View
                style={{
                  marginTop: 14,
                  padding: 12,
                  backgroundColor: '#FAFAFA',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#EFEFEF',
                }}
              >
                <Text style={{ fontSize: 13, color: '#3C3C3C', lineHeight: 19 }}>
                  {p.context.description}
                </Text>
              </View>
            )}

            {/* Messages (for threads/talks) */}
            {p.context.messages && p.context.messages.length > 0 && (
              <View style={{ marginTop: 18 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: '#8E8E8E',
                    letterSpacing: 1.2,
                    marginBottom: 10,
                  }}
                >
                  LATEST REPLIES
                </Text>
                <View style={{ gap: 12 }}>
                  {p.context.messages.map((m, i) => (
                    <View
                      key={i}
                      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}
                    >
                      <Image
                        source={{ uri: m.avatar }}
                        style={{ width: 28, height: 28, borderRadius: 14 }}
                      />
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'baseline',
                            gap: 6,
                          }}
                        >
                          <Text
                            style={{ fontSize: 12.5, fontWeight: '700', color: '#262626' }}
                          >
                            {m.who}
                          </Text>
                          <Text style={{ fontSize: 10.5, color: '#8E8E8E' }}>{m.ago}</Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#262626',
                            marginTop: 2,
                            lineHeight: 18,
                          }}
                        >
                          {m.text}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Inline reply field for threads/talks */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 14,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: '#FAFAFA',
                    borderWidth: 1,
                    borderColor: '#DBDBDB',
                    gap: 8,
                  }}
                >
                  <TextInput
                    value={reply}
                    onChangeText={setReply}
                    placeholder="Reply in thread..."
                    placeholderTextColor="#8E8E8E"
                    style={{ flex: 1, fontSize: 13, color: '#262626' }}
                  />
                  <Pressable
                    disabled={reply.trim().length === 0}
                    onPress={() => setReply('')}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: reply.trim().length ? '#262626' : '#E9E9E9',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Send
                      size={12}
                      color={reply.trim().length ? '#FFFFFF' : '#8E8E8E'}
                      strokeWidth={2.2}
                    />
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Sticky action bar — contextual CTA + save/share */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: 14,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: '#262626',
            borderRadius: 12,
            paddingVertical: 13,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Text
            style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800', letterSpacing: -0.2 }}
          >
            {meta.cta}
          </Text>
          <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.6} />
        </Pressable>
        <Pressable
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#DBDBDB',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Heart size={17} color="#262626" strokeWidth={2} />
        </Pressable>
        <Pressable
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#DBDBDB',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Share2 size={17} color="#262626" strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
};

// ── Main drawer ───────────────────────────────────
interface Props {
  visible: boolean;
  onClose: () => void;
  cityName: string;
}

const FILTERS: { id: string; label: string; cats?: Category[] }[] = [
  { id: 'all', label: 'All' },
  { id: 'events', label: 'Events', cats: ['event', 'invite'] },
  { id: 'talks', label: 'Talks', cats: ['thread', 'talk'] },
  { id: 'locations', label: 'Locations', cats: ['location'] },
];

const ActivityDrawer: React.FC<Props> = ({ visible, onClose, cityName }) => {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Ping | null>(null);

  const translateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const detailSlide = useRef(new Animated.Value(WINDOW_WIDTH)).current;

  // ── Open/close animation with spring for natural drawer feel ─
  useEffect(() => {
    if (visible) {
      setSelected(null);
      detailSlide.setValue(WINDOW_WIDTH);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 11,
          tension: 68,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: DRAWER_HEIGHT,
          duration: 240,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, backdropOpacity, detailSlide]);

  // ── Drag-to-dismiss pan gesture ─
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dy) > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD || g.vy > DISMISS_VELOCITY) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 11,
            tension: 80,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, {
          toValue: 0,
          friction: 11,
          tension: 80,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  // ── Detail view slide in/out ─
  const openDetail = (p: Ping) => {
    setSelected(p);
    Animated.spring(detailSlide, {
      toValue: 0,
      friction: 12,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };
  const closeDetail = () => {
    Animated.timing(detailSlide, {
      toValue: WINDOW_WIDTH,
      duration: 260,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setSelected(null));
  };

  const activeFilter = FILTERS.find((f) => f.id === filter);
  const visiblePings = activeFilter?.cats
    ? ALL_PINGS.filter((p) => activeFilter.cats!.includes(p.category))
    : ALL_PINGS;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop — dimmer + tap to close */}
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'rgba(0,0,0,0.55)', opacity: backdropOpacity },
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Drawer shell */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: DRAWER_HEIGHT,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          transform: [{ translateY }],
          overflow: 'hidden',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -6 },
              shadowOpacity: 0.18,
              shadowRadius: 16,
            },
            android: { elevation: 16 },
          }),
        }}
      >
        {/* Drag handle zone — capture pan here */}
        <View
          {...panResponder.panHandlers}
          style={{ paddingTop: 10, paddingBottom: 8, alignItems: 'center' }}
        >
          <View
            style={{ width: 42, height: 5, borderRadius: 3, backgroundColor: '#DBDBDB' }}
          />
        </View>

        {/* Two stacked panes: list and detail. Detail slides over the list. */}
        <View style={{ flex: 1, position: 'relative' }}>
          {/* LIST pane */}
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View
              style={{
                paddingHorizontal: 18,
                paddingBottom: 14,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Zap size={17} color="#10B981" fill="#10B981" strokeWidth={2} />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '800',
                      color: '#262626',
                      letterSpacing: -0.3,
                    }}
                  >
                    Live feed
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#8E8E8E', marginTop: 3 }}>
                  {visiblePings.length} updates · last hour in {cityName}
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                hitSlop={8}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: '#F2F2F2',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={17} color="#262626" strokeWidth={2.4} />
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 18, gap: 6 }}
              style={{ maxHeight: 44 }}
            >
              {FILTERS.map((f) => (
                <FilterChip
                  key={f.id}
                  label={f.label}
                  active={filter === f.id}
                  onPress={() => setFilter(f.id)}
                />
              ))}
            </ScrollView>

            <View style={{ height: 1, backgroundColor: '#F2F2F2', marginTop: 10 }} />

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
              showsVerticalScrollIndicator={false}
            >
              {visiblePings.map((p) => (
                <PingRow
                  key={p.id}
                  p={p}
                  isFresh={p.agoSec <= 120}
                  onPress={() => openDetail(p)}
                />
              ))}
            </ScrollView>
          </View>

          {/* DETAIL pane — slides in over the list */}
          {selected && (
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#FFFFFF',
                transform: [{ translateX: detailSlide }],
              }}
            >
              <PingDetail p={selected} onBack={closeDetail} />
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};

export default ActivityDrawer;
