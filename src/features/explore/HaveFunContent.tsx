import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Animated,
  Easing,
  ImageBackground,
} from 'react-native';
import { MapPin, Bookmark, Share2, Calendar, Clock } from 'lucide-react-native';

import HeroLiveCarousel, {
  type HeroLiveEvent,
  type HeroMood,
} from './HeroLiveCard';
import ActivityTicker from './ActivityTicker';
import InvitationCard from './InvitationCard';
import PeopleRail from './PeopleRail';
import ConversationsSection from './ConversationsSection';
import UpcomingSection from './UpcomingSection';
import Composer from './Composer';
import PeopleSuggestions from './PeopleSuggestions';

// ── Types ───────────────────────────────────────
type EventItem = {
  id: string;
  posterName: string;
  posterAvatar: string;
  posterRole?: 'Local' | 'Traveler';
  title: string;
  time: string;
  postedAgo: string;
  status: 'live' | 'tonight' | 'thisweek';
  ribbonText: string;
  attendees: number;
  maxAttendees: number;
  location: string;
  lat: number;
  lng: number;
};

// ── Mock Data ───────────────────────────────────
const EVENTS: EventItem[] = [
  {
    id: 'now-1',
    posterName: 'Kamila S.',
    posterAvatar: 'https://i.pravatar.cc/80?u=kamila',
    posterRole: 'Local',
    title: 'Rooftop chai & city skyline',
    time: 'Now',
    postedAgo: '15 min ago',
    status: 'live',
    ribbonText: 'LIVE',
    attendees: 4,
    maxAttendees: 8,
    location: 'Hyatt Regency Tashkent',
    lat: 41.3203,
    lng: 69.2763,
  },
  {
    id: 'now-2',
    posterName: 'Diego R.',
    posterAvatar: 'https://i.pravatar.cc/80?u=diego',
    posterRole: 'Traveler',
    title: 'Street food crawl, Chorsu Bazaar',
    time: 'Now',
    postedAgo: '28 min ago',
    status: 'live',
    ribbonText: 'LIVE',
    attendees: 6,
    maxAttendees: 10,
    location: 'Chorsu Bazaar',
    lat: 41.3267,
    lng: 69.2383,
  },
  {
    id: 'now-3',
    posterName: 'Emre T.',
    posterAvatar: 'https://i.pravatar.cc/80?u=emre',
    posterRole: 'Traveler',
    title: 'Coffee at Tiramisu — drop by',
    time: 'Now',
    postedAgo: '5 min ago',
    status: 'live',
    ribbonText: 'LIVE',
    attendees: 2,
    maxAttendees: 5,
    location: 'Tiramisu Cafe',
    lat: 41.3111,
    lng: 69.2797,
  },
  {
    id: 'tonight-1',
    posterName: 'Sato Bar',
    posterAvatar: 'https://i.pravatar.cc/80?u=sato',
    title: 'Live jazz under the stars',
    time: '8:00 PM',
    postedAgo: '2 h ago',
    status: 'tonight',
    ribbonText: 'IN 3h 12m',
    attendees: 12,
    maxAttendees: 30,
    location: 'Sato Bar',
    lat: 41.3242,
    lng: 69.2812,
  },
  {
    id: 'tonight-2',
    posterName: 'Plov House',
    posterAvatar: 'https://i.pravatar.cc/80?u=plov',
    posterRole: 'Local',
    title: 'Communal plov & strangers',
    time: '7:30 PM',
    postedAgo: '4 h ago',
    status: 'tonight',
    ribbonText: 'IN 2h 42m',
    attendees: 8,
    maxAttendees: 12,
    location: 'Mirzo Ulugbek',
    lat: 41.3178,
    lng: 69.2683,
  },
  {
    id: 'week-1',
    posterName: 'Olga V.',
    posterAvatar: 'https://i.pravatar.cc/80?u=olga',
    posterRole: 'Traveler',
    title: 'Chimgan mountains day trip',
    time: 'Saturday',
    postedAgo: 'Yesterday',
    status: 'thisweek',
    ribbonText: 'SAT · APR 1',
    attendees: 3,
    maxAttendees: 7,
    location: 'Chimgan Mountains',
    lat: 41.54,
    lng: 70.0342,
  },
  {
    id: 'week-2',
    posterName: 'Ahmed F.',
    posterAvatar: 'https://i.pravatar.cc/80?u=ahmed',
    posterRole: 'Local',
    title: 'Film camera photo walk, Old City',
    time: 'Friday',
    postedAgo: '2 days ago',
    status: 'thisweek',
    ribbonText: 'FRI · MAR 31',
    attendees: 5,
    maxAttendees: 12,
    location: 'Old Town Tashkent',
    lat: 41.3275,
    lng: 69.2347,
  },
];

const BUDDIES = [
  {
    id: 'b1',
    name: 'Emma',
    from: 'Melbourne',
    dates: 'Mar 28 – Apr 5',
    cover: 'https://picsum.photos/seed/buddy-emma/800/520',
  },
  {
    id: 'b2',
    name: 'Chen',
    from: 'Shanghai',
    dates: 'Mar 29 – Apr 2',
    cover: 'https://picsum.photos/seed/buddy-chen/800/520',
  },
  {
    id: 'b3',
    name: 'Priya',
    from: 'Mumbai',
    dates: 'Mar 27 – Apr 8',
    cover: 'https://picsum.photos/seed/buddy-priya/800/520',
  },
  {
    id: 'b4',
    name: 'Jonas',
    from: 'Berlin',
    dates: 'Mar 30 – Apr 4',
    cover: 'https://picsum.photos/seed/buddy-jonas/800/520',
  },
];

// ── Live Pulse ───────────────────────────────────
const PulseDot: React.FC<{ color?: string; size?: number }> = ({
  color = '#10B981',
  size = 6,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 2.4,
            duration: 1100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 1100, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale, opacity]);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        }}
      />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
};

// ── Section label (title + optional hint on the SAME row) ─
const SectionLabel: React.FC<{ text: string; hint?: string }> = ({ text, hint }) => (
  <View
    style={{
      paddingHorizontal: 16,
      marginTop: 28,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'baseline',
      flexWrap: 'wrap',
    }}
  >
    <Text
      style={{
        fontSize: 11,
        fontWeight: '700',
        color: '#262626',
        letterSpacing: 1.4,
      }}
    >
      {text}
    </Text>
    {hint && (
      <Text
        style={{
          fontSize: 11,
          color: '#8E8E8E',
          marginLeft: 8,
          fontWeight: '500',
        }}
      >
        · {hint}
      </Text>
    )}
  </View>
);

// ── Status pill (inline, next to host name) ──────
const StatusPill: React.FC<{ event: EventItem }> = ({ event }) => {
  const isLive = event.status === 'live';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: isLive ? '#D1FAE5' : '#FAFAFA',
        borderWidth: 1,
        borderColor: isLive ? '#D1FAE5' : '#DBDBDB',
        gap: 4,
      }}
    >
      {isLive ? (
        <PulseDot color="#FF3B30" size={6} />
      ) : (
        <Clock size={9} color="#8E8E8E" strokeWidth={2.2} />
      )}
      <Text
        style={{
          fontSize: 9.5,
          fontWeight: '800',
          color: isLive ? '#10B981' : '#3C3C3C',
          letterSpacing: 0.6,
        }}
      >
        {event.ribbonText}
      </Text>
    </View>
  );
};

// ── Role pill (LOCAL / TRAVELER) ─────────────────
const RolePill: React.FC<{ role?: 'Local' | 'Traveler' }> = ({ role }) => {
  if (!role) return null;
  const isLocal = role === 'Local';
  return (
    <View
      style={{
        paddingHorizontal: 5,
        paddingVertical: 1.5,
        borderRadius: 3,
        backgroundColor: isLocal ? '#262626' : '#FFFFFF',
        borderWidth: isLocal ? 0 : 1,
        borderColor: '#DBDBDB',
      }}
    >
      <Text
        style={{
          fontSize: 9,
          fontWeight: '800',
          color: isLocal ? '#FFFFFF' : '#8E8E8E',
          letterSpacing: 0.4,
        }}
      >
        {role.toUpperCase()}
      </Text>
    </View>
  );
};

// ── Compact Event Card (text-first, "jump in" feel) ─
const EventCard: React.FC<{ item: EventItem }> = ({ item }) => {
  const spotsLeft = item.maxAttendees - item.attendees;
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
      {/* Top row: avatar + name + status pill */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: item.posterAvatar }}
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
              {item.posterName}
            </Text>
            <RolePill role={item.posterRole} />
          </View>
          <Text style={{ fontSize: 11, color: '#8E8E8E', marginTop: 1 }}>{item.postedAgo}</Text>
        </View>
        <StatusPill event={item} />
      </View>

      {/* Title */}
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
        {item.title}
      </Text>

      {/* Location + social proof in one tight row */}
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
        <Text style={{ fontSize: 12, color: '#8E8E8E' }}>{item.location}</Text>
        <Text style={{ fontSize: 12, color: '#DBDBDB', marginHorizontal: 2 }}>·</Text>
        <Text
          style={{
            fontSize: 12,
            color: full ? '#10B981' : '#262626',
            fontWeight: '600',
          }}
        >
          {item.attendees}/{item.maxAttendees} going
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

      {/* Action row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 12,
          gap: 8,
        }}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: full ? '#F2F2F2' : '#262626',
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: 'center',
          }}
          disabled={full}
        >
          <Text
            style={{
              color: full ? '#8E8E8E' : '#FFFFFF',
              fontSize: 13,
              fontWeight: '700',
              letterSpacing: -0.1,
            }}
          >
            {full ? 'Full' : item.status === 'live' ? 'Join now' : 'Join'}
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

// ── Travel buddies (photo-driven horizontal cards) ─
const BuddyCard: React.FC<{ buddy: (typeof BUDDIES)[number] }> = ({ buddy }) => (
  <Pressable
    style={{
      width: 140,
      height: 190,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#DBDBDB',
    }}
  >
    <ImageBackground
      source={{ uri: buddy.cover }}
      style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}
    >
      <View style={{ backgroundColor: 'rgba(0,0,0,0.55)', padding: 10 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700', letterSpacing: -0.2 }}>
          {buddy.name}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 1 }}>
          {buddy.from}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
          <Calendar size={10} color="rgba(255,255,255,0.85)" />
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10 }}>{buddy.dates}</Text>
        </View>
      </View>
    </ImageBackground>
  </Pressable>
);

const BuddiesRail: React.FC<{ cityName: string }> = ({ cityName }) => (
  <View>
    <SectionLabel text={`TRAVEL BUDDIES IN ${cityName.toUpperCase()}`} />
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={BUDDIES}
      keyExtractor={(b) => b.id}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      renderItem={({ item }) => <BuddyCard buddy={item} />}
    />
  </View>
);

// ── Main Component ─────────────────────────────
interface HaveFunContentProps {
  cityName?: string;
  /** Forwarded to the Composer wrapper so HomeScreen can measure its real
   *  Y using `measureLayout` against the FlatList's scroll node. */
  composerWrapRef?: React.RefObject<View | null>;
  /** Fires when the Composer wrapper's layout changes — HomeScreen uses
   *  this as a trigger to cache the composer's Y in scroll-content coords
   *  while its native view is fresh. */
  onComposerLayout?: () => void;
  /** Bumped each time HomeScreen wants the composer to flash (e.g. after
   *  the + FAB has scrolled back to it). */
  composerFlashTrigger?: number;
}

const HaveFunContent: React.FC<HaveFunContentProps> = ({
  cityName = 'Tashkent',
  composerWrapRef,
  onComposerLayout,
  composerFlashTrigger = 0,
}) => {
  // Only 'live' events are rendered now — tonight/this-week have moved to
  // UpcomingSection with its own mock data.
  const live = EVENTS.filter((e) => e.status === 'live');

  // Promote ALL live events into gradient hero cards (swipeable carousel)
  const moodFor = (id: string): HeroMood => {
    if (id.includes('rooftop') || id.includes('chai') || id.includes('1')) return 'social';
    if (id.includes('food') || id.includes('crawl') || id.includes('2')) return 'food';
    if (id.includes('jazz') || id.includes('night')) return 'nightlife';
    return 'outdoor';
  };
  const heroEvents: HeroLiveEvent[] = live.map((e, i) => ({
    id: e.id,
    title: e.title,
    posterName: e.posterName,
    posterAvatar: e.posterAvatar,
    posterRole: e.posterRole,
    location: e.location,
    lat: e.lat,
    lng: e.lng,
    startedAgo: e.postedAgo,
    attendees: e.attendees,
    maxAttendees: e.maxAttendees,
    participants: [
      `https://i.pravatar.cc/80?u=p${i * 4 + 1}`,
      `https://i.pravatar.cc/80?u=p${i * 4 + 2}`,
      `https://i.pravatar.cc/80?u=p${i * 4 + 3}`,
      `https://i.pravatar.cc/80?u=p${i * 4 + 4}`,
    ],
    mood: (['social', 'food', 'nightlife', 'outdoor'] as HeroMood[])[i % 4],
  }));

  return (
    <View style={{ paddingBottom: 32 }}>
      {/* Unified people rail: merges stories + travel buddies into one custom
         section with vibe tags (what each person is currently up to) */}
      <PeopleRail cityName={cityName} />

      {/* LIVE FEED — sits between people and the hero events. Keeps the page
         feeling alive right near the top without being the very first block.
         Tap opens the full-feed drawer (ActivityDrawer). */}
      <ActivityTicker cityName={cityName} />

      {/* Happening now — swipeable gradient hero carousel. Tight top margin
         so it sits right under the live feed ticker with no empty gap. */}
      <View style={{ paddingHorizontal: 16, marginTop: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#262626', letterSpacing: 1.4 }}>
          {`HAPPENING NOW · ${live.length}`}
        </Text>
        <Text style={{ fontSize: 11, color: '#8E8E8E', marginLeft: 8, fontWeight: '500' }}>
          · walk in now
        </Text>
      </View>
      <HeroLiveCarousel events={heroEvents} />

      {/* Personal invitation card — organic notification in feed */}
      <InvitationCard />

      {/* SHARE A MOMENT — Composer lives as its own dedicated section now,
         above Conversations. The ref + onLayout here are what HomeScreen
         uses to measure the composer's Y in scroll content and cache it
         for the + FAB scroll target. */}
      <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 2 }}>
        <Text
          style={{ fontSize: 11, fontWeight: '700', color: '#262626', letterSpacing: 1.4 }}
        >
          SHARE A MOMENT
        </Text>
      </View>
      <View ref={composerWrapRef} onLayout={() => onComposerLayout?.()}>
        <Composer cityName={cityName} flashTrigger={composerFlashTrigger} />
      </View>

      {/* CONVERSATIONS — Talks + Questions + Polls as per-type horizontal
         carousels (filter chips on top, Hot Right Now below). */}
      <ConversationsSection cityName={cityName} />

      {/* PEOPLE TO MEET — Instagram-style suggestion cards: locals and
         travelers the user might want to connect with. */}
      <PeopleSuggestions cityName={cityName} />

      {/* UPCOMING — merged Tonight + Tomorrow + Weekend + This week behind
         a time chip filter. Default chip: Tonight. */}
      <UpcomingSection cityName={cityName} />
    </View>
  );
};

export default HaveFunContent;
