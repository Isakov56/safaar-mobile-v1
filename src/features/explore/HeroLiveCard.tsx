import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, ArrowRight, Send, Crown } from 'lucide-react-native';

// ── Types ────────────────────────────────────────
export type HeroMood = 'social' | 'outdoor' | 'nightlife' | 'food';

export type HeroLiveEvent = {
  id: string;
  title: string;
  posterName: string;
  posterAvatar: string;
  posterRole?: 'Local' | 'Traveler';
  location: string;
  lat: number;
  lng: number;
  startedAgo: string;
  attendees: number;
  maxAttendees: number;
  participants: string[];
  mood: HeroMood;
};

// Per mood, a 4-stop palette following the colour wheel order
// [topLeft → topRight → bottomLeft → bottomRight], so diagonally-opposite
// corners differ and the adjacent colours blend smoothly through neighbour
// hues — like Instagram's yellow→orange→pink→purple sunset.
type Palette = [string, string, string, string];
const GRADIENTS: Record<HeroMood, Palette> = {
  // yellow → orange → pink → purple (classic Instagram)
  social: ['#FEDA77', '#F58529', '#DD2A7B', '#833AB4'],
  // mint → green → teal → sky
  outdoor: ['#B2F7A6', '#56AB2F', '#2193B0', '#6DD5ED'],
  // soft pink → hot pink → magenta → deep purple
  nightlife: ['#FFB8E0', '#FF5E9C', '#A63FC9', '#5B247A'],
  // yellow → orange → coral → red
  food: ['#FFE259', '#FFA751', '#F76B8A', '#E53935'],
};

/** Converts a #RRGGBB hex to rgba() with the given alpha. */
function alpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const CARD_WIDTH = Dimensions.get('window').width - 32;
const CARD_HEIGHT = 360;
const HALF_W = CARD_WIDTH / 2;
const HALF_H = CARD_HEIGHT / 2;
const AVATAR = 36;

// ── Map tile helpers (CARTO OSM-based, mobile-friendly, no API key) ─────────
// Lower zoom = wider area. 13 shows a neighbourhood-sized view instead of a
// few blocks.
const ZOOM = 13;

function latLngToTilef(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const xf = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const yf =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { xf, yf };
}

const tileUrl = (z: number, x: number, y: number) =>
  `https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/${z}/${x}/${y}.png`;

// Returns the 4 tile URLs for a 2x2 grid. The window is picked so the event
// coordinates sit roughly in the middle of the grid — the pin + "tap to open"
// row is rendered at the card's center, so this keeps the map centered on
// the real location.
function useMapTiles(lat: number, lng: number) {
  const { xf, yf } = latLngToTilef(lat, lng, ZOOM);
  const startX = Math.round(xf - 1.0);
  const startY = Math.round(yf - 1.0);

  return {
    tl: tileUrl(ZOOM, startX, startY),
    tr: tileUrl(ZOOM, startX + 1, startY),
    bl: tileUrl(ZOOM, startX, startY + 1),
    br: tileUrl(ZOOM, startX + 1, startY + 1),
  };
}

// ── Live Pulse (white on gradient) ────────────────
const LivePulse: React.FC<{ size?: number; color?: string }> = ({
  size = 8,
  color = '#FFFFFF',
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.9)).current;
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
          Animated.timing(opacity, { toValue: 0.9, duration: 0, useNativeDriver: true }),
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
      <View
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }}
      />
    </View>
  );
};

// ── Single Hero Card ──────────────────────────────
const HeroCard: React.FC<{ event: HeroLiveEvent }> = ({ event }) => {
  const navigation = useNavigation<any>();
  const spotsLeft = event.maxAttendees - event.attendees;
  const full = spotsLeft === 0;
  const g = GRADIENTS[event.mood];
  const tiles = useMapTiles(event.lat, event.lng);
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0;

  const openMap = () => {
    try {
      navigation.navigate('MapTab' as never);
    } catch {
      /* nav not ready */
    }
  };

  return (
    <Pressable
      onPress={openMap}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 22,
        overflow: 'hidden',
        marginHorizontal: 8,
        backgroundColor: g[0], // fallback colour while map tiles load
      }}
    >
      {/* ── Map background: 2x2 tile grid. Tiles are oversized by 1px and pulled
           back with negative margins so their seams overlap — this hides the
           faint plus-sign crosshair that used to show at the tile boundaries. ── */}
      <View
        style={{ position: 'absolute', top: 0, left: 0, width: CARD_WIDTH, height: CARD_HEIGHT }}
        pointerEvents="none"
      >
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: tiles.tl }} style={{ width: HALF_W + 1, height: HALF_H + 1 }} />
          <Image
            source={{ uri: tiles.tr }}
            style={{ width: HALF_W + 1, height: HALF_H + 1, marginLeft: -1 }}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: -1 }}>
          <Image source={{ uri: tiles.bl }} style={{ width: HALF_W + 1, height: HALF_H + 1 }} />
          <Image
            source={{ uri: tiles.br }}
            style={{ width: HALF_W + 1, height: HALF_H + 1, marginLeft: -1 }}
          />
        </View>
      </View>

      {/* ── Ease-in vignette: alpha stays near-zero across most of the card,
           then ramps up noticeably toward each edge — so as your eye moves
           from centre outward, the color shadow grows "little by little,"
           slowly at first, faster near the very edge. Using 4 color stops per
           side with custom `locations` approximates an ease-in curve. ── */}
      {/* Each edge uses its own colour. Top-left corner blends TOP + LEFT,
          bottom-right corner blends BOTTOM + RIGHT — so the card actually
          reads as a colour transition across the diagonal. Fade extends to
          ~32% inward (further than before) so the colour itself serves as
          the text backdrop — no need for a black scrim. */}
      {/* PRIMARY diagonal (top-left → bottom-right) with 7 colour stops so the
          transition reads as one smooth Instagram-sunset-style blend through
          neighbour hues. Alphas dialled down so the map stays visible. */}
      <LinearGradient
        colors={[
          alpha(g[0], 0.78),  // TL corner
          alpha(g[0], 0.42),
          alpha(g[1], 0.18),
          'transparent',      // middle — map fully visible
          alpha(g[2], 0.18),
          alpha(g[3], 0.42),
          alpha(g[3], 0.78),  // BR corner
        ]}
        locations={[0, 0.12, 0.34, 0.5, 0.66, 0.88, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      />
      {/* SECONDARY diagonal (top-right → bottom-left) at lower intensity. */}
      <LinearGradient
        colors={[
          alpha(g[1], 0.5),
          alpha(g[1], 0.2),
          'transparent',
          alpha(g[2], 0.2),
          alpha(g[2], 0.5),
        ]}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      />

      {/* ── "TAP TO OPEN MAP" label stacked ABOVE a centred pin.
           Nudged above the vertical middle per request. ── */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '40%',
          alignItems: 'center',
          transform: [{ translateY: -28 }],
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: 'rgba(0,0,0,0.6)',
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: '800',
              letterSpacing: 1.2,
            }}
          >
            TAP TO OPEN MAP
          </Text>
        </View>
        <MapPin size={30} color="#EF4444" fill="#EF4444" strokeWidth={2} />
      </View>

      {/* ── Content layer ── */}
      <View
        style={{
          flex: 1,
          paddingTop: 18,
          paddingHorizontal: 18,
          paddingBottom: 40, // reserves space at the bottom for the pagination dots
          justifyContent: 'space-between',
        }}
      >
        {/* Top section: LIVE pill + timestamp, then title immediately below */}
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.35)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.4)',
              }}
            >
              <LivePulse size={6} color="#FFFFFF" />
              <Text
                style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 }}
              >
                LIVE NOW
              </Text>
            </View>
            <Text
              style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700', opacity: 0.92 }}
            >
              started {event.startedAgo}
            </Text>
          </View>

          {/* Title in the TOP-LEFT — white text with soft shadow. */}
          <Text
            style={{
              marginTop: 10,
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: '900',
              letterSpacing: -0.5,
              lineHeight: 26,
              textAlign: 'left',
              textShadowColor: 'rgba(0,0,0,0.35)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}
            numberOfLines={2}
          >
            {event.title}
          </Text>
        </View>

        {/* Bottom section: location + host/participants + Join+chat */}
        <View>
          {/* Location — plain row, white text with shadow. */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 4 }}>
            <MapPin size={12} color="#FFFFFF" />
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: '700',
                textShadowColor: 'rgba(0,0,0,0.5)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
              numberOfLines={1}
            >
              {event.location}
            </Text>
          </View>

          {/* Host row: participants first, then +N, then KAMILA rightmost
              with a crown. She's the same size and style as the others;
              the crown is the only thing marking her as host. */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            {/* +N overflow indicator — LEFTMOST of the stack */}
            {event.attendees > 4 && (
              <View
                style={{
                  width: AVATAR,
                  height: AVATAR,
                  borderRadius: AVATAR / 2,
                  borderWidth: 2.5,
                  borderColor: 'rgba(255,255,255,0.9)',
                  backgroundColor: 'rgba(0,0,0,0.55)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
                  +{event.attendees - 4}
                </Text>
              </View>
            )}

            {/* Participants — between +N and the host */}
            {event.participants.slice(0, 3).map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={{
                  width: AVATAR,
                  height: AVATAR,
                  borderRadius: AVATAR / 2,
                  borderWidth: 2.5,
                  borderColor: 'rgba(255,255,255,0.9)',
                  marginLeft: i === 0 && event.attendees <= 4 ? 0 : -10,
                }}
              />
            ))}

            {/* Host (Kamila) — RIGHTMOST end of the stack, crown marks her */}
            <View style={{ position: 'relative', marginLeft: -10, zIndex: 10, elevation: 3 }}>
              <Image
                source={{ uri: event.posterAvatar }}
                style={{
                  width: AVATAR,
                  height: AVATAR,
                  borderRadius: AVATAR / 2,
                  borderWidth: 2.5,
                  borderColor: 'rgba(255,255,255,0.9)',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -6,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: '#FFD166',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                }}
              >
                <Crown size={10} color="#262626" strokeWidth={2.6} fill="#262626" />
              </View>
            </View>

            {/* Clarifying text on the far right — white with shadow */}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: -0.1,
                  textShadowColor: 'rgba(0,0,0,0.5)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                }}
                numberOfLines={1}
              >
                {event.posterName} hosts
                {event.posterRole === 'Local' ? ' · local' : ''}
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: '600',
                  opacity: 0.92,
                  marginTop: 1,
                  textShadowColor: 'rgba(0,0,0,0.5)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                }}
                numberOfLines={1}
              >
                {event.attendees} there · {full ? 'full' : `${spotsLeft} left`}
              </Text>
            </View>
          </View>

          {/* Join + chat input */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              disabled={full}
              onPress={(e) => {
                e.stopPropagation?.();
              }}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 12,
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Text style={{ color: '#0F0F0F', fontSize: 14, fontWeight: '800' }}>
                {full ? 'Full' : 'Join'}
              </Text>
              {!full && <ArrowRight size={15} color="#0F0F0F" strokeWidth={2.6} />}
            </Pressable>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.4)',
                borderRadius: 999,
                paddingHorizontal: 12,
                height: 42,
              }}
            >
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Ask the group about this event..."
                placeholderTextColor="rgba(255,255,255,0.8)"
                style={{
                  flex: 1,
                  color: '#FFFFFF',
                  fontSize: 12.5,
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
              />
              <Pressable
                disabled={!canSend}
                onPress={(e) => {
                  e.stopPropagation?.();
                  setDraft('');
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: canSend ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send
                  size={12}
                  color={canSend ? '#0F0F0F' : 'rgba(255,255,255,0.75)'}
                  strokeWidth={2.4}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// ── Carousel with pagination dots ─────────────────
const HeroLiveCarousel: React.FC<{ events: HeroLiveEvent[] }> = ({ events }) => {
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + 16));
    if (p !== page) setPage(p);
  };

  if (events.length === 0) return null;

  return (
    <View style={{ marginBottom: 0 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 8 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {events.map((e) => (
          <HeroCard key={e.id} event={e} />
        ))}
      </ScrollView>

      {/* Pagination dots — at the BOTTOM CENTER inside the card, sitting in
          the reserved padding below the Join / chat row so the fields above
          get clear breathing space. */}
      {events.length > 1 && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 999,
              backgroundColor: 'rgba(0,0,0,0.35)',
            }}
          >
            {events.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === page ? 16 : 5,
                  height: 5,
                  borderRadius: 2.5,
                  backgroundColor: i === page ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default HeroLiveCarousel;
