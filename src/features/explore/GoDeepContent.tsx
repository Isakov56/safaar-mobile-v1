import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import {
  Palette,
  Scissors,
  UtensilsCrossed,
  Music,
  Camera,
  Landmark,
  Hammer,
  Disc3,
  Star,
  ChevronRight,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import Button from '../../components/ui/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH * 0.85;

// ── Category Colors ────────────────────────────────────
const CATEGORY_BG: Record<string, string> = {
  CERAMICS: '#FFF3E0',
  TEXTILES: '#F3E5F5',
  CUISINE: '#E8F5E9',
  MUSIC: '#E3F2FD',
  PHOTOGRAPHY: '#ECEFF1',
  HISTORY: '#FBE9E7',
  CRAFTS: '#FFF8E1',
  DANCE: '#FCE4EC',
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  CERAMICS: Palette,
  TEXTILES: Scissors,
  CUISINE: UtensilsCrossed,
  MUSIC: Music,
  PHOTOGRAPHY: Camera,
  HISTORY: Landmark,
  CRAFTS: Hammer,
  DANCE: Disc3,
};

// ── Mock Data ──────────────────────────────────────────
const MOCK_DATA = {
  categories: [
    { id: 'ceramics', key: 'CERAMICS', label: 'Ceramics' },
    { id: 'textiles', key: 'TEXTILES', label: 'Textiles' },
    { id: 'cuisine', key: 'CUISINE', label: 'Cuisine' },
    { id: 'music', key: 'MUSIC', label: 'Music' },
    { id: 'photography', key: 'PHOTOGRAPHY', label: 'Photography' },
    { id: 'history', key: 'HISTORY', label: 'History' },
    { id: 'crafts', key: 'CRAFTS', label: 'Crafts' },
    { id: 'dance', key: 'DANCE', label: 'Dance' },
  ],

  signatureExperiences: [
    {
      id: 'exp-1',
      title: 'Master the Art of Rishton Ceramics',
      host: 'Rustam Usmanov',
      hostAvatar: 'https://i.pravatar.cc/80?u=rustam',
      rating: 4.9,
      reviewCount: 127,
      price: 35,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
      category: 'CERAMICS',
    },
    {
      id: 'exp-2',
      title: 'Silk Road Plov Masterclass with a Mahalla Family',
      host: 'Nilufar Karimova',
      hostAvatar: 'https://i.pravatar.cc/80?u=nilufar',
      rating: 4.8,
      reviewCount: 89,
      price: 28,
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600',
      category: 'CUISINE',
    },
    {
      id: 'exp-3',
      title: 'Suzani Embroidery: Stitch the Silk Road Story',
      host: 'Malika Azimova',
      hostAvatar: 'https://i.pravatar.cc/80?u=malika',
      rating: 4.7,
      reviewCount: 63,
      price: 42,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
      category: 'TEXTILES',
    },
    {
      id: 'exp-4',
      title: 'Dutar & Doira: Traditional Uzbek Music Session',
      host: 'Alisher Navoiy',
      hostAvatar: 'https://i.pravatar.cc/80?u=alisher',
      rating: 5.0,
      reviewCount: 41,
      price: 20,
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600',
      category: 'MUSIC',
    },
  ],

  freeMoments: [
    {
      id: 'free-1',
      title: 'Sunset at Chorsu Bazaar Rooftop',
      description: 'Watch the sun set over the ancient market domes with a local storyteller.',
      time: 'Today, 6:30 PM',
      host: 'Bahrom T.',
      hostAvatar: 'https://i.pravatar.cc/80?u=bahrom',
    },
    {
      id: 'free-2',
      title: 'Morning Tai Chi in Amir Timur Square',
      description: 'Join a peaceful morning session surrounded by historic architecture.',
      time: 'Tomorrow, 7:00 AM',
      host: 'Yelena K.',
      hostAvatar: 'https://i.pravatar.cc/80?u=yelena',
    },
    {
      id: 'free-3',
      title: 'Walking Tour of Old Town Mahallas',
      description: 'Discover hidden courtyards and hear stories of multigenerational families.',
      time: 'Tomorrow, 10:00 AM',
      host: 'Sanjar M.',
      hostAvatar: 'https://i.pravatar.cc/80?u=sanjar',
    },
  ],

  workshops: [
    {
      id: 'ws-1',
      title: 'Miniature Painting Workshop',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
      price: 30,
      duration: '3 hrs',
      rating: 4.6,
    },
    {
      id: 'ws-2',
      title: 'Bread Baking in a Tandoor',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      price: 18,
      duration: '2 hrs',
      rating: 4.9,
    },
    {
      id: 'ws-3',
      title: 'Calligraphy & Tea Ceremony',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
      price: 25,
      duration: '2.5 hrs',
      rating: 4.7,
    },
    {
      id: 'ws-4',
      title: 'Traditional Knife Making',
      image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400',
      price: 50,
      duration: '4 hrs',
      rating: 4.8,
    },
  ],

  travelerStories: [
    {
      id: 'story-1',
      quote: '"The ceramics workshop changed how I see artisan culture. Rustam is a true master."',
      author: 'Sarah L.',
      avatar: 'https://i.pravatar.cc/80?u=sarah',
      from: 'London, UK',
      rating: 5,
      experienceTitle: 'Rishton Ceramics',
    },
    {
      id: 'story-2',
      quote: '"Cooking plov with Nilufar\'s family felt like being adopted for a day. Pure magic."',
      author: 'Marco B.',
      avatar: 'https://i.pravatar.cc/80?u=marco',
      from: 'Rome, Italy',
      rating: 5,
      experienceTitle: 'Plov Masterclass',
    },
    {
      id: 'story-3',
      quote: '"I came for the architecture, but the music session gave me goosebumps. A highlight of my trip."',
      author: 'Yuki T.',
      avatar: 'https://i.pravatar.cc/80?u=yuki',
      from: 'Tokyo, Japan',
      rating: 5,
      experienceTitle: 'Uzbek Music Session',
    },
  ],
};

// ── Section Header ─────────────────────────────────────
const SectionHeader: React.FC<{ title: string; onSeeAll?: () => void }> = ({
  title,
  onSeeAll,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginBottom: 12,
      marginTop: 24,
    }}
  >
    <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 20, color: '#1A1A1A' }}>
      {title}
    </Text>
    {onSeeAll && (
      <Pressable onPress={onSeeAll} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 13, color: '#C4993C' }}>
          See all
        </Text>
        <ChevronRight size={14} color="#C4993C" />
      </Pressable>
    )}
  </View>
);

// ── Section A: Culture Paths ───────────────────────────
const CulturePaths: React.FC = () => (
  <View>
    <SectionHeader title="Culture Paths" onSeeAll={() => {}} />
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={MOCK_DATA.categories}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      renderItem={({ item }) => {
        const Icon = CATEGORY_ICONS[item.key] ?? Palette;
        return (
          <Pressable
            style={{
              width: 72,
              height: 80,
              backgroundColor: CATEGORY_BG[item.key],
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={24} color="#1A1A1A" />
            <Text
              style={{
                fontFamily: 'SourceSerif4-SemiBold',
                fontSize: 11,
                color: '#1A1A1A',
                marginTop: 6,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      }}
    />
  </View>
);

// ── Section B: Signature Experiences ───────────────────
const SignatureExperiences: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View>
      <SectionHeader title="Signature Experiences" onSeeAll={() => {}} />
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CAROUSEL_WIDTH + 12}
        decelerationRate="fast"
        data={MOCK_DATA.signatureExperiences}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View
            style={{
              width: CAROUSEL_WIDTH,
              height: 200,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
            />
            {/* Dark gradient overlay */}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 140,
                backgroundColor: 'rgba(0,0,0,0.55)',
              }}
            />
            <View style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}>
              <Text
                style={{
                  fontFamily: 'SourceSerif4-Bold',
                  fontSize: 16,
                  color: '#FFFFFF',
                }}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Image
                  source={{ uri: item.hostAvatar }}
                  style={{ width: 20, height: 20, borderRadius: 10, marginRight: 6 }}
                />
                <Text style={{ fontSize: 12, color: '#E8D5A8', fontFamily: 'SourceSerif4-Regular' }}>
                  {item.host}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
                  <Star size={12} color="#C4993C" fill="#C4993C" />
                  <Text style={{ fontSize: 12, color: '#FFFFFF', marginLeft: 3, fontFamily: 'SourceSerif4-SemiBold' }}>
                    {item.rating}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ fontSize: 13, color: '#FFFFFF', fontFamily: 'SourceSerif4-SemiBold' }}>
                  ${item.price}/person
                </Text>
                <Button variant="primary" size="sm" pill onPress={() => {}}>
                  Book
                </Button>
              </View>
            </View>
          </View>
        )}
      />

      {/* Dot Indicators */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 6 }}>
        {MOCK_DATA.signatureExperiences.map((_, idx) => (
          <View
            key={idx}
            style={{
              width: idx === activeIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: idx === activeIndex ? '#C4993C' : '#E8D5A8',
            }}
          />
        ))}
      </View>
    </View>
  );
};

// ── Section C: Free Cultural Moments ───────────────────
const FreeCulturalMoments: React.FC = () => (
  <View>
    <SectionHeader title="Free Cultural Moments" onSeeAll={() => {}} />
    <View style={{ paddingHorizontal: 16, gap: 10 }}>
      {MOCK_DATA.freeMoments.map((item) => (
        <Pressable
          key={item.id}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            borderLeftWidth: 3,
            borderLeftColor: '#2E7D32',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View
              style={{
                backgroundColor: '#E8F5E9',
                borderRadius: 999,
                paddingHorizontal: 8,
                paddingVertical: 4,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 11, fontFamily: 'SourceSerif4-Bold', color: '#2E7D32' }}>
                FREE
              </Text>
            </View>
            <Text style={{ fontSize: 11, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
              {item.time}
            </Text>
          </View>
          <Text
            style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 15, color: '#1A1A1A' }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text
            style={{ fontSize: 13, color: '#4A4A4A', fontFamily: 'SourceSerif4-Regular', marginTop: 4 }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Image
              source={{ uri: item.hostAvatar }}
              style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
            />
            <Text style={{ fontSize: 12, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
              Hosted by {item.host}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  </View>
);

// ── Section D: Workshops & Experiences ─────────────────
const WorkshopsGrid: React.FC = () => {
  const cardWidth = (SCREEN_WIDTH - 48) / 2;

  return (
    <View>
      <SectionHeader title="Workshops & Experiences" onSeeAll={() => {}} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 }}>
        {MOCK_DATA.workshops.map((item) => (
          <Pressable
            key={item.id}
            style={{
              width: cardWidth,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: '100%', height: 100 }}
            />
            <View style={{ padding: 12 }}>
              <Text
                style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 13, color: '#1A1A1A' }}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <Star size={12} color="#C4993C" fill="#C4993C" />
                <Text style={{ fontSize: 11, color: '#4A4A4A', marginLeft: 3, fontFamily: 'SourceSerif4-Regular' }}>
                  {item.rating}
                </Text>
                <Text style={{ fontSize: 11, color: '#8A8A8A', marginLeft: 8, fontFamily: 'SourceSerif4-Regular' }}>
                  {item.duration}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'SourceSerif4-Bold',
                  fontSize: 14,
                  color: '#1A1A1A',
                  marginTop: 4,
                }}
              >
                ${item.price}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

// ── Section E: Traveler Stories ─────────────────────────
const TravelerStories: React.FC = () => (
  <View>
    <SectionHeader title="Traveler Stories" onSeeAll={() => {}} />
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={MOCK_DATA.travelerStories}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            width: 250,
          }}
        >
          {/* Stars */}
          <View style={{ flexDirection: 'row', marginBottom: 8, gap: 2 }}>
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star key={i} size={14} color="#C4993C" fill="#C4993C" />
            ))}
          </View>

          {/* Quote */}
          <Text
            style={{
              fontFamily: 'SourceSerif4-Regular',
              fontSize: 14,
              color: '#1A1A1A',
              fontStyle: 'italic',
              lineHeight: 20,
            }}
            numberOfLines={4}
          >
            {item.quote}
          </Text>

          {/* Author */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Image
              source={{ uri: item.avatar }}
              style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
            />
            <View>
              <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 13, color: '#1A1A1A' }}>
                {item.author}
              </Text>
              <Text style={{ fontSize: 11, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
                {item.from}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 8,
              backgroundColor: '#F2EDE4',
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ fontSize: 10, color: '#8A8A8A', fontFamily: 'SourceSerif4-SemiBold' }}>
              {item.experienceTitle}
            </Text>
          </View>
        </View>
      )}
    />
  </View>
);

// ── Main Component ─────────────────────────────────────
const GoDeepContent: React.FC = () => (
  <View style={{ paddingBottom: 32 }}>
    <CulturePaths />
    <SignatureExperiences />
    <FreeCulturalMoments />
    <WorkshopsGrid />
    <TravelerStories />
  </View>
);

export default GoDeepContent;
