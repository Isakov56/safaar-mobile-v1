import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';

// ── Types ────────────────────────────────────────────
interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string | null;
    isOnline: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

// ── Mock Data ────────────────────────────────────────
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    participant: {
      id: 'u1',
      name: 'Sabina Karimova',
      avatar: 'https://i.pravatar.cc/150?img=47',
      isOnline: true,
    },
    lastMessage: 'See you at the workshop tomorrow at 10! Bring an apron if you have one.',
    timestamp: '2m ago',
    unreadCount: 2,
  },
  {
    id: 'conv2',
    participant: {
      id: 'u2',
      name: 'Marco Rossi',
      avatar: 'https://i.pravatar.cc/150?img=15',
      isOnline: false,
    },
    lastMessage: 'The Bukhara trip was incredible. Thanks for the recommendations!',
    timestamp: '1h ago',
    unreadCount: 0,
  },
  {
    id: 'conv3',
    participant: {
      id: 'u3',
      name: 'Aisha Chen',
      avatar: 'https://i.pravatar.cc/150?img=32',
      isOnline: true,
    },
    lastMessage: 'Want to join us for the photography walk this weekend?',
    timestamp: '3h ago',
    unreadCount: 1,
  },
  {
    id: 'conv4',
    participant: {
      id: 'u4',
      name: 'Dmitry Volkov',
      avatar: 'https://i.pravatar.cc/150?img=12',
      isOnline: false,
    },
    lastMessage: 'I just uploaded the photos from the event. Check them out!',
    timestamp: 'Yesterday',
    unreadCount: 0,
  },
  {
    id: 'conv5',
    participant: {
      id: 'u5',
      name: 'Nilufar Akhmedova',
      avatar: 'https://i.pravatar.cc/150?img=25',
      isOnline: true,
    },
    lastMessage: 'The plov recipe you asked about - here it is!',
    timestamp: 'Yesterday',
    unreadCount: 0,
  },
];

// ── Conversation Row ─────────────────────────────────
const ConversationRow: React.FC<{
  conversation: Conversation;
  onPress: (id: string) => void;
}> = ({ conversation, onPress }) => {
  const { participant, lastMessage, timestamp, unreadCount } = conversation;
  const hasUnread = unreadCount > 0;

  return (
    <Pressable
      onPress={() => onPress(conversation.id)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: pressed ? '#FFFFFF' : '#FFFFFF',
      })}
    >
      <Avatar
        uri={participant.avatar}
        size={48}
        name={participant.name}
        online={participant.isOnline}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: hasUnread
                ? 'SourceSerif4-SemiBold'
                : 'SourceSerif4-Regular',
              color: '#262626',
            }}
            numberOfLines={1}
          >
            {participant.name}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SourceSerif4-Regular',
              color: hasUnread ? '#C4993C' : '#8E8E8E',
            }}
          >
            {timestamp}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 2,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              fontFamily: 'SourceSerif4-Regular',
              color: hasUnread ? '#262626' : '#8E8E8E',
              marginRight: 8,
            }}
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
          {hasUnread && (
            <View
              style={{
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#C4993C',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: '#FFFFFF',
                }}
              >
                {unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

// ── Screen ───────────────────────────────────────────
const ConversationListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = MOCK_CONVERSATIONS.filter((c) =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConversationPress = useCallback((id: string) => {
    // Navigation to ChatDetailScreen would happen here
  }, []);

  const renderConversation = useCallback(
    ({ item }: { item: Conversation }) => (
      <ConversationRow
        conversation={item}
        onPress={handleConversationPress}
      />
    ),
    [handleConversationPress],
  );

  const renderSeparator = useCallback(
    () => (
      <View
        style={{
          height: 1,
          backgroundColor: '#FAFAFA',
          marginLeft: 76,
        }}
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: 'SourceSerif4-Bold',
            color: '#262626',
          }}
        >
          Messages
        </Text>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            height: 40,
            paddingHorizontal: 12,
          }}
        >
          <Search size={16} color="#8E8E8E" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search messages..."
            placeholderTextColor="#8E8E8E"
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 14,
              fontFamily: 'SourceSerif4-Regular',
              color: '#262626',
            }}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={14} color="#8E8E8E" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Conversations */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#3C3C3C',
              }}
            >
              No conversations yet
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8E8E8E',
                marginTop: 4,
              }}
            >
              Start chatting with hosts and travelers
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ConversationListScreen;
