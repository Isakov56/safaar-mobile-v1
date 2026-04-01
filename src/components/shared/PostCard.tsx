import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
} from 'lucide-react-native';
import Avatar from '../ui/Avatar';

interface PostUser {
  id: string;
  name: string;
  avatar?: string;
}

interface Post {
  id: string;
  user: PostUser;
  content: string;
  images?: string[];
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  type?: string;
  location?: string;
}

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
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
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHrs < 24) return `${diffHrs}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return `${Math.floor(diffDays / 7)}w`;
}

const MAX_CONTENT_LENGTH = 120;

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onPress,
  style,
  testID,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = post.content.length > MAX_CONTENT_LENGTH;

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const displayContent = shouldTruncate && !isExpanded
    ? post.content.slice(0, MAX_CONTENT_LENGTH) + '...'
    : post.content;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
        }}
      >
        <Avatar uri={post.user.avatar} size={36} name={post.user.name} />

        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
              }}
            >
              {post.user.name}
            </Text>
            {post.location && (
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8A8A8A',
                  marginLeft: 6,
                }}
              >
                in {post.location}
              </Text>
            )}
          </View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'SourceSerif4-Regular',
              color: '#8A8A8A',
            }}
          >
            {formatTimeAgo(post.createdAt)}
          </Text>
        </View>

        <Pressable hitSlop={8}>
          <MoreHorizontal size={20} color="#8A8A8A" />
        </Pressable>
      </View>

      {/* Image */}
      {post.images && post.images.length > 0 && (
        <Image
          source={{ uri: post.images[0] }}
          style={{ width: '100%', aspectRatio: 4 / 3 }}
          contentFit="cover"
          transition={200}
        />
      )}

      {/* Engagement row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingTop: 10,
          paddingBottom: 4,
        }}
      >
        <Pressable
          onPress={onLike}
          hitSlop={6}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
        >
          <Heart
            size={20}
            color={post.isLiked ? '#E53935' : '#4A4A4A'}
            fill={post.isLiked ? '#E53935' : 'transparent'}
          />
          {post.likesCount > 0 && (
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#4A4A4A',
                marginLeft: 4,
              }}
            >
              {post.likesCount}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={onComment}
          hitSlop={6}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}
        >
          <MessageCircle size={20} color="#4A4A4A" />
          {post.commentsCount > 0 && (
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#4A4A4A',
                marginLeft: 4,
              }}
            >
              {post.commentsCount}
            </Text>
          )}
        </Pressable>

        <View style={{ flex: 1 }} />

        <Pressable hitSlop={6} style={{ marginRight: 12 }}>
          <Bookmark size={20} color="#4A4A4A" />
        </Pressable>

        <Pressable onPress={onShare} hitSlop={6}>
          <Share2 size={20} color="#4A4A4A" />
        </Pressable>
      </View>

      {/* Caption */}
      <View style={{ paddingHorizontal: 12, paddingBottom: 12, paddingTop: 4 }}>
        <Text style={{ lineHeight: 20 }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#1A1A1A',
            }}
          >
            {post.user.name}{' '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'SourceSerif4-Regular',
              color: '#1A1A1A',
            }}
          >
            {displayContent}
          </Text>
        </Text>
        {shouldTruncate && (
          <Pressable onPress={handleToggleExpand}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8A8A8A',
                marginTop: 2,
              }}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default PostCard;
