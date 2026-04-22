import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import {
  ChevronLeft,
  CheckCheck,
  Trash2,
  Check,
  UserPlus,
  Calendar,
  MessageCircle,
  AtSign,
  Trophy,
  Clock,
  MapPin,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

// ── Types ─────────────────────────────────────────
type Category = 'mentions' | 'invites' | 'events' | 'reminders';

type NotifType =
  | 'invite_received'     // Olga invited you to X
  | 'invite_accepted'     // Kamila accepted your request
  | 'reply'               // Mira replied to your thread
  | 'mention'             // @you
  | 'event_reminder'      // event in 3h
  | 'badge'               // you got a badge
  | 'event_joined';       // someone joined your event

interface Notification {
  id: string;
  unread: boolean;
  category: Category;
  type: NotifType;
  avatar: string;
  actor: string;
  action: string;
  detail?: string;
  ago: string;
  agoDays: number;
  /** Call-to-action label for a single inline button (chat, view, etc.) */
  cta?: string;
}

// ── Mock data ─────────────────────────────────────
const NOTIFS: Notification[] = [
  {
    id: 'n1',
    unread: true,
    category: 'invites',
    type: 'invite_accepted',
    avatar: 'https://i.pravatar.cc/120?u=kamila',
    actor: 'Kamila',
    action: 'accepted your request',
    detail: '“Rooftop chai at Hyatt”',
    ago: '2m',
    agoDays: 0,
    cta: 'Chat',
  },
  {
    id: 'n2',
    unread: true,
    category: 'mentions',
    type: 'reply',
    avatar: 'https://i.pravatar.cc/120?u=mira',
    actor: 'Mira',
    action: 'replied to your thread',
    detail: '“Best plov in Tashkent?”',
    ago: '18m',
    agoDays: 0,
  },
  {
    id: 'n3',
    unread: true,
    category: 'events',
    type: 'event_joined',
    avatar: 'https://i.pravatar.cc/120?u=alex',
    actor: 'Alex',
    action: 'joined your event',
    detail: '“Communal plov tonight”',
    ago: '42m',
    agoDays: 0,
    cta: 'View',
  },
  {
    id: 'n4',
    unread: false,
    category: 'invites',
    type: 'invite_received',
    avatar: 'https://i.pravatar.cc/120?u=olga',
    actor: 'Olga',
    action: 'invited you to Chimgan trip',
    detail: 'Saturday · 5 going · shared car',
    ago: '1d',
    agoDays: 1,
  },
  {
    id: 'n5',
    unread: false,
    category: 'reminders',
    type: 'event_reminder',
    avatar: 'https://i.pravatar.cc/120?u=hyatt',
    actor: 'Reminder',
    action: 'Your event “Rooftop chai” is in 3 hours',
    detail: '4 going · 2 spots left',
    ago: '1d',
    agoDays: 1,
    cta: 'View',
  },
  {
    id: 'n6',
    unread: false,
    category: 'mentions',
    type: 'mention',
    avatar: 'https://i.pravatar.cc/120?u=timur',
    actor: 'Timur',
    action: 'mentioned you in a thread',
    detail: '“@you — try the samsa stall at Chorsu north gate”',
    ago: '2d',
    agoDays: 2,
  },
  {
    id: 'n7',
    unread: false,
    category: 'events',
    type: 'badge',
    avatar: 'https://i.pravatar.cc/120?u=badge',
    actor: 'Passport',
    action: 'You earned a new badge',
    detail: '🏆 Chorsu Regular — 3 visits',
    ago: '3d',
    agoDays: 3,
  },
  {
    id: 'n8',
    unread: false,
    category: 'events',
    type: 'event_joined',
    avatar: 'https://i.pravatar.cc/120?u=chen',
    actor: 'Chen',
    action: 'joined your event',
    detail: '“Film photo walk, Old City”',
    ago: '4d',
    agoDays: 4,
    cta: 'View',
  },
  {
    id: 'n9',
    unread: false,
    category: 'reminders',
    type: 'event_reminder',
    avatar: 'https://i.pravatar.cc/120?u=bazaar',
    actor: 'Reminder',
    action: 'Saturday bazaar starts tomorrow — still interested?',
    ago: '9d',
    agoDays: 9,
  },
];

// ── Category meta ─────────────────────────────────
const TYPE_META: Record<NotifType, { icon: LucideIcon; color: string; bg: string }> = {
  invite_received: { icon: UserPlus, color: '#7C3AED', bg: '#F2E9FD' },
  invite_accepted: { icon: Check, color: '#0E7451', bg: '#E6FAF0' },
  reply: { icon: MessageCircle, color: '#1155B8', bg: '#E5F0FF' },
  mention: { icon: AtSign, color: '#B91C1C', bg: '#FEE5E5' },
  event_reminder: { icon: Clock, color: '#A66300', bg: '#FFF0D1' },
  badge: { icon: Trophy, color: '#8B5E00', bg: '#FFF8E7' },
  event_joined: { icon: Calendar, color: '#8B5E00', bg: '#FFF8E7' },
};

// ── Filter chips ──────────────────────────────────
const FILTERS: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'mentions', label: 'Mentions' },
  { id: 'invites', label: 'Invites' },
  { id: 'events', label: 'Events' },
  { id: 'reminders', label: 'Reminders' },
];

const FilterChip: React.FC<{
  label: string;
  active: boolean;
  badge?: number;
  onPress: () => void;
}> = ({ label, active, badge, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
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
        fontSize: 12.5,
        fontWeight: '700',
        letterSpacing: -0.1,
      }}
    >
      {label}
    </Text>
    {badge != null && badge > 0 && (
      <View
        style={{
          minWidth: 16,
          height: 16,
          paddingHorizontal: 4,
          borderRadius: 8,
          backgroundColor: active ? '#FFFFFF' : '#E53935',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: active ? '#262626' : '#FFFFFF',
            fontSize: 9,
            fontWeight: '800',
          }}
        >
          {badge}
        </Text>
      </View>
    )}
  </Pressable>
);

// ── Swipe action panels ──────────────────────────
const LeftActions: React.FC<{ progress: Animated.AnimatedInterpolation<number> }> = ({
  progress,
}) => {
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
    extrapolate: 'clamp',
  });
  return (
    <View
      style={{
        backgroundColor: '#10B981',
        justifyContent: 'center',
        paddingLeft: 18,
        flex: 1,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <CheckCheck size={18} color="#FFFFFF" strokeWidth={2.4} />
        <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
          Mark as read
        </Text>
      </Animated.View>
    </View>
  );
};

const RightActions: React.FC<{ progress: Animated.AnimatedInterpolation<number> }> = ({
  progress,
}) => {
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
    extrapolate: 'clamp',
  });
  return (
    <View
      style={{
        backgroundColor: '#E53935',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 18,
        flex: 1,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Trash2 size={18} color="#FFFFFF" strokeWidth={2.4} />
        <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>Delete</Text>
      </Animated.View>
    </View>
  );
};

// ── Notification row ──────────────────────────────
const NotifRow: React.FC<{
  n: Notification;
  onMarkRead: () => void;
  onDelete: () => void;
  onPress: () => void;
  onAccept?: () => void;
  onSkip?: () => void;
  onCta?: () => void;
}> = ({ n, onMarkRead, onDelete, onPress, onAccept, onSkip, onCta }) => {
  const meta = TYPE_META[n.type];
  const Icon = meta.icon;
  const showInviteActions = n.type === 'invite_received';
  const swipeRef = React.useRef<Swipeable>(null);

  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      leftThreshold={80}
      rightThreshold={80}
      renderLeftActions={(progress) => <LeftActions progress={progress} />}
      renderRightActions={(progress) => <RightActions progress={progress} />}
      onSwipeableLeftOpen={() => {
        onMarkRead();
        swipeRef.current?.close();
      }}
      onSwipeableRightOpen={() => {
        onDelete();
      }}
    >
      <Pressable
        onPress={onPress}
        android_ripple={{ color: '#F4F4F4' }}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: 18,
          paddingVertical: 14,
          backgroundColor: pressed
            ? '#F5F5F5'
            : n.unread
              ? '#F1FDF6'
              : '#FFFFFF',
        })}
      >
        {/* Unread dot */}
        <View
          style={{
            width: 6,
            marginRight: 8,
            marginTop: 18,
          }}
        >
          {n.unread && (
            <View
              style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' }}
            />
          )}
        </View>

        {/* Avatar with category badge */}
        <View style={{ position: 'relative', marginRight: 12 }}>
          <Image
            source={{ uri: n.avatar }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#FAFAFA',
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: meta.bg,
              borderWidth: 2,
              borderColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={10} color={meta.color} strokeWidth={2.4} />
          </View>
        </View>

        {/* Body */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13.5, color: '#262626', lineHeight: 19 }}>
            <Text style={{ fontWeight: '700' }}>{n.actor}</Text>{' '}
            <Text style={{ color: '#262626' }}>{n.action}</Text>
          </Text>
          {n.detail && (
            <Text
              style={{
                fontSize: 12.5,
                color: '#8E8E8E',
                marginTop: 2,
                lineHeight: 17,
              }}
              numberOfLines={2}
            >
              {n.detail}
            </Text>
          )}

          {/* Inline actions */}
          {showInviteActions && (
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginTop: 10,
              }}
            >
              <Pressable
                onPress={() => {
                  onAccept?.();
                  swipeRef.current?.close();
                }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 8,
                  backgroundColor: '#262626',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Check size={13} color="#FFFFFF" strokeWidth={2.6} />
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: '800',
                    letterSpacing: -0.1,
                  }}
                >
                  Accept
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onSkip?.()}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#DBDBDB',
                }}
              >
                <Text
                  style={{
                    color: '#3C3C3C',
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  Skip
                </Text>
              </Pressable>
              <Pressable
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#DBDBDB',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 'auto',
                }}
              >
                <MessageCircle size={14} color="#262626" strokeWidth={2} />
              </Pressable>
            </View>
          )}

          {n.cta && !showInviteActions && (
            <Pressable
              onPress={() => onCta?.()}
              style={{
                alignSelf: 'flex-start',
                marginTop: 8,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 6,
                backgroundColor: '#FAFAFA',
                borderWidth: 1,
                borderColor: '#DBDBDB',
              }}
            >
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: '#262626' }}>
                {n.cta}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Timestamp */}
        <Text
          style={{
            fontSize: 11,
            color: '#8E8E8E',
            fontWeight: '600',
            marginLeft: 8,
            marginTop: 2,
          }}
        >
          {n.ago}
        </Text>
      </Pressable>
    </Swipeable>
  );
};

// ── Empty state ───────────────────────────────────
const EmptyState: React.FC<{ label: string }> = ({ label }) => (
  <View
    style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 }}
  >
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CheckCheck size={28} color="#8E8E8E" strokeWidth={2} />
    </View>
    <Text
      style={{
        marginTop: 14,
        fontSize: 15,
        fontWeight: '700',
        color: '#262626',
        letterSpacing: -0.2,
      }}
    >
      You're all caught up
    </Text>
    <Text
      style={{
        marginTop: 4,
        fontSize: 12.5,
        color: '#8E8E8E',
        textAlign: 'center',
      }}
    >
      {label}
    </Text>
  </View>
);

// ── Group header ──────────────────────────────────
const GroupHeader: React.FC<{ text: string; count: number }> = ({ text, count }) => (
  <View
    style={{
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 8,
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
      backgroundColor: '#FFFFFF',
    }}
  >
    <Text
      style={{
        fontSize: 11,
        fontWeight: '800',
        color: '#8E8E8E',
        letterSpacing: 1.4,
      }}
    >
      {text}
    </Text>
    <Text style={{ fontSize: 11, color: '#C7C7C7', fontWeight: '600' }}>
      {count}
    </Text>
  </View>
);

// ── Main screen ───────────────────────────────────
const ActivityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<'all' | Category>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);

  const filtered = useMemo(
    () => (filter === 'all' ? notifs : notifs.filter((n) => n.category === filter)),
    [filter, notifs],
  );

  const groups = useMemo(() => {
    const today = filtered.filter((n) => n.agoDays === 0);
    const week = filtered.filter((n) => n.agoDays > 0 && n.agoDays < 7);
    const earlier = filtered.filter((n) => n.agoDays >= 7);
    return { today, week, earlier };
  }, [filtered]);

  const unreadCount = notifs.filter((n) => n.unread).length;
  const hasAny = filtered.length > 0;

  const markAllRead = useCallback(() => {
    setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })));
  }, []);
  const markOneRead = (id: string) =>
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const deleteOne = (id: string) =>
    setNotifs((ns) => ns.filter((n) => n.id !== id));
  const onPressItem = (id: string) => {
    markOneRead(id);
    // TODO: route to the specific target (event, thread, profile)
  };
  const onAcceptInvite = (id: string) => markOneRead(id);
  const onSkipInvite = (id: string) => deleteOne(id);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 6,
          paddingBottom: 10,
          paddingHorizontal: 14,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F2F2F2',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
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
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#262626',
                letterSpacing: -0.3,
              }}
            >
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Text style={{ fontSize: 11, color: '#10B981', fontWeight: '700', marginTop: 1 }}>
                {unreadCount} unread
              </Text>
            )}
          </View>
        </View>

        <Pressable
          disabled={unreadCount === 0}
          onPress={markAllRead}
          hitSlop={6}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
            opacity: unreadCount === 0 ? 0.4 : 1,
          }}
        >
          <CheckCheck size={14} color="#262626" strokeWidth={2.2} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#262626' }}>
            Mark all read
          </Text>
        </Pressable>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 12, gap: 6 }}
        style={{ maxHeight: 54 }}
      >
        {FILTERS.map((f) => {
          const count =
            f.id === 'all'
              ? unreadCount
              : notifs.filter((n) => n.category === f.id && n.unread).length;
          return (
            <FilterChip
              key={f.id}
              label={f.label}
              active={filter === f.id}
              badge={count}
              onPress={() => setFilter(f.id)}
            />
          );
        })}
      </ScrollView>

      <View style={{ height: 1, backgroundColor: '#F2F2F2' }} />

      {/* List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#262626"
          />
        }
      >
        {!hasAny && (
          <EmptyState label="No notifications in this category yet." />
        )}

        {groups.today.length > 0 && (
          <>
            <GroupHeader text="TODAY" count={groups.today.length} />
            {groups.today.map((n) => (
              <NotifRow
                key={n.id}
                n={n}
                onMarkRead={() => markOneRead(n.id)}
                onDelete={() => deleteOne(n.id)}
                onPress={() => onPressItem(n.id)}
                onAccept={() => onAcceptInvite(n.id)}
                onSkip={() => onSkipInvite(n.id)}
                onCta={() => onPressItem(n.id)}
              />
            ))}
          </>
        )}

        {groups.week.length > 0 && (
          <>
            <GroupHeader text="THIS WEEK" count={groups.week.length} />
            {groups.week.map((n) => (
              <NotifRow
                key={n.id}
                n={n}
                onMarkRead={() => markOneRead(n.id)}
                onDelete={() => deleteOne(n.id)}
                onPress={() => onPressItem(n.id)}
                onAccept={() => onAcceptInvite(n.id)}
                onSkip={() => onSkipInvite(n.id)}
                onCta={() => onPressItem(n.id)}
              />
            ))}
          </>
        )}

        {groups.earlier.length > 0 && (
          <>
            <GroupHeader text="EARLIER" count={groups.earlier.length} />
            {groups.earlier.map((n) => (
              <NotifRow
                key={n.id}
                n={n}
                onMarkRead={() => markOneRead(n.id)}
                onDelete={() => deleteOne(n.id)}
                onPress={() => onPressItem(n.id)}
                onAccept={() => onAcceptInvite(n.id)}
                onSkip={() => onSkipInvite(n.id)}
                onCta={() => onPressItem(n.id)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ActivityScreen;
