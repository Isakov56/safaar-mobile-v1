import React, { useCallback, useMemo } from 'react';
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

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

// ──────────────────────────────────────────────
// Password Strength
// ──────────────────────────────────────────────

type PasswordStrength = 'none' | 'weak' | 'medium' | 'strong';

const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return 'none';

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
};

const strengthConfig: Record<
  Exclude<PasswordStrength, 'none'>,
  { color: string; label: string; width: string }
> = {
  weak: { color: colors.error, label: 'Weak', width: '33%' },
  medium: { color: colors.warning.DEFAULT, label: 'Medium', width: '66%' },
  strong: { color: colors.success.DEFAULT, label: 'Strong', width: '100%' },
};

// ──────────────────────────────────────────────
// Password Strength Bar
// ──────────────────────────────────────────────

interface StrengthBarProps {
  strength: PasswordStrength;
}

const StrengthBar: React.FC<StrengthBarProps> = ({ strength }) => {
  if (strength === 'none') return null;

  const config = strengthConfig[strength];

  return (
    <View className="mt-sm">
      <View
        className="rounded-pill"
        style={{ height: 4, backgroundColor: colors.canvas.deep }}
      >
        <View
          className="rounded-pill"
          style={{
            height: 4,
            width: config.width as any,
            backgroundColor: config.color,
          }}
        />
      </View>
      <Text
        className="mt-xs"
        style={{
          fontSize: 11,
          color: config.color,
          textAlign: 'right',
        }}
      >
        {config.label}
      </Text>
    </View>
  );
};

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const signUp = useAuthStore((s) => s.signUp);
  const isLoading = useAuthStore((s) => s.isLoading);
  const authError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const watchedPassword = watch('password');
  const passwordStrength = useMemo(
    () => getPasswordStrength(watchedPassword),
    [watchedPassword],
  );

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      clearError();
      try {
        await signUp(data.name, data.email, data.password);
        // Navigate to onboarding for new users
        navigation.navigate('Onboarding');
      } catch {
        // Error is set in the store
      }
    },
    [signUp, clearError, navigation],
  );

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
            style={{ height: '28%', paddingBottom: 28 }}
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
                Create an account
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

            {/* Full Name */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  testID="sign-up-name"
                />
              )}
            />

            {/* Email */}
            <View className="mt-lg">
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
                    testID="sign-up-email"
                  />
                )}
              />
            </View>

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
                    autoComplete="new-password"
                    textContentType="newPassword"
                    testID="sign-up-password"
                  />
                )}
              />
              <StrengthBar strength={passwordStrength} />
            </View>

            {/* Create Account button */}
            <View className="mt-xl">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                onPress={handleSubmit(onSubmit)}
                testID="sign-up-button"
              >
                Create Account
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

          {/* ── Sign In Link ── */}
          <View className="mx-lg mt-xl flex-row items-center justify-center">
            <Text style={{ fontSize: 14, color: colors.ink.muted }}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => navigation.navigate('SignIn')} hitSlop={8}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: colors.gold.DEFAULT,
                }}
              >
                Sign in
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
              By creating an account, you agree to SAFAAR's{' '}
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

export default SignUpScreen;
