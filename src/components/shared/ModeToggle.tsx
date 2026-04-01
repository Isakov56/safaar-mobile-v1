import React, { useCallback } from 'react';
import { type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Toggle from '../ui/Toggle';
import { useUIStore, type AppMode } from '../../stores/uiStore';

interface ModeToggleProps {
  style?: ViewStyle;
  testID?: string;
}

const MODE_OPTIONS = [
  { label: 'Go Deep', value: 'goDeep' },
  { label: 'Have Fun', value: 'haveFun' },
] as const;

const ModeToggle: React.FC<ModeToggleProps> = ({ style, testID }) => {
  const mode = useUIStore((s) => s.mode);
  const setMode = useUIStore((s) => s.setMode);

  const handleSelect = useCallback(
    (value: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setMode(value as AppMode);
    },
    [setMode],
  );

  return (
    <Toggle
      testID={testID}
      options={[...MODE_OPTIONS]}
      selected={mode}
      onSelect={handleSelect}
      style={style}
    />
  );
};

export default ModeToggle;
