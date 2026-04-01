import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { Camera, ChevronLeft } from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Pill from '../../components/ui/Pill';

// ── Types ────────────────────────────────────────────
interface ProfileFormData {
  name: string;
  bio: string;
  homeCity: string;
  interests: string[];
  languages: string[];
}

// ── Constants ────────────────────────────────────────
const INTEREST_OPTIONS = [
  'Ceramics', 'Photography', 'Cuisine', 'Architecture',
  'Music', 'History', 'Textiles', 'Markets',
  'Nature', 'Dance', 'Adventure', 'Spirituality',
  'Art', 'Language', 'Crafts', 'Nightlife',
];

const LANGUAGE_OPTIONS = [
  'English', 'Russian', 'Uzbek', 'French',
  'Spanish', 'Mandarin', 'Arabic', 'Japanese',
  'German', 'Korean', 'Turkish', 'Hindi',
];

// ── Screen ───────────────────────────────────────────
const EditProfileScreen: React.FC = () => {
  const { control, handleSubmit, setValue, watch } = useForm<ProfileFormData>({
    defaultValues: {
      name: 'Alex Rivera',
      bio: 'Curious soul exploring the Silk Road, one chai house at a time.',
      homeCity: 'San Francisco, CA',
      interests: ['Ceramics', 'Photography', 'Cuisine'],
      languages: ['English', 'Spanish'],
    },
  });

  const watchedInterests = watch('interests');
  const watchedLanguages = watch('languages');

  const toggleInterest = (interest: string) => {
    const current = watchedInterests;
    if (current.includes(interest)) {
      setValue(
        'interests',
        current.filter((i) => i !== interest),
      );
    } else {
      setValue('interests', [...current, interest]);
    }
  };

  const toggleLanguage = (language: string) => {
    const current = watchedLanguages;
    if (current.includes(language)) {
      setValue(
        'languages',
        current.filter((l) => l !== language),
      );
    } else {
      setValue('languages', [...current, language]);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    // In production, would call API to update profile
    console.log('Profile updated:', data);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF8F4' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F2EDE4',
        }}
      >
        <Pressable hitSlop={8}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </Pressable>
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#1A1A1A',
          }}
        >
          Edit Profile
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar with Camera Overlay */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Pressable style={{ position: 'relative' }}>
            <Avatar
              uri="https://i.pravatar.cc/150?img=68"
              size={80}
              name="Alex Rivera"
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#C4993C',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#FFFFFF',
              }}
            >
              <Camera size={14} color="#FFFFFF" />
            </View>
          </Pressable>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-Regular',
              color: '#C4993C',
              marginTop: 8,
            }}
          >
            Change Photo
          </Text>
        </View>

        {/* Name */}
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="Name"
              value={value}
              onChangeText={onChange}
              error={error?.message}
              containerStyle={{ marginBottom: 16 }}
            />
          )}
        />

        {/* Bio */}
        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Bio"
              value={value}
              onChangeText={onChange}
              multiline
              maxLength={160}
              containerStyle={{ marginBottom: 16 }}
            />
          )}
        />

        {/* Home City */}
        <Controller
          control={control}
          name="homeCity"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Home City"
              value={value}
              onChangeText={onChange}
              containerStyle={{ marginBottom: 24 }}
            />
          )}
        />

        {/* Interests */}
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#1A1A1A',
            marginBottom: 10,
          }}
        >
          Interests
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 24,
          }}
        >
          {INTEREST_OPTIONS.map((interest) => (
            <Pill
              key={interest}
              label={interest}
              selected={watchedInterests.includes(interest)}
              onPress={() => toggleInterest(interest)}
            />
          ))}
        </View>

        {/* Languages */}
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#1A1A1A',
            marginBottom: 10,
          }}
        >
          Languages
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 32,
          }}
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <Pill
              key={lang}
              label={lang}
              selected={watchedLanguages.includes(lang)}
              onPress={() => toggleLanguage(lang)}
            />
          ))}
        </View>

        {/* Save */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
