import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  ImagePlus,
  MapPin,
  X,
  ChevronRight,
} from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';

// ── Types ────────────────────────────────────────────
interface SelectedMedia {
  uri: string;
  type: 'image' | 'video';
}

// ── Mock locations ───────────────────────────────────
const POPULAR_LOCATIONS = [
  'Registan Square, Samarkand',
  'Chorsu Bazaar, Tashkent',
  'Ark Fortress, Bukhara',
  'Amir Temur Square, Tashkent',
  'Itchan Kala, Khiva',
];

// ── Screen ───────────────────────────────────────────
const CreatePostScreen: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const pickFromGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      const newMedia: SelectedMedia[] = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
      }));
      setSelectedMedia((prev) => [...prev, ...newMedia]);
    }
  }, []);

  const openCamera = useCallback(async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedMedia((prev) => [
        ...prev,
        { uri: result.assets[0].uri, type: 'image' },
      ]);
    }
  }, []);

  const removeMedia = useCallback((index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handlePost = useCallback(() => {
    if (!caption.trim() && selectedMedia.length === 0) {
      Alert.alert('Empty Post', 'Please add a caption or media to your post.');
      return;
    }
    Alert.alert('Posted!', 'Your post has been shared with the community.');
  }, [caption, selectedMedia]);

  const canPost = caption.trim().length > 0 || selectedMedia.length > 0;

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
          New Post
        </Text>
        <Pressable onPress={handlePost} disabled={!canPost} hitSlop={8}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'SourceSerif4-SemiBold',
              color: canPost ? '#C4993C' : '#8A8A8A',
            }}
          >
            Post
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Author + Caption */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
        >
          <Avatar size={40} name="You" />
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Share what you're experiencing..."
            placeholderTextColor="#8A8A8A"
            multiline
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 15,
              fontFamily: 'SourceSerif4-Regular',
              color: '#1A1A1A',
              minHeight: 80,
              textAlignVertical: 'top',
              paddingTop: 8,
            }}
          />
        </View>

        {/* Selected Media Grid */}
        {selectedMedia.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              gap: 8,
              paddingTop: 16,
            }}
          >
            {selectedMedia.map((media, index) => (
              <View key={index} style={{ position: 'relative' }}>
                <Image
                  source={{ uri: media.uri }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                  }}
                  contentFit="cover"
                />
                <Pressable
                  onPress={() => removeMedia(index)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={14} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Media Picker Grid */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingTop: 20,
            gap: 12,
          }}
        >
          <Pressable
            onPress={openCamera}
            style={{
              flex: 1,
              height: 100,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#F2EDE4',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Camera size={28} color="#C4993C" />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SourceSerif4-Regular',
                color: '#4A4A4A',
                marginTop: 6,
              }}
            >
              Camera
            </Text>
          </Pressable>
          <Pressable
            onPress={pickFromGallery}
            style={{
              flex: 1,
              height: 100,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#F2EDE4',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImagePlus size={28} color="#C4993C" />
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SourceSerif4-Regular',
                color: '#4A4A4A',
                marginTop: 6,
              }}
            >
              Gallery
            </Text>
          </Pressable>
        </View>

        {/* Location Tag */}
        <Pressable
          onPress={() => setShowLocationPicker(!showLocationPicker)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginTop: 16,
            marginHorizontal: 16,
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#F2EDE4',
          }}
        >
          <MapPin size={18} color={selectedLocation ? '#C4993C' : '#8A8A8A'} />
          <Text
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 14,
              fontFamily: 'SourceSerif4-Regular',
              color: selectedLocation ? '#1A1A1A' : '#8A8A8A',
            }}
          >
            {selectedLocation ?? 'Add location'}
          </Text>
          <ChevronRight size={16} color="#8A8A8A" />
        </Pressable>

        {/* Location Suggestions */}
        {showLocationPicker && (
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 8,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#F2EDE4',
              overflow: 'hidden',
            }}
          >
            {POPULAR_LOCATIONS.map((loc) => (
              <Pressable
                key={loc}
                onPress={() => {
                  setSelectedLocation(loc);
                  setShowLocationPicker(false);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F2EDE4',
                }}
              >
                <MapPin size={14} color="#C4993C" />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 14,
                    fontFamily: 'SourceSerif4-Regular',
                    color: '#1A1A1A',
                  }}
                >
                  {loc}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;
