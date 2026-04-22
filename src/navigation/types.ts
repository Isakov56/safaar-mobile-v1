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
// Order: Home / Map / Create / Chat / Profile
// ──────────────────────────────────────────────
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  MapTab: NavigatorScreenParams<MapStackParamList>;
  CreateTab: NavigatorScreenParams<CreateStackParamList>;
  ChatTab: NavigatorScreenParams<ChatStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ──────────────────────────────────────────────
// Home Stack (Live Now + Do Safaar live inside HomeScreen)
// ──────────────────────────────────────────────
export type HomeStackParamList = {
  Home: undefined;
  CityPulse: { cityId: string };
  ExperienceDetail: { experienceId: string };
  HostProfile: { userId: string };
  Checkout: { experienceId: string; slotId: string };
  BookingConfirmation: { bookingId: string };
  Search: undefined;
  SearchResults: { query: string; category?: string };
  Activity: undefined;
  Conversation: { id: string };
  ConversationsHub: undefined;
  EventsHub: undefined;
};

// ──────────────────────────────────────────────
// Map Stack
// ──────────────────────────────────────────────
export type MapStackParamList = {
  MapHome: undefined;
  EventChat: { eventId: string };
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
// Chat Stack
// ──────────────────────────────────────────────
export type ChatStackParamList = {
  ChatHome: undefined;
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
  Activity: undefined;
};
