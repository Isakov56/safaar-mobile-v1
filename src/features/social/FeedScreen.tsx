import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MapPin,
  Star,
  Calendar,
} from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';

// ── Types ────────────────────────────────────────────
type PostType = 'standard' | 'event' | 'review' | 'story';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
    isVerified: boolean;
  };
  type: PostType;
  caption: string;
  imageUri: string | null;
  location: string | null;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  // Event-specific
  eventDate?: string;
  eventTitle?: string;
  // Review-specific
  rating?: number;
  experienceTitle?: string;
}

type FeedTab = 'following' | 'foryou' | 'favorites';

// ── Mock Data ────────────────────────────────────────
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: {
      id: 'u1',
      name: 'Sabina Karimova',
      avatar: 'https://i.pravatar.cc/150?img=47',
      isVerified: true,
    },
    type: 'standard',
    caption:
      'Morning light hitting the Registan tiles just right. These moments remind me why I fell in love with Samarkand.',
    imageUri: 'https://picsum.photos/seed/registan/800/600',
    location: 'Registan Square, Samarkand',
    likes: 243,
    comments: 18,
    isLiked: false,
    isSaved: false,
    createdAt: '2h ago',
  },
  {
    id: '2',
    author: {
      id: 'u2',
      name: 'Dmitry Volkov',
      avatar: 'https://i.pravatar.cc/150?img=12',
      isVerified: false,
    },
    type: 'event',
    caption:
      'Excited to announce our first community pottery workshop! Beginners welcome. Limited to 12 spots.',
    imageUri: 'https://picsum.photos/seed/pottery/800/600',
    location: 'Chorsu Bazaar, Tashkent',
    likes: 87,
    comments: 34,
    isLiked: true,
    isSaved: true,
    createdAt: '4h ago',
    eventDate: 'Apr 15, 2026 at 10:00 AM',
    eventTitle: 'Hands-on Pottery with Local Artisans',
  },
  {
    id: '3',
    author: {
      id: 'u3',
      name: 'Aisha Chen',
      avatar: 'https://i.pravatar.cc/150?img=32',
      isVerified: false,
    },
    type: 'review',
    caption:
      'Just finished Sabina\'s ceramics class and I am speechless. She taught us the traditional Rishtan blue technique. Walked away with my own hand-painted bowl!',
    imageUri: 'https://picsum.photos/seed/ceramics/800/600',
    location: 'Tashkent, Uzbekistan',
    likes: 156,
    comments: 22,
    isLiked: false,
    isSaved: false,
    createdAt: '6h ago',
    rating: 5,
    experienceTitle: 'Traditional Ceramics Workshop',
  },
  {
    id: '4',
    author: {
      id: 'u4',
      name: 'Marco Rossi',
      avatar: 'https://i.pravatar.cc/150?img=15',
      isVerified: false,
    },
    type: 'story',
    caption:
      'Day 5 of my Silk Road journey. Got lost in the old town alleys of Bukhara, ended up sharing tea with a carpet weaver who told me stories of traders from centuries past. Travel at its finest.',
    imageUri: 'https://picsum.photos/seed/bukhara/800/600',
    location: 'Old Town, Bukhara',
    likes: 312,
    comments: 45,
    isLiked: true,
    isSaved: false,
    createdAt: '8h ago',
  },
  {
    id: '5',
    author: {
      id: 'u5',
      name: 'Nilufar Akhmedova',
      avatar: 'https://i.pravatar.cc/150?img=25',
      isVerified: true,
    },
    type: 'standard',
    caption:
      'Plov competition at the local mahalla today. My uncle took third place and honestly, it was the best one there. Family bias? Maybe.',
    imageUri: 'https://picsum.photos/seed/plov/800/600',
    location: 'Sergeli, Tashkent',
    likes: 198,
    comments: 31,
    isLiked: false,
    isSaved: true,
    createdAt: '12h ago',
  },
  {
    id: '6',
    author: {
      id: 'u6',
      name: 'Yuki Tanaka',
      avatar: 'https://i.pravatar.cc/150?img=9',
      isVerified: false,
    },
    type: 'review',
    caption:
      'The sunset desert tour exceeded every expectation. Riding camels through the Kyzylkum at golden hour with traditional music playing in the background. Truly unforgettable.',
    imageUri: 'https://picsum.photos/seed/desert/800/600',
    location: 'Kyzylkum Desert, Navoi',
    likes: 421,
    comments: 56,
    isLiked: false,
    isSaved: false,
    createdAt: '1d ago',
    rating: 5,
    experienceTitle: 'Sunset Desert Camel Tour',
  },
];

// ── Tab Bar ──────────────────────────────────────────
const TABS: { key: FeedTab; label: string }[] = [
  { key: 'following', label: 'Following' },
  { key: 'foryou', label: 'For You' },
  { key: 'favorites', label: 'Favorites' },
];

const FeedTabs: React.FC<{
  active: FeedTab;
  onSelect: (tab: FeedTab) => void;
}> = ({ active, onSelect }) => (
  <View
    className="bg-canvas"
    style={{
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#FAFAFA',
    }}
  >
    {TABS.map((tab) => {
      const isActive = tab.key === active;
      return (
        <Pressable
          key={tab.key}
          onPress={() => onSelect(tab.key)}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 2,
            borderBottomColor: isActive ? '#C4993C' : 'transparent',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: isActive
                ? 'SourceSerif4-SemiBold'
                : 'SourceSerif4-Regular',
              color: isActive ? '#262626' : '#8E8E8E',
            }}
          >
            {tab.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

// ── Post Card ────────────────────────────────────────
const PostCard: React.FC<{
  post: Post;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
}> = ({ post, onToggleLike, onToggleSave }) => (
  <View
    style={{
      backgroundColor: '#FFFFFF',
      marginBottom: 8,
      paddingBottom: 12,
    }}
  >
    {/* Header */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Avatar
        uri={post.author.avatar}
        size={40}
        name={post.author.name}
        verified={post.author.isVerified}
      />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#262626',
          }}
        >
          {post.author.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {post.location && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MapPin size={11} color="#8E8E8E" />
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8E8E8E',
                  marginLeft: 2,
                }}
              >
                {post.location}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Text
        style={{
          fontSize: 11,
          fontFamily: 'SourceSerif4-Regular',
          color: '#8E8E8E',
        }}
      >
        {post.createdAt}
      </Text>
    </View>

    {/* Type badge for event / review */}
    {post.type === 'event' && post.eventTitle && (
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <View
          style={{
            backgroundColor: '#E8D5A8',
            borderRadius: 8,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Calendar size={14} color="#8B6914" />
          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#8B6914',
              }}
            >
              {post.eventTitle}
            </Text>
            {post.eventDate && (
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8B6914',
                  marginTop: 2,
                }}
              >
                {post.eventDate}
              </Text>
            )}
          </View>
        </View>
      </View>
    )}

    {post.type === 'review' && post.rating && (
      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Badge label={post.experienceTitle ?? 'Experience'} variant="gold" size="sm" />
        <View style={{ flexDirection: 'row', marginLeft: 6 }}>
          {Array.from({ length: post.rating }).map((_, i) => (
            <Star key={i} size={12} color="#C4993C" fill="#C4993C" />
          ))}
        </View>
      </View>
    )}

    {/* Image */}
    {post.imageUri && (
      <Image
        source={{ uri: post.imageUri }}
        style={{ width: '100%', aspectRatio: 4 / 3 }}
        contentFit="cover"
        transition={200}
      />
    )}

    {/* Actions */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        gap: 16,
      }}
    >
      <Pressable
        onPress={() => onToggleLike(post.id)}
        style={{ flexDirection: 'row', alignItems: 'center' }}
        hitSlop={8}
      >
        <Heart
          size={20}
          color={post.isLiked ? '#E53935' : '#262626'}
          fill={post.isLiked ? '#E53935' : 'transparent'}
        />
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'SourceSerif4-Regular',
            color: '#3C3C3C',
            marginLeft: 4,
          }}
        >
          {post.likes}
        </Text>
      </Pressable>

      <Pressable
        style={{ flexDirection: 'row', alignItems: 'center' }}
        hitSlop={8}
      >
        <MessageCircle size={20} color="#262626" />
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'SourceSerif4-Regular',
            color: '#3C3C3C',
            marginLeft: 4,
          }}
        >
          {post.comments}
        </Text>
      </Pressable>

      <Pressable hitSlop={8}>
        <Share2 size={20} color="#262626" />
      </Pressable>

      <View style={{ flex: 1 }} />

      <Pressable onPress={() => onToggleSave(post.id)} hitSlop={8}>
        <Bookmark
          size={20}
          color={post.isSaved ? '#C4993C' : '#262626'}
          fill={post.isSaved ? '#C4993C' : 'transparent'}
        />
      </Pressable>
    </View>

    {/* Caption */}
    <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'SourceSerif4-Regular',
          color: '#262626',
          lineHeight: 20,
        }}
        numberOfLines={3}
      >
        <Text style={{ fontFamily: 'SourceSerif4-SemiBold' }}>
          {post.author.name}
        </Text>{' '}
        {post.caption}
      </Text>
    </View>
  </View>
);

// ── Screen ───────────────────────────────────────────
const FeedScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedTab>('foryou');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewPosts, setShowNewPosts] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setShowNewPosts(false);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const toggleLike = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  }, []);

  const toggleSave = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isSaved: !p.isSaved } : p,
      ),
    );
  }, []);

  const handleEndReached = useCallback(() => {
    // Infinite scroll placeholder - in production would fetch next page
  }, []);

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        onToggleLike={toggleLike}
        onToggleSave={toggleSave}
      />
    ),
    [toggleLike, toggleSave],
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      edges={['top']}
    >
      {/* Sticky Tabs */}
      <FeedTabs active={activeTab} onSelect={setActiveTab} />

      {/* New posts banner */}
      {showNewPosts && (
        <Pressable
          onPress={onRefresh}
          style={{
            backgroundColor: '#C4993C',
            paddingVertical: 8,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#FFFFFF',
            }}
          >
            New posts available - tap to refresh
          </Text>
        </Pressable>
      )}

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C4993C"
            colors={['#C4993C']}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      />
    </SafeAreaView>
  );
};

export default FeedScreen;
