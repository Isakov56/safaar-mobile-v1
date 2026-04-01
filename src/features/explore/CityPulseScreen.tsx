import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Users,
  CalendarDays,
  Gift,
  TrendingUp,
  Star,
  Clock,
  ChevronRight,
} from 'lucide-react-native';

// ── Mock Data ──────────────────────────────────────────
const MOCK_DATA = {
  city: {
    name: 'Tashkent',
    country: 'Uzbekistan',
    weather: '22\u00B0C, Sunny',
    date: 'Saturday, March 29',
  },

  stats: [
    { label: 'Travelers', value: '38', icon: Users },
    { label: 'Events', value: '12', icon: CalendarDays },
    { label: 'Free Hangouts', value: '5', icon: Gift },
  ],

  trending: [
    {
      id: 't-1',
      title: 'Chorsu Bazaar Food Tour',
      category: 'Cuisine',
      heat: 'Hot',
      attendees: 18,
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    },
    {
      id: 't-2',
      title: 'Sunset at Amir Timur Square',
      category: 'Photography',
      heat: 'Trending',
      attendees: 24,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    },
    {
      id: 't-3',
      title: 'Rishton Ceramics Workshop',
      category: 'Ceramics',
      heat: 'Popular',
      attendees: 12,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
    },
  ],

  freshStories: [
    {
      id: 's-1',
      author: 'Sarah L.',
      avatar: 'https://i.pravatar.cc/80?u=sarah',
      preview: 'The ceramics workshop changed my perspective on...',
      time: '2h ago',
      likes: 14,
    },
    {
      id: 's-2',
      author: 'Marco B.',
      avatar: 'https://i.pravatar.cc/80?u=marco',
      preview: 'Cooking plov with a local family in Tashkent was...',
      time: '5h ago',
      likes: 23,
    },
  ],

  tonightsPicks: [
    {
      id: 'tp-1',
      title: 'Live Jazz at Sato Lounge',
      time: '8:00 PM',
      price: 'Free',
    },
    {
      id: 'tp-2',
      title: 'Rooftop Social Mixer',
      time: '9:00 PM',
      price: '$10',
    },
    {
      id: 'tp-3',
      title: 'Night Bazaar Walking Tour',
      time: '8:30 PM',
      price: '$15',
    },
  ],

  newArrivals: [
    { id: 'a-1', avatar: 'https://i.pravatar.cc/80?u=newuser1' },
    { id: 'a-2', avatar: 'https://i.pravatar.cc/80?u=newuser2' },
    { id: 'a-3', avatar: 'https://i.pravatar.cc/80?u=newuser3' },
    { id: 'a-4', avatar: 'https://i.pravatar.cc/80?u=newuser4' },
    { id: 'a-5', avatar: 'https://i.pravatar.cc/80?u=newuser5' },
  ],
};

// ── Section Header ─────────────────────────────────────
const SectionHeader: React.FC<{ title: string; onSeeAll?: () => void }> = ({
  title,
  onSeeAll,
}) => (
  <View className="flex-row items-center justify-between px-4 mb-3 mt-6">
    <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 20, color: '#1A1A1A' }}>
      {title}
    </Text>
    {onSeeAll && (
      <Pressable onPress={onSeeAll} className="flex-row items-center">
        <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 13, color: '#C4993C' }}>
          See all
        </Text>
        <ChevronRight size={14} color="#C4993C" />
      </Pressable>
    )}
  </View>
);

// ── Component ──────────────────────────────────────────
const CityPulseScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* ── Hero Header ── */}
        <View style={{ height: 180 + insets.top }}>
          {/* Dark gradient bg */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#1A1A1A',
            }}
          />

          {/* Back button */}
          <Pressable
            style={{ position: 'absolute', top: insets.top + 8, left: 16, zIndex: 10 }}
            hitSlop={12}
            onPress={() => {}}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </Pressable>

          {/* City info */}
          <View
            style={{
              paddingTop: insets.top + 48,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                fontFamily: 'SourceSerif4-Bold',
                fontSize: 28,
                color: '#FFFFFF',
              }}
            >
              {MOCK_DATA.city.name}
            </Text>
            <Text
              style={{
                fontFamily: 'SourceSerif4-Regular',
                fontSize: 13,
                color: '#E8D5A8',
                marginTop: 2,
              }}
            >
              {MOCK_DATA.city.date} · {MOCK_DATA.city.weather}
            </Text>
          </View>

          {/* Stat Cards */}
          <View
            className="flex-row px-4"
            style={{ gap: 10, position: 'absolute', bottom: -28, left: 0, right: 0 }}
          >
            {MOCK_DATA.stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <View
                  key={stat.label}
                  className="flex-1 bg-white rounded-2xl p-3 items-center"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  <Icon size={16} color="#C4993C" />
                  <Text
                    style={{
                      fontFamily: 'SourceSerif4-Bold',
                      fontSize: 22,
                      color: '#C4993C',
                      marginTop: 2,
                    }}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SourceSerif4-Regular',
                      fontSize: 11,
                      color: '#8A8A8A',
                    }}
                  >
                    {stat.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Spacer for stat cards overflow */}
        <View style={{ height: 40 }} />

        {/* ── Trending Now ── */}
        <SectionHeader title="Trending Now" onSeeAll={() => {}} />
        <View className="px-4" style={{ gap: 12 }}>
          {MOCK_DATA.trending.map((item) => (
            <Pressable
              key={item.id}
              className="bg-white rounded-2xl flex-row overflow-hidden"
              style={{ height: 100 }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: 100, height: '100%' }}
              />
              <View className="flex-1 p-3 justify-between">
                <View>
                  <View className="flex-row items-center mb-1">
                    <TrendingUp size={12} color="#E53935" />
                    <Text
                      style={{
                        fontSize: 11,
                        color: '#E53935',
                        fontFamily: 'SourceSerif4-Bold',
                        marginLeft: 4,
                      }}
                    >
                      {item.heat}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: 'SourceSerif4-SemiBold',
                      fontSize: 14,
                      color: '#1A1A1A',
                    }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Users size={12} color="#8A8A8A" />
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#8A8A8A',
                      marginLeft: 4,
                      fontFamily: 'SourceSerif4-Regular',
                    }}
                  >
                    {item.attendees} interested
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* ── Fresh Stories ── */}
        <SectionHeader title="Fresh Stories" onSeeAll={() => {}} />
        <View className="px-4" style={{ gap: 10 }}>
          {MOCK_DATA.freshStories.map((story) => (
            <Pressable key={story.id} className="bg-white rounded-2xl p-4 flex-row items-center">
              <Image
                source={{ uri: story.avatar }}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
              />
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 14, color: '#1A1A1A' }}>
                    {story.author}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
                    {story.time}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#4A4A4A',
                    fontFamily: 'SourceSerif4-Regular',
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {story.preview}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Star size={12} color="#C4993C" fill="#C4993C" />
                  <Text style={{ fontSize: 11, color: '#8A8A8A', marginLeft: 4, fontFamily: 'SourceSerif4-Regular' }}>
                    {story.likes} likes
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* ── Tonight's Picks ── */}
        <SectionHeader title="Tonight's Picks" onSeeAll={() => {}} />
        <View className="px-4" style={{ gap: 8 }}>
          {MOCK_DATA.tonightsPicks.map((pick) => (
            <Pressable
              key={pick.id}
              className="bg-white rounded-2xl flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center">
                <Clock size={16} color="#C4993C" />
                <View className="ml-3">
                  <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 14, color: '#1A1A1A' }}>
                    {pick.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
                    {pick.time}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontFamily: 'SourceSerif4-Bold',
                  fontSize: 14,
                  color: pick.price === 'Free' ? '#2E7D32' : '#1A1A1A',
                }}
              >
                {pick.price}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── New Arrivals ── */}
        <SectionHeader title="New Arrivals" />
        <Pressable className="mx-4 bg-white rounded-2xl p-4 flex-row items-center justify-between mb-8">
          {/* Avatar Stack */}
          <View className="flex-row items-center">
            <View className="flex-row" style={{ marginRight: 12 }}>
              {MOCK_DATA.newArrivals.slice(0, 4).map((arrival, index) => (
                <Image
                  key={arrival.id}
                  source={{ uri: arrival.avatar }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    marginLeft: index === 0 ? 0 : -10,
                    zIndex: 4 - index,
                  }}
                />
              ))}
              {MOCK_DATA.newArrivals.length > 4 && (
                <View
                  className="bg-canvas-deep items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    marginLeft: -10,
                  }}
                >
                  <Text style={{ fontSize: 11, fontFamily: 'SourceSerif4-Bold', color: '#8A8A8A' }}>
                    +{MOCK_DATA.newArrivals.length - 4}
                  </Text>
                </View>
              )}
            </View>
            <View>
              <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 14, color: '#1A1A1A' }}>
                {MOCK_DATA.newArrivals.length} travelers arrived
              </Text>
              <Text style={{ fontSize: 12, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
                in Tashkent today
              </Text>
            </View>
          </View>

          {/* CTA */}
          <View className="bg-gold rounded-pill px-4 py-2">
            <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 12, color: '#FFFFFF' }}>
              Say hi
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default CityPulseScreen;
