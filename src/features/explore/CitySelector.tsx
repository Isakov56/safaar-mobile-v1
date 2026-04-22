import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MapPin, Search, Navigation, X } from 'lucide-react-native';

// ── Mock Cities ────────────────────────────────────────
const CITIES = [
  { id: 'tashkent', name: 'Tashkent', country: 'Uzbekistan', emoji: '\uD83C\uDFF0' },
  { id: 'bukhara', name: 'Bukhara', country: 'Uzbekistan', emoji: '\uD83D\uDD4C' },
  { id: 'samarkand', name: 'Samarkand', country: 'Uzbekistan', emoji: '\u2728' },
  { id: 'khiva', name: 'Khiva', country: 'Uzbekistan', emoji: '\uD83C\uDFDB' },
  { id: 'rishton', name: 'Rishton', country: 'Uzbekistan', emoji: '\uD83C\uDFA8' },
  { id: 'fergana', name: 'Fergana', country: 'Uzbekistan', emoji: '\uD83C\uDF3F' },
];

interface CitySelectorProps {
  visible: boolean;
  selectedCityId: string;
  onSelectCity: (cityId: string, cityName: string) => void;
  onClose: () => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  visible,
  selectedCityId,
  onSelectCity,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return CITIES;
    const q = query.toLowerCase();
    return CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
    );
  }, [query]);

  const handleDetectLocation = useCallback(() => {
    // Mock: select Tashkent
    onSelectCity('tashkent', 'Tashkent');
  }, [onSelectCity]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ maxHeight: '75%' }}
        >
          <View className="bg-canvas rounded-t-3xl" style={{ paddingBottom: 34 }}>
            {/* Handle */}
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 rounded-full bg-canvas-deep" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pb-3">
              <Text
                style={{
                  fontFamily: 'SourceSerif4-Bold',
                  fontSize: 20,
                  color: '#262626',
                }}
              >
                Choose City
              </Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <X size={22} color="#262626" />
              </Pressable>
            </View>

            {/* Search */}
            <View className="mx-4 mb-3">
              <View className="flex-row items-center bg-canvas-deep rounded-xl px-3" style={{ height: 44 }}>
                <Search size={16} color="#8E8E8E" />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search cities..."
                  placeholderTextColor="#8E8E8E"
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 15,
                    color: '#262626',
                    fontFamily: 'SourceSerif4-Regular',
                  }}
                />
              </View>
            </View>

            {/* Detect Location */}
            <Pressable
              onPress={handleDetectLocation}
              className="flex-row items-center mx-4 mb-2 p-3 rounded-xl bg-gold/10"
            >
              <View className="bg-gold rounded-full p-2 mr-3">
                <Navigation size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 14, color: '#C4993C' }}>
                  Detect my location
                </Text>
                <Text style={{ fontSize: 11, color: '#8E8E8E', fontFamily: 'SourceSerif4-Regular' }}>
                  Use GPS to find nearest city
                </Text>
              </View>
            </Pressable>

            {/* City List */}
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedCityId;
                return (
                  <Pressable
                    onPress={() => onSelectCity(item.id, item.name)}
                    className={`flex-row items-center p-3 rounded-xl mb-1 ${
                      isSelected ? 'bg-gold/10' : ''
                    }`}
                  >
                    <Text style={{ fontSize: 24, marginRight: 12 }}>{item.emoji}</Text>
                    <View className="flex-1">
                      <Text
                        style={{
                          fontFamily: 'SourceSerif4-SemiBold',
                          fontSize: 16,
                          color: isSelected ? '#C4993C' : '#262626',
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{ fontSize: 12, color: '#8E8E8E', fontFamily: 'SourceSerif4-Regular' }}
                      >
                        {item.country}
                      </Text>
                    </View>
                    {isSelected && (
                      <MapPin size={18} color="#C4993C" />
                    )}
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View className="items-center py-8">
                  <Text style={{ fontSize: 13, color: '#8E8E8E', fontFamily: 'SourceSerif4-Regular' }}>
                    No cities found
                  </Text>
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CitySelector;
