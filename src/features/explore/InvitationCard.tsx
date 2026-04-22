import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MessageCircle, Check, X, Calendar, MapPin } from 'lucide-react-native';

type Invitation = {
  id: string;
  from: { name: string; avatar: string; role?: 'Local' | 'Traveler' };
  title: string;
  when: string;
  location: string;
  going: number;
  detail: string;
};

const MOCK_INVITE: Invitation = {
  id: 'inv-1',
  from: {
    name: 'Olga',
    avatar: 'https://i.pravatar.cc/80?u=olga',
    role: 'Traveler',
  },
  title: 'Chimgan mountains day trip',
  when: 'Saturday · 8 AM',
  location: 'Chimgan, 85 km from Tashkent',
  going: 5,
  detail: 'Shared car, splitting fuel. Already matched you by interests.',
};

const InvitationCard: React.FC = () => {
  const [state, setState] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const inv = MOCK_INVITE;

  if (state === 'declined') {
    return (
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 20,
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: '#FAFAFA',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#DBDBDB',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <X size={14} color="#8E8E8E" />
        <Text style={{ fontSize: 12, color: '#8E8E8E', flex: 1 }}>
          Invitation from {inv.from.name} skipped
        </Text>
        <Pressable hitSlop={6} onPress={() => setState('pending')}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#0095F6' }}>Undo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#DBDBDB',
        overflow: 'hidden',
      }}
    >
      {/* Top strip: from-line + envelope-y accent */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: '#FFF8E7',
          borderBottomWidth: 1,
          borderBottomColor: '#F4E7C7',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 14 }}>✋</Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '800',
            color: '#8B5E00',
            letterSpacing: 1.1,
          }}
        >
          INVITATION FOR YOU
        </Text>
      </View>

      {/* Body */}
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: inv.from.avatar }}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: '#262626' }}>
              <Text style={{ fontWeight: '700' }}>{inv.from.name}</Text>
              <Text style={{ color: '#3C3C3C' }}>
                {inv.from.role ? ` · ${inv.from.role.toLowerCase()}` : ''} invited you to
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '800',
                color: '#262626',
                letterSpacing: -0.3,
                marginTop: 2,
              }}
            >
              {inv.title}
            </Text>
          </View>
        </View>

        {/* Meta rows */}
        <View style={{ marginTop: 10, gap: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Calendar size={12} color="#8E8E8E" />
            <Text style={{ fontSize: 12, color: '#3C3C3C' }}>{inv.when}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MapPin size={12} color="#8E8E8E" />
            <Text style={{ fontSize: 12, color: '#3C3C3C' }}>{inv.location}</Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 12,
            color: '#3C3C3C',
            marginTop: 10,
            lineHeight: 17,
            fontStyle: 'italic',
          }}
        >
          "{inv.detail}"
        </Text>

        {state === 'accepted' ? (
          <View
            style={{
              marginTop: 14,
              paddingVertical: 11,
              borderRadius: 10,
              backgroundColor: '#D1FAE5',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Check size={14} color="#065F46" strokeWidth={2.6} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '800',
                color: '#065F46',
                letterSpacing: -0.1,
              }}
            >
              You're in — Olga has been notified
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <Pressable
              onPress={() => setState('accepted')}
              style={{
                flex: 1,
                backgroundColor: '#262626',
                borderRadius: 10,
                paddingVertical: 11,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Check size={14} color="#FFFFFF" strokeWidth={2.6} />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: '800',
                  letterSpacing: -0.1,
                }}
              >
                Accept
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setState('declined')}
              style={{
                paddingHorizontal: 14,
                borderRadius: 10,
                paddingVertical: 11,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#DBDBDB',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{ color: '#3C3C3C', fontSize: 13, fontWeight: '700', letterSpacing: -0.1 }}
              >
                Skip
              </Text>
            </Pressable>
            <Pressable
              style={{
                width: 42,
                borderRadius: 10,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#DBDBDB',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageCircle size={16} color="#262626" strokeWidth={2} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default InvitationCard;
