import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'bounce';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  style?: ViewStyle;
  onAnimationComplete?: () => void;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  direction = 'right',
  duration = 300,
  delay = 0,
  style,
  onAnimationComplete,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const startAnimation = () => {
      let animation: Animated.CompositeAnimation;

      switch (type) {
        case 'fade':
          animation = Animated.timing(animValue, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          break;

        case 'slide':
          const startValue = direction === 'left' || direction === 'right' ? 100 : 0;
          const endValue = 0;
          
          animValue.setValue(startValue);
          animation = Animated.timing(animValue, {
            toValue: endValue,
            duration,
            delay,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          break;

        case 'scale':
          animation = Animated.timing(scaleValue, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
          break;

        case 'bounce':
          animation = Animated.sequence([
            Animated.timing(scaleValue, {
              toValue: 1.1,
              duration: duration * 0.4,
              delay,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            Animated.timing(scaleValue, {
              toValue: 0.9,
              duration: duration * 0.2,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            Animated.timing(scaleValue, {
              toValue: 1,
              duration: duration * 0.4,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
          ]);
          break;

        default:
          animation = Animated.timing(animValue, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
      }

      animation.start(onAnimationComplete);
    };

    startAnimation();
  }, [type, direction, duration, delay]);

  const getAnimatedStyle = (): any => {
    switch (type) {
      case 'fade':
        return {
          opacity: animValue,
        };

      case 'slide':
        if (direction === 'left' || direction === 'right') {
          return {
            transform: [{ translateX: animValue }],
          };
        } else {
          return {
            transform: [{ translateY: animValue }],
          };
        }

      case 'scale':
        return {
          transform: [{ scale: scaleValue }],
        };

      case 'bounce':
        return {
          transform: [{ scale: scaleValue }],
        };

      default:
        return {
          opacity: animValue,
        };
    }
  };

  return (
    <Animated.View style={[getAnimatedStyle(), style]}>
      {children}
    </Animated.View>
  );
};

