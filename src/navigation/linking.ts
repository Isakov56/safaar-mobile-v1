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
          ExploreTab: {
            screens: {
              Home: 'home',
              CityPulse: 'city/:cityId',
              ExperienceDetail: 'experience/:experienceId',
              HostProfile: 'host/:userId',
              Checkout: 'checkout/:experienceId/:slotId',
              BookingConfirmation: 'booking-confirmation/:bookingId',
            },
          },
          SearchTab: {
            screens: {
              SearchHome: 'search',
              SearchResults: 'search/results',
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
          ActivityTab: {
            screens: {
              ActivityHome: 'activity',
              BookingDetail: 'booking/:bookingId',
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
