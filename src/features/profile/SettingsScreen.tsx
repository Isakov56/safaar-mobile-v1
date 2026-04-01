import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Lock,
  Link2,
  Trash2,
  CreditCard,
  Receipt,
  Bell,
  Globe,
  Palette,
  Eye,
  MapPin,
  Shield,
  HelpCircle,
  Mail,
  Bug,
  FileText,
  Scale,
  LogOut,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

// ── Types ────────────────────────────────────────────
interface SettingsRow {
  icon: LucideIcon;
  label: string;
  type: 'navigate' | 'toggle' | 'action';
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
  subtitle?: string;
}

interface SettingsSection {
  title: string;
  rows: SettingsRow[];
}

// ── Screen ───────────────────────────────────────────
const SettingsScreen: React.FC = () => {
  // Toggle states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [bookingNotifs, setBookingNotifs] = useState(true);
  const [messageNotifs, setMessageNotifs] = useState(true);
  const [socialNotifs, setSocialNotifs] = useState(true);
  const [bgAnimEnabled, setBgAnimEnabled] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Would call authStore.signOut()
          },
        },
      ],
    );
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Would call API to delete account
          },
        },
      ],
    );
  }, []);

  const sections: SettingsSection[] = [
    {
      title: 'Account',
      rows: [
        { icon: User, label: 'Edit Profile', type: 'navigate' },
        { icon: Lock, label: 'Change Password', type: 'navigate' },
        { icon: Link2, label: 'Linked Accounts', type: 'navigate' },
        {
          icon: Trash2,
          label: 'Delete Account',
          type: 'action',
          danger: true,
          onPress: handleDeleteAccount,
        },
      ],
    },
    {
      title: 'Payments',
      rows: [
        { icon: CreditCard, label: 'Saved Cards', type: 'navigate' },
        { icon: Receipt, label: 'Transaction History', type: 'navigate' },
      ],
    },
    {
      title: 'Notifications',
      rows: [
        {
          icon: Bell,
          label: 'Push Notifications',
          type: 'toggle',
          value: pushEnabled,
          onToggle: setPushEnabled,
        },
        {
          icon: Mail,
          label: 'Email Notifications',
          type: 'toggle',
          value: emailEnabled,
          onToggle: setEmailEnabled,
        },
        {
          icon: Bell,
          label: 'Booking Updates',
          type: 'toggle',
          value: bookingNotifs,
          onToggle: setBookingNotifs,
        },
        {
          icon: Bell,
          label: 'Messages',
          type: 'toggle',
          value: messageNotifs,
          onToggle: setMessageNotifs,
        },
        {
          icon: Bell,
          label: 'Social Activity',
          type: 'toggle',
          value: socialNotifs,
          onToggle: setSocialNotifs,
        },
      ],
    },
    {
      title: 'Language',
      rows: [
        {
          icon: Globe,
          label: 'App Language',
          type: 'navigate',
          subtitle: 'English',
        },
      ],
    },
    {
      title: 'Appearance',
      rows: [
        {
          icon: Palette,
          label: 'Background Animation',
          type: 'toggle',
          value: bgAnimEnabled,
          onToggle: setBgAnimEnabled,
        },
      ],
    },
    {
      title: 'Privacy',
      rows: [
        {
          icon: Eye,
          label: 'Profile Visibility',
          type: 'toggle',
          value: profileVisible,
          onToggle: setProfileVisible,
        },
        {
          icon: MapPin,
          label: 'Location Sharing',
          type: 'toggle',
          value: locationSharing,
          onToggle: setLocationSharing,
        },
        { icon: Shield, label: 'Blocked Users', type: 'navigate' },
      ],
    },
    {
      title: 'Support',
      rows: [
        { icon: HelpCircle, label: 'Help Center', type: 'navigate' },
        { icon: Mail, label: 'Contact Us', type: 'navigate' },
        { icon: Bug, label: 'Report a Bug', type: 'navigate' },
      ],
    },
    {
      title: 'Legal',
      rows: [
        { icon: FileText, label: 'Terms of Service', type: 'navigate' },
        { icon: Scale, label: 'Privacy Policy', type: 'navigate' },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF8F4' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F2EDE4',
        }}
      >
        <Pressable hitSlop={8}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </Pressable>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 17,
            fontFamily: 'SourceSerif4-SemiBold',
            color: '#1A1A1A',
          }}
        >
          Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title} style={{ marginTop: 24 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#8A8A8A',
                textTransform: 'uppercase',
                letterSpacing: 1,
                paddingHorizontal: 16,
                marginBottom: 8,
              }}
            >
              {section.title}
            </Text>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                marginHorizontal: 16,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {section.rows.map((row, index) => {
                const Icon = row.icon;
                const isLast = index === section.rows.length - 1;

                return (
                  <Pressable
                    key={row.label}
                    onPress={
                      row.type === 'toggle'
                        ? () => row.onToggle?.(!row.value)
                        : row.onPress
                    }
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 14,
                      paddingVertical: 13,
                      backgroundColor: pressed ? '#FAF8F4' : '#FFFFFF',
                      borderBottomWidth: isLast ? 0 : 1,
                      borderBottomColor: '#F2EDE4',
                    })}
                  >
                    <Icon
                      size={18}
                      color={row.danger ? '#C62828' : '#4A4A4A'}
                    />
                    <Text
                      style={{
                        flex: 1,
                        marginLeft: 12,
                        fontSize: 15,
                        fontFamily: 'SourceSerif4-Regular',
                        color: row.danger ? '#C62828' : '#1A1A1A',
                      }}
                    >
                      {row.label}
                    </Text>

                    {row.subtitle && (
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: 'SourceSerif4-Regular',
                          color: '#8A8A8A',
                          marginRight: 4,
                        }}
                      >
                        {row.subtitle}
                      </Text>
                    )}

                    {row.type === 'navigate' && (
                      <ChevronRight size={16} color="#8A8A8A" />
                    )}

                    {row.type === 'toggle' && (
                      <Switch
                        value={row.value}
                        onValueChange={row.onToggle}
                        trackColor={{ false: '#F2EDE4', true: '#E8D5A8' }}
                        thumbColor={row.value ? '#C4993C' : '#FFFFFF'}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <Pressable
          onPress={handleSignOut}
          style={{
            marginTop: 24,
            marginHorizontal: 16,
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <LogOut size={18} color="#C62828" />
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'SourceSerif4-SemiBold',
              color: '#C62828',
            }}
          >
            Sign Out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
