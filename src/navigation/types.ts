import type { NavigatorScreenParams } from '@react-navigation/native';

// ──────────────────────────────────────────────
// Root Stack
// ──────────────────────────────────────────────
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Chat: undefined;
  TravelerBoard: undefined;
  StoryViewer: { storyId: string };
};

// ──────────────────────────────────────────────
// Auth Stack
// ──────────────────────────────────────────────
export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Onboarding: undefined;
};

// ──────────────────────────────────────────────
// Main Tab Navigator
// ──────────────────────────────────────────────
export type MainTabParamList = {
  ExploreTab: NavigatorScreenParams<ExploreStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  CreateTab: NavigatorScreenParams<CreateStackParamList>;
  ActivityTab: NavigatorScreenParams<ActivityStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ──────────────────────────────────────────────
// Explore Stack
// ──────────────────────────────────────────────
export type ExploreStackParamList = {
  Home: undefined;
  CityPulse: { cityId: string };
  ExperienceDetail: { experienceId: string };
  HostProfile: { userId: string };
  Checkout: { experienceId: string; slotId: string };
  BookingConfirmation: { bookingId: string };
};

// ──────────────────────────────────────────────
// Search Stack
// ──────────────────────────────────────────────
export type SearchStackParamList = {
  SearchHome: undefined;
  SearchResults: { query: string; category?: string };
  CityPulse: { cityId: string };
  ExperienceDetail: { experienceId: string };
  HostProfile: { userId: string };
};

// ──────────────────────────────────────────────
// Create Stack
// ──────────────────────────────────────────────
export type CreateStackParamList = {
  CreateHome: undefined;
  CreateExperience: undefined;
  CreateStory: undefined;
  CreatePost: undefined;
};

// ──────────────────────────────────────────────
// Activity Stack
// ──────────────────────────────────────────────
export type ActivityStackParamList = {
  ActivityHome: undefined;
  BookingDetail: { bookingId: string };
  ChatThread: { threadId: string };
};

// ──────────────────────────────────────────────
// Profile Stack
// ──────────────────────────────────────────────
export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  Settings: undefined;
  BookingHistory: undefined;
  HostDashboard: undefined;
  HostProfile: { userId: string };
};
