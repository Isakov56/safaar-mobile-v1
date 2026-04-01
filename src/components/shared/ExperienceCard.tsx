import React from 'react';
import { View, Text, Pressable, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Clock, Users, Star } from 'lucide-react-native';
import Badge from '../ui/Badge';

interface ExperienceHost {
  id: string;
  name: string;
  avatar?: string;
}

interface Experience {
  id: string;
  title: string;
  images: string[];
  category: string;
  pricePerPerson: number;
  isFree: boolean;
  host: ExperienceHost;
  averageRating: number;
  reviewCount: number;
  durationMinutes: number;
  spotsLeft?: number;
}

type ExperienceCardVariant = 'featured' | 'grid' | 'list';

interface ExperienceCardProps {
  experience: Experience;
  variant?: ExperienceCardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatPrice(price: number, isFree: boolean): string {
  if (isFree) return 'Free';
  return `$${price}`;
}

// ─── Featured Variant ────────────────────────────────────────

const FeaturedCard: React.FC<ExperienceCardProps> = ({
  experience,
  onPress,
  style,
  testID,
}) => {
  const { title, images, category, host, averageRating, reviewCount, pricePerPerson, isFree } =
    experience;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: '85%' as unknown as number,
          height: 200,
          borderRadius: 16,
          overflow: 'hidden',
          opacity: pressed ? 0.95 : 1,
        },
        style,
      ]}
    >
      <Image
        source={{ uri: images[0] }}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        contentFit="cover"
        transition={200}
      />

      {/* Dark gradient overlay */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65%',
          backgroundColor: 'transparent',
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.55)',
          }}
        />
      </View>

      {/* Category label */}
      <View style={{ position: 'absolute', top: 12, left: 12 }}>
        <Badge label={category} variant="gold" size="sm" />
      </View>

      {/* Bottom content */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 12,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontSize: 18,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#FFFFFF',
            marginBottom: 4,
          }}
        >
          {title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-Regular',
                color: 'rgba(255,255,255,0.8)',
                marginRight: 8,
              }}
            >
              {host.name}
            </Text>

            <Star size={12} color="#C4993C" fill="#C4993C" />
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#FFFFFF',
                marginLeft: 2,
              }}
            >
              {averageRating.toFixed(1)}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SourceSerif4-Regular',
                color: 'rgba(255,255,255,0.7)',
                marginLeft: 2,
              }}
            >
              ({reviewCount})
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#C4993C',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#FFFFFF',
              }}
            >
              {formatPrice(pricePerPerson, isFree)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// ─── Grid Variant ────────────────────────────────────────────

const GridCard: React.FC<ExperienceCardProps> = ({
  experience,
  onPress,
  style,
  testID,
}) => {
  const { title, images, category, pricePerPerson, isFree, durationMinutes, spotsLeft } =
    experience;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          overflow: 'hidden',
          opacity: pressed ? 0.95 : 1,
        },
        style,
      ]}
    >
      <Image
        source={{ uri: images[0] }}
        style={{ width: '100%', aspectRatio: 1, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        contentFit="cover"
        transition={200}
      />

      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#C4993C',
              flex: 1,
            }}
          >
            {category}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Clock size={11} color="#8A8A8A" />
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8A8A8A',
                marginLeft: 2,
              }}
            >
              {formatDuration(durationMinutes)}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={2}
          style={{
            fontSize: 15,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#1A1A1A',
            marginBottom: 8,
          }}
        >
          {title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#1A1A1A',
            }}
          >
            {formatPrice(pricePerPerson, isFree)}
            {!isFree && (
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8A8A8A',
                }}
              >
                {' /person'}
              </Text>
            )}
          </Text>

          {spotsLeft !== undefined && spotsLeft <= 5 && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Users size={11} color="#E65100" />
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: '#E65100',
                  marginLeft: 2,
                }}
              >
                {spotsLeft} left
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

// ─── List Variant ────────────────────────────────────────────

const ListCard: React.FC<ExperienceCardProps> = ({
  experience,
  onPress,
  style,
  testID,
}) => {
  const { title, host, durationMinutes, pricePerPerson, isFree, category } = experience;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 12,
          opacity: pressed ? 0.95 : 1,
        },
        style,
      ]}
    >
      {/* Left - category icon area */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: '#FAF8F4',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Text style={{ fontSize: 11, fontFamily: 'SourceSerif4-SemiBold', color: '#C4993C', textAlign: 'center' }}>
          {category.slice(0, 3).toUpperCase()}
        </Text>
      </View>

      {/* Center - info */}
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 15,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#1A1A1A',
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-Regular',
              color: '#8A8A8A',
            }}
          >
            {host.name}
          </Text>
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: '#8A8A8A',
              marginHorizontal: 6,
            }}
          />
          <Clock size={11} color="#8A8A8A" />
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-Regular',
              color: '#8A8A8A',
              marginLeft: 2,
            }}
          >
            {formatDuration(durationMinutes)}
          </Text>
        </View>
      </View>

      {/* Right - price badge */}
      <Badge
        label={formatPrice(pricePerPerson, isFree)}
        variant={isFree ? 'success' : 'gold'}
        size="sm"
      />
    </Pressable>
  );
};

// ─── Main Export ─────────────────────────────────────────────

const ExperienceCard: React.FC<ExperienceCardProps> = (props) => {
  const { variant = 'grid' } = props;

  switch (variant) {
    case 'featured':
      return <FeaturedCard {...props} />;
    case 'list':
      return <ListCard {...props} />;
    case 'grid':
    default:
      return <GridCard {...props} />;
  }
};

export default ExperienceCard;
