import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DollarSign,
  Calendar,
  Eye,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import Toggle from '../../components/ui/Toggle';
import Badge from '../../components/ui/Badge';

// ── Types ────────────────────────────────────────────
type Period = 'weekly' | 'monthly' | 'yearly';

interface MetricCard {
  label: string;
  value: string;
  change: number; // percentage
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

interface TopCustomer {
  id: string;
  name: string;
  avatar: string | null;
  bookings: number;
  totalSpent: number;
}

interface RecentBooking {
  id: string;
  guest: string;
  guestAvatar: string | null;
  experience: string;
  date: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'completed';
}

// ── Mock Data ────────────────────────────────────────
const METRICS: Record<Period, MetricCard[]> = {
  weekly: [
    {
      label: 'Total Revenue',
      value: '$1,245',
      change: 12.5,
      icon: DollarSign,
      iconBg: '#E8F5E9',
      iconColor: '#2E7D32',
    },
    {
      label: 'Bookings',
      value: '28',
      change: 8.3,
      icon: Calendar,
      iconBg: '#E8D5A8',
      iconColor: '#8B6914',
    },
    {
      label: 'Profile Views',
      value: '342',
      change: -2.1,
      icon: Eye,
      iconBg: '#E3F2FD',
      iconColor: '#1565C0',
    },
    {
      label: 'New Followers',
      value: '47',
      change: 15.0,
      icon: Users,
      iconBg: '#F3E5F5',
      iconColor: '#7B1FA2',
    },
  ],
  monthly: [
    {
      label: 'Total Revenue',
      value: '$5,430',
      change: 18.2,
      icon: DollarSign,
      iconBg: '#E8F5E9',
      iconColor: '#2E7D32',
    },
    {
      label: 'Bookings',
      value: '127',
      change: 14.6,
      icon: Calendar,
      iconBg: '#E8D5A8',
      iconColor: '#8B6914',
    },
    {
      label: 'Profile Views',
      value: '1,489',
      change: 5.3,
      icon: Eye,
      iconBg: '#E3F2FD',
      iconColor: '#1565C0',
    },
    {
      label: 'New Followers',
      value: '198',
      change: 22.7,
      icon: Users,
      iconBg: '#F3E5F5',
      iconColor: '#7B1FA2',
    },
  ],
  yearly: [
    {
      label: 'Total Revenue',
      value: '$48,750',
      change: 35.8,
      icon: DollarSign,
      iconBg: '#E8F5E9',
      iconColor: '#2E7D32',
    },
    {
      label: 'Bookings',
      value: '1,156',
      change: 28.4,
      icon: Calendar,
      iconBg: '#E8D5A8',
      iconColor: '#8B6914',
    },
    {
      label: 'Profile Views',
      value: '12,834',
      change: 42.1,
      icon: Eye,
      iconBg: '#E3F2FD',
      iconColor: '#1565C0',
    },
    {
      label: 'New Followers',
      value: '1,842',
      change: 67.3,
      icon: Users,
      iconBg: '#F3E5F5',
      iconColor: '#7B1FA2',
    },
  ],
};

const MOCK_TOP_CUSTOMERS: TopCustomer[] = [
  {
    id: 'tc1',
    name: 'Aisha Chen',
    avatar: 'https://i.pravatar.cc/150?img=32',
    bookings: 5,
    totalSpent: 325,
  },
  {
    id: 'tc2',
    name: 'Marco Rossi',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bookings: 3,
    totalSpent: 195,
  },
  {
    id: 'tc3',
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?img=44',
    bookings: 3,
    totalSpent: 180,
  },
];

const MOCK_RECENT_BOOKINGS: RecentBooking[] = [
  {
    id: 'rb1',
    guest: 'Yuki Tanaka',
    guestAvatar: 'https://i.pravatar.cc/150?img=9',
    experience: 'Traditional Ceramics Workshop',
    date: 'Apr 15, 2026',
    amount: 45,
    status: 'confirmed',
  },
  {
    id: 'rb2',
    guest: 'Lena Muller',
    guestAvatar: 'https://i.pravatar.cc/150?img=23',
    experience: 'Rishtan Blue Masterclass',
    date: 'Apr 16, 2026',
    amount: 75,
    status: 'pending',
  },
  {
    id: 'rb3',
    guest: 'Olumide Adeyemi',
    guestAvatar: 'https://i.pravatar.cc/150?img=56',
    experience: 'Traditional Ceramics Workshop',
    date: 'Apr 14, 2026',
    amount: 45,
    status: 'completed',
  },
  {
    id: 'rb4',
    guest: 'Alex Rivera',
    guestAvatar: 'https://i.pravatar.cc/150?img=68',
    experience: 'Traditional Ceramics Workshop',
    date: 'Apr 15, 2026',
    amount: 45,
    status: 'confirmed',
  },
];

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'gold'> = {
  confirmed: 'success',
  pending: 'warning',
  completed: 'gold',
};

// ── Metric Card Component ────────────────────────────
const MetricTile: React.FC<{ metric: MetricCard }> = ({ metric }) => {
  const Icon = metric.icon;
  const isPositive = metric.change >= 0;

  return (
    <Card elevated padding={14} style={{ flex: 1 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: metric.iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <Icon size={18} color={metric.iconColor} />
      </View>
      <Text
        style={{
          fontSize: 11,
          fontFamily: 'SourceSerif4-Regular',
          color: '#8A8A8A',
        }}
      >
        {metric.label}
      </Text>
      <Text
        style={{
          fontSize: 22,
          fontFamily: 'SourceSerif4-Bold',
          color: '#1A1A1A',
          marginTop: 2,
        }}
      >
        {metric.value}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 4,
          gap: 2,
        }}
      >
        {isPositive ? (
          <ArrowUpRight size={12} color="#2E7D32" />
        ) : (
          <ArrowDownRight size={12} color="#C62828" />
        )}
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'SourceSerif4-SemiBold',
            color: isPositive ? '#2E7D32' : '#C62828',
          }}
        >
          {Math.abs(metric.change)}%
        </Text>
      </View>
    </Card>
  );
};

// ── Screen ───────────────────────────────────────────
const DashboardScreen: React.FC = () => {
  const [period, setPeriod] = useState<Period>('monthly');
  const metrics = METRICS[period];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF8F4' }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'SourceSerif4-ExtraBold',
              color: '#1A1A1A',
              letterSpacing: 2,
            }}
          >
            SAFAAR
          </Text>
        </View>

        {/* Period Toggle */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Toggle
            options={[
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Yearly', value: 'yearly' },
            ]}
            selected={period}
            onSelect={(val) => setPeriod(val as Period)}
          />
        </View>

        {/* Metric Cards - 2 column grid */}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <MetricTile metric={metrics[0]} />
            <MetricTile metric={metrics[1]} />
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <MetricTile metric={metrics[2]} />
            <MetricTile metric={metrics[3]} />
          </View>
        </View>

        {/* Revenue Chart Placeholder */}
        <Card
          elevated
          style={{ marginHorizontal: 16, marginTop: 20 }}
          padding={16}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
              }}
            >
              Revenue Trend
            </Text>
            <TrendingUp size={18} color="#2E7D32" />
          </View>

          {/* Mock chart bars */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: 120,
              paddingTop: 8,
            }}
          >
            {[60, 45, 80, 55, 90, 70, 100].map((height, index) => (
              <View key={index} style={{ alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: '60%',
                    height: height * 1.1,
                    backgroundColor: index === 6 ? '#C4993C' : '#E8D5A8',
                    borderRadius: 4,
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'SourceSerif4-Regular',
                    color: '#8A8A8A',
                    marginTop: 4,
                  }}
                >
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Top Customers */}
        <View style={{ marginTop: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
              }}
            >
              Top Customers
            </Text>
            <Pressable hitSlop={8}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: '#C4993C',
                }}
              >
                See All
              </Text>
            </Pressable>
          </View>
          <Card
            elevated
            style={{ marginHorizontal: 16 }}
            padding={0}
          >
            {MOCK_TOP_CUSTOMERS.map((customer, index) => (
              <View
                key={customer.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderBottomWidth:
                    index < MOCK_TOP_CUSTOMERS.length - 1 ? 1 : 0,
                  borderBottomColor: '#F2EDE4',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'SourceSerif4-Bold',
                    color: '#8A8A8A',
                    width: 20,
                  }}
                >
                  {index + 1}
                </Text>
                <Avatar
                  uri={customer.avatar}
                  size={36}
                  name={customer.name}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'SourceSerif4-SemiBold',
                      color: '#1A1A1A',
                    }}
                  >
                    {customer.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'SourceSerif4-Regular',
                      color: '#8A8A8A',
                    }}
                  >
                    {customer.bookings} bookings
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'SourceSerif4-Bold',
                    color: '#1A1A1A',
                  }}
                >
                  ${customer.totalSpent}
                </Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Recent Bookings */}
        <View style={{ marginTop: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#1A1A1A',
              }}
            >
              Recent Bookings
            </Text>
            <Pressable hitSlop={8}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'SourceSerif4-SemiBold',
                  color: '#C4993C',
                }}
              >
                See All
              </Text>
            </Pressable>
          </View>
          <Card
            elevated
            style={{ marginHorizontal: 16 }}
            padding={0}
          >
            {MOCK_RECENT_BOOKINGS.map((booking, index) => (
              <Pressable
                key={booking.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderBottomWidth:
                    index < MOCK_RECENT_BOOKINGS.length - 1 ? 1 : 0,
                  borderBottomColor: '#F2EDE4',
                }}
              >
                <Avatar
                  uri={booking.guestAvatar}
                  size={36}
                  name={booking.guest}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'SourceSerif4-SemiBold',
                      color: '#1A1A1A',
                    }}
                    numberOfLines={1}
                  >
                    {booking.guest}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'SourceSerif4-Regular',
                      color: '#8A8A8A',
                    }}
                    numberOfLines={1}
                  >
                    {booking.experience} - {booking.date}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'SourceSerif4-Bold',
                      color: '#1A1A1A',
                    }}
                  >
                    ${booking.amount}
                  </Text>
                  <Badge
                    label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    variant={STATUS_VARIANT[booking.status]}
                    size="sm"
                  />
                </View>
              </Pressable>
            ))}
          </Card>
        </View>

        {/* Payout Section */}
        <Card
          elevated
          style={{ marginHorizontal: 16, marginTop: 24 }}
          padding={16}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8A8A8A',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Next Payout
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: 'SourceSerif4-Bold',
                  color: '#2E7D32',
                  marginTop: 4,
                }}
              >
                $1,245.00
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'SourceSerif4-Regular',
                  color: '#8A8A8A',
                  marginTop: 2,
                }}
              >
                Estimated on Apr 1, 2026
              </Text>
            </View>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#E8F5E9',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={24} color="#2E7D32" />
            </View>
          </View>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 14,
              paddingVertical: 10,
              backgroundColor: '#FAF8F4',
              borderRadius: 10,
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'SourceSerif4-SemiBold',
                color: '#C4993C',
              }}
            >
              View Payout History
            </Text>
            <ChevronRight size={14} color="#C4993C" />
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
