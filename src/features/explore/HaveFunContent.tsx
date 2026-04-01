import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Animated,
  Easing,
} from 'react-native';
import {
  Zap,
  Users,
  MapPin,
  Calendar,
  Music,
  Coffee,
  PartyPopper,
  Utensils,
  Dumbbell,
  MessageCircle,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import Button from '../../components/ui/Button';

// ── Mock Data ──────────────────────────────────────────
const MOCK_DATA = {
  happeningNow: [
    {
      id: 'now-1',
      posterName: 'Kamila S.',
      posterAvatar: 'https://i.pravatar.cc/80?u=kamila',
      content: 'Rooftop chai and conversation at Hyatt Regency. Anyone want to join? Amazing views of the city skyline!',
      time: '15 min ago',
      attendees: 4,
      maxAttendees: 8,
      location: 'Hyatt Regency Tashkent',
    },
    {
      id: 'now-2',
      posterName: 'Diego R.',
      posterAvatar: 'https://i.pravatar.cc/80?u=diego',
      content: 'Street food crawl through Chorsu Bazaar starting now! Already found incredible samsa and fresh pomegranate juice.',
      time: '28 min ago',
      attendees: 6,
      maxAttendees: 10,
      location: 'Chorsu Bazaar',
    },
  ],

  travelBuddies: [
    {
      id: 'buddy-1',
      name: 'Emma W.',
      avatar: 'https://i.pravatar.cc/80?u=emma',
      from: 'Melbourne, AU',
      dates: 'Mar 28 - Apr 5',
      interests: ['Photography', 'Food', 'History'],
    },
    {
      id: 'buddy-2',
      name: 'Chen L.',
      avatar: 'https://i.pravatar.cc/80?u=chen',
      from: 'Shanghai, CN',
      dates: 'Mar 29 - Apr 2',
      interests: ['Architecture', 'Markets', 'Music'],
    },
    {
      id: 'buddy-3',
      name: 'Priya K.',
      avatar: 'https://i.pravatar.cc/80?u=priya',
      from: 'Mumbai, IN',
      dates: 'Mar 27 - Apr 8',
      interests: ['Textiles', 'Cuisine', 'Yoga'],
    },
    {
      id: 'buddy-4',
      name: 'Jonas M.',
      avatar: 'https://i.pravatar.cc/80?u=jonas',
      from: 'Berlin, DE',
      dates: 'Mar 30 - Apr 4',
      interests: ['Nightlife', 'Adventure', 'Art'],
    },
  ],

  tonightsPicks: [
    { id: 'tonight-1', title: 'Live Jazz at Sato', time: '8:00 PM', price: 'Free', icon: Music, color: '#E3F2FD' },
    { id: 'tonight-2', title: 'Chai & Poetry Night', time: '7:30 PM', price: '$5', icon: Coffee, color: '#FFF8E1' },
    { id: 'tonight-3', title: 'Rooftop Social Mixer', time: '9:00 PM', price: '$10', icon: PartyPopper, color: '#FCE4EC' },
    { id: 'tonight-4', title: 'Night Food Tour', time: '8:30 PM', price: '$15', icon: Utensils, color: '#E8F5E9' },
    { id: 'tonight-5', title: 'Sunset Yoga Session', time: '6:00 PM', price: 'Free', icon: Dumbbell, color: '#F3E5F5' },
  ],

  thisWeek: [
    {
      id: 'week-1',
      posterName: 'Olga V.',
      posterAvatar: 'https://i.pravatar.cc/80?u=olga',
      content: 'Organizing a group trip to Chimgan Mountains this Saturday! Need 4 more people for a shared car.',
      time: 'Sat, Apr 1',
      attendees: 3,
      maxAttendees: 7,
      location: 'Chimgan Mountains',
    },
    {
      id: 'week-2',
      posterName: 'Ahmed F.',
      posterAvatar: 'https://i.pravatar.cc/80?u=ahmed',
      content: 'Photo walk through the Old City on Friday afternoon. Bringing my film camera, all skill levels welcome!',
      time: 'Fri, Mar 31',
      attendees: 5,
      maxAttendees: 12,
      location: 'Old Town Tashkent',
    },
    {
      id: 'week-3',
      posterName: 'Lena B.',
      posterAvatar: 'https://i.pravatar.cc/80?u=lena',
      content: 'Cooking class meetup: learning to make manti (dumplings) with a local grandmother. Spots limited!',
      time: 'Sun, Apr 2',
      attendees: 2,
      maxAttendees: 6,
      location: 'Mirzo Ulugbek district',
    },
  ],
};

// ── Section Header ─────────────────────────────────────
const SectionHeader: React.FC<{ title: string; onSeeAll?: () => void }> = ({
  title,
  onSeeAll,
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12, marginTop: 24 }}>
    <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 20, color: '#1A1A1A' }}>
      {title}
    </Text>
    {onSeeAll && (
      <Pressable onPress={onSeeAll} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 13, color: '#C4993C' }}>
          See all
        </Text>
      </Pressable>
    )}
  </View>
);

// ── Animated Green Pulse Dot ───────────────────────────
const PulseDot: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.6, duration: 800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [scale, opacity]);

  return (
    <View style={{ width: 12, height: 12, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: '#2E7D32',
          transform: [{ scale }],
          opacity,
        }}
      />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2E7D32' }} />
    </View>
  );
};

// ── Event Card ───────────────────────────────────────────
const EventCard: React.FC<{
  item: (typeof MOCK_DATA.happeningNow)[0];
  showPulse?: boolean;
}> = ({ item, showPulse = false }) => (
  <Pressable
    style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <Image
        source={{ uri: item.posterAvatar }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 14, color: '#1A1A1A' }}>
            {item.posterName}
          </Text>
          {showPulse && (
            <View style={{ marginLeft: 8 }}>
              <PulseDot />
            </View>
          )}
          <Text style={{ fontSize: 11, color: '#8A8A8A', marginLeft: 'auto', fontFamily: 'SourceSerif4-Regular' }}>
            {item.time}
          </Text>
        </View>
        <Text
          style={{ fontSize: 14, color: '#4A4A4A', marginTop: 4, lineHeight: 20, fontFamily: 'SourceSerif4-Regular' }}
          numberOfLines={3}
        >
          {item.content}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <MapPin size={12} color="#8A8A8A" />
          <Text style={{ fontSize: 11, color: '#8A8A8A', marginLeft: 4, fontFamily: 'SourceSerif4-Regular' }}>
            {item.location}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Users size={14} color="#C4993C" />
            <Text style={{ fontSize: 12, color: '#C4993C', marginLeft: 4, fontFamily: 'SourceSerif4-SemiBold' }}>
              {item.attendees}/{item.maxAttendees} going
            </Text>
          </View>
          <Button variant="primary" size="sm" pill onPress={() => {}}>
            Join
          </Button>
        </View>
      </View>
    </View>
  </Pressable>
);

// ── Section A: Happening Now ───────────────────────────
const HappeningNow: React.FC = () => (
  <View>
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12, marginTop: 24 }}>
      <PulseDot />
      <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 20, color: '#1A1A1A', marginLeft: 8 }}>
        Happening Now
      </Text>
    </View>
    {MOCK_DATA.happeningNow.map((item) => (
      <EventCard key={item.id} item={item} showPulse />
    ))}
  </View>
);

// ── Section B: Travel Buddy Board ──────────────────────
const TravelBuddyBoard: React.FC = () => (
  <View>
    <SectionHeader title="Travel Buddy Board" onSeeAll={() => {}} />
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={MOCK_DATA.travelBuddies}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      renderItem={({ item }) => (
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, width: 200 }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: item.avatar }}
              style={{ width: 56, height: 56, borderRadius: 28, marginBottom: 8 }}
            />
            <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 15, color: '#1A1A1A' }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 12, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
              {item.from}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Calendar size={12} color="#8A8A8A" />
            <Text style={{ fontSize: 11, color: '#8A8A8A', marginLeft: 4, fontFamily: 'SourceSerif4-Regular' }}>
              {item.dates}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 4 }}>
            {item.interests.map((interest) => (
              <View
                key={interest}
                style={{
                  backgroundColor: '#F2EDE4',
                  borderRadius: 999,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontSize: 10, color: '#4A4A4A', fontFamily: 'SourceSerif4-Regular' }}>
                  {interest}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 12 }}>
            <Button variant="outline" size="sm" pill fullWidth icon={MessageCircle} onPress={() => {}}>
              Connect
            </Button>
          </View>
        </View>
      )}
    />
  </View>
);

// ── Section C: Tonight's Picks ─────────────────────────
const TonightsPicks: React.FC = () => (
  <View>
    <SectionHeader title="Tonight's Picks" onSeeAll={() => {}} />
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={MOCK_DATA.tonightsPicks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      renderItem={({ item }) => {
        const Icon: LucideIcon = item.icon;
        return (
          <Pressable style={{ width: 140, borderRadius: 16, overflow: 'hidden' }}>
            <View style={{ height: 6, backgroundColor: item.color }} />
            <View style={{ backgroundColor: '#FFFFFF', padding: 12, minHeight: 120 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: item.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}
              >
                <Icon size={18} color="#1A1A1A" />
              </View>
              <Text
                style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 13, color: '#1A1A1A' }}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ fontSize: 11, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
                  {item.time}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'SourceSerif4-Bold',
                    color: item.price === 'Free' ? '#2E7D32' : '#1A1A1A',
                  }}
                >
                  {item.price}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      }}
    />
  </View>
);

// ── Section D: Happening This Week ─────────────────────
const HappeningThisWeek: React.FC = () => (
  <View>
    <SectionHeader title="Happening This Week" onSeeAll={() => {}} />
    {MOCK_DATA.thisWeek.map((item) => (
      <EventCard key={item.id} item={item} />
    ))}
  </View>
);

// ── Main Component ─────────────────────────────────────
const HaveFunContent: React.FC = () => (
  <View style={{ paddingBottom: 32 }}>
    <HappeningNow />
    <TravelBuddyBoard />
    <TonightsPicks />
    <HappeningThisWeek />
  </View>
);

export default HaveFunContent;
