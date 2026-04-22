import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Calendar, Clock, User } from 'lucide-react-native';
import Button from '../../components/ui/Button';

// ── Mock Data ──────────────────────────────────────────
const MOCK_CONFIRMATION = {
  bookingId: 'BK-20260329-001',
  experienceName: 'Master the Art of Rishton Ceramics',
  date: 'Saturday, March 29, 2026',
  time: '11:00 AM',
  host: 'Rustam Usmanov',
  guests: 2,
  total: 77,
};

// ── Confetti Particle ──────────────────────────────────
const ConfettiParticle: React.FC<{
  delay: number;
  startX: number;
  color: string;
}> = ({ delay, startX, color }) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 100;
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 300,
          duration: 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: drift,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(1400),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [delay, translateY, translateX, opacity, rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${360 + Math.random() * 360}deg`],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: 80,
        width: 8,
        height: 8,
        borderRadius: 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate: spin }],
      }}
    />
  );
};

// ── Main Component ─────────────────────────────────────
const BookingConfirmationScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Checkmark animation
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      // Checkmark bounces in
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // Content fades in
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [checkScale, checkOpacity, contentOpacity, contentTranslateY]);

  // Confetti colors
  const confettiColors = ['#C4993C', '#E8D5A8', '#2E7D32', '#E3F2FD', '#FFF3E0', '#F3E5F5', '#FCE4EC'];
  const confettiParticles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 600,
    startX: Math.random() * 350 + 20,
    color: confettiColors[i % confettiColors.length],
  }));

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Confetti */}
      {confettiParticles.map((p) => (
        <ConfettiParticle
          key={p.id}
          delay={p.delay}
          startX={p.startX}
          color={p.color}
        />
      ))}

      <View
        className="flex-1 items-center justify-center px-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        {/* ── Animated Checkmark ── */}
        <Animated.View
          style={{
            transform: [{ scale: checkScale }],
            opacity: checkOpacity,
            marginBottom: 24,
          }}
        >
          <View
            className="rounded-full items-center justify-center"
            style={{
              width: 80,
              height: 80,
              backgroundColor: '#E8F5E9',
            }}
          >
            <View
              className="rounded-full items-center justify-center"
              style={{
                width: 60,
                height: 60,
                backgroundColor: '#2E7D32',
              }}
            >
              <Check size={32} color="#FFFFFF" strokeWidth={3} />
            </View>
          </View>
        </Animated.View>

        {/* ── Content ── */}
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text
            style={{
              fontFamily: 'SourceSerif4-Bold',
              fontSize: 26,
              color: '#262626',
              textAlign: 'center',
            }}
          >
            Booking Confirmed!
          </Text>
          <Text
            style={{
              fontFamily: 'SourceSerif4-Regular',
              fontSize: 14,
              color: '#8E8E8E',
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            Your amazing experience awaits
          </Text>

          {/* Booking Details Card */}
          <View
            className="bg-white rounded-2xl p-5 mt-8 w-full"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontFamily: 'SourceSerif4-SemiBold',
                fontSize: 16,
                color: '#262626',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              {MOCK_CONFIRMATION.experienceName}
            </Text>

            <View style={{ gap: 12 }}>
              <View className="flex-row items-center">
                <View
                  className="rounded-full items-center justify-center mr-3"
                  style={{ width: 32, height: 32, backgroundColor: '#FFF3E0' }}
                >
                  <Calendar size={16} color="#C4993C" />
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: '#8E8E8E', fontFamily: 'SourceSerif4-Regular' }}>
                    Date
                  </Text>
                  <Text style={{ fontSize: 14, color: '#262626', fontFamily: 'SourceSerif4-SemiBold' }}>
                    {MOCK_CONFIRMATION.date}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View
                  className="rounded-full items-center justify-center mr-3"
                  style={{ width: 32, height: 32, backgroundColor: '#E3F2FD' }}
                >
                  <Clock size={16} color="#C4993C" />
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: '#8E8E8E', fontFamily: 'SourceSerif4-Regular' }}>
                    Time
                  </Text>
                  <Text style={{ fontSize: 14, color: '#262626', fontFamily: 'SourceSerif4-SemiBold' }}>
                    {MOCK_CONFIRMATION.time}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View
                  className="rounded-full items-center justify-center mr-3"
                  style={{ width: 32, height: 32, backgroundColor: '#E8F5E9' }}
                >
                  <User size={16} color="#C4993C" />
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: '#8E8E8E', fontFamily: 'SourceSerif4-Regular' }}>
                    Host
                  </Text>
                  <Text style={{ fontSize: 14, color: '#262626', fontFamily: 'SourceSerif4-SemiBold' }}>
                    {MOCK_CONFIRMATION.host}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-4 pt-3 border-t border-canvas-deep items-center">
              <Text style={{ fontSize: 11, color: '#8E8E8E', fontFamily: 'SourceSerif4-Regular' }}>
                Booking reference
              </Text>
              <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 14, color: '#C4993C', marginTop: 2 }}>
                {MOCK_CONFIRMATION.bookingId}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="mt-8 w-full" style={{ gap: 12 }}>
            <Button variant="primary" size="lg" fullWidth pill onPress={() => {}}>
              View Booking
            </Button>
            <Button variant="outline" size="lg" fullWidth pill onPress={() => {}}>
              Back to Explore
            </Button>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default BookingConfirmationScreen;
