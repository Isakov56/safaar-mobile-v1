import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '../../components/layout/ScreenContainer';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../theme';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrateAuth = useAuthStore((s) => s.hydrateAuth);

  // Animation values
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkScale = useRef(new Animated.Value(0.9)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(wordmarkScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Hydrate auth and navigate after delay
    const navigate = () => {
      if (isAuthenticated) {
        // Auth navigator will be replaced by Root navigator conditional rendering
        // Nothing to do — RootNavigator handles the switch
      } else {
        navigation.replace('SignIn');
      }
    };

    hydrateAuth().finally(() => {
      const timer = setTimeout(navigate, 1500);
      return () => clearTimeout(timer);
    });
  }, []);

  return (
    <ScreenContainer
      scrollable={false}
      padded={false}
      keyboardAvoiding={false}
      edges={[]}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{
          backgroundColor: colors.canvas.DEFAULT,
        }}
      >
        {/* Warm gradient overlay */}
        <View
          className="absolute inset-0"
          style={{
            backgroundColor: 'transparent',
            // Gradient from canvas to gold-soft
            // Using a simple overlay approach for cross-platform support
          }}
        >
          <View
            className="absolute inset-0"
            style={{
              backgroundColor: colors.gold.soft,
              opacity: 0.3,
            }}
          />
          <View
            className="absolute left-0 right-0 top-0"
            style={{
              height: '60%',
              backgroundColor: colors.canvas.DEFAULT,
              opacity: 0.8,
            }}
          />
        </View>

        {/* Wordmark */}
        <Animated.View
          className="items-center"
          style={{
            opacity: wordmarkOpacity,
            transform: [{ scale: wordmarkScale }],
          }}
        >
          <Text
            style={{
              fontFamily: 'SourceSerif4-ExtraBold',
              fontSize: 36,
              color: colors.ink.DEFAULT,
              letterSpacing: 6,
            }}
          >
            SAFAAR
          </Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          className="mt-md"
          style={{
            opacity: taglineOpacity,
            transform: [{ translateY: taglineTranslateY }],
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: colors.ink.soft,
              fontStyle: 'italic',
              letterSpacing: 0.3,
            }}
          >
            Not your typical tour.
          </Text>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
};

export default WelcomeScreen;
