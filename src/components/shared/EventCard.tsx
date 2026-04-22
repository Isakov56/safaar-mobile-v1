import React from 'react';
import { View, Text, Pressable, type ViewStyle } from 'react-native';
import { Calendar, Clock, MapPin, Users } from 'lucide-react-native';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface EventPoster {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  spotsTotal: number;
  spotsJoined: number;
  poster: EventPoster;
  isFree: boolean;
}

interface EventCardProps {
  event: EventData;
  onJoin?: () => void;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onJoin,
  onPress,
  style,
  testID,
}) => {
  const spotsLeft = event.spotsTotal - event.spotsJoined;
  const fillPercent = (event.spotsJoined / event.spotsTotal) * 100;

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
      {/* Poster info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Avatar uri={event.poster.avatar} size={32} name={event.poster.name} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#262626',
            }}
          >
            {event.poster.name}
          </Text>
        </View>
        {event.poster.role && (
          <Badge
            label={event.poster.role}
            variant={event.poster.role.toLowerCase() === 'local' ? 'local' : 'traveler'}
            size="sm"
          />
        )}
      </View>

      {/* Event title */}
      <Text
        numberOfLines={2}
        style={{
          fontSize: 18,
          fontFamily: 'SourceSerif4-SemiBold',
          color: '#262626',
          marginBottom: 12,
        }}
      >
        {event.title}
      </Text>

      {/* Event details */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Calendar size={14} color="#8E8E8E" />
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-Regular',
              color: '#3C3C3C',
              marginLeft: 6,
            }}
          >
            {formatDate(event.date)}
          </Text>

          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: '#8E8E8E',
              marginHorizontal: 8,
            }}
          />

          <Clock size={14} color="#8E8E8E" />
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-Regular',
              color: '#3C3C3C',
              marginLeft: 6,
            }}
          >
            {event.time}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MapPin size={14} color="#8E8E8E" />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-Regular',
              color: '#3C3C3C',
              marginLeft: 6,
              flex: 1,
            }}
          >
            {event.location}
          </Text>
        </View>
      </View>

      {/* Spots progress */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Users size={13} color="#8E8E8E" />
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8E8E8E',
                marginLeft: 4,
              }}
            >
              {event.spotsJoined}/{event.spotsTotal} joined
            </Text>
          </View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SourceSerif4-SemiBold',
              color: spotsLeft <= 3 ? '#E65100' : '#8E8E8E',
            }}
          >
            {spotsLeft} spots left
          </Text>
        </View>

        <View
          style={{
            height: 4,
            backgroundColor: '#FAFAFA',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: 4,
              width: `${Math.min(fillPercent, 100)}%` as unknown as number,
              backgroundColor: spotsLeft <= 3 ? '#E65100' : '#C4993C',
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      {/* CTA */}
      <Button
        variant={event.isFree ? 'primary' : 'outline'}
        size="sm"
        fullWidth
        pill
        onPress={onJoin}
      >
        {event.isFree ? 'Join for Free' : `Book - $${event.price}`}
      </Button>
    </Pressable>
  );
};

export default EventCard;
