import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Minus,
  Plus,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Tag,
  Shield,
} from 'lucide-react-native';
import Button from '../../components/ui/Button';

// ── Mock Data ──────────────────────────────────────────
const MOCK_BOOKING = {
  experience: {
    id: 'exp-1',
    title: 'Master the Art of Rishton Ceramics',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
    host: 'Rustam Usmanov',
    date: 'Saturday, March 29',
    time: '11:00 AM',
    pricePerPerson: 35,
  },
};

// ── Component ──────────────────────────────────────────
const CheckoutScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [guests, setGuests] = useState(2);
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const experienceFee = MOCK_BOOKING.experience.pricePerPerson * guests;
  const serviceFee = Math.round(experienceFee * 0.1);
  const discount = promoApplied ? Math.round(experienceFee * 0.15) : 0;
  const total = experienceFee + serviceFee - discount;

  const decrementGuests = useCallback(() => {
    setGuests((prev) => Math.max(1, prev - 1));
  }, []);

  const incrementGuests = useCallback(() => {
    setGuests((prev) => Math.min(10, prev + 1));
  }, []);

  const applyPromo = useCallback(() => {
    if (promoCode.trim().toUpperCase() === 'SAFAAR15') {
      setPromoApplied(true);
    }
  }, [promoCode]);

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ── */}
      <View
        className="bg-canvas flex-row items-center px-4 border-b border-canvas-deep"
        style={{ paddingTop: insets.top, height: 52 + insets.top }}
      >
        <Pressable onPress={() => {}} hitSlop={12} style={{ marginRight: 16 }}>
          <ArrowLeft size={22} color="#262626" />
        </Pressable>
        <Text
          style={{
            fontFamily: 'SourceSerif4-Bold',
            fontSize: 18,
            color: '#262626',
          }}
        >
          Book Experience
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Experience Summary Card ── */}
        <View className="bg-white rounded-2xl mx-4 mt-4 flex-row overflow-hidden">
          <Image
            source={{ uri: MOCK_BOOKING.experience.image }}
            style={{ width: 90, height: 90 }}
          />
          <View className="flex-1 p-3 justify-center">
            <Text
              style={{
                fontFamily: 'SourceSerif4-SemiBold',
                fontSize: 14,
                color: '#262626',
              }}
              numberOfLines={2}
            >
              {MOCK_BOOKING.experience.title}
            </Text>
            <Text
              style={{ fontSize: 12, color: '#8E8E8E', fontFamily: 'SourceSerif4-Regular', marginTop: 2 }}
            >
              with {MOCK_BOOKING.experience.host}
            </Text>
            <Text
              style={{ fontSize: 12, color: '#C4993C', fontFamily: 'SourceSerif4-SemiBold', marginTop: 2 }}
            >
              {MOCK_BOOKING.experience.date} at {MOCK_BOOKING.experience.time}
            </Text>
          </View>
        </View>

        {/* ── Guest Count ── */}
        <View className="bg-white rounded-2xl mx-4 mt-4 p-4">
          <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 16, color: '#262626', marginBottom: 12 }}>
            Guests
          </Text>
          <View className="flex-row items-center justify-between">
            <Text style={{ fontSize: 14, color: '#3C3C3C', fontFamily: 'SourceSerif4-Regular' }}>
              Number of guests
            </Text>
            <View className="flex-row items-center" style={{ gap: 16 }}>
              <Pressable
                onPress={decrementGuests}
                className={`rounded-full items-center justify-center border ${
                  guests <= 1 ? 'border-canvas-deep' : 'border-ink'
                }`}
                style={{ width: 36, height: 36 }}
                disabled={guests <= 1}
              >
                <Minus size={16} color={guests <= 1 ? '#8E8E8E' : '#262626'} />
              </Pressable>
              <Text
                style={{
                  fontFamily: 'SourceSerif4-Bold',
                  fontSize: 18,
                  color: '#262626',
                  minWidth: 24,
                  textAlign: 'center',
                }}
              >
                {guests}
              </Text>
              <Pressable
                onPress={incrementGuests}
                className={`rounded-full items-center justify-center border ${
                  guests >= 10 ? 'border-canvas-deep' : 'border-ink'
                }`}
                style={{ width: 36, height: 36 }}
                disabled={guests >= 10}
              >
                <Plus size={16} color={guests >= 10 ? '#8E8E8E' : '#262626'} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* ── Payment Method ── */}
        <View className="bg-white rounded-2xl mx-4 mt-4 p-4">
          <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 16, color: '#262626', marginBottom: 12 }}>
            Payment Method
          </Text>
          <Pressable className="flex-row items-center justify-between p-3 bg-canvas-deep rounded-xl">
            <View className="flex-row items-center">
              <CreditCard size={20} color="#262626" />
              <Text
                style={{
                  fontFamily: 'SourceSerif4-Regular',
                  fontSize: 14,
                  color: '#262626',
                  marginLeft: 12,
                }}
              >
                Add payment method
              </Text>
            </View>
            <ChevronDown size={16} color="#8E8E8E" />
          </Pressable>
          <View className="flex-row items-center mt-3">
            <Shield size={14} color="#8E8E8E" />
            <Text style={{ fontSize: 11, color: '#8E8E8E', fontFamily: 'SourceSerif4-Regular', marginLeft: 6 }}>
              Payments are securely processed via Stripe
            </Text>
          </View>
        </View>

        {/* ── Promo Code ── */}
        <View className="bg-white rounded-2xl mx-4 mt-4 p-4">
          <Pressable
            onPress={() => setPromoExpanded((v) => !v)}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Tag size={18} color="#C4993C" />
              <Text
                style={{
                  fontFamily: 'SourceSerif4-SemiBold',
                  fontSize: 14,
                  color: '#262626',
                  marginLeft: 10,
                }}
              >
                Promo Code
              </Text>
            </View>
            {promoExpanded ? (
              <ChevronUp size={16} color="#8E8E8E" />
            ) : (
              <ChevronDown size={16} color="#8E8E8E" />
            )}
          </Pressable>
          {promoExpanded && (
            <View className="flex-row mt-3" style={{ gap: 8 }}>
              <View className="flex-1 bg-canvas-deep rounded-xl px-3" style={{ height: 44, justifyContent: 'center' }}>
                <TextInput
                  value={promoCode}
                  onChangeText={setPromoCode}
                  placeholder="Enter code"
                  placeholderTextColor="#8E8E8E"
                  autoCapitalize="characters"
                  style={{
                    fontSize: 14,
                    color: '#262626',
                    fontFamily: 'SourceSerif4-Regular',
                  }}
                />
              </View>
              <Button
                variant={promoApplied ? 'secondary' : 'primary'}
                size="sm"
                onPress={applyPromo}
                disabled={promoApplied}
              >
                {promoApplied ? 'Applied' : 'Apply'}
              </Button>
            </View>
          )}
          {promoApplied && (
            <Text style={{ fontSize: 12, color: '#2E7D32', fontFamily: 'SourceSerif4-SemiBold', marginTop: 8 }}>
              SAFAAR15 applied - 15% off!
            </Text>
          )}
        </View>

        {/* ── Price Breakdown ── */}
        <View className="bg-white rounded-2xl mx-4 mt-4 p-4">
          <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 16, color: '#262626', marginBottom: 12 }}>
            Price Breakdown
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text style={{ fontSize: 14, color: '#3C3C3C', fontFamily: 'SourceSerif4-Regular' }}>
              ${MOCK_BOOKING.experience.pricePerPerson} x {guests} guest{guests > 1 ? 's' : ''}
            </Text>
            <Text style={{ fontSize: 14, color: '#262626', fontFamily: 'SourceSerif4-SemiBold' }}>
              ${experienceFee}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <Text style={{ fontSize: 14, color: '#3C3C3C', fontFamily: 'SourceSerif4-Regular' }}>
              Service fee
            </Text>
            <Text style={{ fontSize: 14, color: '#262626', fontFamily: 'SourceSerif4-SemiBold' }}>
              ${serviceFee}
            </Text>
          </View>
          {promoApplied && (
            <View className="flex-row items-center justify-between mb-2">
              <Text style={{ fontSize: 14, color: '#2E7D32', fontFamily: 'SourceSerif4-Regular' }}>
                Promo discount
              </Text>
              <Text style={{ fontSize: 14, color: '#2E7D32', fontFamily: 'SourceSerif4-SemiBold' }}>
                -${discount}
              </Text>
            </View>
          )}
          <View className="border-t border-canvas-deep mt-2 pt-3 flex-row items-center justify-between">
            <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 16, color: '#262626' }}>
              Total
            </Text>
            <Text style={{ fontFamily: 'SourceSerif4-Bold', fontSize: 18, color: '#262626' }}>
              ${total}
            </Text>
          </View>
        </View>

        {/* ── Cancellation Policy ── */}
        <View className="mx-4 mt-4 p-4 bg-canvas-deep rounded-2xl">
          <Text style={{ fontFamily: 'SourceSerif4-SemiBold', fontSize: 13, color: '#262626', marginBottom: 4 }}>
            Cancellation Policy
          </Text>
          <Text style={{ fontSize: 12, color: '#8E8E8E', fontFamily: 'SourceSerif4-Regular', lineHeight: 18 }}>
            Free cancellation up to 24 hours before the experience. After that, a 50% cancellation fee
            applies. No refund for no-shows. Contact support for special circumstances.
          </Text>
        </View>
      </ScrollView>

      {/* ── Fixed Bottom CTA ── */}
      <View
        className="bg-white border-t border-canvas-deep px-4"
        style={{
          paddingBottom: insets.bottom + 8,
          paddingTop: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Button variant="primary" size="lg" fullWidth pill onPress={() => {}}>
          {`Place Order \u00B7 $${total}`}
        </Button>
      </View>
    </View>
  );
};

export default CheckoutScreen;
