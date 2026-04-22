import React from 'react';
import { View, Text, Pressable, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

import { ConversationsBrowseView } from './ConversationsSection';

const ConversationsHubScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with back button */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          paddingTop: insets.top,
          borderBottomWidth: 1,
          borderBottomColor: '#EFEFEF',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 52,
            paddingHorizontal: 8,
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            hitSlop={6}
          >
            <ChevronLeft size={26} color="#262626" strokeWidth={2.2} />
          </Pressable>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: '#262626',
              letterSpacing: -0.2,
              marginLeft: 2,
            }}
          >
            Conversations
          </Text>
        </View>
      </View>

      {/* Browse content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
      >
        <ConversationsBrowseView cityName="Tashkent" />
      </ScrollView>
    </View>
  );
};

export default ConversationsHubScreen;
