import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Camera, BarChart3, UserPlus, Send, Plus } from 'lucide-react-native';

interface Props {
  cityName: string;
  userAvatar?: string;
  /** External signal to collapse/expand (usually driven by scroll position) */
  collapsed: boolean;
  /** Called when the user taps the collapsed pill to expand it */
  onRequestExpand: () => void;
  /** Space to leave for the bottom tab bar */
  bottomOffset: number;
}

/**
 * ComposerDock — docked at the bottom of the screen. Two visual states:
 *   - expanded (when near top of feed or user tapped to expand): full text input,
 *     icon affordances, larger send button
 *   - collapsed (while scrolling deep in the feed): slim pill with avatar +
 *     placeholder + send icon — tap to re-expand
 *
 * Animation lerps via a shared Animated.Value driven by the `collapsed` prop.
 */
const ComposerDock: React.FC<Props> = ({
  cityName,
  userAvatar = 'https://i.pravatar.cc/80?u=me',
  collapsed,
  onRequestExpand,
  bottomOffset,
}) => {
  const [draft, setDraft] = useState('');
  const anim = useRef(new Animated.Value(collapsed ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: collapsed ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // we animate layout properties (width / padding / opacity)
    }).start();
  }, [collapsed, anim]);

  const canSend = draft.trim().length > 0;

  // Animated layout values
  const cardPadY = anim.interpolate({ inputRange: [0, 1], outputRange: [12, 6] });
  const cardPadX = anim.interpolate({ inputRange: [0, 1], outputRange: [12, 12] });
  const expandedOpacity = anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0, 0] });
  const collapsedOpacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] });
  const expandedHeight = anim.interpolate({ inputRange: [0, 1], outputRange: [72, 0] });

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 8,
        right: 8,
        bottom: bottomOffset + 6,
      }}
    >
      <Pressable
        onPress={collapsed ? onRequestExpand : undefined}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          borderWidth: 1,
          borderColor: '#DBDBDB',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
            },
            android: {
              elevation: 6,
            },
          }),
        }}
      >
        <Animated.View
          style={{
            paddingVertical: cardPadY,
            paddingHorizontal: cardPadX,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Image
            source={{ uri: userAvatar }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: '#FAFAFA',
            }}
          />

          <View style={{ flex: 1, position: 'relative', minHeight: 38 }}>
            {/* EXPANDED layer: real input + icons */}
            <Animated.View
              pointerEvents={collapsed ? 'none' : 'auto'}
              style={{ opacity: expandedOpacity }}
            >
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={`Share a moment, ask, or start a poll in ${cityName}...`}
                placeholderTextColor="#8E8E8E"
                multiline
                style={{
                  fontSize: 13.5,
                  color: '#262626',
                  paddingTop: 0,
                  paddingBottom: 0,
                  minHeight: 22,
                  maxHeight: 80,
                }}
              />
              <Animated.View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  marginTop: 6,
                  height: expandedHeight.interpolate({
                    inputRange: [0, 72],
                    outputRange: [0, 18],
                  }),
                  overflow: 'hidden',
                }}
              >
                <Pressable hitSlop={6}>
                  <Camera size={14} color="#8E8E8E" strokeWidth={2} />
                </Pressable>
                <Pressable hitSlop={6}>
                  <BarChart3 size={14} color="#8E8E8E" strokeWidth={2} />
                </Pressable>
                <Pressable hitSlop={6}>
                  <UserPlus size={14} color="#8E8E8E" strokeWidth={2} />
                </Pressable>
                <Text style={{ marginLeft: 'auto', fontSize: 9.5, color: '#8E8E8E' }}>
                  photo · poll · buddy
                </Text>
              </Animated.View>
            </Animated.View>

            {/* COLLAPSED layer: static pill label */}
            <Animated.View
              pointerEvents={collapsed ? 'auto' : 'none'}
              style={{
                ...StyleSheet_absoluteFill,
                justifyContent: 'center',
                opacity: collapsedOpacity,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: '#8E8E8E',
                  fontWeight: '500',
                }}
                numberOfLines={1}
              >
                Share a moment in {cityName}...
              </Text>
            </Animated.View>
          </View>

          {/* Send/plus button: Send in expanded (active when typing), Plus in collapsed */}
          <Pressable
            disabled={!collapsed && !canSend}
            onPress={() => {
              if (collapsed) {
                onRequestExpand();
              } else {
                setDraft('');
              }
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: collapsed || canSend ? '#262626' : '#F2F2F2',
            }}
          >
            {collapsed ? (
              <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
            ) : (
              <Send
                size={14}
                color={canSend ? '#FFFFFF' : '#8E8E8E'}
                strokeWidth={2.2}
              />
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </View>
  );
};

// Inline helper to avoid importing StyleSheet just for this
const StyleSheet_absoluteFill = {
  position: 'absolute' as const,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export default ComposerDock;
