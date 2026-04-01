import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import Avatar from '../ui/Avatar';
import StarRating from '../ui/StarRating';

interface Reviewer {
  id: string;
  name: string;
  avatar?: string;
  country?: string;
}

interface Review {
  id: string;
  reviewer: Reviewer;
  rating: number;
  text: string;
  photos?: string[];
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
  style?: ViewStyle;
  testID?: string;
}

const MAX_TEXT_LENGTH = 150;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  style,
  testID,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = review.text.length > MAX_TEXT_LENGTH;

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const displayText = shouldTruncate && !isExpanded
    ? review.text.slice(0, MAX_TEXT_LENGTH) + '...'
    : review.text;

  return (
    <View
      testID={testID}
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 16,
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Avatar uri={review.reviewer.avatar} size={36} name={review.reviewer.name} />

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#1A1A1A',
            }}
          >
            {review.reviewer.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {review.reviewer.country && (
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8A8A8A',
                  marginRight: 6,
                }}
              >
                {review.reviewer.country}
              </Text>
            )}
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'SourceSerif4-Regular',
                color: '#8A8A8A',
              }}
            >
              {formatDate(review.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Star Rating */}
      <StarRating rating={review.rating} size={14} style={{ marginBottom: 8 }} />

      {/* Review Text */}
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'SourceSerif4-Regular',
          color: '#1A1A1A',
          lineHeight: 22,
        }}
      >
        {displayText}
      </Text>

      {shouldTruncate && (
        <Pressable onPress={handleToggleExpand}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#C4993C',
              marginTop: 4,
            }}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </Text>
        </Pressable>
      )}

      {/* Photo Thumbnails */}
      {review.photos && review.photos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginTop: 12 }}
        >
          {review.photos.map((photo, index) => (
            <Image
              key={`${review.id}-photo-${index}`}
              source={{ uri: photo }}
              style={{
                width: 72,
                height: 72,
                borderRadius: 8,
              }}
              contentFit="cover"
              transition={200}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ReviewCard;
