import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Text } from 'react-native';

import type { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../theme';

// ──────────────────────────────────────────────
// Placeholder modal screens
// ──────────────────────────────────────────────

const ChatScreen: React.FC = () => (
  <View className="flex-1 items-center justify-center bg-canvas">
    <Text className="font-serif-semibold text-xl text-ink">Chat</Text>
  </View>
);

const TravelerBoardScreen: React.FC = () => (
  <View className="flex-1 items-center justify-center bg-canvas">
    <Text className="font-serif-semibold text-xl text-ink">Traveler Board</Text>
  </View>
);

const StoryViewerScreen: React.FC = () => (
  <View className="flex-1 items-center justify-center bg-ink">
    <Text className="font-serif-semibold text-xl text-white">Story Viewer</Text>
  </View>
);

// ──────────────────────────────────────────────
// Loading screen
// ──────────────────────────────────────────────

const LoadingScreen: React.FC = () => (
  <View className="flex-1 items-center justify-center bg-canvas">
    <ActivityIndicator size="large" color={colors.gold.DEFAULT} />
  </View>
);

// ──────────────────────────────────────────────
// Root Navigator
// ──────────────────────────────────────────────

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="TravelerBoard"
            component={TravelerBoardScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="StoryViewer"
            component={StoryViewerScreen}
            options={{
              presentation: 'fullScreenModal',
              animation: 'fade',
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
