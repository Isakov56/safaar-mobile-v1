import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  type ViewStyle,
  type ScrollViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  /** @deprecated Use backgroundColor instead */
  bgColor?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  keyboardAvoiding?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  scrollViewProps?: ScrollViewProps;
  testID?: string;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  padded = true,
  bgColor,
  backgroundColor,
  style,
  keyboardAvoiding = true,
  edges = ['top', 'bottom'],
  scrollViewProps,
  testID,
}) => {
  const insets = useSafeAreaInsets();
  const resolvedBg = backgroundColor ?? bgColor ?? '#FFFFFF';

  const safeAreaStyle: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[
        { flexGrow: 1 },
        padded && { paddingHorizontal: 16 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        { flex: 1 },
        padded && { paddingHorizontal: 16 },
      ]}
    >
      {children}
    </View>
  );

  const wrappedContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <View
      testID={testID}
      style={[
        { flex: 1, backgroundColor: resolvedBg },
        safeAreaStyle,
        style,
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={resolvedBg} />
      {wrappedContent}
    </View>
  );
};

export default ScreenContainer;
