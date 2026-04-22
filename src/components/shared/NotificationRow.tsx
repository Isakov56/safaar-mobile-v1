import React from 'react';
import { View, Text, Pressable, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import Avatar from '../ui/Avatar';

interface NotificationActor {
  id: string;
  name: string;
  avatar?: string;
}

interface NotificationData {
  id: string;
  actor: NotificationActor;
  type: string;
  text: string;
  thumbnail?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationRowProps {
  notification: NotificationData;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

const NotificationRow: React.FC<NotificationRowProps> = ({
  notification,
  onPress,
  style,
  testID,
}) => {
  const { actor, text, thumbnail, isRead, createdAt } = notification;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isRead ? 'transparent' : '#FFFBF0',
          borderLeftWidth: isRead ? 0 : 3,
          borderLeftColor: isRead ? 'transparent' : '#C4993C',
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {/* Left - Avatar */}
      <Avatar uri={actor.avatar} size={40} name={actor.name} />

      {/* Center - Text */}
      <View style={{ flex: 1, marginLeft: 12, marginRight: 12 }}>
        <Text style={{ lineHeight: 18 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#262626',
            }}
          >
            {actor.name}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-Regular',
              color: '#3C3C3C',
            }}
          >
            {' '}{text}
          </Text>
        </Text>

        <Text
          style={{
            fontSize: 11,
            fontFamily: 'SourceSerif4-Regular',
            color: '#8E8E8E',
            marginTop: 2,
          }}
        >
          {formatTimeAgo(createdAt)}
        </Text>
      </View>

      {/* Right - Thumbnail */}
      {thumbnail && (
        <Image
          source={{ uri: thumbnail }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
          }}
          contentFit="cover"
          transition={200}
        />
      )}
    </Pressable>
  );
};

export default NotificationRow;
