import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock, Bookmark, Share2, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';

// ── Types ────────────────────────────────────────
type Bucket = 'tonight' | 'tomorrow' | 'weekend' | 'week';

type EventItem = {
  id: string;
  posterName: string;
  posterAvatar: string;
  posterRole?: 'Local' | 'Traveler';
  title: string;
  ribbonText: string;
  attendees: number;
  maxAttendees: number;
  location: string;
  bucket: Bucket;
  /** Venue / mood cover image, used as background on visual cards. */
  cover: string;
};

// ── Mock data ────────────────────────────────────
const EVENTS: EventItem[] = [
  {
    id: 'u1',
    posterName: 'Sato Bar',
    posterAvatar: 'https://i.pravatar.cc/80?u=sato',
    title: 'Live jazz under the stars',
    ribbonText: 'IN 3h 12m',
    attendees: 12,
    maxAttendees: 30,
    location: 'Sato Bar',
    bucket: 'tonight',
    cover: 'https://picsum.photos/seed/jazz-night/800/600',
  },
  {
    id: 'u2',
    posterName: 'Plov House',
    posterAvatar: 'https://i.pravatar.cc/80?u=plov',
    posterRole: 'Local',
    title: 'Communal plov & strangers',
    ribbonText: 'IN 2h 42m',
    attendees: 8,
    maxAttendees: 12,
    location: 'Mirzo Ulugbek',
    bucket: 'tonight',
    cover: 'https://picsum.photos/seed/plov-dinner/800/600',
  },
  {
    id: 'u8',
    posterName: 'Rooftop Lounge',
    posterAvatar: 'https://i.pravatar.cc/80?u=rooftop',
    title: 'Rooftop sunset & cocktails',
    ribbonText: 'IN 1h 20m',
    attendees: 7,
    maxAttendees: 20,
    location: 'Hyatt Regency',
    bucket: 'tonight',
    cover: 'https://picsum.photos/seed/rooftop-sunset/800/600',
  },
  {
    id: 'u3',
    posterName: 'Aziza',
    posterAvatar: 'https://i.pravatar.cc/80?u=aziza',
    posterRole: 'Local',
    title: 'Morning teahouse crawl',
    ribbonText: 'TOMORROW · 9 AM',
    attendees: 3,
    maxAttendees: 8,
    location: 'Old City Tashkent',
    bucket: 'tomorrow',
    cover: 'https://picsum.photos/seed/teahouse-morning/800/600',
  },
  {
    id: 'u4',
    posterName: 'Olga V.',
    posterAvatar: 'https://i.pravatar.cc/80?u=olga',
    posterRole: 'Traveler',
    title: 'Chimgan mountains day trip',
    ribbonText: 'SAT · APR 1',
    attendees: 3,
    maxAttendees: 7,
    location: 'Chimgan Mountains',
    bucket: 'weekend',
    cover: 'https://picsum.photos/seed/mountain-day/800/600',
  },
  {
    id: 'u5',
    posterName: 'Ahmed F.',
    posterAvatar: 'https://i.pravatar.cc/80?u=ahmed',
    posterRole: 'Local',
    title: 'Film camera photo walk, Old City',
    ribbonText: 'FRI · MAR 31',
    attendees: 5,
    maxAttendees: 12,
    location: 'Old Town Tashkent',
    bucket: 'weekend',
    cover: 'https://picsum.photos/seed/film-walk/800/600',
  },
  {
    id: 'u6',
    posterName: 'Lena B.',
    posterAvatar: 'https://i.pravatar.cc/80?u=lena',
    posterRole: 'Traveler',
    title: 'Cooking class — learn manti',
    ribbonText: 'SUN · APR 2',
    attendees: 2,
    maxAttendees: 6,
    location: 'Mirzo Ulugbek district',
    bucket: 'week',
    cover: 'https://picsum.photos/seed/cooking-class/800/600',
  },
  {
    id: 'u7',
    posterName: 'Timur',
    posterAvatar: 'https://i.pravatar.cc/80?u=timur',
    posterRole: 'Local',
    title: 'Bookshop crawl, Mirzo Ulugbek',
    ribbonText: 'WED · APR 5',
    attendees: 4,
    maxAttendees: 10,
    location: 'Mirzo Ulugbek',
    bucket: 'week',
    cover: 'https://picsum.photos/seed/bookshop/800/600',
  },
];

// ── Visual event card — image bg + overlay text ──
// Used in the home "Happening Tonight" carousel. Photo-forward like
// Airbnb experience cards: cover image fills, darkened at the bottom
// for readable overlay text + quick-join CTA.
const VisualEventCard: React.FC<{ e: EventItem }> = ({ e }) => {
  const spotsLeft = e.maxAttendees - e.attendees;
  const full = spotsLeft === 0;
  return (
    <Pressable
      style={{
        width: 300,
        height: 260,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#262626',
      }}
    >
      <ImageBackground source={{ uri: e.cover }} style={{ flex: 1 }}>
        {/* Top row — time ribbon + bookmark */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.96)',
            }}
          >
            <Clock size={10} color="#262626" strokeWidth={2.4} />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '800',
                color: '#262626',
                letterSpacing: 0.4,
              }}
            >
              {e.ribbonText}
            </Text>
          </View>
          <View
            style={{
              marginLeft: 'auto',
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: 'rgba(0,0,0,0.35)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bookmark size={15} color="#FFFFFF" strokeWidth={2} />
          </View>
        </View>

        {/* Bottom overlay — gradient for text contrast + content */}
        <View style={{ flex: 1 }} />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ paddingHorizontal: 14, paddingTop: 30, paddingBottom: 12 }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 17,
              fontWeight: '800',
              letterSpacing: -0.3,
              lineHeight: 21,
            }}
            numberOfLines={2}
          >
            {e.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginTop: 4,
            }}
          >
            <MapPin size={11} color="rgba(255,255,255,0.85)" />
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>
              {e.location}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.45)', marginHorizontal: 2 }}>·</Text>
            <Text
              style={{
                color: full ? '#FF8787' : 'rgba(255,255,255,0.9)',
                fontSize: 12,
                fontWeight: '700',
              }}
            >
              {e.attendees}/{e.maxAttendees} going
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 10,
            }}
          >
            <Pressable
              disabled={full}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 999,
                backgroundColor: full ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: full ? '#FFFFFF' : '#262626',
                  fontSize: 13,
                  fontWeight: '800',
                  letterSpacing: -0.1,
                }}
              >
                {full ? 'Full' : 'Join'}
              </Text>
            </Pressable>
            {spotsLeft > 0 && spotsLeft <= 3 && (
              <View
                style={{
                  paddingHorizontal: 10,
                  height: 36,
                  borderRadius: 999,
                  backgroundColor: 'rgba(16,185,129,0.18)',
                  borderWidth: 1,
                  borderColor: 'rgba(16,185,129,0.5)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '800' }}>
                  {spotsLeft} left
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};

// ── Vertical full-width event card (used on hub page) ─────
const EventCard: React.FC<{ e: EventItem }> = ({ e }) => {
  const spotsLeft = e.maxAttendees - e.attendees;
  const full = spotsLeft === 0;
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DBDBDB',
        padding: 14,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: e.posterAvatar }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            marginRight: 10,
            backgroundColor: '#FAFAFA',
          }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#262626' }}>
              {e.posterName}
            </Text>
            {e.posterRole && (
              <View
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 1.5,
                  borderRadius: 3,
                  backgroundColor:
                    e.posterRole === 'Local' ? '#262626' : '#FFFFFF',
                  borderWidth: e.posterRole === 'Local' ? 0 : 1,
                  borderColor: '#DBDBDB',
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: '800',
                    color: e.posterRole === 'Local' ? '#FFFFFF' : '#8E8E8E',
                    letterSpacing: 0.4,
                  }}
                >
                  {e.posterRole.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 7,
            paddingVertical: 3,
            borderRadius: 999,
            backgroundColor: '#FAFAFA',
            borderWidth: 1,
            borderColor: '#DBDBDB',
          }}
        >
          <Clock size={9} color="#8E8E8E" strokeWidth={2.2} />
          <Text
            style={{
              fontSize: 9.5,
              fontWeight: '800',
              color: '#3C3C3C',
              letterSpacing: 0.5,
            }}
          >
            {e.ribbonText}
          </Text>
        </View>
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 15,
          fontWeight: '600',
          color: '#262626',
          letterSpacing: -0.1,
          lineHeight: 20,
        }}
      >
        {e.title}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
          gap: 4,
          flexWrap: 'wrap',
        }}
      >
        <MapPin size={12} color="#8E8E8E" />
        <Text style={{ fontSize: 12, color: '#8E8E8E' }}>{e.location}</Text>
        <Text style={{ fontSize: 12, color: '#DBDBDB', marginHorizontal: 2 }}>·</Text>
        <Text
          style={{
            fontSize: 12,
            color: full ? '#E53935' : '#262626',
            fontWeight: '600',
          }}
        >
          {e.attendees}/{e.maxAttendees} going
        </Text>
        {spotsLeft > 0 && spotsLeft <= 3 && (
          <>
            <Text style={{ fontSize: 12, color: '#DBDBDB', marginHorizontal: 2 }}>·</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#10B981' }}>
              {spotsLeft} spots left
            </Text>
          </>
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 }}>
        <Pressable
          disabled={full}
          style={{
            flex: 1,
            backgroundColor: full ? '#F2F2F2' : '#262626',
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: full ? '#8E8E8E' : '#FFFFFF',
              fontSize: 13,
              fontWeight: '700',
              letterSpacing: -0.1,
            }}
          >
            {full ? 'Full' : 'Join'}
          </Text>
        </Pressable>
        <Pressable
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#DBDBDB',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bookmark size={16} color="#262626" strokeWidth={1.8} />
        </Pressable>
        <Pressable
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#DBDBDB',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Share2 size={16} color="#262626" strokeWidth={1.8} />
        </Pressable>
      </View>
    </View>
  );
};

// ── Bucket tabs (text tabs with underline — X style) ──
const BUCKETS: { id: Bucket; label: string }[] = [
  { id: 'tonight', label: 'Tonight' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'weekend', label: 'Weekend' },
  { id: 'week', label: 'This week' },
];

const BucketTab: React.FC<{
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}> = ({ label, count, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      flex: 1,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: active ? '800' : '600',
          color: active ? '#262626' : '#8E8E8E',
          letterSpacing: -0.1,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          color: active ? '#262626' : '#B0B0B0',
        }}
      >
        {count}
      </Text>
    </View>
    {active && (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: 3,
          width: 36,
          borderRadius: 2,
          backgroundColor: '#262626',
        }}
      />
    )}
  </Pressable>
);

// ── Full browse view (used on Events hub screen) ──
export const UpcomingBrowseView: React.FC = () => {
  const [bucket, setBucket] = useState<Bucket>('tonight');

  const counts = useMemo(() => {
    return BUCKETS.reduce(
      (acc, b) => ({ ...acc, [b.id]: EVENTS.filter((e) => e.bucket === b.id).length }),
      {} as Record<Bucket, number>,
    );
  }, []);

  const visible = useMemo(() => EVENTS.filter((e) => e.bucket === bucket), [bucket]);

  return (
    <View>
      {/* Tabs on top */}
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#EFEFEF',
        }}
      >
        {BUCKETS.map((b) => (
          <BucketTab
            key={b.id}
            label={b.label}
            count={counts[b.id]}
            active={bucket === b.id}
            onPress={() => setBucket(b.id)}
          />
        ))}
      </View>

      {/* Event list */}
      {visible.length === 0 ? (
        <View style={{ padding: 28, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: '#8E8E8E', textAlign: 'center' }}>
            Nothing scheduled for this window — check another.
          </Text>
        </View>
      ) : (
        <View style={{ paddingTop: 12 }}>
          {visible.map((e) => <EventCard key={e.id} e={e} />)}
        </View>
      )}
    </View>
  );
};

// ── Home section — single "Happening Tonight" carousel ──
// Photo-forward visual cards for tonight's events only. Full browse
// (time buckets, vertical list) lives on the dedicated Events hub.
interface Props {
  cityName: string;
}

const UpcomingSection: React.FC<Props> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const tonight = useMemo(() => EVENTS.filter((e) => e.bucket === 'tonight'), []);

  const openHub = () => {
    try {
      navigation.navigate('EventsHub');
    } catch {
      /* nav may not be ready */
    }
  };

  return (
    <View style={{ marginTop: 28 }}>
      {/* Header — title + count + See all */}
      <View
        style={{
          paddingHorizontal: 16,
          marginBottom: 12,
          flexDirection: 'row',
          alignItems: 'baseline',
        }}
      >
        <Text
          style={{ fontSize: 11, fontWeight: '700', color: '#262626', letterSpacing: 1.4 }}
        >
          HAPPENING TONIGHT · {tonight.length}
        </Text>
        <Pressable onPress={openHub} style={{ marginLeft: 'auto' }} hitSlop={8}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#0095F6',
                letterSpacing: -0.1,
              }}
            >
              See all
            </Text>
            <ArrowRight size={12} color="#0095F6" strokeWidth={2.4} />
          </View>
        </Pressable>
      </View>

      {/* Visual carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {tonight.map((e) => (
          <VisualEventCard key={e.id} e={e} />
        ))}
      </ScrollView>
    </View>
  );
};

export default UpcomingSection;
