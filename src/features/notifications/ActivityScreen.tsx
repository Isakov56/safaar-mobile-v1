import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Heart,
  MessageCircle,
  UserPlus,
  Calendar,
  Star,
  Bookmark,
  Bell,
} from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';
import Pill from '../../components/ui/Pill';
import type { LucideIcon } from 'lucide-react-native';

// ── Types ────────────────────────────────────────────
type NotificationType =
  | 'follow'
  | 'like'
  | 'comment'
  | 'booking'
  | 'message'
  | 'review'
  | 'reminder';

interface Notification {
  id: string;
  type: NotificationType;
  actor: {
    name: string;
    avatar: string | null;
  };
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
}

type FilterCategory = 'all' | 'follows' | 'likes' | 'comments' | 'bookings' | 'messages';

// ── Mock Data ────────────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'follow',
    actor: { name: 'Marco Rossi', avatar: 'https://i.pravatar.cc/150?img=15' },
    message: 'started following you',
    timestamp: '5m ago',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'like',
    actor: { name: 'Aisha Chen', avatar: 'https://i.pravatar.cc/150?img=32' },
    message: 'liked your post about Registan Square',
    timestamp: '15m ago',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'comment',
    actor: { name: 'Yuki Tanaka', avatar: 'https://i.pravatar.cc/150?img=9' },
    message: 'commented: "This is absolutely stunning! What lens did you use?"',
    timestamp: '1h ago',
    isRead: false,
  },
  {
    id: 'n4',
    type: 'booking',
    actor: { name: 'Sabina Karimova', avatar: 'https://i.pravatar.cc/150?img=47' },
    message: 'confirmed your booking for Traditional Ceramics Workshop on Apr 15',
    timestamp: '2h ago',
    isRead: false,
    actionLabel: 'View Booking',
  },
  {
    id: 'n5',
    type: 'like',
    actor: { name: 'Nilufar Akhmedova', avatar: 'https://i.pravatar.cc/150?img=25' },
    message: 'and 3 others liked your review of Sunset Desert Tour',
    timestamp: '3h ago',
    isRead: true,
  },
  {
    id: 'n6',
    type: 'message',
    actor: { name: 'Dmitry Volkov', avatar: 'https://i.pravatar.cc/150?img=12' },
    message: 'sent you a message about the photography walk',
    timestamp: '4h ago',
    isRead: true,
  },
  {
    id: 'n7',
    type: 'review',
    actor: { name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/150?img=44' },
    message: 'left a 5-star review on your Ceramics Workshop',
    timestamp: '6h ago',
    isRead: true,
  },
  {
    id: 'n8',
    type: 'reminder',
    actor: { name: 'SAFAAR', avatar: null },
    message: 'Your ceramics workshop with Sabina is tomorrow at 10:00 AM. Do not forget!',
    timestamp: '8h ago',
    isRead: true,
    actionLabel: 'View Details',
  },
  {
    id: 'n9',
    type: 'follow',
    actor: { name: 'Lena Muller', avatar: 'https://i.pravatar.cc/150?img=23' },
    message: 'started following you',
    timestamp: 'Yesterday',
    isRead: true,
  },
  {
    id: 'n10',
    type: 'booking',
    actor: { name: 'Rustam Kalandarov', avatar: 'https://i.pravatar.cc/150?img=52' },
    message: 'has a new time slot available for Desert Camel Tour. Book now!',
    timestamp: 'Yesterday',
    isRead: true,
    actionLabel: 'Book Now',
  },
];

// ── Helpers ──────────────────────────────────────────
const ICON_MAP: Record<NotificationType, LucideIcon> = {
  follow: UserPlus,
  like: Heart,
  comment: MessageCircle,
  booking: Calendar,
  message: MessageCircle,
  review: Star,
  reminder: Bell,
};

const ICON_COLOR_MAP: Record<NotificationType, string> = {
  follow: '#1E88E5',
  like: '#E53935',
  comment: '#C4993C',
  booking: '#2E7D32',
  message: '#C4993C',
  review: '#C4993C',
  reminder: '#E65100',
};

const FILTER_CATEGORIES: { key: FilterCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'follows', label: 'Follows' },
  { key: 'likes', label: 'Likes' },
  { key: 'comments', label: 'Comments' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'messages', label: 'Messages' },
];

const filterMap: Record<FilterCategory, NotificationType[] | null> = {
  all: null,
  follows: ['follow'],
  likes: ['like'],
  comments: ['comment'],
  bookings: ['booking'],
  messages: ['message'],
};

// ── Notification Row ─────────────────────────────────
const NotificationRow: React.FC<{
  notification: Notification;
  onPress: (id: string) => void;
}> = ({ notification, onPress }) => {
  const Icon = ICON_MAP[notification.type];
  const iconColor = ICON_COLOR_MAP[notification.type];

  return (
    <Pressable
      onPress={() => onPress(notification.id)}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: notification.isRead ? '#FFFFFF' : '#FFFCF5',
        borderLeftWidth: notification.isRead ? 0 : 3,
        borderLeftColor: notification.isRead ? 'transparent' : '#C4993C',
      }}
    >
      <View style={{ position: 'relative' }}>
        <Avatar
          uri={notification.actor.avatar}
          size={40}
          name={notification.actor.name}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={12} color={iconColor} />
        </View>
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'SourceSerif4-Regular',
            color: '#1A1A1A',
            lineHeight: 18,
          }}
        >
          <Text style={{ fontFamily: 'SourceSerif4-SemiBold' }}>
            {notification.actor.name}
          </Text>{' '}
          {notification.message}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'SourceSerif4-Regular',
            color: '#8A8A8A',
            marginTop: 4,
          }}
        >
          {notification.timestamp}
        </Text>
        {notification.actionLabel && (
          <Pressable style={{ marginTop: 6 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#C4993C',
              }}
            >
              {notification.actionLabel}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

// ── Screen ───────────────────────────────────────────
const ActivityScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredNotifications = MOCK_NOTIFICATIONS.filter((n) => {
    const types = filterMap[activeFilter];
    if (!types) return true;
    return types.includes(n.type);
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleNotificationPress = useCallback((id: string) => {
    // Navigate to relevant screen based on notification type
  }, []);

  const renderNotification = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationRow
        notification={item}
        onPress={handleNotificationPress}
      />
    ),
    [handleNotificationPress],
  );

  const renderSeparator = useCallback(
    () => (
      <View
        style={{
          height: 1,
          backgroundColor: '#F2EDE4',
          marginLeft: 68,
        }}
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: 'SourceSerif4-Bold',
            color: '#1A1A1A',
          }}
        >
          Activity
        </Text>
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
          paddingBottom: 12,
        }}
      >
        {FILTER_CATEGORIES.map((cat) => (
          <Pill
            key={cat.key}
            label={cat.label}
            selected={activeFilter === cat.key}
            onPress={() => setActiveFilter(cat.key)}
          />
        ))}
      </ScrollView>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C4993C"
            colors={['#C4993C']}
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <Bell size={40} color="#8A8A8A" />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#4A4A4A',
                marginTop: 12,
              }}
            >
              No activity yet
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8A8A8A',
                marginTop: 4,
                textAlign: 'center',
                maxWidth: 260,
              }}
            >
              When you get likes, comments, or bookings they will show up here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ActivityScreen;
