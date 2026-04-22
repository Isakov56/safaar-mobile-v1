import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  ChevronLeft,
  MapPin,
  Star,
  MessageCircle,
  UserPlus,
  UserCheck,
} from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

// ── Types ────────────────────────────────────────────
type HostTab = 'experiences' | 'posts' | 'reviews';

interface Experience {
  id: string;
  title: string;
  imageUri: string;
  rating: number;
  reviewCount: number;
  price: number;
  duration: string;
  category: string;
}

interface HostPost {
  id: string;
  imageUri: string;
  caption: string;
  likes: number;
}

interface Review {
  id: string;
  author: string;
  avatar: string | null;
  rating: number;
  text: string;
  date: string;
}

// ── Mock Data ────────────────────────────────────────
const MOCK_HOST = {
  id: 'host1',
  name: 'Sabina Karimova',
  avatar: 'https://i.pravatar.cc/150?img=47',
  tagline: 'Master ceramicist preserving Rishtan traditions',
  location: 'Tashkent, Uzbekistan',
  isVerified: true,
  stats: {
    experiencesHosted: 156,
    rating: 4.9,
    reviews: 127,
    followers: 1842,
  },
};

const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'exp1',
    title: 'Traditional Ceramics Workshop',
    imageUri: 'https://picsum.photos/seed/ceramics1/400/300',
    rating: 4.9,
    reviewCount: 127,
    price: 45,
    duration: '3 hours',
    category: 'Ceramics',
  },
  {
    id: 'exp2',
    title: 'Rishtan Blue Masterclass',
    imageUri: 'https://picsum.photos/seed/rishtan/400/300',
    rating: 5.0,
    reviewCount: 42,
    price: 75,
    duration: '4 hours',
    category: 'Ceramics',
  },
  {
    id: 'exp3',
    title: 'Kids Pottery Morning',
    imageUri: 'https://picsum.photos/seed/kidspottery/400/300',
    rating: 4.8,
    reviewCount: 31,
    price: 25,
    duration: '2 hours',
    category: 'Ceramics',
  },
];

const MOCK_HOST_POSTS: HostPost[] = [
  {
    id: 'hp1',
    imageUri: 'https://picsum.photos/seed/hostpost1/400/400',
    caption: 'New batch of Rishtan blue pieces coming out of the kiln today.',
    likes: 312,
  },
  {
    id: 'hp2',
    imageUri: 'https://picsum.photos/seed/hostpost2/400/400',
    caption: 'Workshop preparations. Every detail matters.',
    likes: 198,
  },
  {
    id: 'hp3',
    imageUri: 'https://picsum.photos/seed/hostpost3/400/400',
    caption: 'My grandmother taught me this technique when I was seven years old.',
    likes: 456,
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Aisha Chen',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 5,
    text: 'Sabina is an extraordinary teacher. She made the traditional techniques accessible while sharing fascinating stories about the craft. I left with a beautiful bowl and an unforgettable memory.',
    date: 'Mar 2026',
  },
  {
    id: 'r2',
    author: 'Marco Rossi',
    avatar: 'https://i.pravatar.cc/150?img=15',
    rating: 5,
    text: 'One of the best experiences of my entire trip. The attention to detail and the warm hospitality made it truly special. Highly recommend!',
    date: 'Mar 2026',
  },
  {
    id: 'r3',
    author: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?img=44',
    rating: 5,
    text: 'As a travel writer, I have done hundreds of activities worldwide. This ceramics workshop ranks among the very best. Authentic, engaging, and deeply personal.',
    date: 'Feb 2026',
  },
  {
    id: 'r4',
    author: 'Yuki Tanaka',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 4,
    text: 'Loved learning about the Rishtan blue technique. The studio is beautiful and Sabina is incredibly knowledgeable. Only wish it was longer!',
    date: 'Feb 2026',
  },
];

// ── Tab Content: Experiences ─────────────────────────
const ExperiencesTab: React.FC = () => (
  <View style={{ paddingHorizontal: 16, gap: 12 }}>
    {MOCK_EXPERIENCES.map((exp) => (
      <Card key={exp.id} elevated padding={0}>
        <Image
          source={{ uri: exp.imageUri }}
          style={{
            width: '100%',
            height: 160,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
          contentFit="cover"
        />
        <View style={{ padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Badge label={exp.category} variant="outline" size="sm" />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8E8E8E',
              }}
            >
              {exp.duration}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#262626',
              marginTop: 6,
            }}
          >
            {exp.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Star size={14} color="#C4993C" fill="#C4993C" />
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: '#262626',
                }}
              >
                {exp.rating}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8E8E8E',
                }}
              >
                ({exp.reviewCount})
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'SourceSerif4-Bold',
                color: '#262626',
              }}
            >
              ${exp.price}{' '}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8E8E8E',
                }}
              >
                / person
              </Text>
            </Text>
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
    {MOCK_HOST_POSTS.map((post) => (
      <Pressable
        key={post.id}
        style={{ width: '32.6%', aspectRatio: 1 }}
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

// ── Tab Content: Reviews ─────────────────────────────
const ReviewsTab: React.FC = () => (
  <View style={{ paddingHorizontal: 16, gap: 12 }}>
    {MOCK_REVIEWS.map((review) => (
      <Card key={review.id} padding={14}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar
            uri={review.avatar}
            size={32}
            name={review.author}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#262626',
              }}
            >
              {review.author}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8E8E8E',
              }}
            >
              {review.date}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 2 }}>
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} size={12} color="#C4993C" fill="#C4993C" />
            ))}
          </View>
        </View>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'SourceSerif4-Regular',
            color: '#3C3C3C',
            lineHeight: 19,
            marginTop: 10,
          }}
        >
          {review.text}
        </Text>
      </Card>
    ))}
  </View>
);

// ── Tab Bar ──────────────────────────────────────────
const TABS: { key: HostTab; label: string }[] = [
  { key: 'experiences', label: 'Experiences' },
  { key: 'posts', label: 'Posts' },
  { key: 'reviews', label: 'Reviews' },
];

// ── Screen ───────────────────────────────────────────
const HostProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HostTab>('experiences');
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
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
            <ChevronLeft size={22} color="#262626" />
          </Pressable>
        </View>

        {/* Hero */}
        <View style={{ alignItems: 'center', paddingTop: 12 }}>
          <Avatar
            uri={MOCK_HOST.avatar}
            size={80}
            name={MOCK_HOST.name}
            verified={MOCK_HOST.isVerified}
          />
          <Text
            style={{
              fontSize: 22,
              fontFamily: 'SourceSerif4-Bold',
              color: '#262626',
              marginTop: 12,
            }}
          >
            {MOCK_HOST.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'SourceSerif4-Regular',
              color: '#3C3C3C',
              marginTop: 4,
              textAlign: 'center',
              paddingHorizontal: 40,
            }}
          >
            {MOCK_HOST.tagline}
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
              {MOCK_HOST.location}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            gap: 20,
          }}
        >
          {[
            { value: MOCK_HOST.stats.experiencesHosted, label: 'Hosted' },
            { value: MOCK_HOST.stats.rating, label: 'Rating' },
            { value: MOCK_HOST.stats.reviews, label: 'Reviews' },
            { value: MOCK_HOST.stats.followers, label: 'Followers' },
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
                  fontSize: 11,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8E8E8E',
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            marginTop: 16,
            gap: 12,
          }}
        >
          <Button
            variant="outline"
            icon={MessageCircle}
            style={{ flex: 1 }}
          >
            Message
          </Button>
          <Button
            variant={isFollowing ? 'secondary' : 'primary'}
            icon={isFollowing ? UserCheck : UserPlus}
            onPress={() => setIsFollowing(!isFollowing)}
            style={{ flex: 1 }}
          >
            {isFollowing ? 'Following' : 'Follow'}
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
          {activeTab === 'experiences' && <ExperiencesTab />}
          {activeTab === 'posts' && <PostsTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HostProfileScreen;
