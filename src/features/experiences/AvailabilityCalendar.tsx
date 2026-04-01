import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

// ── Types ──────────────────────────────────────────────
export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DateSlot {
  date: string; // ISO date string YYYY-MM-DD
  dayName: string;
  dayNumber: number;
  available: boolean;
  timeSlots: TimeSlot[];
}

interface AvailabilityCalendarProps {
  slots: DateSlot[];
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

// ── Helpers ────────────────────────────────────────────
export function generateDateSlots(daysAhead = 14): DateSlot[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const slots: DateSlot[] = [];
  const today = new Date();

  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const available = Math.random() > 0.25;
    slots.push({
      date: iso,
      dayName: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      available,
      timeSlots: available
        ? [
            { time: '09:00', available: Math.random() > 0.3 },
            { time: '11:00', available: Math.random() > 0.3 },
            { time: '14:00', available: Math.random() > 0.2 },
            { time: '16:30', available: Math.random() > 0.4 },
          ]
        : [],
    });
  }
  return slots;
}

// ── Component ──────────────────────────────────────────
const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  slots,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}) => {
  const activeSlot = useMemo(
    () => slots.find((s) => s.date === selectedDate),
    [slots, selectedDate],
  );

  return (
    <View>
      {/* ── Date Row ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {slots.map((slot) => {
          const isSelected = slot.date === selectedDate;
          const isAvailable = slot.available;

          return (
            <Pressable
              key={slot.date}
              onPress={() => isAvailable && onSelectDate(slot.date)}
              disabled={!isAvailable}
              className={`items-center justify-center rounded-xl py-2 px-3 ${
                isSelected
                  ? 'bg-gold'
                  : isAvailable
                    ? 'bg-canvas-deep'
                    : 'bg-canvas-deep opacity-40'
              }`}
              style={{ width: 52, height: 64 }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'SourceSerif4-Regular',
                  color: isSelected ? '#FFFFFF' : isAvailable ? '#8A8A8A' : '#8A8A8A',
                  textDecorationLine: isAvailable ? 'none' : 'line-through',
                }}
              >
                {slot.dayName}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'SourceSerif4-Bold',
                  color: isSelected ? '#FFFFFF' : isAvailable ? '#1A1A1A' : '#8A8A8A',
                  textDecorationLine: isAvailable ? 'none' : 'line-through',
                  marginTop: 2,
                }}
              >
                {slot.dayNumber}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Time Slots ── */}
      {activeSlot && activeSlot.timeSlots.length > 0 && (
        <View className="flex-row flex-wrap mt-4 px-4" style={{ gap: 10 }}>
          {activeSlot.timeSlots.map((ts) => {
            const isTimeSelected = ts.time === selectedTime;
            return (
              <Pressable
                key={ts.time}
                onPress={() => ts.available && onSelectTime(ts.time)}
                disabled={!ts.available}
                className={`rounded-pill px-4 py-2 ${
                  isTimeSelected
                    ? 'bg-gold'
                    : ts.available
                      ? 'bg-canvas-deep'
                      : 'bg-canvas-deep opacity-40'
                }`}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'SourceSerif4-SemiBold',
                    color: isTimeSelected
                      ? '#FFFFFF'
                      : ts.available
                        ? '#1A1A1A'
                        : '#8A8A8A',
                    textDecorationLine: ts.available ? 'none' : 'line-through',
                  }}
                >
                  {ts.time}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {selectedDate && activeSlot && activeSlot.timeSlots.length === 0 && (
        <View className="mt-4 px-4">
          <Text style={{ fontSize: 13, color: '#8A8A8A', fontFamily: 'SourceSerif4-Regular' }}>
            No time slots available for this date.
          </Text>
        </View>
      )}
    </View>
  );
};

export default AvailabilityCalendar;
