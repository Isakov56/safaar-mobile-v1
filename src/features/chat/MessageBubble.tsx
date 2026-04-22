import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Check, CheckCheck } from 'lucide-react-native';

// ── Types ────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
  type: 'text' | 'image';
  imageUri?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

// ── Component ────────────────────────────────────────
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine }) => {
  const isImage = message.type === 'image' && message.imageUri;

  return (
    <View
      style={{
        alignSelf: isMine ? 'flex-end' : 'flex-start',
        maxWidth: '78%',
        marginVertical: 2,
        marginHorizontal: 16,
      }}
    >
      <View
        style={{
          backgroundColor: isMine ? '#262626' : '#FAFAFA',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: isMine ? 16 : 4,
          borderBottomRightRadius: isMine ? 4 : 16,
          overflow: 'hidden',
        }}
      >
        {isImage ? (
          <Image
            source={{ uri: message.imageUri }}
            style={{
              width: 200,
              height: 150,
            }}
            contentFit="cover"
            transition={200}
          />
        ) : null}

        <View
          style={{
            paddingHorizontal: 14,
            paddingTop: isImage ? 6 : 10,
            paddingBottom: 6,
          }}
        >
          {!isImage && (
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'SourceSerif4-Regular',
                color: isMine ? '#FFFFFF' : '#262626',
                lineHeight: 20,
              }}
            >
              {message.content}
            </Text>
          )}

          {/* Timestamp + Read Receipt */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: 2,
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'SourceSerif4-Regular',
                color: isMine ? 'rgba(255,255,255,0.5)' : '#8E8E8E',
              }}
            >
              {message.createdAt}
            </Text>
            {isMine && (
              message.isRead ? (
                <CheckCheck size={12} color="#C4993C" />
              ) : (
                <Check size={12} color="rgba(255,255,255,0.5)" />
              )
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;
