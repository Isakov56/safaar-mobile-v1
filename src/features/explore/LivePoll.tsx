import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { BarChart3, Share2, MessageCircle, Plus } from 'lucide-react-native';

type Option = { id: string; label: string; votes: number };

type Poll = {
  id: string;
  question: string;
  asker: { name: string; avatar: string; role?: 'Local' | 'Traveler' };
  timeLeft: string;
  options: Option[];
  totalVotes: number;
  comments: number;
};

const MOCK_POLL: Poll = {
  id: 'poll-1',
  question: 'Weekend in Uzbekistan — where should I go first?',
  asker: {
    name: 'Nico',
    avatar: 'https://i.pravatar.cc/80?u=nico',
    role: 'Traveler',
  },
  timeLeft: '8h left',
  options: [
    { id: 'a', label: 'Samarkand', votes: 48 },
    { id: 'b', label: 'Bukhara', votes: 31 },
    { id: 'c', label: 'Stay in Tashkent', votes: 9 },
  ],
  totalVotes: 88,
  comments: 14,
};

const LivePoll: React.FC = () => {
  const [voted, setVoted] = useState<string | null>(null);
  const poll = MOCK_POLL;

  const liveTotal = voted ? poll.totalVotes + 1 : poll.totalVotes;

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DBDBDB',
        borderRadius: 14,
        padding: 16,
      }}
    >
      {/* Header row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <BarChart3 size={14} color="#7C3AED" strokeWidth={2.4} />
          <Text
            style={{
              fontSize: 10,
              fontWeight: '800',
              color: '#7C3AED',
              letterSpacing: 1.2,
            }}
          >
            LIVE POLL
          </Text>
        </View>
        <Text style={{ fontSize: 11, color: '#8E8E8E', fontWeight: '600' }}>{poll.timeLeft}</Text>
      </View>

      {/* Asker */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 }}>
        <Image
          source={{ uri: poll.asker.avatar }}
          style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#FAFAFA' }}
        />
        <Text style={{ fontSize: 12, color: '#262626', fontWeight: '600' }}>{poll.asker.name}</Text>
        {poll.asker.role && (
          <View
            style={{
              paddingHorizontal: 5,
              paddingVertical: 1.5,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#DBDBDB',
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: '800',
                color: '#8E8E8E',
                letterSpacing: 0.4,
              }}
            >
              {poll.asker.role.toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={{ fontSize: 11, color: '#8E8E8E', marginLeft: 'auto' }}>asks</Text>
      </View>

      {/* Question */}
      <Text
        style={{
          fontSize: 17,
          fontWeight: '700',
          color: '#262626',
          letterSpacing: -0.2,
          marginTop: 10,
          lineHeight: 22,
        }}
      >
        {poll.question}
      </Text>

      {/* Options */}
      <View style={{ marginTop: 14, gap: 8 }}>
        {poll.options.map((opt) => {
          const bumped = voted === opt.id ? opt.votes + 1 : opt.votes;
          const pct = Math.round((bumped / liveTotal) * 100);
          const isPicked = voted === opt.id;
          const showResult = voted != null;

          return (
            <Pressable
              key={opt.id}
              disabled={showResult}
              onPress={() => setVoted(opt.id)}
              style={{
                position: 'relative',
                height: 38,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: isPicked ? '#7C3AED' : '#DBDBDB',
                backgroundColor: showResult ? '#FAFAFA' : '#FFFFFF',
                overflow: 'hidden',
                justifyContent: 'center',
              }}
            >
              {/* Vote bar */}
              {showResult && (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${pct}%`,
                    backgroundColor: isPicked ? '#EDE6FE' : '#F2F2F2',
                  }}
                />
              )}
              <View
                style={{
                  paddingHorizontal: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: showResult ? '700' : '600',
                    color: '#262626',
                  }}
                >
                  {opt.label}
                </Text>
                {showResult && (
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '800',
                      color: isPicked ? '#7C3AED' : '#8E8E8E',
                    }}
                  >
                    {pct}%
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Footer: vote count + comment / share */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 14,
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 11, color: '#8E8E8E' }}>
          <Text style={{ fontWeight: '700', color: '#262626' }}>{liveTotal}</Text> votes
        </Text>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MessageCircle size={14} color="#262626" strokeWidth={2} />
            <Text style={{ fontSize: 12, color: '#262626', fontWeight: '600' }}>
              {poll.comments}
            </Text>
          </Pressable>
          <Pressable>
            <Share2 size={14} color="#262626" strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      {/* Post-vote: inviting CTA to start your own poll (psychology: you just voted,
          you're thinking about opinions — perfect moment to prompt creation). */}
      {voted && (
        <Pressable
          style={{
            marginTop: 14,
            paddingVertical: 11,
            borderRadius: 10,
            backgroundColor: '#F7F0FF',
            borderWidth: 1,
            borderColor: '#E3D4FB',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Plus size={14} color="#7C3AED" strokeWidth={2.6} />
          <Text
            style={{
              fontSize: 12.5,
              fontWeight: '700',
              color: '#7C3AED',
              letterSpacing: -0.1,
            }}
          >
            Start your own poll
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default LivePoll;
