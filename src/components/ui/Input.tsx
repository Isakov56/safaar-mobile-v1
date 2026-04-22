import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  Animated,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  icon?: LucideIcon;
  multiline?: boolean;
  maxLength?: number;
  containerStyle?: ViewStyle;
  testID?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  icon: Icon,
  multiline = false,
  maxLength,
  containerStyle,
  testID,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;
  const inputRef = useRef<TextInput>(null);

  const hasValue = value.length > 0;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue, animatedLabel]);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  const toggleSecure = useCallback(() => setIsSecureVisible((prev) => !prev), []);

  const labelTop = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 4],
  });

  const labelSize = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 11],
  });

  const labelColor = error
    ? '#C62828'
    : isFocused
      ? '#C4993C'
      : '#8E8E8E';

  const borderColor = error
    ? '#C62828'
    : isFocused
      ? '#C4993C'
      : '#FAFAFA';

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          minHeight: multiline ? 100 : 48,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        {Icon && (
          <View style={{ paddingTop: 14, marginRight: 8 }}>
            <Icon size={18} color={isFocused ? '#C4993C' : '#8E8E8E'} />
          </View>
        )}

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Animated.Text
            style={{
              position: 'absolute',
              left: 0,
              top: labelTop,
              fontSize: labelSize,
              color: labelColor,
              fontFamily: 'SourceSerif4-Regular',
            }}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>

          <TextInput
            ref={inputRef}
            testID={testID}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !isSecureVisible}
            multiline={multiline}
            maxLength={maxLength}
            placeholderTextColor="transparent"
            style={{
              fontSize: 15,
              fontFamily: 'SourceSerif4-Regular',
              color: '#262626',
              paddingTop: 18,
              paddingBottom: 6,
              minHeight: multiline ? 80 : undefined,
              textAlignVertical: multiline ? 'top' : 'center',
            }}
            {...rest}
          />
        </View>

        {secureTextEntry && (
          <Pressable
            onPress={toggleSecure}
            style={{ paddingTop: 14, marginLeft: 8 }}
            hitSlop={8}
          >
            {isSecureVisible ? (
              <EyeOff size={18} color="#8E8E8E" />
            ) : (
              <Eye size={18} color="#8E8E8E" />
            )}
          </Pressable>
        )}
      </Pressable>

      {error && (
        <Text
          className="text-error"
          style={{
            fontSize: 11,
            fontFamily: 'SourceSerif4-Regular',
            marginTop: 4,
            marginLeft: 4,
          }}
        >
          {error}
        </Text>
      )}

      {maxLength && (
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'SourceSerif4-Regular',
            color: '#8E8E8E',
            marginTop: 2,
            textAlign: 'right',
          }}
        >
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

export default Input;
