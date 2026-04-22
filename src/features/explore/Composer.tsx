import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, Pressable, Animated, Easing } from 'react-native';
import { Camera, BarChart3, UserPlus, Send } from 'lucide-react-native';

interface Props {
  cityName: string;
  userAvatar?: string;
  flashTrigger?: number;
}

/**
 * In-feed composer. Two rows: top is avatar + text input + send; bottom is
 * action pills (Photo / Poll / Buddy) separated by a hairline divider for
 * clear visual structure.
 */
const Composer: React.FC<Props> = ({
  cityName,
  userAvatar = 'https://i.pravatar.cc/80?u=me',
  flashTrigger = 0,
}) => {
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0;

  const flash = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (flashTrigger === 0) return;
    flash.setValue(0);
    Animated.sequence([
      Animated.timing(flash, {
        toValue: 1,
        duration: 110,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.delay(280),
      Animated.timing(flash, {
        toValue: 0,
        duration: 260,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  }, [flashTrigger, flash]);

  const borderColor = flash.interpolate({
    inputRange: [0, 1],
    outputRange: ['#DBDBDB', '#0095F6'],
  });
  const bgColor = flash.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#E8F4FE'],
  });

  return (
    <Animated.View
      style={{
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: bgColor,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor,
        padding: 14,
      }}
    >
      {/* Top row — avatar, input, send */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Image
          source={{ uri: userAvatar }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#FAFAFA',
          }}
        />
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={`Share a moment, ask, or start a poll in ${cityName}...`}
          placeholderTextColor="#8E8E8E"
          multiline
          style={{
            flex: 1,
            fontSize: 14,
            color: '#262626',
            paddingTop: 2,
            paddingBottom: 2,
            minHeight: 24,
            maxHeight: 110,
          }}
        />
        <Pressable
          disabled={!canSend}
          onPress={() => setDraft('')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: canSend ? '#262626' : '#F2F2F2',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send
            size={17}
            color={canSend ? '#FFFFFF' : '#8E8E8E'}
            strokeWidth={2.2}
          />
        </Pressable>
      </View>

      {/* Hairline divider */}
      <View
        style={{
          height: 1,
          backgroundColor: '#F0F0F0',
          marginTop: 12,
          marginBottom: 10,
        }}
      />

      {/* Action row — consistent icon+label pills */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <ActionPill icon={Camera} label="Photo" color="#262626" />
        <ActionPill icon={BarChart3} label="Poll" color="#7C3AED" />
        <ActionPill icon={UserPlus} label="Buddy" color="#10B981" />
      </View>
    </Animated.View>
  );
};

// ── Consistent, reusable action pill for Photo / Poll / Buddy ─────────
const ActionPill: React.FC<{
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  label: string;
  color: string;
}> = ({ icon: Icon, label, color }) => (
  <Pressable
    hitSlop={4}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: '#FAFAFA',
      borderWidth: 1,
      borderColor: '#EFEFEF',
    }}
  >
    <Icon size={16} color={color} strokeWidth={2.2} />
    <Text
      style={{
        fontSize: 12,
        fontWeight: '700',
        color: '#262626',
        letterSpacing: -0.1,
      }}
    >
      {label}
    </Text>
  </Pressable>
);

export default Composer;
