import React from 'react';
import { View, Text, Pressable, ScrollView, type ViewStyle } from 'react-native';
import Avatar from '../ui/Avatar';
import Pill from '../ui/Pill';
import Button from '../ui/Button';
import { UserPlus } from 'lucide-react-native';

interface Traveler {
  id: string;
  name: string;
  avatar?: string;
  country: string;
  travelDates?: string;
  bio?: string;
  interests: string[];
  isVerified?: boolean;
}

interface TravelerCardProps {
  traveler: Traveler;
  onConnect?: () => void;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

// Simple flag emoji from country code (2-letter ISO)
function countryFlag(code: string): string {
  if (code.length !== 2) return '';
  const base = 0x1f1e6;
  const c1 = code.toUpperCase().charCodeAt(0) - 65 + base;
  const c2 = code.toUpperCase().charCodeAt(1) - 65 + base;
  return String.fromCodePoint(c1) + String.fromCodePoint(c2);
}

const TravelerCard: React.FC<TravelerCardProps> = ({
  traveler,
  onConnect,
  onPress,
  style,
  testID,
}) => {
  const flag = traveler.country.length === 2
    ? countryFlag(traveler.country)
    : '';

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 16,
          opacity: pressed ? 0.95 : 1,
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Avatar
          uri={traveler.avatar}
          size={48}
          name={traveler.name}
          verified={traveler.isVerified}
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#262626',
              }}
            >
              {traveler.name}
            </Text>
            {flag !== '' && (
              <Text style={{ fontSize: 14, marginLeft: 6 }}>{flag}</Text>
            )}
          </View>

          {traveler.country.length > 2 && (
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8E8E8E',
              }}
            >
              {traveler.country}
            </Text>
          )}

          {traveler.travelDates && (
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8E8E8E',
                marginTop: 1,
              }}
            >
              {traveler.travelDates}
            </Text>
          )}
        </View>
      </View>

      {/* Bio */}
      {traveler.bio && (
        <Text
          numberOfLines={2}
          style={{
            fontSize: 13,
            fontFamily: 'SourceSerif4-Regular',
            color: '#3C3C3C',
            lineHeight: 18,
            marginBottom: 10,
          }}
        >
          {traveler.bio}
        </Text>
      )}

      {/* Interests */}
      {traveler.interests.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, marginBottom: 12 }}
        >
          {traveler.interests.map((interest) => (
            <Pill key={interest} label={interest} />
          ))}
        </ScrollView>
      )}

      {/* Connect button */}
      <Button
        variant="outline"
        size="sm"
        fullWidth
        pill
        icon={UserPlus}
        onPress={onConnect}
      >
        Connect
      </Button>
    </Pressable>
  );
};

export default TravelerCard;
