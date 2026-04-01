import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Filter,
  Users,
  MapPin,
  Globe,
  Calendar,
  MessageCircle,
  Sparkles,
  X,
} from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Pill from '../../components/ui/Pill';
import Card from '../../components/ui/Card';

// ── Types ────────────────────────────────────────────
interface Traveler {
  id: string;
  name: string;
  avatar: string | null;
  homeCity: string;
  travelDates: string;
  interests: string[];
  languages: string[];
  travelStyle: string;
  bio: string;
  matchScore: number;
}

// ── Mock Data ────────────────────────────────────────
const MOCK_TRAVELERS: Traveler[] = [
  {
    id: 't1',
    name: 'Aisha Chen',
    avatar: 'https://i.pravatar.cc/150?img=32',
    homeCity: 'Singapore',
    travelDates: 'Apr 10 - Apr 20',
    interests: ['Ceramics', 'Photography', 'Street Food'],
    languages: ['English', 'Mandarin'],
    travelStyle: 'Cultural Explorer',
    bio: 'Photographer chasing light and stories across Central Asia.',
    matchScore: 92,
  },
  {
    id: 't2',
    name: 'Marco Rossi',
    avatar: 'https://i.pravatar.cc/150?img=15',
    homeCity: 'Milan, Italy',
    travelDates: 'Apr 8 - Apr 18',
    interests: ['Architecture', 'History', 'Cuisine'],
    languages: ['English', 'Italian', 'French'],
    travelStyle: 'Slow Traveler',
    bio: 'Architect by day, Silk Road enthusiast always. On a 3-month journey east.',
    matchScore: 85,
  },
  {
    id: 't3',
    name: 'Yuki Tanaka',
    avatar: 'https://i.pravatar.cc/150?img=9',
    homeCity: 'Tokyo, Japan',
    travelDates: 'Apr 12 - Apr 25',
    interests: ['Textiles', 'Music', 'Markets'],
    languages: ['English', 'Japanese'],
    travelStyle: 'Adventure Seeker',
    bio: 'Textile designer exploring traditional weaving techniques around the world.',
    matchScore: 78,
  },
  {
    id: 't4',
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?img=44',
    homeCity: 'London, UK',
    travelDates: 'Apr 14 - Apr 22',
    interests: ['Dance', 'Cuisine', 'Language'],
    languages: ['English', 'Spanish'],
    travelStyle: 'Cultural Explorer',
    bio: 'Travel writer for Wanderlust Magazine. Looking for authentic local experiences.',
    matchScore: 74,
  },
  {
    id: 't5',
    name: 'Olumide Adeyemi',
    avatar: 'https://i.pravatar.cc/150?img=56',
    homeCity: 'Lagos, Nigeria',
    travelDates: 'Apr 11 - Apr 19',
    interests: ['Music', 'Crafts', 'Spirituality'],
    languages: ['English', 'Yoruba'],
    travelStyle: 'Social Butterfly',
    bio: 'Musician and cultural bridge-builder. Always looking for jam sessions.',
    matchScore: 70,
  },
  {
    id: 't6',
    name: 'Lena Muller',
    avatar: 'https://i.pravatar.cc/150?img=23',
    homeCity: 'Berlin, Germany',
    travelDates: 'Apr 9 - Apr 16',
    interests: ['Photography', 'Nature', 'Adventure'],
    languages: ['English', 'German', 'Russian'],
    travelStyle: 'Adventure Seeker',
    bio: 'Documenting disappearing crafts and traditions across the Silk Road.',
    matchScore: 68,
  },
];

const OVERLAP_COUNT = MOCK_TRAVELERS.length;

// ── Filter Options ───────────────────────────────────
const INTEREST_OPTIONS = [
  'Ceramics', 'Photography', 'Cuisine', 'Architecture', 'Music',
  'History', 'Textiles', 'Markets', 'Nature', 'Dance',
];
const LANGUAGE_OPTIONS = ['English', 'Russian', 'Uzbek', 'French', 'Spanish', 'Mandarin'];
const STYLE_OPTIONS = ['Cultural Explorer', 'Adventure Seeker', 'Slow Traveler', 'Social Butterfly'];

// ── Traveler Card ────────────────────────────────────
const TravelerCard: React.FC<{ traveler: Traveler }> = ({ traveler }) => (
  <Card
    elevated
    style={{ marginHorizontal: 16, marginBottom: 12 }}
    padding={16}
  >
    <View style={{ flexDirection: 'row' }}>
      <Avatar
        uri={traveler.avatar}
        size={48}
        name={traveler.name}
      />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#1A1A1A',
            }}
          >
            {traveler.name}
          </Text>
          <Badge
            label={`${traveler.matchScore}% match`}
            variant="gold"
            size="sm"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 2,
            gap: 4,
          }}
        >
          <MapPin size={12} color="#8A8A8A" />
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'SourceSerif4-Regular',
              color: '#8A8A8A',
            }}
          >
            {traveler.homeCity}
          </Text>
        </View>
      </View>
    </View>

    {/* Bio */}
    <Text
      style={{
        fontSize: 13,
        fontFamily: 'SourceSerif4-Regular',
        color: '#4A4A4A',
        marginTop: 10,
        lineHeight: 18,
      }}
      numberOfLines={2}
    >
      {traveler.bio}
    </Text>

    {/* Travel Dates & Style */}
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Calendar size={12} color="#C4993C" />
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'SourceSerif4-Regular',
            color: '#4A4A4A',
          }}
        >
          {traveler.travelDates}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Globe size={12} color="#C4993C" />
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'SourceSerif4-Regular',
            color: '#4A4A4A',
          }}
        >
          {traveler.languages.join(', ')}
        </Text>
      </View>
    </View>

    {/* Interests */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 6, marginTop: 10 }}
    >
      {traveler.interests.map((interest) => (
        <Badge key={interest} label={interest} variant="outline" size="sm" />
      ))}
      <Badge label={traveler.travelStyle} variant="gold" size="sm" />
    </ScrollView>

    {/* Action */}
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingVertical: 10,
        backgroundColor: '#FAF8F4',
        borderRadius: 10,
        gap: 6,
      }}
    >
      <MessageCircle size={16} color="#C4993C" />
      <Text
        style={{
          fontSize: 13,
          fontFamily: 'SourceSerif4-SemiBold',
          color: '#C4993C',
        }}
      >
        Send Message
      </Text>
    </Pressable>
  </Card>
);

// ── Screen ───────────────────────────────────────────
const TravelerBoardScreen: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const toggleArrayItem = useCallback(
    (arr: string[], item: string): string[] =>
      arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
    [],
  );

  const renderTraveler = useCallback(
    ({ item }: { item: Traveler }) => <TravelerCard traveler={item} />,
    [],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF8F4' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F2EDE4',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'SourceSerif4-Bold',
              color: '#1A1A1A',
            }}
          >
            Travel Buddies in Tashkent
          </Text>
        </View>
        <Pressable
          onPress={() => setShowFilter(true)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#FAF8F4',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Filter size={18} color="#1A1A1A" />
        </Pressable>
      </View>

      {/* Smart Match Banner */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 16,
          marginTop: 12,
          marginBottom: 4,
          padding: 14,
          backgroundColor: '#E8D5A8',
          borderRadius: 12,
          gap: 10,
        }}
      >
        <Sparkles size={20} color="#8B6914" />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#8B6914',
            }}
          >
            Your trip overlaps with {OVERLAP_COUNT} travelers!
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'SourceSerif4-Regular',
              color: '#8B6914',
              marginTop: 2,
            }}
          >
            Based on your dates and interests
          </Text>
        </View>
      </View>

      {/* Traveler List */}
      <FlatList
        data={MOCK_TRAVELERS}
        keyExtractor={(item) => item.id}
        renderItem={renderTraveler}
        contentContainerStyle={{ paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Bottom Sheet */}
      <Modal
        visible={showFilter}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          {/* Handle */}
          <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 4 }}>
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#F2EDE4',
              }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#F2EDE4',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
              }}
            >
              Filter Travelers
            </Text>
            <Pressable onPress={() => setShowFilter(false)} hitSlop={8}>
              <X size={22} color="#1A1A1A" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            {/* Date Range */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
                marginBottom: 10,
              }}
            >
              Date Range
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 20,
              }}
            >
              <Pill label="This week" />
              <Pill label="Next week" />
              <Pill label="This month" />
            </View>

            {/* Interests */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
                marginBottom: 10,
              }}
            >
              Interests
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 20,
              }}
            >
              {INTEREST_OPTIONS.map((interest) => (
                <Pill
                  key={interest}
                  label={interest}
                  selected={selectedInterests.includes(interest)}
                  onPress={() =>
                    setSelectedInterests((prev) =>
                      toggleArrayItem(prev, interest),
                    )
                  }
                />
              ))}
            </View>

            {/* Languages */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
                marginBottom: 10,
              }}
            >
              Language
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 20,
              }}
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <Pill
                  key={lang}
                  label={lang}
                  selected={selectedLanguages.includes(lang)}
                  onPress={() =>
                    setSelectedLanguages((prev) =>
                      toggleArrayItem(prev, lang),
                    )
                  }
                />
              ))}
            </View>

            {/* Travel Style */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
                marginBottom: 10,
              }}
            >
              Travel Style
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 24,
              }}
            >
              {STYLE_OPTIONS.map((style) => (
                <Pill
                  key={style}
                  label={style}
                  selected={selectedStyles.includes(style)}
                  onPress={() =>
                    setSelectedStyles((prev) =>
                      toggleArrayItem(prev, style),
                    )
                  }
                />
              ))}
            </View>

            {/* Apply */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => setShowFilter(false)}
            >
              Apply Filters
            </Button>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TravelerBoardScreen;
