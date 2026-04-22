import React from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Story = {
  id: string;
  user: string;
  avatar: string;
  watched?: boolean;
  isMine?: boolean;
  isLocal?: boolean;
  distance?: string;
};

const MOCK_STORIES: Story[] = [
  { id: 'me', user: 'Add story', avatar: 'https://i.pravatar.cc/120?u=me', isMine: true },
  { id: 's1', user: 'Kamila', avatar: 'https://i.pravatar.cc/120?u=kamila', isLocal: true, distance: '0.4km' },
  { id: 's2', user: 'Diego', avatar: 'https://i.pravatar.cc/120?u=diego', distance: '1.2km' },
  { id: 's3', user: 'Emma', avatar: 'https://i.pravatar.cc/120?u=emma', distance: '0.8km' },
  { id: 's4', user: 'Chen', avatar: 'https://i.pravatar.cc/120?u=chen', distance: '2.1km' },
  { id: 's5', user: 'Priya', avatar: 'https://i.pravatar.cc/120?u=priya', watched: true, distance: '3.5km' },
  { id: 's6', user: 'Jonas', avatar: 'https://i.pravatar.cc/120?u=jonas', watched: true, distance: '0.6km' },
  { id: 's7', user: 'Olga', avatar: 'https://i.pravatar.cc/120?u=olga', isLocal: true, distance: '1.8km' },
  { id: 's8', user: 'Ahmed', avatar: 'https://i.pravatar.cc/120?u=ahmed', watched: true, distance: '4.2km' },
];

const RING_SIZE = 70;
const AVATAR_SIZE = 60;

interface Props {
  cityName: string;
  travelersCount: number;
  localsCount: number;
}

const StoryItem: React.FC<{ story: Story; onPress: () => void }> = ({ story, onPress }) => {
  const ringStyle = story.isMine
    ? { borderColor: '#DBDBDB', borderWidth: 2, borderStyle: 'dashed' as const }
    : story.watched
      ? { borderColor: '#DBDBDB', borderWidth: 1.5 }
      : { borderColor: '#E1306C', borderWidth: 2.5 };

  return (
    <Pressable onPress={onPress} style={{ width: 78, alignItems: 'center' }}>
      <View
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: RING_SIZE / 2,
          alignItems: 'center',
          justifyContent: 'center',
          ...ringStyle,
        }}
      >
        <Image
          source={{ uri: story.avatar }}
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            backgroundColor: '#FAFAFA',
          }}
        />
        {story.isMine && (
          <View
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: '#0095F6',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#FFFFFF',
            }}
          >
            <Plus size={12} color="#FFFFFF" strokeWidth={3} />
          </View>
        )}
      </View>
      <Text
        numberOfLines={1}
        style={{
          marginTop: 6,
          maxWidth: 70,
          fontSize: 12,
          fontWeight: '500',
          color: '#262626',
        }}
      >
        {story.user}
      </Text>
    </Pressable>
  );
};

const StoriesRail: React.FC<Props> = ({ cityName, travelersCount, localsCount }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = (story: Story) => {
    if (story.isMine) return; // future: open story composer
    navigation.navigate('StoryViewer', { storyId: story.id });
  };

  return (
    <View style={{ paddingTop: 16 }}>
      {/* Subtle section label */}
      <Text
        style={{
          paddingHorizontal: 16,
          marginBottom: 10,
          fontSize: 12,
          color: '#8E8E8E',
          letterSpacing: 0.2,
        }}
      >
        People in {cityName} · {travelersCount} travelers · {localsCount} locals
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {MOCK_STORIES.map((story) => (
          <StoryItem key={story.id} story={story} onPress={() => handlePress(story)} />
        ))}
      </ScrollView>

      <View
        style={{
          height: 1,
          backgroundColor: '#DBDBDB',
          marginHorizontal: 0,
          marginTop: 16,
        }}
      />
    </View>
  );
};

export default StoriesRail;
