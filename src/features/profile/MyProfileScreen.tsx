import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Settings,
  MapPin,
  Calendar,
  Bookmark,
  Star,
} from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

// ── Types ────────────────────────────────────────────
type ProfileTab = 'bookings' | 'saved' | 'posts';

interface Booking {
  id: string;
  title: string;
  host: string;
  date: string;
  imageUri: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface SavedItem {
  id: string;
  title: string;
  imageUri: string;
  category: string;
  price: number;
}

interface UserPost {
  id: string;
  imageUri: string;
  likes: number;
  comments: number;
}

// ── Mock Data ────────────────────────────────────────
const MOCK_USER = {
  name: 'Alex Rivera',
  avatar: 'https://i.pravatar.cc/150?img=68',
  bio: 'Curious soul exploring the Silk Road, one chai house at a time.',
  city: 'San Francisco, CA',
  joinedDate: 'Member since Jan 2025',
  stats: {
    experiences: 12,
    following: 87,
    followers: 234,
  },
};

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    title: 'Traditional Ceramics Workshop',
    host: 'Sabina Karimova',
    date: 'Apr 15, 2026 at 10:00 AM',
    imageUri: 'https://picsum.photos/seed/ceramics1/400/300',
    status: 'upcoming',
  },
  {
    id: 'b2',
    title: 'Silk Road Cooking Class',
    host: 'Aziz Umarov',
    date: 'Apr 20, 2026 at 2:00 PM',
    imageUri: 'https://picsum.photos/seed/cooking1/400/300',
    status: 'upcoming',
  },
  {
    id: 'b3',
    title: 'Old City Photography Walk',
    host: 'Dmitry Volkov',
    date: 'Mar 28, 2026 at 9:00 AM',
    imageUri: 'https://picsum.photos/seed/photo1/400/300',
    status: 'completed',
  },
];

const MOCK_SAVED: SavedItem[] = [
  {
    id: 's1',
    title: 'Suzani Embroidery Masterclass',
    imageUri: 'https://picsum.photos/seed/textiles1/400/300',
    category: 'Textiles',
    price: 55,
  },
  {
    id: 's2',
    title: 'Desert Sunset Camel Trek',
    imageUri: 'https://picsum.photos/seed/desert1/400/300',
    category: 'Adventure',
    price: 65,
  },
  {
    id: 's3',
    title: 'Traditional Music Evening',
    imageUri: 'https://picsum.photos/seed/music1/400/300',
    category: 'Music',
    price: 25,
  },
];

const MOCK_POSTS: UserPost[] = [
  { id: 'p1', imageUri: 'https://picsum.photos/seed/post1/400/400', likes: 87, comments: 12 },
  { id: 'p2', imageUri: 'https://picsum.photos/seed/post2/400/400', likes: 156, comments: 22 },
  { id: 'p3', imageUri: 'https://picsum.photos/seed/post3/400/400', likes: 243, comments: 31 },
  { id: 'p4', imageUri: 'https://picsum.photos/seed/post4/400/400', likes: 64, comments: 8 },
  { id: 'p5', imageUri: 'https://picsum.photos/seed/post5/400/400', likes: 198, comments: 18 },
  { id: 'p6', imageUri: 'https://picsum.photos/seed/post6/400/400', likes: 312, comments: 45 },
];

// ── Tab Content: Bookings ────────────────────────────
const BookingsTab: React.FC = () => (
  <View style={{ paddingHorizontal: 16, gap: 12 }}>
    {MOCK_BOOKINGS.map((booking) => (
      <Card key={booking.id} elevated padding={0}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: booking.imageUri }}
            style={{
              width: 90,
              height: 90,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
            }}
            contentFit="cover"
          />
          <View style={{ flex: 1, padding: 12 }}>
            <Badge
              label={booking.status === 'upcoming' ? 'Upcoming' : 'Completed'}
              variant={booking.status === 'upcoming' ? 'gold' : 'success'}
              size="sm"
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#262626',
                marginTop: 4,
              }}
              numberOfLines={1}
            >
              {booking.title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8E8E8E',
                marginTop: 2,
              }}
            >
              with {booking.host}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4,
                gap: 4,
              }}
            >
              <Calendar size={11} color="#8E8E8E" />
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8E8E8E',
                }}
              >
                {booking.date}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    ))}
  </View>
);

// ── Tab Content: Saved ───────────────────────────────
const SavedTab: React.FC = () => (
  <View style={{ paddingHorizontal: 16, gap: 12 }}>
    {MOCK_SAVED.map((item) => (
      <Card key={item.id} elevated padding={0}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: item.imageUri }}
            style={{
              width: 90,
              height: 90,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
            }}
            contentFit="cover"
          />
          <View style={{ flex: 1, padding: 12, justifyContent: 'center' }}>
            <Badge label={item.category} variant="outline" size="sm" />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#262626',
                marginTop: 4,
              }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-Bold',
                color: '#262626',
                marginTop: 4,
              }}
            >
              ${item.price}{' '}
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8E8E8E',
                }}
              >
                / person
              </Text>
            </Text>
          </View>
          <View style={{ padding: 12, justifyContent: 'center' }}>
            <Bookmark size={18} color="#C4993C" fill="#C4993C" />
          </View>
        </View>
      </Card>
    ))}
  </View>
);

// ── Tab Content: Posts ────────────────────────────────
const PostsTab: React.FC = () => (
  <View
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      gap: 2,
    }}
  >
    {MOCK_POSTS.map((post) => (
      <Pressable
        key={post.id}
        style={{
          width: '32.6%',
          aspectRatio: 1,
        }}
      >
        <Image
          source={{ uri: post.imageUri }}
          style={{ width: '100%', height: '100%', borderRadius: 4 }}
          contentFit="cover"
        />
      </Pressable>
    ))}
  </View>
);

// ── Tab Bar ──────────────────────────────────────────
const TABS: { key: ProfileTab; label: string }[] = [
  { key: 'bookings', label: 'Bookings' },
  { key: 'saved', label: 'Saved' },
  { key: 'posts', label: 'Posts' },
];

// ── Screen ───────────────────────────────────────────
const MyProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('bookings');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Row */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 16,
            paddingTop: 8,
          }}
        >
          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={20} color="#262626" />
          </Pressable>
        </View>

        {/* Avatar + Name */}
        <View style={{ alignItems: 'center', paddingTop: 8 }}>
          <Avatar
            uri={MOCK_USER.avatar}
            size={80}
            name={MOCK_USER.name}
          />
          <Text
            style={{
              fontSize: 22,
              fontFamily: 'SourceSerif4-Bold',
              color: '#262626',
              marginTop: 12,
            }}
          >
            {MOCK_USER.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'SourceSerif4-Regular',
              color: '#3C3C3C',
              fontStyle: 'italic',
              marginTop: 4,
              textAlign: 'center',
              paddingHorizontal: 40,
            }}
          >
            {MOCK_USER.bio}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 6,
              gap: 4,
            }}
          >
            <MapPin size={12} color="#8E8E8E" />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8E8E8E',
              }}
            >
              {MOCK_USER.city}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            gap: 32,
          }}
        >
          {[
            { value: MOCK_USER.stats.experiences, label: 'Experiences' },
            { value: MOCK_USER.stats.following, label: 'Following' },
            { value: MOCK_USER.stats.followers, label: 'Followers' },
          ].map((stat) => (
            <View key={stat.label} style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'SourceSerif4-Bold',
                  color: '#262626',
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8E8E8E',
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Edit Profile Button */}
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 16,
          }}
        >
          <Button variant="outline" fullWidth>
            Edit Profile
          </Button>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#FAFAFA',
          }}
        >
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
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

        {/* Tab Content */}
        <View style={{ paddingTop: 16, paddingBottom: 40 }}>
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'saved' && <SavedTab />}
          {activeTab === 'posts' && <PostsTab />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
