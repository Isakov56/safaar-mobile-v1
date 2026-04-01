import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});

export const editProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(300, 'Bio must be 300 characters or less').optional(),
  homeCity: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

export const createPostSchema = z.object({
  content: z.string().min(1, 'Post cannot be empty').max(2000),
  images: z.array(z.string()).max(10, 'Maximum 10 images'),
  location: z.string().optional(),
});

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string(),
  time: z.string(),
  location: z.string().min(3),
  price: z.number().min(0).optional(),
  isFree: z.boolean(),
  spotsTotal: z.number().min(1).max(100),
});

export const createExperienceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.string(),
  durationMinutes: z.number().min(15).max(480),
  maxGuests: z.number().min(1).max(50),
  pricePerPerson: z.number().min(0).optional(),
  isFree: z.boolean(),
  images: z.array(z.string()).min(3, 'At least 3 photos required'),
  includes: z.array(z.string()),
  meetingAddress: z.string().min(5),
  cancellationPolicy: z.enum(['FLEXIBLE', 'MODERATE', 'STRICT']),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type EditProfileFormData = z.infer<typeof editProfileSchema>;
export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type CreateExperienceFormData = z.infer<typeof createExperienceSchema>;
