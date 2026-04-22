import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send } from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';

// ── Types ────────────────────────────────────────────
interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  text: string;
  createdAt: string;
  likes: number;
}

interface CommentSheetProps {
  postId: string;
  visible: boolean;
  onClose: () => void;
}

// ── Mock Data ────────────────────────────────────────
const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: { id: 'u1', name: 'Sabina Karimova', avatar: 'https://i.pravatar.cc/150?img=47' },
    text: 'This is absolutely gorgeous! The light in Samarkand is unmatched.',
    createdAt: '2h ago',
    likes: 12,
  },
  {
    id: 'c2',
    author: { id: 'u2', name: 'Dmitry Volkov', avatar: 'https://i.pravatar.cc/150?img=12' },
    text: 'I need to visit this place. Adding it to my list!',
    createdAt: '3h ago',
    likes: 5,
  },
  {
    id: 'c3',
    author: { id: 'u3', name: 'Aisha Chen', avatar: 'https://i.pravatar.cc/150?img=32' },
    text: 'Was there last week. The whole area is magical around sunset.',
    createdAt: '5h ago',
    likes: 8,
  },
  {
    id: 'c4',
    author: { id: 'u4', name: 'Marco Rossi', avatar: 'https://i.pravatar.cc/150?img=15' },
    text: 'Amazing capture!',
    createdAt: '6h ago',
    likes: 3,
  },
  {
    id: 'c5',
    author: { id: 'u5', name: 'Nilufar Akhmedova', avatar: 'https://i.pravatar.cc/150?img=25' },
    text: 'The tilework detail is incredible in this shot. What camera did you use?',
    createdAt: '8h ago',
    likes: 7,
  },
];

// ── Comment Row ──────────────────────────────────────
const CommentRow: React.FC<{ comment: Comment }> = ({ comment }) => (
  <View
    style={{
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 10,
    }}
  >
    <Avatar
      uri={comment.author.avatar}
      size={32}
      name={comment.author.name}
    />
    <View style={{ marginLeft: 10, flex: 1 }}>
      <Text
        style={{
          fontSize: 13,
          fontFamily: 'SourceSerif4-Regular',
          color: '#262626',
          lineHeight: 18,
        }}
      >
        <Text style={{ fontFamily: 'SourceSerif4-SemiBold' }}>
          {comment.author.name}
        </Text>{' '}
        {comment.text}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 4,
          gap: 12,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'SourceSerif4-Regular',
            color: '#8E8E8E',
          }}
        >
          {comment.createdAt}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#8E8E8E',
          }}
        >
          {comment.likes} likes
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#8E8E8E',
          }}
        >
          Reply
        </Text>
      </View>
    </View>
  </View>
);

// ── Component ────────────────────────────────────────
const CommentSheet: React.FC<CommentSheetProps> = ({
  postId,
  visible,
  onClose,
}) => {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: { id: 'me', name: 'You', avatar: null },
      text: inputText.trim(),
      createdAt: 'Just now',
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
    setInputText('');
  }, [inputText]);

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => <CommentRow comment={item} />,
    [],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      >
        {/* Handle */}
        <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 4 }}>
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#FAFAFA',
            }}
          />
        </View>

        {/* Header */}
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#FAFAFA',
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#262626',
            }}
          >
            Comments
          </Text>
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderComment}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: '#FAFAFA',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Avatar size={28} name="You" />
          <TextInput
            ref={inputRef}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Add a comment..."
            placeholderTextColor="#8E8E8E"
            style={{
              flex: 1,
              marginLeft: 10,
              marginRight: 10,
              fontSize: 14,
              fontFamily: 'SourceSerif4-Regular',
              color: '#262626',
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
            }}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim()}
            hitSlop={8}
          >
            <Send
              size={20}
              color={inputText.trim() ? '#C4993C' : '#8E8E8E'}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentSheet;
