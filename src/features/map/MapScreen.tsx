import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Calendar, Utensils, Camera, Sparkles } from 'lucide-react-native';

const Chip: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: '#FFFFFF',
      borderRadius: 999,
      borderWidth: 1,
      borderColor: '#DBDBDB',
      marginRight: 8,
    }}
  >
    {icon}
    <Text
      style={{
        marginLeft: 6,
        fontWeight: '600',
        fontSize: 13,
        color: '#262626',
      }}
    >
      {label}
    </Text>
  </View>
);

const MapScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#DBDBDB',
        }}
      >
        <Text
          style={{
            fontWeight: '700',
            fontSize: 22,
            color: '#262626',
            letterSpacing: -0.3,
          }}
        >
          Map
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: '#8E8E8E',
            marginTop: 2,
          }}
        >
          Events, experiences and local picks near you
        </Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <Chip icon={<Calendar size={14} color="#262626" />} label="Events" />
        <Chip icon={<Sparkles size={14} color="#262626" />} label="Experiences" />
        <Chip icon={<Utensils size={14} color="#262626" />} label="Food" />
        <Chip icon={<Camera size={14} color="#262626" />} label="Photo spots" />
        <Chip icon={<MapPin size={14} color="#262626" />} label="Live now" />
      </ScrollView>

      {/* Placeholder map area */}
      <View
        style={{
          flex: 1,
          margin: 16,
          marginTop: 0,
          borderRadius: 12,
          backgroundColor: '#FAFAFA',
          borderWidth: 1,
          borderColor: '#DBDBDB',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <MapPin size={36} color="#262626" />
        <Text
          style={{
            marginTop: 12,
            fontWeight: '700',
            fontSize: 18,
            color: '#262626',
            textAlign: 'center',
            letterSpacing: -0.2,
          }}
        >
          Map coming next
        </Text>
        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            color: '#8E8E8E',
            textAlign: 'center',
            maxWidth: 280,
          }}
        >
          Pins for events and experiences with a slide-up drawer that re-centers
          the pin so it stays visible. Built with react-native-maps in phase 4.
        </Text>
      </View>
    </View>
  );
};

export default MapScreen;
