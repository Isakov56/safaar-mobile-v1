import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import Button from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  testID?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
  testID,
}) => {
  return (
    <View
      testID={testID}
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
          paddingVertical: 48,
        },
        style,
      ]}
    >
      {Icon && (
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: '#F2EDE4',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Icon size={32} color="#8A8A8A" />
        </View>
      )}

      <Text
        style={{
          fontSize: 18,
          fontFamily: 'SourceSerif4-SemiBold',
          color: '#1A1A1A',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'SourceSerif4-Regular',
            color: '#8A8A8A',
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: 24,
          }}
        >
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" size="md" pill onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;
