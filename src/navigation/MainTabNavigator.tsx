import React, { useCallback } from 'react';
import { View, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  Home,
  Map,
  PlusCircle,
  MessageCircle,
  User,
  type LucideIcon,
} from 'lucide-react-native';

import type {
  MainTabParamList,
  HomeStackParamList,
  MapStackParamList,
  CreateStackParamList,
  ChatStackParamList,
  ProfileStackParamList,
} from './types';

import { colors } from '../theme';
import { useSocketStore } from '../stores/socketStore';

// ── Real Screens ──────────────────────────────
import HomeScreen from '../features/explore/HomeScreen';
import CityPulseScreen from '../features/explore/CityPulseScreen';
import ExperienceDetailScreen from '../features/experiences/ExperienceDetailScreen';
import HostProfileScreen from '../features/profile/HostProfileScreen';
import CheckoutScreen from '../features/experiences/CheckoutScreen';
import BookingConfirmationScreen from '../features/experiences/BookingConfirmationScreen';

import SearchHomeScreen from '../features/search/SearchScreen';

import CreatePostScreen from '../features/social/CreatePostScreen';
import CreateEventScreen from '../features/events/CreateEventScreen';

import ActivityHomeScreen from '../features/notifications/ActivityScreen';
import ChatThreadScreen from '../features/chat/ChatDetailScreen';
import ConversationListScreen from '../features/chat/ConversationListScreen';

import ProfileHomeScreen from '../features/profile/MyProfileScreen';
import EditProfileScreen from '../features/profile/EditProfileScreen';
import SettingsScreen from '../features/profile/SettingsScreen';
import HostDashboardScreen from '../features/dashboard/DashboardScreen';

import MapScreen from '../features/map/MapScreen';
import ConversationScreen from '../features/explore/ConversationScreen';
import ConversationsHubScreen from '../features/explore/ConversationsHubScreen';
import EventsHubScreen from '../features/explore/EventsHubScreen';

// ── Placeholder for screens not yet built ─────
const PlaceholderScreen: React.FC<{ name: string }> = ({ name }) => (
  <View className="flex-1 items-center justify-center bg-canvas">
    <Text className="font-serif-semibold text-xl text-ink">{name}</Text>
  </View>
);

const SearchResultsScreen = () => <PlaceholderScreen name="Results" />;
const CreateHomeScreen = () => <PlaceholderScreen name="Create" />;
const CreateExperienceScreen = () => <PlaceholderScreen name="New Experience" />;
const CreateStoryScreen = () => <PlaceholderScreen name="New Story" />;
const BookingDetailScreen = () => <PlaceholderScreen name="Booking" />;
const BookingHistoryScreen = () => <PlaceholderScreen name="Bookings" />;
const EventChatScreen = () => <PlaceholderScreen name="Event Chat" />;

// ──────────────────────────────────────────────
// Tab Stack Navigators
// ──────────────────────────────────────────────

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: '#FFFFFF' },
} as const;

// Home (Live Now + Do Safaar live inside HomeScreen)
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator screenOptions={stackScreenOptions}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="CityPulse" component={CityPulseScreen} />
    <HomeStack.Screen name="ExperienceDetail" component={ExperienceDetailScreen} />
    <HomeStack.Screen name="HostProfile" component={HostProfileScreen} />
    <HomeStack.Screen name="Checkout" component={CheckoutScreen} />
    <HomeStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    <HomeStack.Screen name="Search" component={SearchHomeScreen} />
    <HomeStack.Screen name="SearchResults" component={SearchResultsScreen} />
    <HomeStack.Screen name="Activity" component={ActivityHomeScreen} />
    <HomeStack.Screen name="Conversation" component={ConversationScreen} />
    <HomeStack.Screen name="ConversationsHub" component={ConversationsHubScreen} />
    <HomeStack.Screen name="EventsHub" component={EventsHubScreen} />
  </HomeStack.Navigator>
);

// Map
const MapStack = createNativeStackNavigator<MapStackParamList>();
const MapStackNavigator: React.FC = () => (
  <MapStack.Navigator screenOptions={stackScreenOptions}>
    <MapStack.Screen name="MapHome" component={MapScreen} />
    <MapStack.Screen name="EventChat" component={EventChatScreen} />
  </MapStack.Navigator>
);

// Create
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const CreateStackNavigator: React.FC = () => (
  <CreateStack.Navigator screenOptions={stackScreenOptions}>
    <CreateStack.Screen name="CreateHome" component={CreateHomeScreen} />
    <CreateStack.Screen name="CreateExperience" component={CreateExperienceScreen} />
    <CreateStack.Screen name="CreateStory" component={CreateStoryScreen} />
    <CreateStack.Screen name="CreatePost" component={CreatePostScreen} />
  </CreateStack.Navigator>
);

// Chat
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const ChatStackNavigator: React.FC = () => (
  <ChatStack.Navigator screenOptions={stackScreenOptions}>
    <ChatStack.Screen name="ChatHome" component={ConversationListScreen} />
    <ChatStack.Screen name="ChatThread" component={ChatThreadScreen} />
  </ChatStack.Navigator>
);

// Profile
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const ProfileStackNavigator: React.FC = () => (
  <ProfileStack.Navigator screenOptions={stackScreenOptions}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileHomeScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="BookingHistory" component={BookingHistoryScreen} />
    <ProfileStack.Screen name="HostDashboard" component={HostDashboardScreen} />
    <ProfileStack.Screen name="HostProfile" component={HostProfileScreen} />
    <ProfileStack.Screen name="Activity" component={ActivityHomeScreen} />
  </ProfileStack.Navigator>
);

// ──────────────────────────────────────────────
// Tab Icon Component
// ──────────────────────────────────────────────

interface TabIconProps {
  Icon: LucideIcon;
  focused: boolean;
  size?: number;
  badge?: number;
}

const TabIcon: React.FC<TabIconProps> = ({ Icon, focused, size = 24, badge }) => {
  // B/W per Figma: focused = full ink, unfocused = muted gray. No label.
  const iconColor = focused ? colors.ink.DEFAULT : colors.ink.muted;

  return (
    <View className="items-center justify-center" style={{ minWidth: 48 }}>
      <View className="relative">
        <Icon size={size} color={iconColor} strokeWidth={focused ? 2.2 : 1.6} />
        {badge != null && badge > 0 && (
          <View
            className="absolute -right-1.5 -top-1 items-center justify-center rounded-full bg-hot"
            style={{ minWidth: 16, height: 16, paddingHorizontal: 4 }}
          >
            <Text className="text-center text-white" style={{ fontSize: 9, fontWeight: '700' }}>
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main Tab Navigator
// ──────────────────────────────────────────────

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const unreadNotifications = useSocketStore((s) => s.unreadNotifications);

  const handleTabPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 56 + (Platform.OS === 'ios' ? insets.bottom : 12),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapStackNavigator}
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Map} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="CreateTab"
        component={CreateStackNavigator}
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={PlusCircle} focused={focused} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatStackNavigator}
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={MessageCircle} focused={focused} badge={unreadNotifications} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
