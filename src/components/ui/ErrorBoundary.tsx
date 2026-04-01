import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAF8F4',
            paddingHorizontal: 32,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#FFEBEE',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={32} color="#C62828" />
          </View>

          <Text
            style={{
              fontSize: 18,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#1A1A1A',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Something went wrong
          </Text>

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
            An unexpected error occurred. Please try again.
          </Text>

          <Pressable
            onPress={this.handleRetry}
            style={({ pressed }) => ({
              backgroundColor: '#C4993C',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 999,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#FFFFFF',
              }}
            >
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
