import React, { useCallback } from 'react';
import { View, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  Compass,
  Search,
  PlusCircle,
  Bell,
  User,
  type LucideIcon,
} from 'lucide-react-native';

import type {
  MainTabParamList,
  ExploreStackParamList,
  SearchStackParamList,
  CreateStackParamList,
  ActivityStackParamList,
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

import ProfileHomeScreen from '../features/profile/MyProfileScreen';
import EditProfileScreen from '../features/profile/EditProfileScreen';
import SettingsScreen from '../features/profile/SettingsScreen';
import HostDashboardScreen from '../features/dashboard/DashboardScreen';

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

// ──────────────────────────────────────────────
// Tab Stack Navigators
// ──────────────────────────────────────────────

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: '#FAF8F4' },
} as const;

// Explore
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();
const ExploreStackNavigator: React.FC = () => (
  <ExploreStack.Navigator screenOptions={stackScreenOptions}>
    <ExploreStack.Screen name="Home" component={HomeScreen} />
    <ExploreStack.Screen name="CityPulse" component={CityPulseScreen} />
    <ExploreStack.Screen name="ExperienceDetail" component={ExperienceDetailScreen} />
    <ExploreStack.Screen name="HostProfile" component={HostProfileScreen} />
    <ExploreStack.Screen name="Checkout" component={CheckoutScreen} />
    <ExploreStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
  </ExploreStack.Navigator>
);

// Search
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const SearchStackNavigator: React.FC = () => (
  <SearchStack.Navigator screenOptions={stackScreenOptions}>
    <SearchStack.Screen name="SearchHome" component={SearchHomeScreen} />
    <SearchStack.Screen name="SearchResults" component={SearchResultsScreen} />
    <SearchStack.Screen name="CityPulse" component={CityPulseScreen} />
    <SearchStack.Screen name="ExperienceDetail" component={ExperienceDetailScreen} />
    <SearchStack.Screen name="HostProfile" component={HostProfileScreen} />
  </SearchStack.Navigator>
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

// Activity
const ActivityStack = createNativeStackNavigator<ActivityStackParamList>();
const ActivityStackNavigator: React.FC = () => (
  <ActivityStack.Navigator screenOptions={stackScreenOptions}>
    <ActivityStack.Screen name="ActivityHome" component={ActivityHomeScreen} />
    <ActivityStack.Screen name="BookingDetail" component={BookingDetailScreen} />
    <ActivityStack.Screen name="ChatThread" component={ChatThreadScreen} />
  </ActivityStack.Navigator>
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
  </ProfileStack.Navigator>
);

// ──────────────────────────────────────────────
// Tab Icon Component
// ──────────────────────────────────────────────

interface TabIconProps {
  Icon: LucideIcon;
  focused: boolean;
  label: string;
  size?: number;
  badge?: number;
}

const TabIcon: React.FC<TabIconProps> = ({ Icon, focused, label, size = 24, badge }) => {
  const iconColor = focused ? colors.gold.DEFAULT : colors.ink.muted;

  return (
    <View className="items-center justify-center" style={{ minWidth: 48 }}>
      <View className="relative">
        <Icon size={size} color={iconColor} strokeWidth={focused ? 2.2 : 1.8} />
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
      {focused && (
        <Text
          style={{
            fontSize: 10,
            fontFamily: 'SourceSerif4-SemiBold',
            color: colors.gold.DEFAULT,
            marginTop: 2,
          }}
        >
          {label}
        </Text>
      )}
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
        name="ExploreTab"
        component={ExploreStackNavigator}
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Compass} focused={focused} label="Explore" />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Search} focused={focused} label="Search" />
          ),
        }}
      />
      <Tab.Screen
        name="CreateTab"
        component={CreateStackNavigator}
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={PlusCircle} focused={focused} label="Create" size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="ActivityTab"
        component={ActivityStackNavigator}
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              Icon={Bell}
              focused={focused}
              label="Activity"
              badge={unreadNotifications}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={User} focused={focused} label="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
