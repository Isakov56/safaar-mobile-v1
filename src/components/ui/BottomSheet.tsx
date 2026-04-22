import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  PanResponder,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { X } from 'lucide-react-native';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
  style?: ViewStyle;
  testID?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  snapPoints = [400],
  style,
  testID,
}) => {
  const sheetHeight = snapPoints[snapPoints.length - 1];
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const open = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 14,
        bounciness: 4,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, backdropOpacity]);

  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, [translateY, backdropOpacity, sheetHeight, onClose]);

  useEffect(() => {
    if (visible) {
      translateY.setValue(sheetHeight);
      backdropOpacity.setValue(0);
      // Small delay to let modal mount
      const timer = setTimeout(open, 50);
      return () => clearTimeout(timer);
    }
  }, [visible, open, translateY, backdropOpacity, sheetHeight]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          close();
        } else {
          // Find nearest snap point
          const currentOffset = gestureState.dy;
          const snapTo = snapPoints.reduce((prev, curr) => {
            const prevDist = Math.abs(sheetHeight - prev - (sheetHeight - currentOffset));
            const currDist = Math.abs(sheetHeight - curr - (sheetHeight - currentOffset));
            return currDist < prevDist ? curr : prev;
          });

          Animated.spring(translateY, {
            toValue: sheetHeight - snapTo,
            useNativeDriver: true,
            speed: 14,
            bounciness: 4,
          }).start();
        }
      },
    }),
  ).current;

  if (!visible) return null;

  return (
    <Modal
      testID={testID}
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
    >
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
            opacity: backdropOpacity,
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={close} />
        </Animated.View>

        {/* Sheet */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: sheetHeight,
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 16,
              transform: [{ translateY }],
            },
            style,
          ]}
        >
          {/* Drag handle */}
          <View
            {...panResponder.panHandlers}
            style={{
              alignItems: 'center',
              paddingTop: 12,
              paddingBottom: 8,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#FAFAFA',
              }}
            />
          </View>

          {/* Header */}
          {title && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#FAFAFA',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: '#262626',
                }}
              >
                {title}
              </Text>
              <Pressable onPress={close} hitSlop={8}>
                <X size={22} color="#8E8E8E" />
              </Pressable>
            </View>
          )}

          {/* Content */}
          <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomSheet;
