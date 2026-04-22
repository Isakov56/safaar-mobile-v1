import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['safaar://', 'https://safaar.app'],

  config: {
    screens: {
      Auth: {
        screens: {
          Welcome: 'welcome',
          SignIn: 'sign-in',
          SignUp: 'sign-up',
          Onboarding: 'onboarding',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'home',
              CityPulse: 'city/:cityId',
              ExperienceDetail: 'experience/:experienceId',
              HostProfile: 'host/:userId',
              Checkout: 'checkout/:experienceId/:slotId',
              BookingConfirmation: 'booking-confirmation/:bookingId',
              Search: 'search',
              SearchResults: 'search/results',
              Activity: 'activity',
            },
          },
          MapTab: {
            screens: {
              MapHome: 'map',
              EventChat: 'map/event/:eventId/chat',
            },
          },
          CreateTab: {
            screens: {
              CreateHome: 'create',
              CreateExperience: 'create/experience',
              CreateStory: 'create/story',
              CreatePost: 'create/post',
            },
          },
          ChatTab: {
            screens: {
              ChatHome: 'chats',
              ChatThread: 'chat/:threadId',
            },
          },
          ProfileTab: {
            screens: {
              ProfileHome: 'profile',
              EditProfile: 'profile/edit',
              Settings: 'settings',
              BookingHistory: 'bookings',
              HostDashboard: 'host-dashboard',
            },
          },
        },
      },
      Chat: 'chat',
      TravelerBoard: 'traveler-board',
      StoryViewer: 'story/:storyId',
    },
  },
};
