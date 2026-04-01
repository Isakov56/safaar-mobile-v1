import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  Calendar,
  Clock,
  MapPin,
  Users,
  Minus,
  Plus,
  X,
  DollarSign,
} from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';

// ── Screen ───────────────────────────────────────────
const CreateEventScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('free');
  const [price, setPrice] = useState('');
  const [spotsLimit, setSpotsLimit] = useState(20);
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const pickCoverPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  }, []);

  const incrementSpots = useCallback(() => {
    setSpotsLimit((prev) => prev + 1);
  }, []);

  const decrementSpots = useCallback(() => {
    setSpotsLimit((prev) => Math.max(1, prev - 1));
  }, []);

  const handlePost = useCallback(() => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please add a title for your event.');
      return;
    }
    Alert.alert('Event Created!', 'Your event has been published.');
  }, [title]);

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
          borderBottomWidth: 1,
          borderBottomColor: '#F2EDE4',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Pressable hitSlop={8}>
          <X size={24} color="#1A1A1A" />
        </Pressable>
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#1A1A1A',
          }}
        >
          Create Event
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cover Photo */}
        <Pressable
          onPress={pickCoverPhoto}
          style={{
            height: 180,
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#F2EDE4',
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          {coverUri ? (
            <Image
              source={{ uri: coverUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <>
              <Camera size={32} color="#C4993C" />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#4A4A4A',
                  marginTop: 8,
                }}
              >
                Add cover photo
              </Text>
            </>
          )}
        </Pressable>

        {/* Title */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#4A4A4A',
              marginBottom: 6,
            }}
          >
            Event Title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Give your event a name"
            placeholderTextColor="#8A8A8A"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#F2EDE4',
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              fontFamily: 'SourceSerif4-Regular',
              color: '#1A1A1A',
            }}
          />
        </View>

        {/* Description */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#4A4A4A',
              marginBottom: 6,
            }}
          >
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Tell people what to expect..."
            placeholderTextColor="#8A8A8A"
            multiline
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#F2EDE4',
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              fontFamily: 'SourceSerif4-Regular',
              color: '#1A1A1A',
              minHeight: 100,
              textAlignVertical: 'top',
            }}
          />
        </View>

        {/* Date & Time Row */}
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#4A4A4A',
                marginBottom: 6,
              }}
            >
              Date
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#F2EDE4',
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Calendar size={16} color="#C4993C" />
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="Apr 15, 2026"
                placeholderTextColor="#8A8A8A"
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 14,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#1A1A1A',
                }}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#4A4A4A',
                marginBottom: 6,
              }}
            >
              Time
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#F2EDE4',
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Clock size={16} color="#C4993C" />
              <TextInput
                value={time}
                onChangeText={setTime}
                placeholder="10:00 AM"
                placeholderTextColor="#8A8A8A"
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 14,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#1A1A1A',
                }}
              />
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#4A4A4A',
              marginBottom: 6,
            }}
          >
            Location
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#F2EDE4',
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          >
            <MapPin size={16} color="#C4993C" />
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Search for a venue..."
              placeholderTextColor="#8A8A8A"
              style={{
                flex: 1,
                marginLeft: 8,
                fontSize: 14,
                fontFamily: 'SourceSerif4-Regular',
                color: '#1A1A1A',
              }}
            />
          </View>
        </View>

        {/* Pricing Toggle */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#4A4A4A',
              marginBottom: 6,
            }}
          >
            Pricing
          </Text>
          <Toggle
            options={[
              { label: 'Free', value: 'free' },
              { label: 'Paid', value: 'paid' },
            ]}
            selected={pricingType}
            onSelect={(val) => setPricingType(val as 'free' | 'paid')}
          />

          {pricingType === 'paid' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#F2EDE4',
                paddingHorizontal: 14,
                paddingVertical: 12,
                marginTop: 10,
              }}
            >
              <DollarSign size={16} color="#C4993C" />
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="#8A8A8A"
                keyboardType="decimal-pad"
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 15,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#1A1A1A',
                }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8A8A8A',
                }}
              >
                USD
              </Text>
            </View>
          )}
        </View>

        {/* Spots Limit Stepper */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#4A4A4A',
              marginBottom: 6,
            }}
          >
            Spots Limit
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#F2EDE4',
              paddingHorizontal: 14,
              paddingVertical: 8,
            }}
          >
            <Users size={16} color="#C4993C" />
            <Text
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 14,
                fontFamily: 'SourceSerif4-Regular',
                color: '#4A4A4A',
              }}
            >
              Maximum attendees
            </Text>
            <Pressable
              onPress={decrementSpots}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#F2EDE4',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Minus size={16} color="#1A1A1A" />
            </Pressable>
            <Text
              style={{
                width: 40,
                textAlign: 'center',
                fontSize: 16,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
              }}
            >
              {spotsLimit}
            </Text>
            <Pressable
              onPress={incrementSpots}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#F2EDE4',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={16} color="#1A1A1A" />
            </Pressable>
          </View>
        </View>

        {/* Post Event Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handlePost}
        >
          Post Event
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateEventScreen;
