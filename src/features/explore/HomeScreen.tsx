import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
  findNodeHandle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Search, ChevronDown, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';

import GoDeepContent from './GoDeepContent';
import HaveFunContent from './HaveFunContent';
import CitySelector from './CitySelector';
import ComposerFab from './ComposerFab';

// ── Mode Toggle ────────────────────────────────────────
// Two home segments per product spec:
//   liveNow  — fun, social, what's happening right now (HaveFunContent)
//   doSafaar — travel: experiences, top hosts, food, locals (GoDeepContent)
type Mode = 'liveNow' | 'doSafaar';

const TABS: { id: Mode; label: string }[] = [
  { id: 'liveNow', label: 'Live Now' },
  { id: 'doSafaar', label: 'Do Safaar' },
];

// Full-width segmented switch: white thumb slides under selected label.
const ModeToggle: React.FC<{ mode: Mode; onToggle: (m: Mode) => void }> = ({
  mode,
  onToggle,
}) => (
  <View
    style={{
      flexDirection: 'row',
      marginHorizontal: 16,
      marginTop: 4,
      marginBottom: 12,
      backgroundColor: '#FAFAFA',
      borderRadius: 10,
      padding: 3,
      borderWidth: 1,
      borderColor: '#DBDBDB',
    }}
  >
    {TABS.map((t) => {
      const selected = mode === t.id;
      return (
        <Pressable
          key={t.id}
          onPress={() => onToggle(t.id)}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 9,
            borderRadius: 8,
            backgroundColor: selected ? '#FFFFFF' : 'transparent',
            ...(selected
              ? {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.08,
                  shadowRadius: 2,
                  elevation: 1,
                }
              : {}),
          }}
        >
          <Text
            style={{
              fontWeight: selected ? '700' : '500',
              fontSize: 14,
              color: selected ? '#262626' : '#8E8E8E',
              letterSpacing: -0.1,
            }}
          >
            {t.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

// ── Home Screen ────────────────────────────────────────
const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const listRef = useRef<FlatList>(null);
  // Unread notification count — mock for now; wire to backend later.
  const unreadNotifications = 3;
  const [mode, setMode] = useState<Mode>('liveNow');
  const [refreshing, setRefreshing] = useState(false);
  const [citySelectorVisible, setCitySelectorVisible] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState('tashkent');
  const [cityName, setCityName] = useState('Tashkent');
  const [composerFlashTrigger, setComposerFlashTrigger] = useState(0);

  // Composer is placed mid-feed (inside ConversationsSection). We keep a
  // ref on the Composer wrapper and measure it against the FlatList's
  // scroll node AT LAYOUT TIME (while it's freshly mounted and visible),
  // caching the result. On FAB press we use the cached Y — so even if the
  // composer is later clipped out of the native tree by the virtualized
  // list, the FAB still scrolls to the right place on the first tap.
  const composerWrapRef = useRef<View>(null);
  const composerContentY = useRef(0);
  const composerHeightRef = useRef(110);
  const scrollY = useRef(0);
  const listViewportH = useRef(0); // visible height of the FlatList area

  const HEADER_HEIGHT = 52;

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleSelectCity = useCallback((id: string, name: string) => {
    setSelectedCityId(id);
    setCityName(name);
    setCitySelectorVisible(false);
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.current = e.nativeEvent.contentOffset.y;
    },
    [],
  );

  // Called when the Composer wrapper's onLayout fires inside
  // ConversationsSection (on mount, and again if its frame changes e.g.
  // because content above it grew). We measure against the FlatList's
  // scroll node while the composer's native view is guaranteed fresh,
  // caching the Y for later FAB presses.
  const cacheComposerLayout = useCallback(() => {
    const composer = composerWrapRef.current;
    const list = listRef.current;
    if (!composer || !list) return;
    const scrollNode =
      (list as unknown as { getScrollableNode?: () => number })
        .getScrollableNode?.() ?? findNodeHandle(list as unknown as React.Component);
    if (scrollNode == null) return;
    composer.measureLayout(
      scrollNode as number,
      (_x, y, _w, h) => {
        composerContentY.current = y;
        if (h) composerHeightRef.current = h;
      },
      () => {},
    );
  }, []);

  const handleFabPress = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const composerBottom =
      composerContentY.current + composerHeightRef.current;
    const bottomMargin = 16;
    const targetY = Math.max(
      0,
      composerBottom - listViewportH.current + bottomMargin,
    );
    list.scrollToOffset({ offset: targetY, animated: true });
    setTimeout(() => setComposerFlashTrigger((c) => c + 1), 320);
  }, []);

  const DATA = [{ key: 'content' }];

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Fixed Header ── */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          paddingTop: insets.top,
          height: HEADER_HEIGHT + insets.top,
          zIndex: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            height: HEADER_HEIGHT,
          }}
        >
          {/* Left: City name + stats */}
          <Pressable
            onPress={() => setCitySelectorVisible(true)}
            style={{ flex: 1 }}
            hitSlop={8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 20,
                  color: '#262626',
                  letterSpacing: -0.3,
                }}
              >
                {cityName}
              </Text>
              <ChevronDown size={18} color="#262626" style={{ marginLeft: 4 }} />
            </View>
            <Text
              style={{
                fontSize: 11,
                color: '#8E8E8E',
                marginTop: 1,
              }}
            >
              12 events today · 38 travelers here
            </Text>
          </Pressable>

          {/* Right side — all three tappable areas are the same 44 px size
              with identical gaps, so search / bell / avatar sit on a clean
              visual grid along the top of the header. */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Pressable
              style={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hitSlop={6}
              onPress={() => {}}
            >
              <Search size={24} color="#262626" strokeWidth={2} />
            </Pressable>

            {/* Bell with unread badge. Tap → Activity screen. */}
            <Pressable
              style={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hitSlop={6}
              onPress={() => {
                try {
                  navigation.navigate('Activity');
                } catch {
                  /* nav may not be ready */
                }
              }}
            >
              <View style={{ position: 'relative' }}>
                <Bell size={24} color="#262626" strokeWidth={2} />
                {unreadNotifications > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -3,
                      right: -4,
                      minWidth: 16,
                      height: 16,
                      borderRadius: 8,
                      paddingHorizontal: 4,
                      backgroundColor: '#E53935',
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 9,
                        fontWeight: '800',
                        lineHeight: 10,
                      }}
                    >
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>

            <Pressable
              style={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hitSlop={6}
              onPress={() => {}}
            >
              <Image
                source={{ uri: 'https://i.pravatar.cc/80?u=me' }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── Scrollable Content ── */}
      <FlatList
        ref={listRef}
        data={DATA}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onLayout={(e) => {
          listViewportH.current = e.nativeEvent.layout.height;
        }}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#262626"
            colors={['#262626']}
          />
        }
        ListHeaderComponent={<ModeToggle mode={mode} onToggle={setMode} />}
        renderItem={() =>
          mode === 'liveNow' ? (
            <HaveFunContent
              cityName={cityName}
              composerWrapRef={composerWrapRef}
              onComposerLayout={cacheComposerLayout}
              composerFlashTrigger={composerFlashTrigger}
            />
          ) : (
            <GoDeepContent />
          )
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />

      {/* Floating `+` FAB — always visible on Live Now. Tap scrolls back to
          the composer so its bottom aligns with the top of the nav bar, and
          flashes the composer border to signal where to type. */}
      {mode === 'liveNow' && (
        <ComposerFab
          visible
          bottomOffset={tabBarHeight}
          onPress={handleFabPress}
        />
      )}

      {/* ── City Selector ── */}
      <CitySelector
        visible={citySelectorVisible}
        selectedCityId={selectedCityId}
        onSelectCity={handleSelectCity}
        onClose={() => setCitySelectorVisible(false)}
      />
    </View>
  );
};

export default HomeScreen;
