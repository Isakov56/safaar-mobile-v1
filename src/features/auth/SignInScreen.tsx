import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '../../components/layout/ScreenContainer';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../theme';
import type { AuthStackParamList } from '../../navigation/types';

// ──────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const signIn = useAuthStore((s) => s.signIn);
  const isLoading = useAuthStore((s) => s.isLoading);
  const authError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(
    async (data: SignInFormData) => {
      clearError();
      try {
        await signIn(data.email, data.password);
        // RootNavigator will handle navigation to Main upon isAuthenticated change
      } catch {
        // Error is set in the store
      }
    },
    [signIn, clearError],
  );

  const handleForgotPassword = useCallback(() => {
    Alert.alert('Reset Password', 'Password reset functionality coming soon.');
  }, []);

  const handleGoogleSignIn = useCallback(() => {
    Alert.alert('Google Sign-In', 'Google authentication coming soon.');
  }, []);

  const handleAppleSignIn = useCallback(() => {
    Alert.alert('Apple Sign-In', 'Apple authentication coming soon.');
  }, []);

  return (
    <ScreenContainer
      scrollable={false}
      padded={false}
      backgroundColor={colors.canvas.DEFAULT}
      keyboardAvoiding={false}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Top Brand Section ── */}
          <View
            className="items-center justify-end px-lg"
            style={{ height: '35%', paddingBottom: 32 }}
          >
            <View>
              <Text
                style={{
                  fontFamily: 'SourceSerif4-ExtraBold',
                  fontSize: 32,
                  color: colors.ink.DEFAULT,
                  letterSpacing: 5,
                  textAlign: 'center',
                }}
              >
                SAFAAR
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.ink.soft,
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                Welcome back
              </Text>
            </View>
          </View>

          {/* ── Form Card ── */}
          <View
            className="mx-lg rounded-card bg-surface px-xl py-xl"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            {/* Auth error banner */}
            {authError && (
              <View
                className="mb-lg rounded-button px-lg py-md"
                style={{ backgroundColor: '#FFEBEE' }}
              >
                <Text style={{ fontSize: 13, color: colors.error }}>
                  {authError}
                </Text>
              </View>
            )}

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  testID="sign-in-email"
                />
              )}
            />

            {/* Password */}
            <View className="mt-lg">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
                    testID="sign-in-password"
                  />
                )}
              />
            </View>

            {/* Forgot password */}
            <Pressable
              onPress={handleForgotPassword}
              className="mt-md self-end"
              hitSlop={8}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: colors.gold.DEFAULT,
                  fontFamily: 'SourceSerif4-SemiBold',
                }}
              >
                Forgot password?
              </Text>
            </Pressable>

            {/* Sign In button */}
            <View className="mt-xl">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                onPress={handleSubmit(onSubmit)}
                testID="sign-in-button"
              >
                Sign In
              </Button>
            </View>
          </View>

          {/* ── Divider ── */}
          <View className="mx-lg my-xl flex-row items-center">
            <View className="flex-1" style={{ height: 1, backgroundColor: colors.canvas.deep }} />
            <Text
              className="mx-lg"
              style={{ fontSize: 13, color: colors.ink.muted }}
            >
              or
            </Text>
            <View className="flex-1" style={{ height: 1, backgroundColor: colors.canvas.deep }} />
          </View>

          {/* ── Social Buttons ── */}
          <View
            className="mx-lg"
          >
            {/* Google */}
            <Pressable
              onPress={handleGoogleSignIn}
              className="mb-md flex-row items-center justify-center rounded-button"
              style={{
                height: 50,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.canvas.deep,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: colors.ink.DEFAULT,
                }}
              >
                Continue with Google
              </Text>
            </Pressable>

            {/* Apple */}
            <Pressable
              onPress={handleAppleSignIn}
              className="flex-row items-center justify-center rounded-button"
              style={{
                height: 50,
                backgroundColor: colors.ink.DEFAULT,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: '#FFFFFF',
                }}
              >
                Continue with Apple
              </Text>
            </Pressable>
          </View>

          {/* ── Sign Up Link ── */}
          <View className="mx-lg mt-xl flex-row items-center justify-center">
            <Text style={{ fontSize: 14, color: colors.ink.muted }}>
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: colors.gold.DEFAULT,
                }}
              >
                Sign up
              </Text>
            </Pressable>
          </View>

          {/* ── Terms ── */}
          <View className="mx-xl mb-lg mt-lg px-lg">
            <Text
              style={{
                fontSize: 11,
                color: colors.ink.muted,
                textAlign: 'center',
                lineHeight: 16,
              }}
            >
              By continuing, you agree to SAFAAR's{' '}
              <Text style={{ textDecorationLine: 'underline' }}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={{ textDecorationLine: 'underline' }}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default SignInScreen;
