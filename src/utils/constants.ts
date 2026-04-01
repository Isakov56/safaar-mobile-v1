export const EXPERIENCE_CATEGORIES = [
  { key: 'CERAMICS', label: 'Ceramics', icon: 'Palette' },
  { key: 'TEXTILES', label: 'Textiles', icon: 'Scissors' },
  { key: 'CUISINE', label: 'Cuisine', icon: 'ChefHat' },
  { key: 'MUSIC', label: 'Music', icon: 'Music' },
  { key: 'PHOTOGRAPHY', label: 'Photography', icon: 'Camera' },
  { key: 'HISTORY', label: 'History', icon: 'Landmark' },
  { key: 'ARCHITECTURE', label: 'Architecture', icon: 'Building2' },
  { key: 'DANCE', label: 'Dance', icon: 'PersonStanding' },
  { key: 'CRAFTS', label: 'Crafts', icon: 'Hammer' },
  { key: 'MARKETS', label: 'Markets', icon: 'ShoppingBag' },
  { key: 'NATURE', label: 'Nature', icon: 'Trees' },
  { key: 'NIGHTLIFE', label: 'Nightlife', icon: 'Moon' },
  { key: 'ADVENTURE', label: 'Adventure', icon: 'Mountain' },
  { key: 'SPIRITUALITY', label: 'Spirituality', icon: 'Sparkles' },
  { key: 'LANGUAGE', label: 'Language', icon: 'Languages' },
  { key: 'ART', label: 'Art', icon: 'Brush' },
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  CERAMICS: '#FFF3E0',
  TEXTILES: '#F3E5F5',
  CUISINE: '#E8F5E9',
  MUSIC: '#E3F2FD',
  PHOTOGRAPHY: '#ECEFF1',
  HISTORY: '#FBE9E7',
  CRAFTS: '#FFF8E1',
  DANCE: '#FCE4EC',
  ARCHITECTURE: '#E8EAF6',
  MARKETS: '#FFF9C4',
  NATURE: '#E0F2F1',
  NIGHTLIFE: '#EDE7F6',
  ADVENTURE: '#FBE9E7',
  SPIRITUALITY: '#F3E5F5',
  LANGUAGE: '#E1F5FE',
  ART: '#FCE4EC',
};

export const NOTIFICATION_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'follows', label: 'Follows' },
  { key: 'likes', label: 'Likes' },
  { key: 'comments', label: 'Comments' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'messages', label: 'Messages' },
] as const;

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'uz', label: 'Uzbek' },
  { code: 'ru', label: 'Russian' },
  { code: 'tr', label: 'Turkish' },
] as const;

export const CANCELLATION_POLICIES = [
  {
    key: 'FLEXIBLE',
    label: 'Flexible',
    description: 'Free cancellation up to 24 hours before',
  },
  {
    key: 'MODERATE',
    label: 'Moderate',
    description: 'Free cancellation up to 5 days before',
  },
  {
    key: 'STRICT',
    label: 'Strict',
    description: '50% refund up to 7 days before, no refund after',
  },
] as const;
