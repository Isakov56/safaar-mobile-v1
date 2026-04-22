import React, { useCallback } from 'react';
import { View, Pressable, Text, type ViewStyle } from 'react-native';
import { Star } from 'lucide-react-native';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  style?: ViewStyle;
  testID?: string;
}

const TOTAL_STARS = 5;

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  count,
  size = 16,
  interactive = false,
  onRate,
  style,
  testID,
}) => {
  const handlePress = useCallback(
    (starIndex: number) => {
      if (interactive && onRate) {
        onRate(starIndex + 1);
      }
    },
    [interactive, onRate],
  );

  const renderStar = (index: number) => {
    const fillLevel = Math.min(1, Math.max(0, rating - index));

    if (fillLevel >= 0.75) {
      // Full star
      return (
        <Star
          key={index}
          size={size}
          color="#C4993C"
          fill="#C4993C"
        />
      );
    }

    if (fillLevel >= 0.25) {
      // Half star - render two overlapping stars
      return (
        <View key={index} style={{ width: size, height: size, position: 'relative' }}>
          <Star
            size={size}
            color="#D1D5DB"
            fill="#D1D5DB"
            style={{ position: 'absolute' }}
          />
          <View style={{ position: 'absolute', overflow: 'hidden', width: size / 2, height: size }}>
            <Star
              size={size}
              color="#C4993C"
              fill="#C4993C"
            />
          </View>
        </View>
      );
    }

    // Empty star
    return (
      <Star
        key={index}
        size={size}
        color="#D1D5DB"
        fill="transparent"
      />
    );
  };

  return (
    <View
      testID={testID}
      style={[{ flexDirection: 'row', alignItems: 'center' }, style]}
    >
      {Array.from({ length: TOTAL_STARS }, (_, i) =>
        interactive ? (
          <Pressable
            key={i}
            onPress={() => handlePress(i)}
            hitSlop={4}
            style={{ marginRight: 2 }}
          >
            {renderStar(i)}
          </Pressable>
        ) : (
          <View key={i} style={{ marginRight: 2 }}>
            {renderStar(i)}
          </View>
        ),
      )}

      {count !== undefined && (
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'SourceSerif4-Regular',
            color: '#8E8E8E',
            marginLeft: 4,
          }}
        >
          ({count})
        </Text>
      )}
    </View>
  );
};

export default StarRating;
