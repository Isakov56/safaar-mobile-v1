import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Compass, Home, Search } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '../../components/layout/ScreenContainer';
import Button from '../../components/ui/Button';
import Pill from '../../components/ui/Pill';
import { useAuthStore, type UserRole } from '../../stores/authStore';
import { colors } from '../../theme';
import type { AuthStackParamList } from '../../navigation/types';

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const TOTAL_STEPS = 3;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INTEREST_OPTIONS = [
  'Ceramics',
  'Textiles',
  'Cuisine',
  'Music',
  'Photography',
  'History',
  'Architecture',
  'Dance',
  'Crafts',
  'Markets',
  'Nature',
  'Nightlife',
  'Adventure',
  'Spirituality',
  'Language',
  'Art',
] as const;

const MIN_INTERESTS = 3;

const MOCK_CITIES = [
  { id: 'marrakech', name: 'Marrakech, Morocco' },
  { id: 'istanbul', name: 'Istanbul, Turkey' },
  { id: 'fez', name: 'Fez, Morocco' },
  { id: 'cairo', name: 'Cairo, Egypt' },
  { id: 'jaipur', name: 'Jaipur, India' },
  { id: 'oaxaca', name: 'Oaxaca, Mexico' },
  { id: 'kyoto', name: 'Kyoto, Japan' },
  { id: 'lisbon', name: 'Lisbon, Portugal' },
  { id: 'havana', name: 'Havana, Cuba' },
  { id: 'bangkok', name: 'Bangkok, Thailand' },
];

// ──────────────────────────────────────────────
// Progress Bar
// ──────────────────────────────────────────────

interface ProgressBarProps {
  step: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, total }) => {
  const progress = React.useRef(new Animated.Value(step / total)).current;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: step / total,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step, total, progress]);

  const widthInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      className="mx-lg rounded-pill"
      style={{ height: 4, backgroundColor: colors.canvas.deep }}
    >
      <Animated.View
        className="rounded-pill"
        style={{
          height: 4,
          backgroundColor: colors.gold.DEFAULT,
          width: widthInterpolation,
        }}
      />
    </View>
  );
};

// ──────────────────────────────────────────────
// Step 1: Role Selection
// ──────────────────────────────────────────────

interface RoleStepProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
}

const RoleStep: React.FC<RoleStepProps> = ({ selectedRole, onSelectRole }) => {
  const handleSelect = useCallback(
    (role: UserRole) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSelectRole(role);
    },
    [onSelectRole],
  );

  return (
    <View className="flex-1 px-lg pt-2xl">
      <Text
        style={{
          fontFamily: 'SourceSerif4-Bold',
          fontSize: 24,
          color: colors.ink.DEFAULT,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        How will you use SAFAAR?
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: colors.ink.soft,
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        You can always change this later
      </Text>

      {/* Traveler Card */}
      <Pressable
        onPress={() => handleSelect('traveler')}
        className="mb-lg rounded-card bg-surface px-xl py-xl"
        style={[
          {
            borderWidth: 2,
            borderColor:
              selectedRole === 'traveler' ? colors.gold.DEFAULT : colors.canvas.deep,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: selectedRole === 'traveler' ? 0.08 : 0.02,
            shadowRadius: selectedRole === 'traveler' ? 8 : 3,
            elevation: selectedRole === 'traveler' ? 4 : 1,
          },
        ]}
      >
        <View className="flex-row items-center">
          <View
            className="mr-lg items-center justify-center rounded-full"
            style={{
              width: 56,
              height: 56,
              backgroundColor:
                selectedRole === 'traveler' ? colors.gold.soft : colors.canvas.deep,
            }}
          >
            <Compass
              size={28}
              color={
                selectedRole === 'traveler' ? colors.gold.DEFAULT : colors.ink.muted
              }
            />
          </View>
          <View className="flex-1">
            <Text
              style={{
                fontFamily: 'SourceSerif4-SemiBold',
                fontSize: 18,
                color: colors.ink.DEFAULT,
              }}
            >
              I'm a Traveler
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.ink.soft,
                marginTop: 4,
              }}
            >
              Discover authentic local experiences
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Host Card */}
      <Pressable
        onPress={() => handleSelect('host')}
        className="mb-lg rounded-card bg-surface px-xl py-xl"
        style={[
          {
            borderWidth: 2,
            borderColor:
              selectedRole === 'host' ? colors.gold.DEFAULT : colors.canvas.deep,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: selectedRole === 'host' ? 0.08 : 0.02,
            shadowRadius: selectedRole === 'host' ? 8 : 3,
            elevation: selectedRole === 'host' ? 4 : 1,
          },
        ]}
      >
        <View className="flex-row items-center">
          <View
            className="mr-lg items-center justify-center rounded-full"
            style={{
              width: 56,
              height: 56,
              backgroundColor:
                selectedRole === 'host' ? colors.gold.soft : colors.canvas.deep,
            }}
          >
            <Home
              size={28}
              color={
                selectedRole === 'host' ? colors.gold.DEFAULT : colors.ink.muted
              }
            />
          </View>
          <View className="flex-1">
            <Text
              style={{
                fontFamily: 'SourceSerif4-SemiBold',
                fontSize: 18,
                color: colors.ink.DEFAULT,
              }}
            >
              I'm a Local Host
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.ink.soft,
                marginTop: 4,
              }}
            >
              Share your craft and culture
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Both link */}
      <Pressable
        onPress={() => handleSelect('both')}
        className="mt-sm items-center"
        hitSlop={12}
      >
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'SourceSerif4-SemiBold',
            color: colors.gold.DEFAULT,
            textDecorationLine:
              selectedRole === 'both' ? 'underline' : 'none',
          }}
        >
          Both
        </Text>
      </Pressable>
    </View>
  );
};

// ──────────────────────────────────────────────
// Step 2: Interests
// ──────────────────────────────────────────────

interface InterestsStepProps {
  selectedInterests: string[];
  onToggleInterest: (interest: string) => void;
}

const InterestsStep: React.FC<InterestsStepProps> = ({
  selectedInterests,
  onToggleInterest,
}) => {
  return (
    <View className="flex-1 px-lg pt-2xl">
      <Text
        style={{
          fontFamily: 'SourceSerif4-Bold',
          fontSize: 24,
          color: colors.ink.DEFAULT,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        What interests you?
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: colors.ink.soft,
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        Pick at least {MIN_INTERESTS} to personalize your feed
      </Text>

      <View className="flex-row flex-wrap justify-center" style={{ gap: 10 }}>
        {INTEREST_OPTIONS.map((interest) => (
          <Pill
            key={interest}
            label={interest}
            selected={selectedInterests.includes(interest)}
            onPress={() => onToggleInterest(interest)}
          />
        ))}
      </View>

      <Text
        className="mt-xl"
        style={{
          fontSize: 13,
          color:
            selectedInterests.length >= MIN_INTERESTS
              ? colors.success.DEFAULT
              : colors.ink.muted,
          textAlign: 'center',
        }}
      >
        {selectedInterests.length} of {MIN_INTERESTS} minimum selected
      </Text>
    </View>
  );
};

// ──────────────────────────────────────────────
// Step 3: Location
// ──────────────────────────────────────────────

interface LocationStepProps {
  cityQuery: string;
  onCityQueryChange: (text: string) => void;
  selectedCity: { id: string; name: string } | null;
  onSelectCity: (city: { id: string; name: string }) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
  cityQuery,
  onCityQueryChange,
  selectedCity,
  onSelectCity,
}) => {
  const filteredCities = cityQuery.length > 0
    ? MOCK_CITIES.filter((c) =>
        c.name.toLowerCase().includes(cityQuery.toLowerCase()),
      )
    : MOCK_CITIES;

  const handleSelectCity = useCallback(
    (city: { id: string; name: string }) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectCity(city);
      onCityQueryChange(city.name);
    },
    [onSelectCity, onCityQueryChange],
  );

  return (
    <View className="flex-1 px-lg pt-2xl">
      <Text
        style={{
          fontFamily: 'SourceSerif4-Bold',
          fontSize: 24,
          color: colors.ink.DEFAULT,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Where are you?
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: colors.ink.soft,
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        We'll show you what's happening nearby
      </Text>

      {/* City Search */}
      <View
        className="flex-row items-center rounded-button bg-surface px-lg"
        style={{
          height: 52,
          borderWidth: 1.5,
          borderColor: colors.canvas.deep,
        }}
      >
        <Search size={20} color={colors.ink.muted} />
        <TextInput
          value={cityQuery}
          onChangeText={onCityQueryChange}
          placeholder="Search cities..."
          placeholderTextColor={colors.ink.muted}
          className="ml-md flex-1"
          style={{
            fontSize: 15,
            color: colors.ink.DEFAULT,
          }}
          autoCapitalize="none"
          testID="city-search-input"
        />
      </View>

      {/* City suggestions */}
      <View className="mt-md" style={{ maxHeight: 280 }}>
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const isSelected = selectedCity?.id === item.id;
            return (
              <Pressable
                onPress={() => handleSelectCity(item)}
                className="flex-row items-center rounded-button px-lg py-md"
                style={{
                  backgroundColor: isSelected
                    ? colors.gold.soft
                    : 'transparent',
                  marginBottom: 4,
                }}
              >
                <View
                  className="mr-md items-center justify-center rounded-full"
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: isSelected
                      ? colors.gold.DEFAULT
                      : colors.canvas.deep,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: isSelected ? '#FFFFFF' : colors.ink.muted,
                      fontWeight: '600',
                    }}
                  >
                    {item.name.charAt(0)}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: isSelected ? colors.ink.DEFAULT : colors.ink.soft,
                    fontFamily: isSelected
                      ? 'SourceSerif4-SemiBold'
                      : undefined,
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Optional note */}
      <Text
        className="mt-lg"
        style={{
          fontSize: 13,
          color: colors.ink.muted,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        This is optional — you can skip for now
      </Text>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main Onboarding Screen
// ──────────────────────────────────────────────

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const setOnboardingData = useAuthStore((s) => s.setOnboardingData);

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 state
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Step 2 state
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Step 3 state
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const toggleInterest = useCallback((interest: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  }, []);

  const canContinue = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return selectedRole !== null;
      case 2:
        return selectedInterests.length >= MIN_INTERESTS;
      case 3:
        return true; // City is optional
      default:
        return false;
    }
  }, [currentStep, selectedRole, selectedInterests]);

  const handleContinue = useCallback(() => {
    if (!canContinue()) {
      if (currentStep === 1) {
        Alert.alert('Select a role', 'Please choose how you plan to use SAFAAR.');
      } else if (currentStep === 2) {
        Alert.alert(
          'Select interests',
          `Please pick at least ${MIN_INTERESTS} interests.`,
        );
      }
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Save onboarding data and finish
      setOnboardingData(
        selectedRole!,
        selectedInterests,
        selectedCity?.name,
      );
      // RootNavigator will pick up isAuthenticated from signUp and show MainTabs
    }
  }, [
    currentStep,
    canContinue,
    selectedRole,
    selectedInterests,
    selectedCity,
    setOnboardingData,
  ]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View key="step-1" className="flex-1">
            <RoleStep
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
            />
          </View>
        );
      case 2:
        return (
          <View key="step-2" className="flex-1">
            <InterestsStep
              selectedInterests={selectedInterests}
              onToggleInterest={toggleInterest}
            />
          </View>
        );
      case 3:
        return (
          <View key="step-3" className="flex-1">
            <LocationStep
              cityQuery={cityQuery}
              onCityQueryChange={setCityQuery}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScreenContainer
      scrollable={false}
      padded={false}
      backgroundColor={colors.canvas.DEFAULT}
      keyboardAvoiding={false}
    >
      <View className="flex-1">
        {/* Progress bar */}
        <View className="pt-md">
          <ProgressBar step={currentStep} total={TOTAL_STEPS} />
        </View>

        {/* Step content */}
        <View className="flex-1">{renderStep()}</View>

        {/* Bottom actions */}
        <View
          className="flex-row items-center px-lg pb-lg"
          style={{ gap: 12 }}
        >
          {currentStep > 1 && (
            <Pressable
              onPress={handleBack}
              className="items-center justify-center rounded-button"
              style={{
                height: 50,
                paddingHorizontal: 24,
                borderWidth: 1,
                borderColor: colors.canvas.deep,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: colors.ink.soft,
                }}
              >
                Back
              </Text>
            </Pressable>
          )}

          <View className="flex-1">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleContinue}
              disabled={!canContinue()}
              testID="onboarding-continue"
            >
              {currentStep === TOTAL_STEPS ? 'Get Started' : 'Continue'}
            </Button>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default OnboardingScreen;
