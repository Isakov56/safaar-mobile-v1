import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  PenLine,
  BarChart3,
  HelpCircle,
  UserPlus,
  type LucideIcon,
} from 'lucide-react-native';

type Action = {
  id: string;
  label: string;
  hint: string;
  Icon: LucideIcon;
  tint: string;
};

const ACTIONS: Action[] = [
  { id: 'post', label: 'Post', hint: 'Share a thought', Icon: PenLine, tint: '#262626' },
  { id: 'poll', label: 'Poll', hint: 'Get opinions fast', Icon: BarChart3, tint: '#7C3AED' },
  { id: 'ask', label: 'Ask', hint: 'Question for locals', Icon: HelpCircle, tint: '#0095F6' },
  { id: 'buddy', label: 'Buddy', hint: 'Find someone to meet', Icon: UserPlus, tint: '#10B981' },
];

const QuickActionBar: React.FC<{ onPick?: (id: string) => void }> = ({ onPick }) => (
  <View
    style={{
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginTop: 20,
      gap: 8,
    }}
  >
    {ACTIONS.map((a) => {
      const Icon = a.Icon;
      return (
        <Pressable
          key={a.id}
          onPress={() => onPick?.(a.id)}
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#DBDBDB',
            borderRadius: 12,
            paddingVertical: 10,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: a.tint,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 5,
            }}
          >
            <Icon size={15} color="#FFFFFF" strokeWidth={2.4} />
          </View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#262626', letterSpacing: -0.1 }}>
            {a.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export default QuickActionBar;
