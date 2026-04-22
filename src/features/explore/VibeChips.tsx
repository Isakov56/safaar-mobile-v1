import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import {
  Coffee,
  Footprints,
  ShoppingBasket,
  Camera,
  UtensilsCrossed,
  Wine,
  Compass,
  Users,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

type Vibe = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const VIBES: Vibe[] = [
  { id: 'coffee', label: 'Coffee', icon: Coffee },
  { id: 'walk', label: 'Walk', icon: Footprints },
  { id: 'bazaar', label: 'Bazaar', icon: ShoppingBasket },
  { id: 'photo', label: 'Photo', icon: Camera },
  { id: 'eat', label: 'Eat', icon: UtensilsCrossed },
  { id: 'drinks', label: 'Drinks', icon: Wine },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'buddy', label: 'Buddy', icon: Users },
];

const VibeChips: React.FC<{ onPick?: (id: string) => void }> = ({ onPick }) => {
  const [active, setActive] = useState<string | null>(null);

  const handlePress = (id: string) => {
    const next = active === id ? null : id;
    setActive(next);
    onPick?.(id);
  };

  return (
    <View style={{ marginTop: 12 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      >
        {VIBES.map((v) => {
          const isActive = active === v.id;
          const Icon = v.icon;
          return (
            <Pressable
              key={v.id}
              onPress={() => handlePress(v.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 999,
                backgroundColor: isActive ? '#262626' : '#FFFFFF',
                borderWidth: 1,
                borderColor: isActive ? '#262626' : '#DBDBDB',
              }}
            >
              <Icon size={15} color={isActive ? '#FFFFFF' : '#262626'} strokeWidth={2} />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 13,
                  fontWeight: '600',
                  color: isActive ? '#FFFFFF' : '#262626',
                }}
              >
                {v.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default VibeChips;
