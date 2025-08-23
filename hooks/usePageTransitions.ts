import { useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const usePageTransitions = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const fadeIn = (duration: number = 300) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };

  const fadeOut = (duration: number = 300) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };

  const slideIn = (direction: 'left' | 'right' | 'up' | 'down', duration: number = 300) => {
    const startValue = direction === 'left' || direction === 'right' ? 100 : 0;
    const endValue = 0;
    
    slideAnim.setValue(startValue);
    
    Animated.timing(slideAnim, {
      toValue: endValue,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };

  const slideOut = (direction: 'left' | 'right' | 'up' | 'down', duration: number = 300) => {
    const endValue = direction === 'left' || direction === 'right' ? -100 : 0;
    
    Animated.timing(slideAnim, {
      toValue: endValue,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };

  const scaleIn = (duration: number = 300) => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };

  const scaleOut = (duration: number = 300) => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };

  const bounceIn = (duration: number = 600) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: duration * 0.4,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: duration * 0.2,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: duration * 0.4,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    ]).start();
  };

  const pulse = (duration: number = 1000) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    scaleAnim.stopAnimation();
    scaleAnim.setValue(1);
  };

  return {
    fadeAnim,
    slideAnim,
    scaleAnim,
    fadeIn,
    fadeOut,
    slideIn,
    slideOut,
    scaleIn,
    scaleOut,
    bounceIn,
    pulse,
    stopPulse,
  };
};

