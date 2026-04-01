import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Pressable,
  Dimensions,
  type ViewStyle,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';

interface ImageGalleryProps {
  images: string[];
  height?: number;
  onPress?: (index: number) => void;
  style?: ViewStyle;
  borderRadius?: number;
  blurhash?: string;
  testID?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  height = 300,
  onPress,
  style,
  borderRadius = 0,
  blurhash,
  testID,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      setActiveIndex(index);
    },
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <Pressable
        onPress={() => onPress?.(index)}
        style={{ width: SCREEN_WIDTH, height }}
      >
        <Image
          source={{ uri: item }}
          placeholder={blurhash ? { blurhash } : undefined}
          style={{
            width: SCREEN_WIDTH,
            height,
            borderRadius,
          }}
          contentFit="cover"
          transition={200}
        />
      </Pressable>
    ),
    [height, onPress, borderRadius, blurhash],
  );

  const keyExtractor = useCallback(
    (_: string, index: number) => `gallery-image-${index}`,
    [],
  );

  if (images.length === 0) return null;

  return (
    <View testID={testID} style={[{ position: 'relative' }, style]}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
      />

      {/* Dot indicators */}
      {images.length > 1 && (
        <View
          style={{
            position: 'absolute',
            bottom: 12,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {images.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={{
                width: index === activeIndex ? 8 : 6,
                height: index === activeIndex ? 8 : 6,
                borderRadius: index === activeIndex ? 4 : 3,
                backgroundColor: index === activeIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                marginHorizontal: 3,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ImageGallery;
