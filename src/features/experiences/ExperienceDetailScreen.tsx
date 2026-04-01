import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Animated,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Clock,
  Users,
  BadgeCheck,
  MapPin,
  ChevronRight,
  Check,
  Navigation,
} from 'lucide-react-native';
import Button from '../../components/ui/Button';
import AvailabilityCalendar, { generateDateSlots } from './AvailabilityCalendar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 300;

// ── Mock Data ──────────────────────────────────────────
const MOCK_EXPERIENCE = {
  id: 'exp-1',
  title: 'Master the Art of Rishton Ceramics',
  category: 'Ceramics',
  duration: '3 hours',
  groupSize: '2-6 people',
  price: 35,
  rating: 4.9,
  reviewCount: 127,
  description:
    'Discover the centuries-old tradition of Rishton ceramics with master artisan Rustam Usmanov. ' +
    'In this hands-on workshop, you will learn to shape clay on a traditional wheel, paint intricate ' +
    'blue-and-white patterns using natural dyes, and fire your creation in a wood-burning kiln. ' +
    'Take home your own handmade piece as a unique souvenir. The workshop takes place in Rustam\'s ' +
    'family studio, which has been producing ceramics for five generations. Tea and sweets are served ' +
    'throughout the experience.',
  images: [
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
  ],
  host: {
    name: 'Rustam Usmanov',
    avatar: 'https://i.pravatar.cc/120?u=rustam',
    verified: true,
    city: 'Rishton, Uzbekistan',
    rating: 4.9,
    reviewCount: 203,
  },
  included: [
    'All materials and tools',
    'Take home your ceramic piece',
    'Traditional tea and sweets',
    'Photo opportunities',
    'Certificate of completion',
  ],
  meetingPoint: {
    address: '14 Hamza Street, Rishton, Fergana Valley',
    note: 'Look for the blue ceramic doorway. Rustam will meet you outside.',
  },
  reviews: [
    {
      id: 'r-1',
      author: 'Sarah L.',
      avatar: 'https://i.pravatar.cc/80?u=sarah',
      rating: 5,
      text: 'An unforgettable experience! Rustam is incredibly patient and skilled. I now have a beautiful bowl that I treasure.',
      date: 'March 2026',
    },
    {
      id: 'r-2',
      author: 'Yuki T.',
      avatar: 'https://i.pravatar.cc/80?u=yuki',
      rating: 5,
      text: 'This was the highlight of my Uzbekistan trip. The family\'s hospitality was beyond anything I expected.',
      date: 'February 2026',
    },
    {
      id: 'r-3',
      author: 'Marco B.',
      avatar: 'https://i.pravatar.cc/80?u=marco',
      rating: 4,
      text: 'Great workshop, very authentic. The only downside was the 2-hour drive from Tashkent, but absolutely worth it.',
      date: 'January 2026',
    },
  ],
};

const SLOTS = generateDateSlots(14);

// ── Component ──────────────────────────────────────────
const ExperienceDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        setActiveImageIndex(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Parallax
  const imageTranslateY = scrollY.interpolate({
    inputRange: [-HERO_HEIGHT, 0, HERO_HEIGHT],
    outputRange: [-HERO_HEIGHT / 2, 0, HERO_HEIGHT / 3],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar barStyle="light-content" />

      {/* ── Scrollable Content ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {/* ── Hero Image Gallery ── */}
        <View style={{ height: HERO_HEIGHT }}>
          <Animated.View
            style={{
              height: HERO_HEIGHT,
              transform: [{ translateY: imageTranslateY }],
            }}
          >
            <FlatList
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              data={MOCK_EXPERIENCE.images}
              keyExtractor={(_, idx) => `img-${idx}`}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width: SCREEN_WIDTH, height: HERO_HEIGHT }}
                  resizeMode="cover"
                />
              )}
            />
          </Animated.View>

          {/* Overlay Buttons */}
          <View
            className="flex-row items-center justify-between px-4"
            style={{
              position: 'absolute',
              top: insets.top + 8,
              left: 0,
              right: 0,
            }}
          >
            <Pressable
              onPress={() => {}}
              className="bg-black/30 rounded-full items-center justify-center"
              style={{ width: 40, height: 40 }}
            >
              <ArrowLeft size={22} color="#FFFFFF" />
            </Pressable>
            <View className="flex-row" style={{ gap: 10 }}>
              <Pressable
                onPress={() => {}}
                className="bg-black/30 rounded-full items-center justify-center"
                style={{ width: 40, height: 40 }}
              >
                <Share2 size={20} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={() => setLiked((v) => !v)}
                className="bg-black/30 rounded-full items-center justify-center"
                style={{ width: 40, height: 40 }}
              >
                <Heart
                  size={20}
                  color={liked ? '#E53935' : '#FFFFFF'}
                  fill={liked ? '#E53935' : 'transparent'}
                />
              </Pressable>
            </View>
          </View>

          {/* Dot Indicators */}
          <View
            className="flex-row items-center justify-center"
            style={{ position: 'absolute', bottom: 32, left: 0, right: 0, gap: 6 }}
          >
            {MOCK_EXPERIENCE.images.map((_, idx) => (
              <View
                key={idx}
                style={{
                  width: idx === activeImageIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: idx === activeImageIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </View>
        </View>

        {/* ── Content Card overlapping hero ── */}
        <View
          className="bg-canvas rounded-t-3xl"
          style={{ marginTop: -20, paddingBottom: 120 }}
        >
          {/* Host Info */}
          <Pressable className="flex-row items-center p-4 pb-0">
            <Image
              source={{ uri: MOCK_EXPERIENCE.host.avatar }}
              style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
            />
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text
                  style={{
                    fontFamily: 'SourceSerif4-SemiBold',
                    fontSize: 15,
                    color: '#1A1A1A',
                  }}
                >
                  {MOCK_EXPERIENCE.host.name}
                </Text>
                {MOCK_EXPERIENCE.host.verified && (
                  <BadgeCheck size={16} color="#C4993C" style={{ marginLeft: 4 }} />
                )}
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: '#8A8A8A',
                  fontFamily: 'SourceSerif4-Regular',
                }}
              >
                {MOCK_EXPERIENCE.host.city}
              </Text>
              <View className="flex-row items-center mt-1">
                <Star size={12} color="#C4993C" fill="#C4993C" />
                <Text
                  style={{
                    fontSize: 12,
                    color: '#1A1A1A',
                    fontFamily: 'SourceSerif4-SemiBold',
                    marginLeft: 3,
                  }}
                >
                  {MOCK_EXPERIENCE.host.rating}
                </Text>
                <Text style={{ fontSize: 11, color: '#8A8A8A', marginLeft: 4, fontFamily: 'SourceSerif4-Regular' }}>
                  ({MOCK_EXPERIENCE.host.reviewCount} reviews)
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text style={{ fontSize: 13, color: '#C4993C', fontFamily: 'SourceSerif4-SemiBold' }}>
                View profile
              </Text>
              <ChevronRight size={14} color="#C4993C" />
            </View>
          </Pressable>

          {/* Title */}
          <Text
            style={{
              fontFamily: 'SourceSerif4-Bold',
              fontSize: 22,
              color: '#1A1A1A',
              paddingHorizontal: 16,
              marginTop: 16,
              lineHeight: 30,
            }}
          >
            {MOCK_EXPERIENCE.title}
          </Text>

          {/* Pills */}
          <View className="flex-row px-4 mt-3" style={{ gap: 8 }}>
            <View className="flex-row items-center bg-canvas-deep rounded-pill px-3 py-1.5">
              <View
                style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF3E0', marginRight: 6 }}
              />
              <Text style={{ fontSize: 12, fontFamily: 'SourceSerif4-SemiBold', color: '#4A4A4A' }}>
                {MOCK_EXPERIENCE.category}
              </Text>
            </View>
            <View className="flex-row items-center bg-canvas-deep rounded-pill px-3 py-1.5">
              <Clock size={12} color="#8A8A8A" />
              <Text style={{ fontSize: 12, fontFamily: 'SourceSerif4-Regular', color: '#4A4A4A', marginLeft: 4 }}>
                {MOCK_EXPERIENCE.duration}
              </Text>
            </View>
            <View className="flex-row items-center bg-canvas-deep rounded-pill px-3 py-1.5">
              <Users size={12} color="#8A8A8A" />
              <Text style={{ fontSize: 12, fontFamily: 'SourceSerif4-Regular', color: '#4A4A4A', marginLeft: 4 }}>
                {MOCK_EXPERIENCE.groupSize}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="px-4 mt-4">
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: '#4A4A4A',
                fontFamily: 'SourceSerif4-Regular',
              }}
              numberOfLines={descriptionExpanded ? undefined : 4}
            >
              {MOCK_EXPERIENCE.description}
            </Text>
            {!descriptionExpanded && (
              <Pressable onPress={() => setDescriptionExpanded(true)} className="mt-1">
                <Text style={{ fontSize: 13, color: '#C4993C', fontFamily: 'SourceSerif4-SemiBold' }}>
                  Read more
                </Text>
              </Pressable>
            )}
          </View>

          {/* What's Included */}
          <View className="px-4 mt-6">
            <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 18, color: '#1A1A1A', marginBottom: 12 }}>
              What's Included
            </Text>
            {MOCK_EXPERIENCE.included.map((item, idx) => (
              <View key={idx} className="flex-row items-center mb-3">
                <View
                  className="rounded-full items-center justify-center mr-3"
                  style={{ width: 24, height: 24, backgroundColor: '#E8F5E9' }}
                >
                  <Check size={14} color="#2E7D32" />
                </View>
                <Text style={{ fontSize: 14, color: '#4A4A4A', fontFamily: 'SourceSerif4-Regular' }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Meeting Point */}
          <View className="px-4 mt-6">
            <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 18, color: '#1A1A1A', marginBottom: 12 }}>
              Meeting Point
            </Text>
            {/* Map Placeholder */}
            <View
              className="bg-canvas-deep rounded-2xl items-center justify-center"
              style={{ height: 140, marginBottom: 12 }}
            >
              <MapPin size={32} color="#8A8A8A" />
              <Text style={{ fontSize: 13, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular', marginTop: 4 }}>
                Map view
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#1A1A1A', fontFamily: 'SourceSerif4-SemiBold' }}>
              {MOCK_EXPERIENCE.meetingPoint.address}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#8A8A8A',
                fontFamily: 'SourceSerif4-Regular',
                marginTop: 4,
              }}
            >
              {MOCK_EXPERIENCE.meetingPoint.note}
            </Text>
            <Pressable className="flex-row items-center mt-3">
              <Navigation size={14} color="#C4993C" />
              <Text
                style={{ fontSize: 13, color: '#C4993C', fontFamily: 'SourceSerif4-SemiBold', marginLeft: 6 }}
              >
                Get Directions
              </Text>
            </Pressable>
          </View>

          {/* Availability Calendar */}
          <View className="mt-6">
            <Text
              style={{
                fontFamily: 'SourceSerif4-Bold',
                fontSize: 18,
                color: '#1A1A1A',
                paddingHorizontal: 16,
                marginBottom: 12,
              }}
            >
              Availability
            </Text>
            <AvailabilityCalendar
              slots={SLOTS}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectDate={setSelectedDate}
              onSelectTime={setSelectedTime}
            />
          </View>

          {/* Reviews */}
          <View className="px-4 mt-6">
            <View className="flex-row items-center mb-4">
              <Star size={18} color="#C4993C" fill="#C4993C" />
              <Text
                style={{
                  fontFamily: 'SourceSerif4-Bold',
                  fontSize: 18,
                  color: '#1A1A1A',
                  marginLeft: 6,
                }}
              >
                {MOCK_EXPERIENCE.rating}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#8A8A8A',
                  fontFamily: 'SourceSerif4-Regular',
                  marginLeft: 4,
                }}
              >
                ({MOCK_EXPERIENCE.reviewCount} reviews)
              </Text>
            </View>
            {MOCK_EXPERIENCE.reviews.map((review) => (
              <View key={review.id} className="mb-4 pb-4 border-b border-canvas-deep">
                <View className="flex-row items-center mb-2">
                  <Image
                    source={{ uri: review.avatar }}
                    style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }}
                  />
                  <View className="flex-1">
                    <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 14, color: '#1A1A1A' }}>
                      {review.author}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
                      {review.date}
                    </Text>
                  </View>
                  <View className="flex-row" style={{ gap: 2 }}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={12} color="#C4993C" fill="#C4993C" />
                    ))}
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#4A4A4A',
                    lineHeight: 20,
                    fontFamily: 'SourceSerif4-Regular',
                  }}
                >
                  {review.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* ── Floating Bottom Bar ── */}
      <View
        className="bg-white border-t border-canvas-deep flex-row items-center justify-between px-4"
        style={{
          paddingBottom: insets.bottom + 8,
          paddingTop: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View>
          <View className="flex-row items-baseline">
            <Text
              style={{
                fontFamily: 'SourceSerif4-ExtraBold',
                fontSize: 22,
                color: '#1A1A1A',
              }}
            >
              ${MOCK_EXPERIENCE.price}
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
            per person
          </Text>
        </View>
        <Button variant="primary" size="lg" pill onPress={() => {}}>
          Book Now
        </Button>
      </View>
    </View>
  );
};

export default ExperienceDetailScreen;
