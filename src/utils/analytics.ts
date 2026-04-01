// Analytics wrapper — swap implementation for Mixpanel in production

type EventProperties = Record<string, string | number | boolean | undefined>;

class Analytics {
  private enabled = !__DEV__;

  track(event: string, properties?: EventProperties): void {
    if (!this.enabled) {
      console.log('[Analytics]', event, properties);
      return;
    }
    // TODO: Mixpanel.track(event, properties);
  }

  identify(userId: string, traits?: EventProperties): void {
    if (!this.enabled) {
      console.log('[Analytics] identify', userId, traits);
      return;
    }
    // TODO: Mixpanel.identify(userId); Mixpanel.getPeople().set(traits);
  }

  screen(name: string, properties?: EventProperties): void {
    this.track(`Screen Viewed: ${name}`, properties);
  }

  reset(): void {
    if (!this.enabled) return;
    // TODO: Mixpanel.reset();
  }
}

export const analytics = new Analytics();

// Pre-defined event names for type safety
export const EVENTS = {
  // Auth
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
  SIGN_OUT: 'Sign Out',

  // Experience
  EXPERIENCE_VIEWED: 'Experience Viewed',
  EXPERIENCE_SAVED: 'Experience Saved',
  EXPERIENCE_SHARED: 'Experience Shared',
  EXPERIENCE_BOOKED: 'Experience Booked',

  // Social
  POST_CREATED: 'Post Created',
  POST_LIKED: 'Post Liked',
  COMMENT_ADDED: 'Comment Added',

  // Chat
  MESSAGE_SENT: 'Message Sent',
  CONVERSATION_STARTED: 'Conversation Started',

  // Events
  EVENT_CREATED: 'Event Created',
  EVENT_JOINED: 'Event Joined',

  // Traveler Board
  CONNECTION_SENT: 'Connection Sent',
  CONNECTION_ACCEPTED: 'Connection Accepted',

  // Mode
  MODE_SWITCHED: 'Mode Switched',
  CITY_CHANGED: 'City Changed',
} as const;
