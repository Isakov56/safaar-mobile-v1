import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Sparkles, ArrowUp } from 'lucide-react-native';

interface Props {
  placeholder?: string;
  cityName?: string;
}

// Inline "ask locals anything" input that lives in the feed.
// No button to open a composer — the composer IS the input.
const AskPrompt: React.FC<Props> = ({
  placeholder,
  cityName = 'Tashkent',
}) => {
  const [q, setQ] = useState('');
  const canSend = q.trim().length > 0;

  const EXAMPLES = [
    'Best plov near Chorsu?',
    'Safe for solo female travelers?',
    'Any jazz tonight?',
  ];

  return (
    <View style={{ marginTop: 20, marginHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Sparkles size={13} color="#0095F6" strokeWidth={2.4} />
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: '#8E8E8E',
            letterSpacing: 1.2,
          }}
        >
          ASK {cityName.toUpperCase()} — LOCALS REPLY IN MINUTES
        </Text>
      </View>

      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#DBDBDB',
          overflow: 'hidden',
        }}
      >
        {/* Input row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 14,
            paddingRight: 8,
            paddingVertical: 8,
          }}
        >
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={placeholder ?? `Ask anything about ${cityName}...`}
            placeholderTextColor="#8E8E8E"
            multiline
            style={{
              flex: 1,
              fontSize: 14,
              color: '#262626',
              paddingVertical: 4,
              minHeight: 24,
              maxHeight: 90,
            }}
          />
          <Pressable
            disabled={!canSend}
            onPress={() => setQ('')}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: canSend ? '#0095F6' : '#F2F2F2',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUp
              size={16}
              color={canSend ? '#FFFFFF' : '#8E8E8E'}
              strokeWidth={2.4}
            />
          </Pressable>
        </View>

        {/* Example chips under the input — inviting & frictionless */}
        {q.length === 0 && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 6,
              paddingHorizontal: 12,
              paddingBottom: 12,
              paddingTop: 2,
            }}
          >
            {EXAMPLES.map((ex) => (
              <Pressable
                key={ex}
                onPress={() => setQ(ex)}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: '#FAFAFA',
                  borderWidth: 1,
                  borderColor: '#DBDBDB',
                }}
              >
                <Text style={{ fontSize: 11, color: '#3C3C3C', fontWeight: '500' }}>
                  {ex}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default AskPrompt;
