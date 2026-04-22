import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { Bookmark, Heart } from 'lucide-react-native';

type Tip = {
  id: string;
  title: string;
  cover: string;
  category: string;
  author: { name: string; avatar: string };
  likes: number;
  liked?: boolean;
};

const cover = (seed: string) => `https://picsum.photos/seed/${seed}/800/520`;

const MOCK_TIPS: Tip[] = [
  {
    id: 't1',
    title: 'Hidden teahouse locals actually go to',
    cover: cover('teahouse'),
    category: 'FOOD',
    author: { name: 'Aziza', avatar: 'https://i.pravatar.cc/80?u=aziza' },
    likes: 142,
  },
  {
    id: 't2',
    title: 'Chorsu at sunrise — no tourists, best samsa',
    cover: cover('chorsu-sunrise'),
    category: 'BAZAAR',
    author: { name: 'Timur', avatar: 'https://i.pravatar.cc/80?u=timur' },
    likes: 98,
    liked: true,
  },
  {
    id: 't3',
    title: 'The rooftop nobody on Tripadvisor knows',
    cover: cover('rooftop-secret'),
    category: 'VIEW',
    author: { name: 'Nargiza', avatar: 'https://i.pravatar.cc/80?u=nargiza' },
    likes: 211,
  },
  {
    id: 't4',
    title: 'Saturday morning bookshop crawl, Mirzo Ulugbek',
    cover: cover('bookshop'),
    category: 'CULTURE',
    author: { name: 'Bobur', avatar: 'https://i.pravatar.cc/80?u=bobur' },
    likes: 64,
  },
];

const TipCard: React.FC<{ t: Tip }> = ({ t }) => (
  <Pressable
    style={{
      width: 200,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#DBDBDB',
      backgroundColor: '#FFFFFF',
    }}
  >
    <ImageBackground
      source={{ uri: t.cover }}
      style={{ width: '100%', height: 130, justifyContent: 'space-between' }}
    >
      {/* Category badge */}
      <View
        style={{
          alignSelf: 'flex-start',
          margin: 8,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 4,
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      >
        <Text
          style={{
            fontSize: 9,
            fontWeight: '800',
            color: '#FFFFFF',
            letterSpacing: 0.8,
          }}
        >
          {t.category}
        </Text>
      </View>
      {/* Bookmark */}
      <Pressable
        hitSlop={6}
        style={{
          alignSelf: 'flex-end',
          margin: 8,
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: 'rgba(0,0,0,0.6)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Bookmark size={13} color="#FFFFFF" strokeWidth={2} />
      </Pressable>
    </ImageBackground>

    <View style={{ padding: 10 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          color: '#262626',
          letterSpacing: -0.2,
          lineHeight: 17,
        }}
        numberOfLines={2}
      >
        {t.title}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 }}>
          <Image
            source={{ uri: t.author.avatar }}
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: '#FAFAFA',
            }}
          />
          <Text
            style={{ fontSize: 11, color: '#262626', fontWeight: '500' }}
            numberOfLines={1}
          >
            {t.author.name}
          </Text>
          <View
            style={{
              paddingHorizontal: 4,
              paddingVertical: 1,
              borderRadius: 3,
              backgroundColor: '#262626',
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: 0.3,
              }}
            >
              LOCAL
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Heart
            size={12}
            color={t.liked ? '#FF3B30' : '#262626'}
            fill={t.liked ? '#FF3B30' : 'none'}
            strokeWidth={2}
          />
          <Text style={{ fontSize: 11, color: '#262626', fontWeight: '500' }}>
            {t.likes}
          </Text>
        </View>
      </View>
    </View>
  </Pressable>
);

const LocalTipsRail: React.FC<{ cityName: string }> = ({ cityName }) => (
  <View>
    <Text
      style={{
        paddingHorizontal: 16,
        marginTop: 28,
        marginBottom: 12,
        fontSize: 11,
        fontWeight: '700',
        color: '#8E8E8E',
        letterSpacing: 1.4,
      }}
    >
      LOCALS' PICKS · {cityName.toUpperCase()}
    </Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
    >
      {MOCK_TIPS.map((t) => (
        <TipCard key={t.id} t={t} />
      ))}
    </ScrollView>
  </View>
);

export default LocalTipsRail;
