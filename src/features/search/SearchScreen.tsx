import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Search,
  MapPin,
  Star,
  Clock,
  List,
  Map,
  SlidersHorizontal,
  X,
  ChevronDown,
} from 'lucide-react-native';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Pill from '../../components/ui/Pill';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

// ── Types ────────────────────────────────────────────
interface SearchResult {
  id: string;
  title: string;
  host: { name: string; avatar: string | null };
  category: string;
  imageUri: string;
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  duration: string;
  location: string;
  isFeatured: boolean;
}

type ViewMode = 'list' | 'map';

// ── Mock Data ────────────────────────────────────────
const MOCK_RESULTS: SearchResult[] = [
  {
    id: 'e1',
    title: 'Traditional Ceramics Workshop',
    host: { name: 'Sabina Karimova', avatar: 'https://i.pravatar.cc/150?img=47' },
    category: 'Ceramics',
    imageUri: 'https://picsum.photos/seed/ceramics1/400/300',
    rating: 4.9,
    reviewCount: 127,
    price: 45,
    currency: 'USD',
    duration: '3 hours',
    location: 'Tashkent',
    isFeatured: true,
  },
  {
    id: 'e2',
    title: 'Silk Road Cooking Class',
    host: { name: 'Aziz Umarov', avatar: 'https://i.pravatar.cc/150?img=60' },
    category: 'Cuisine',
    imageUri: 'https://picsum.photos/seed/cooking1/400/300',
    rating: 4.8,
    reviewCount: 89,
    price: 35,
    currency: 'USD',
    duration: '2.5 hours',
    location: 'Samarkand',
    isFeatured: false,
  },
  {
    id: 'e3',
    title: 'Old City Photography Walk',
    host: { name: 'Dmitry Volkov', avatar: 'https://i.pravatar.cc/150?img=12' },
    category: 'Photography',
    imageUri: 'https://picsum.photos/seed/photo1/400/300',
    rating: 4.7,
    reviewCount: 63,
    price: 30,
    currency: 'USD',
    duration: '4 hours',
    location: 'Bukhara',
    isFeatured: false,
  },
  {
    id: 'e4',
    title: 'Suzani Embroidery Masterclass',
    host: { name: 'Malika Sultanova', avatar: 'https://i.pravatar.cc/150?img=38' },
    category: 'Textiles',
    imageUri: 'https://picsum.photos/seed/textiles1/400/300',
    rating: 5.0,
    reviewCount: 42,
    price: 55,
    currency: 'USD',
    duration: '3 hours',
    location: 'Tashkent',
    isFeatured: true,
  },
  {
    id: 'e5',
    title: 'Desert Sunset Camel Trek',
    host: { name: 'Rustam Kalandarov', avatar: 'https://i.pravatar.cc/150?img=52' },
    category: 'Adventure',
    imageUri: 'https://picsum.photos/seed/desert1/400/300',
    rating: 4.6,
    reviewCount: 78,
    price: 65,
    currency: 'USD',
    duration: '5 hours',
    location: 'Navoi',
    isFeatured: false,
  },
  {
    id: 'e6',
    title: 'Traditional Music & Dance Evening',
    host: { name: 'Dilnoza Rashidova', avatar: 'https://i.pravatar.cc/150?img=29' },
    category: 'Music',
    imageUri: 'https://picsum.photos/seed/music1/400/300',
    rating: 4.9,
    reviewCount: 56,
    price: 25,
    currency: 'USD',
    duration: '2 hours',
    location: 'Khiva',
    isFeatured: false,
  },
];

const FILTER_PILLS = ['Category', 'Price', 'Rating', 'Duration', 'Date'];

// ── Experience Card (List Variant) ───────────────────
const ExperienceListCard: React.FC<{ item: SearchResult }> = ({ item }) => (
  <Card
    elevated
    style={{ marginHorizontal: 16, marginBottom: 12 }}
    padding={0}
  >
    <View style={{ flexDirection: 'row' }}>
      <Image
        source={{ uri: item.imageUri }}
        style={{
          width: 110,
          height: 120,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        }}
        contentFit="cover"
        transition={200}
      />
      <View style={{ flex: 1, padding: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Badge label={item.category} variant="outline" size="sm" />
          {item.isFeatured && (
            <Badge label="Featured" variant="gold" size="sm" />
          )}
        </View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#1A1A1A',
            marginTop: 4,
          }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
            gap: 4,
          }}
        >
          <Avatar uri={item.host.avatar} size={16} name={item.host.name} />
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SourceSerif4-Regular',
              color: '#8A8A8A',
            }}
          >
            {item.host.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
            gap: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Star size={12} color="#C4993C" fill="#C4993C" />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
              }}
            >
              {item.rating}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8A8A8A',
              }}
            >
              ({item.reviewCount})
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Clock size={11} color="#8A8A8A" />
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8A8A8A',
              }}
            >
              {item.duration}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'SourceSerif4-Bold',
            color: '#1A1A1A',
            marginTop: 6,
          }}
        >
          ${item.price}{' '}
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SourceSerif4-Regular',
              color: '#8A8A8A',
            }}
          >
            / person
          </Text>
        </Text>
      </View>
    </View>
  </Card>
);

// ── Screen ───────────────────────────────────────────
const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredResults = MOCK_RESULTS.filter((r) => {
    if (query && !r.title.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    if (selectedCategory && r.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleFilterPill = useCallback((pill: string) => {
    setActiveFilter((prev) => (prev === pill ? null : pill));
    setShowFilterSheet(true);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: SearchResult }) => <ExperienceListCard item={item} />,
    [],
  );

  const categories = [
    'Ceramics', 'Cuisine', 'Photography', 'Textiles',
    'Adventure', 'Music', 'History', 'Architecture',
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF8F4' }} edges={['top']}>
      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            height: 48,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderColor: '#F2EDE4',
          }}
        >
          <Search size={18} color="#8A8A8A" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search experiences, hosts, places..."
            placeholderTextColor="#8A8A8A"
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 14,
              fontFamily: 'SourceSerif4-Regular',
              color: '#1A1A1A',
            }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <X size={16} color="#8A8A8A" />
            </Pressable>
          )}
        </View>
      </View>

      {/* View Toggle + Filter Pills */}
      <View
        style={{
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#F2EDE4',
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8,
            alignItems: 'center',
          }}
        >
          {/* View Mode Toggle */}
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 8,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#F2EDE4',
              marginRight: 4,
            }}
          >
            <Pressable
              onPress={() => setViewMode('list')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: viewMode === 'list' ? '#1A1A1A' : '#FFFFFF',
              }}
            >
              <List
                size={16}
                color={viewMode === 'list' ? '#FFFFFF' : '#4A4A4A'}
              />
            </Pressable>
            <Pressable
              onPress={() => setViewMode('map')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: viewMode === 'map' ? '#1A1A1A' : '#FFFFFF',
              }}
            >
              <Map
                size={16}
                color={viewMode === 'map' ? '#FFFFFF' : '#4A4A4A'}
              />
            </Pressable>
          </View>

          {/* Filter Pills */}
          {FILTER_PILLS.map((pill) => (
            <Pill
              key={pill}
              label={pill}
              selected={activeFilter === pill}
              onPress={() => handleFilterPill(pill)}
              icon={ChevronDown}
            />
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {viewMode === 'list' ? (
        <FlatList
          data={filteredResults}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={{
                alignItems: 'center',
                paddingTop: 60,
              }}
            >
              <Search size={40} color="#8A8A8A" />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: '#4A4A4A',
                  marginTop: 12,
                }}
              >
                No results found
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8A8A8A',
                  marginTop: 4,
                }}
              >
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#F2EDE4',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Map size={48} color="#8A8A8A" />
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#4A4A4A',
              marginTop: 12,
            }}
          >
            Map View
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-Regular',
              color: '#8A8A8A',
              marginTop: 4,
            }}
          >
            {filteredResults.length} experiences in this area
          </Text>
        </View>
      )}

      {/* Filter Bottom Sheet */}
      <Modal
        visible={showFilterSheet}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilterSheet(false)}
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
              Filters
            </Text>
            <Pressable onPress={() => setShowFilterSheet(false)} hitSlop={8}>
              <X size={22} color="#1A1A1A" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            {/* Category */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
                marginBottom: 10,
              }}
            >
              Category
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 24,
              }}
            >
              {categories.map((cat) => (
                <Pill
                  key={cat}
                  label={cat}
                  selected={selectedCategory === cat}
                  onPress={() =>
                    setSelectedCategory((prev) =>
                      prev === cat ? null : cat,
                    )
                  }
                />
              ))}
            </View>

            {/* Price Range */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
                marginBottom: 10,
              }}
            >
              Price Range
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginBottom: 24,
              }}
            >
              <Pill label="Under $25" />
              <Pill label="$25 - $50" />
              <Pill label="$50 - $100" />
              <Pill label="$100+" />
            </View>

            {/* Rating */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
                marginBottom: 10,
              }}
            >
              Minimum Rating
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginBottom: 24,
              }}
            >
              {[3, 3.5, 4, 4.5].map((r) => (
                <Pill key={r} label={`${r}+`} icon={Star} />
              ))}
            </View>

            {/* Duration */}
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
                marginBottom: 10,
              }}
            >
              Duration
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginBottom: 24,
              }}
            >
              <Pill label="Under 2h" />
              <Pill label="2-4h" />
              <Pill label="4-6h" />
              <Pill label="Full day" />
            </View>

            {/* Apply */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                variant="outline"
                size="lg"
                onPress={() => {
                  setSelectedCategory(null);
                  setActiveFilter(null);
                }}
                style={{ flex: 1 }}
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                size="lg"
                onPress={() => setShowFilterSheet(false)}
                style={{ flex: 1 }}
              >
                Show Results
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SearchScreen;
