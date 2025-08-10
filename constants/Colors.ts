/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#ff9b00'; // Orange from the palette
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#11181C', // Darker text for contrast on light background
    background: '#f8f8f8', // Light background for dark mode
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
};

export const PookieColors = {
  black: '#000000',
  deepRed: '#CE114A',
  hotPink: '#FF0B55',
  palePink: '#FFDEDE',
};

// Color palette from ff9b00ffe100ffc900ebe389.png
export const PaletteColors = {
  orange: '#ff9b00',
  yellow: '#ffe100',
  gold: '#ffc900',
  lightYellow: '#ebe389',
};
