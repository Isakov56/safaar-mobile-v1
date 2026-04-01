import { Platform } from 'react-native';

export const fonts = {
  serif: {
    regular: 'SourceSerif4-Regular',
    semibold: 'SourceSerif4-SemiBold',
    bold: 'SourceSerif4-Bold',
    extrabold: 'SourceSerif4-ExtraBold',
  },
  system: {
    regular: Platform.select({ ios: 'System', android: 'Roboto' }) ?? 'System',
  },
} as const;

export const textStyles = {
  xs: { fontSize: 11, lineHeight: 16 },
  sm: { fontSize: 13, lineHeight: 18 },
  base: { fontSize: 15, lineHeight: 22 },
  lg: { fontSize: 18, lineHeight: 26 },
  xl: { fontSize: 22, lineHeight: 30 },
  '2xl': { fontSize: 28, lineHeight: 36 },
  brand: { fontSize: 32, lineHeight: 38 },
} as const;
