import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Phone,
  Video,
  Paperclip,
  Smile,
  Send,
  Mic,
} from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';
import MessageBubble, { type ChatMessage } from './MessageBubble';

// ── Mock Data ────────────────────────────────────────
const CURRENT_USER_ID = 'me';

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    content: 'Hi Sabina! I am so excited about the ceramics workshop tomorrow.',
    senderId: CURRENT_USER_ID,
    createdAt: '10:02 AM',
    isRead: true,
    type: 'text',
  },
  {
    id: 'm2',
    content: 'Hello! So glad you are joining us. It is going to be a wonderful session.',
    senderId: 'u1',
    createdAt: '10:05 AM',
    isRead: true,
    type: 'text',
  },
  {
    id: 'm3',
    content: 'Do I need to bring anything special?',
    senderId: CURRENT_USER_ID,
    createdAt: '10:06 AM',
    isRead: true,
    type: 'text',
  },
  {
    id: 'm4',
    content: 'Just yourself and comfortable clothes you do not mind getting a bit messy! I provide all the clay, glazes, and tools.',
    senderId: 'u1',
    createdAt: '10:08 AM',
    isRead: true,
    type: 'text',
  },
  {
    id: 'm5',
    content: 'Perfect! How long does the workshop usually run?',
    senderId: CURRENT_USER_ID,
    createdAt: '10:10 AM',
    isRead: true,
    type: 'text',
  },
  {
    id: 'm6',
    content: 'About 3 hours. We start with the Rishtan blue technique and then you will create your own piece.',
    senderId: 'u1',
    createdAt: '10:12 AM',
    isRead: true,
    type: 'text',
  },
  {
    id: 'm7',
    content: 'Here is a preview of what we will be making',
    senderId: 'u1',
    createdAt: '10:13 AM',
    isRead: true,
    type: 'image',
    imageUri: 'https://picsum.photos/seed/bowl/400/300',
  },
  {
    id: 'm8',
    content: 'That is beautiful! I love the blue patterns.',
    senderId: CURRENT_USER_ID,
    createdAt: '10:15 AM',
    isRead: true,
    type: 'text',
  },
  {
    id: 'm9',
    content: 'The Rishtan blue is made from natural cobalt pigment. The technique has been passed down for centuries in my family.',
    senderId: 'u1',
    createdAt: '10:17 AM',
    isRead: true,
    type: 'text',
  },
  {
    id: 'm10',
    content: 'That is incredible. I can not wait to learn about the history behind it.',
    senderId: CURRENT_USER_ID,
    createdAt: '10:18 AM',
    isRead: true,
    type: 'text',
  },
  {
    id: 'm11',
    content: 'See you at the workshop tomorrow at 10! Bring an apron if you have one.',
    senderId: 'u1',
    createdAt: '10:20 AM',
    isRead: true,
    type: 'text',
  },
  {
    id: 'm12',
    content: 'Will do! See you there.',
    senderId: CURRENT_USER_ID,
    createdAt: '10:21 AM',
    isRead: false,
    type: 'text',
  },
];

// ── Typing Indicator ─────────────────────────────────
const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, [dot1, dot2, dot3]);

  const dots = [dot1, dot2, dot3];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: '#F2EDE4',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginHorizontal: 16,
        marginVertical: 4,
        gap: 4,
      }}
    >
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#8A8A8A',
            opacity: dot.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
            transform: [
              {
                translateY: dot.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -3],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
};

// ── Date Separator ───────────────────────────────────
const DateSeparator: React.FC<{ label: string }> = ({ label }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    }}
  >
    <View style={{ flex: 1, height: 1, backgroundColor: '#F2EDE4' }} />
    <Text
      style={{
        fontSize: 11,
        fontFamily: 'SourceSerif4-Regular',
        color: '#8A8A8A',
      }}
    >
      {label}
    </Text>
    <View style={{ flex: 1, height: 1, backgroundColor: '#F2EDE4' }} />
  </View>
);

// ── Screen ───────────────────────────────────────────
const ChatDetailScreen: React.FC = () => {
  const [messages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    // In production, would send via socket.io
    setInputText('');
  }, [inputText]);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble message={item} isMine={item.senderId === CURRENT_USER_ID} />
    ),
    [],
  );

  const hasText = inputText.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF8F4' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F2EDE4',
        }}
      >
        <Pressable hitSlop={8} style={{ padding: 4 }}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </Pressable>
        <Avatar
          uri="https://i.pravatar.cc/150?img=47"
          size={32}
          name="Sabina Karimova"
          style={{ marginLeft: 6 }}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#1A1A1A',
            }}
          >
            Sabina Karimova
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SourceSerif4-Regular',
              color: '#2E7D32',
            }}
          >
            Active now
          </Text>
        </View>
        <Pressable hitSlop={8} style={{ padding: 8 }}>
          <Phone size={20} color="#1A1A1A" />
        </Pressable>
        <Pressable hitSlop={8} style={{ padding: 8 }}>
          <Video size={20} color="#1A1A1A" />
        </Pressable>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            isTyping ? <TypingIndicator /> : null
          }
          ListFooterComponent={
            <DateSeparator label="Today" />
          }
        />

        {/* Input Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F2EDE4',
          }}
        >
          <Pressable hitSlop={8} style={{ padding: 8, paddingBottom: 10 }}>
            <Paperclip size={20} color="#8A8A8A" />
          </Pressable>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
              backgroundColor: '#FAF8F4',
              borderRadius: 20,
              marginHorizontal: 6,
              paddingHorizontal: 14,
              paddingVertical: 6,
              minHeight: 40,
              maxHeight: 120,
            }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#8A8A8A"
              multiline
              style={{
                flex: 1,
                fontSize: 14,
                fontFamily: 'SourceSerif4-Regular',
                color: '#1A1A1A',
                maxHeight: 100,
                paddingVertical: 4,
              }}
            />
            <Pressable hitSlop={8} style={{ paddingBottom: 2, paddingLeft: 6 }}>
              <Smile size={18} color="#8A8A8A" />
            </Pressable>
          </View>
          <Pressable
            onPress={hasText ? handleSend : undefined}
            hitSlop={8}
            style={{ padding: 8, paddingBottom: 10 }}
          >
            {hasText ? (
              <Send size={20} color="#C4993C" />
            ) : (
              <Mic size={20} color="#8A8A8A" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;
