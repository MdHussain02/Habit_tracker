declare module 'lottie-react-native' {
  import { Animated, StyleProp, ViewStyle } from 'react-native';
  
  interface LottieViewProps {
    autoPlay?: boolean;
    loop?: boolean;
    source: any; // You can make this more specific if you know the shape
    style?: StyleProp<ViewStyle>;
    progress?: Animated.Value | number;
    speed?: number;
    duration?: number;
    autoSize?: boolean;
    enableMergePathsAndroidForKitKatAndAbove?: boolean;
    hardwareAccelerationAndroid?: boolean;
    cacheComposition?: boolean;
    colorFilters?: Array<{
      keypath: string;
      color: string;
    }>;
    onAnimationFinish?: (isCancelled: boolean) => void;
    onAnimationFailure?: (error: any) => void;
    onAnimationLoop?: (isCancelled: boolean) => void;
    onLayout?: () => void;
    onAnimationLoaded?: () => void;
    renderMode?: 'AUTOMATIC' | 'HARDWARE' | 'SOFTWARE';
    resizeMode?: 'cover' | 'contain' | 'center' | 'repeat';
  }

  const LottieView: React.ComponentType<LottieViewProps>;
  export default LottieView;
}
