// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: {
    page?: number;
    total?: number;
    cursor?: string;
    hasMore?: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Auth
export interface LoginRequest {
  firebase_token: string;
}

export interface RegisterRequest {
  firebase_token: string;
  name: string;
  role: 'TRAVELER' | 'HOST' | 'BOTH';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// User
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  role: 'TRAVELER' | 'HOST' | 'BOTH' | 'ADMIN';
  isVerified: boolean;
  homeCity: string | null;
  travelCity: string | null;
  travelStartDate: string | null;
  travelEndDate: string | null;
  interests: string[];
  languages: string[];
  createdAt: string;
}

export interface UserProfile extends User {
  experienceCount: number;
  averageRating: number;
  reviewCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

// Experience
export interface Experience {
  id: string;
  hostId: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  maxGuests: number;
  pricePerPerson: number | null;
  currency: string;
  isFree: boolean;
  isSignature: boolean;
  images: string[];
  includes: string[];
  meetingAddress: string | null;
  cityName: string;
  averageRating: number | null;
  reviewCount: number;
  bookingCount: number;
  host: {
    id: string;
    name: string;
    avatar: string | null;
    isVerified: boolean;
  };
}

export interface ExperienceSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  spotsTotal: number;
  spotsBooked: number;
}

// Booking
export interface Booking {
  id: string;
  experienceId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED';
  guestCount: number;
  totalAmount: number;
  serviceFee: number;
  currency: string;
  createdAt: string;
  experience: {
    id: string;
    title: string;
    images: string[];
    host: { id: string; name: string; avatar: string | null };
  };
  slot: { date: string; startTime: string; endTime: string };
}

export interface CreateBookingRequest {
  experience_id: string;
  slot_id: string;
  guest_count: number;
  payment_method_id?: string;
  promo_code?: string;
}

// Post
export interface Post {
  id: string;
  userId: string;
  content: string;
  images: string[];
  type: 'post' | 'event_announcement' | 'review' | 'story';
  location: string | null;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

// Event
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number | null;
  isFree: boolean;
  spotsTotal: number;
  spotsJoined: number;
  coverImage: string | null;
  createdAt: string;
  poster: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
  };
}

// Chat
export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ConversationParticipant {
  userId: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video';
  readBy: string[];
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'booking' | 'message' | 'event_join';
  actorId: string;
  referenceId: string;
  referenceType: string;
  isRead: boolean;
  createdAt: string;
  actor: {
    id: string;
    name: string;
    avatar: string | null;
  };
  thumbnail: string | null;
  text: string;
}

// City
export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  imageUrl: string | null;
}

export interface CityPulse {
  city: City;
  travelerCount: number;
  eventCount: number;
  freeHangoutCount: number;
  trending: Experience[];
  tonightPicks: Event[];
}

// Traveler
export interface Traveler {
  id: string;
  name: string;
  avatar: string | null;
  country: string;
  travelStartDate: string;
  travelEndDate: string;
  bio: string | null;
  interests: string[];
  isVerified: boolean;
  languages: string[];
}

// Dashboard
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  bookingsCount: number;
  bookingsChange: number;
  profileViews: number;
  profileViewsChange: number;
  newFollowers: number;
}

export interface RevenueDataPoint {
  date: string;
  amount: number;
}

// Search
export interface SearchResult {
  type: 'experience' | 'host' | 'event' | 'city';
  id: string;
  title: string;
  subtitle: string;
  image: string | null;
  rating?: number;
  price?: number;
}

// Pagination
export interface PaginatedRequest {
  cursor?: string;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  cursor: string | null;
  hasMore: boolean;
}
