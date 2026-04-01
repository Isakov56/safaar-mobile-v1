import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ChevronDown } from 'lucide-react-native';

import GoDeepContent from './GoDeepContent';
import HaveFunContent from './HaveFunContent';
import CitySelector from './CitySelector';

// ── Mode Toggle ────────────────────────────────────────
type Mode = 'goDeep' | 'haveFun';

const ModeToggle: React.FC<{ mode: Mode; onToggle: (m: Mode) => void }> = ({
  mode,
  onToggle,
}) => (
  <View
    style={{
      flexDirection: 'row',
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      backgroundColor: '#F2EDE4',
      borderRadius: 12,
      padding: 4,
    }}
  >
    <Pressable
      onPress={() => onToggle('goDeep')}
      style={{
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: mode === 'goDeep' ? '#FFFFFF' : 'transparent',
        ...(mode === 'goDeep'
          ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
              elevation: 2,
            }
          : {}),
      }}
    >
      <Text
        style={{
          fontFamily: mode === 'goDeep' ? 'SourceSerif4-Bold' : 'SourceSerif4-Regular',
          fontSize: 14,
          color: mode === 'goDeep' ? '#1A1A1A' : '#8A8A8A',
        }}
      >
        Go Deep
      </Text>
    </Pressable>
    <Pressable
      onPress={() => onToggle('haveFun')}
      style={{
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: mode === 'haveFun' ? '#FFFFFF' : 'transparent',
        ...(mode === 'haveFun'
          ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
              elevation: 2,
            }
          : {}),
      }}
    >
      <Text
        style={{
          fontFamily: mode === 'haveFun' ? 'SourceSerif4-Bold' : 'SourceSerif4-Regular',
          fontSize: 14,
          color: mode === 'haveFun' ? '#1A1A1A' : '#8A8A8A',
        }}
      >
        Have Fun
      </Text>
    </Pressable>
  </View>
);

// ── Home Screen ────────────────────────────────────────
const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('goDeep');
  const [refreshing, setRefreshing] = useState(false);
  const [citySelectorVisible, setCitySelectorVisible] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState('tashkent');
  const [cityName, setCityName] = useState('Tashkent');

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

  const DATA = [{ key: 'content' }];

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF8F4' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F4" />

      {/* ── Fixed Header ── */}
      <View
        style={{
          backgroundColor: '#FAF8F4',
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
                  fontFamily: 'SourceSerif4-Bold',
                  fontSize: 20,
                  color: '#1A1A1A',
                }}
              >
                {cityName}
              </Text>
              <ChevronDown size={18} color="#1A1A1A" style={{ marginLeft: 4 }} />
            </View>
            <Text
              style={{
                fontFamily: 'SourceSerif4-Regular',
                fontSize: 11,
                color: '#8A8A8A',
                marginTop: 1,
              }}
            >
              12 events today · 38 travelers here
            </Text>
          </Pressable>

          {/* Right: Search + Avatar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable
              style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
              hitSlop={8}
              onPress={() => {}}
            >
              <Search size={22} color="#1A1A1A" />
            </Pressable>
            <Pressable onPress={() => {}}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/80?u=me' }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── Scrollable Content ── */}
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#C4993C"
            colors={['#C4993C']}
          />
        }
        ListHeaderComponent={<ModeToggle mode={mode} onToggle={setMode} />}
        renderItem={() => (
          mode === 'goDeep' ? <GoDeepContent /> : <HaveFunContent />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

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
